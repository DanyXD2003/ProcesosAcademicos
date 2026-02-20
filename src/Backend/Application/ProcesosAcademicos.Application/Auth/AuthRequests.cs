using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Common.Constants;
using ProcesosAcademicos.Application.Common.Exceptions;
using ProcesosAcademicos.Application.Common.Utilities;
using ProcesosAcademicos.Domain.Entities;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Application.Auth;

public sealed record LoginCommand(LoginRequestDto Request) : IRequest<AuthSessionDto>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Request.UsernameOrEmail).NotEmpty().MaximumLength(180);
        RuleFor(x => x.Request.Password).NotEmpty().MaximumLength(200);
    }
}

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, AuthSessionDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPasswordHasherService _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IClock _clock;

    public LoginCommandHandler(
        IApplicationDbContext dbContext,
        IPasswordHasherService passwordHasher,
        IJwtTokenService jwtTokenService,
        IClock clock)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _clock = clock;
    }

    public async Task<AuthSessionDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var input = request.Request.UsernameOrEmail.Trim();
        var normalized = input.ToUpperInvariant();

        var user = await _dbContext.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.StudentProfile)
            .Include(x => x.ProfessorProfile)
            .Include(x => x.DirectorProfile)
            .FirstOrDefaultAsync(x =>
                    x.Email.ToUpper() == normalized ||
                    (x.StudentProfile != null && x.StudentProfile.StudentCode.ToUpper() == normalized) ||
                    (x.ProfessorProfile != null && x.ProfessorProfile.ProfessorCode.ToUpper() == normalized) ||
                    (x.DirectorProfile != null && x.DirectorProfile.DirectorCode.ToUpper() == normalized),
                cancellationToken);

        if (user is null || !_passwordHasher.VerifyPassword(user.PasswordHash, request.Request.Password))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.AuthInvalidCredentials,
                "Credenciales invalidas.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthInvalidCredentials));
        }

        if (!user.IsActive)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.AuthUserDisabled,
                "El usuario esta deshabilitado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthUserDisabled));
        }

        var currentUser = ResolveCurrentUser(user);
        var expiresAt = _clock.UtcNow.AddMinutes(30);
        var accessToken = _jwtTokenService.GenerateAccessToken(
            user.Id,
            currentUser.RoleCode,
            currentUser.RoleLabel,
            Guid.Parse(currentUser.ProfileId),
            currentUser.CareerId is null ? null : Guid.Parse(currentUser.CareerId),
            currentUser.DisplayName,
            expiresAt);

        var refreshTokenRaw = _jwtTokenService.GenerateRefreshToken();
        var refreshTokenHash = _jwtTokenService.HashRefreshToken(refreshTokenRaw);

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            CreatedAt = _clock.UtcNow,
            ExpiresAt = _clock.UtcNow.AddDays(7)
        });

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new AuthSessionDto(accessToken, refreshTokenRaw, 1800, currentUser);
    }

    private static CurrentUserDto ResolveCurrentUser(User user)
    {
        var role = user.UserRoles
            .Select(x => x.Role.Code)
            .OrderBy(x => x)
            .FirstOrDefault();

        return role switch
        {
            UserRoleCode.DIRECTOR when user.DirectorProfile is not null => new CurrentUserDto(
                user.Id.ToString(),
                "DIRECTOR",
                "Director",
                user.DirectorProfile.FullName,
                user.DirectorProfile.Id.ToString(),
                null),
            UserRoleCode.PROFESOR when user.ProfessorProfile is not null => new CurrentUserDto(
                user.Id.ToString(),
                "PROFESOR",
                "Profesor",
                user.ProfessorProfile.FullName,
                user.ProfessorProfile.Id.ToString(),
                null),
            _ when user.StudentProfile is not null => new CurrentUserDto(
                user.Id.ToString(),
                "ESTUDIANTE",
                "Estudiante",
                user.StudentProfile.FullName,
                user.StudentProfile.Id.ToString(),
                user.StudentProfile.CareerId?.ToString()),
            _ => throw new FunctionalException(
                FunctionalErrorCodes.AuthInvalidToken,
                "No fue posible resolver el perfil del usuario.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthInvalidToken))
        };
    }
}

public sealed record RefreshTokenCommand(RefreshTokenRequestDto Request) : IRequest<AuthSessionDto>;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.Request.RefreshToken).NotEmpty();
    }
}

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthSessionDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IClock _clock;

    public RefreshTokenCommandHandler(IApplicationDbContext dbContext, IJwtTokenService jwtTokenService, IClock clock)
    {
        _dbContext = dbContext;
        _jwtTokenService = jwtTokenService;
        _clock = clock;
    }

    public async Task<AuthSessionDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var hash = _jwtTokenService.HashRefreshToken(request.Request.RefreshToken.Trim());

        var refreshToken = await _dbContext.RefreshTokens
            .Include(x => x.User)
            .ThenInclude(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.User.StudentProfile)
            .Include(x => x.User.ProfessorProfile)
            .Include(x => x.User.DirectorProfile)
            .FirstOrDefaultAsync(x => x.TokenHash == hash, cancellationToken);

        if (refreshToken is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.AuthRefreshInvalid,
                "Refresh token invalido.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthRefreshInvalid));
        }

        if (!refreshToken.IsActive(_clock.UtcNow))
        {
            var code = refreshToken.ExpiresAt <= _clock.UtcNow
                ? FunctionalErrorCodes.AuthRefreshExpired
                : FunctionalErrorCodes.AuthRefreshInvalid;

            throw new FunctionalException(code, "Refresh token no valido.", FunctionalErrorHttpMapper.Resolve(code));
        }

        refreshToken.Revoke(_clock.UtcNow);

        var currentUser = ResolveCurrentUser(refreshToken.User);
        var expiresAt = _clock.UtcNow.AddMinutes(30);
        var newAccessToken = _jwtTokenService.GenerateAccessToken(
            refreshToken.UserId,
            currentUser.RoleCode,
            currentUser.RoleLabel,
            Guid.Parse(currentUser.ProfileId),
            currentUser.CareerId is null ? null : Guid.Parse(currentUser.CareerId),
            currentUser.DisplayName,
            expiresAt);

        var nextRefreshRaw = _jwtTokenService.GenerateRefreshToken();
        var nextRefreshHash = _jwtTokenService.HashRefreshToken(nextRefreshRaw);

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = refreshToken.UserId,
            TokenHash = nextRefreshHash,
            CreatedAt = _clock.UtcNow,
            ExpiresAt = _clock.UtcNow.AddDays(7)
        });

        refreshToken.ReplacedByTokenHash = nextRefreshHash;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new AuthSessionDto(newAccessToken, nextRefreshRaw, 1800, currentUser);
    }

    private static CurrentUserDto ResolveCurrentUser(User user)
    {
        var role = user.UserRoles.Select(x => x.Role.Code).OrderBy(x => x).First();

        return role switch
        {
            UserRoleCode.DIRECTOR => new CurrentUserDto(
                user.Id.ToString(),
                "DIRECTOR",
                "Director",
                user.DirectorProfile!.FullName,
                user.DirectorProfile.Id.ToString(),
                null),
            UserRoleCode.PROFESOR => new CurrentUserDto(
                user.Id.ToString(),
                "PROFESOR",
                "Profesor",
                user.ProfessorProfile!.FullName,
                user.ProfessorProfile.Id.ToString(),
                null),
            _ => new CurrentUserDto(
                user.Id.ToString(),
                "ESTUDIANTE",
                "Estudiante",
                user.StudentProfile!.FullName,
                user.StudentProfile.Id.ToString(),
                user.StudentProfile.CareerId?.ToString())
        };
    }
}

public sealed record LogoutCommand(Guid UserId, LogoutRequestDto Request) : IRequest<LogoutResultDto>;

public sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand, LogoutResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IClock _clock;

    public LogoutCommandHandler(IApplicationDbContext dbContext, IJwtTokenService jwtTokenService, IClock clock)
    {
        _dbContext = dbContext;
        _jwtTokenService = jwtTokenService;
        _clock = clock;
    }

    public async Task<LogoutResultDto> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var tokens = _dbContext.RefreshTokens.Where(x => x.UserId == request.UserId && x.RevokedAt == null);

        if (!string.IsNullOrWhiteSpace(request.Request.RefreshToken))
        {
            var hash = _jwtTokenService.HashRefreshToken(request.Request.RefreshToken.Trim());
            tokens = tokens.Where(x => x.TokenHash == hash);
        }

        var tokenList = await tokens.ToListAsync(cancellationToken);
        foreach (var token in tokenList)
        {
            token.Revoke(_clock.UtcNow);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new LogoutResultDto(true, _clock.UtcNow.ToString("O"));
    }
}

public sealed record GetCurrentUserQuery(Guid UserId) : IRequest<CurrentUserDto>;

public sealed class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCurrentUserQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.StudentProfile)
            .Include(x => x.ProfessorProfile)
            .Include(x => x.DirectorProfile)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

        if (user is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.AuthInvalidToken,
                "Token invalido.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthInvalidToken));
        }

        var role = user.UserRoles.Select(x => x.Role.Code).OrderBy(x => x).FirstOrDefault();

        return role switch
        {
            UserRoleCode.DIRECTOR when user.DirectorProfile is not null => new CurrentUserDto(
                user.Id.ToString(), "DIRECTOR", "Director", user.DirectorProfile.FullName, user.DirectorProfile.Id.ToString(), null),
            UserRoleCode.PROFESOR when user.ProfessorProfile is not null => new CurrentUserDto(
                user.Id.ToString(), "PROFESOR", "Profesor", user.ProfessorProfile.FullName, user.ProfessorProfile.Id.ToString(), null),
            _ when user.StudentProfile is not null => new CurrentUserDto(
                user.Id.ToString(), "ESTUDIANTE", "Estudiante", user.StudentProfile.FullName, user.StudentProfile.Id.ToString(), user.StudentProfile.CareerId?.ToString()),
            _ => throw new FunctionalException(
                FunctionalErrorCodes.AuthInvalidToken,
                "No fue posible identificar el perfil del token.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthInvalidToken))
        };
    }
}
