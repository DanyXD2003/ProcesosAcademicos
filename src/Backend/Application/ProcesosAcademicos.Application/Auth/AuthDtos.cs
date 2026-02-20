namespace ProcesosAcademicos.Application.Auth;

public sealed record LoginRequestDto(string UsernameOrEmail, string Password);

public sealed record RefreshTokenRequestDto(string RefreshToken);

public sealed record LogoutRequestDto(string? RefreshToken);

public sealed record LogoutResultDto(bool Success, string LoggedOutAt);

public sealed record AuthSessionDto(string AccessToken, string RefreshToken, int ExpiresIn, CurrentUserDto User);

public sealed record CurrentUserDto(
    string UserId,
    string RoleCode,
    string RoleLabel,
    string DisplayName,
    string ProfileId,
    string? CareerId);
