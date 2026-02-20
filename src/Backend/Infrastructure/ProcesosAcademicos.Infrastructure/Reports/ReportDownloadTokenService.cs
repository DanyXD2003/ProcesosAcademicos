using System.Globalization;
using Microsoft.AspNetCore.DataProtection;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Infrastructure.Reports;

public sealed class ReportDownloadTokenService : IReportDownloadTokenService
{
    private const string Purpose = "ProcesosAcademicos.Reports.DownloadToken.v1";
    private readonly IDataProtector _protector;

    public ReportDownloadTokenService(IDataProtectionProvider dataProtectionProvider)
    {
        _protector = dataProtectionProvider.CreateProtector(Purpose);
    }

    public string CreateToken(Guid reportRequestId, DateTimeOffset expiresAt)
    {
        var payload = $"{reportRequestId:N}|{expiresAt.UtcDateTime:O}";
        return _protector.Protect(payload);
    }

    public bool TryValidateToken(string token, out Guid reportRequestId, out DateTimeOffset expiresAt)
    {
        reportRequestId = Guid.Empty;
        expiresAt = DateTimeOffset.MinValue;

        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        string payload;
        try
        {
            payload = _protector.Unprotect(token);
        }
        catch
        {
            return false;
        }

        var parts = payload.Split('|', 2, StringSplitOptions.None);
        if (parts.Length != 2)
        {
            return false;
        }

        if (!Guid.TryParseExact(parts[0], "N", out reportRequestId))
        {
            return false;
        }

        if (!DateTimeOffset.TryParseExact(
                parts[1],
                "O",
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out expiresAt))
        {
            return false;
        }

        expiresAt = expiresAt.ToUniversalTime();
        return true;
    }
}
