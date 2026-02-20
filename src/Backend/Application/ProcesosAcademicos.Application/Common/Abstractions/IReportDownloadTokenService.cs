namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface IReportDownloadTokenService
{
    string CreateToken(Guid reportRequestId, DateTimeOffset expiresAt);

    bool TryValidateToken(string token, out Guid reportRequestId, out DateTimeOffset expiresAt);
}
