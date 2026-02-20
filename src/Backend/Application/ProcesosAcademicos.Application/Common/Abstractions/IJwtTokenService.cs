namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface IJwtTokenService
{
    string GenerateAccessToken(
        Guid userId,
        string roleCode,
        string roleLabel,
        Guid profileId,
        Guid? careerId,
        string displayName,
        DateTimeOffset expiresAt);

    string GenerateRefreshToken();

    string HashRefreshToken(string refreshToken);
}
