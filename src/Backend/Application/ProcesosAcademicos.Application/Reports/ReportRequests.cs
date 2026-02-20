using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Common.Constants;
using ProcesosAcademicos.Application.Common.Exceptions;
using ProcesosAcademicos.Application.Common.Utilities;
using ProcesosAcademicos.Domain.Entities;

namespace ProcesosAcademicos.Application.Reports;

public sealed record DownloadReportFileQuery(
    Guid ReportRequestId,
    string Token,
    string? IpAddress,
    string? UserAgent)
    : IRequest<ReportFileDownloadResultDto>;

public sealed record ReportFileDownloadResultDto(
    string FileName,
    string ContentType,
    byte[] Content);

public sealed class DownloadReportFileQueryHandler
    : IRequestHandler<DownloadReportFileQuery, ReportFileDownloadResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;
    private readonly IReportDownloadTokenService _downloadTokenService;
    private readonly IReportStorageService _reportStorageService;
    private readonly ILogger<DownloadReportFileQueryHandler> _logger;

    public DownloadReportFileQueryHandler(
        IApplicationDbContext dbContext,
        IClock clock,
        IReportDownloadTokenService downloadTokenService,
        IReportStorageService reportStorageService,
        ILogger<DownloadReportFileQueryHandler> logger)
    {
        _dbContext = dbContext;
        _clock = clock;
        _downloadTokenService = downloadTokenService;
        _reportStorageService = reportStorageService;
        _logger = logger;
    }

    public async Task<ReportFileDownloadResultDto> Handle(DownloadReportFileQuery request, CancellationToken cancellationToken)
    {
        if (!_downloadTokenService.TryValidateToken(request.Token, out var tokenRequestId, out var expiresAt))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ReportDownloadTokenInvalid,
                "Token de descarga invalido.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ReportDownloadTokenInvalid));
        }

        if (tokenRequestId != request.ReportRequestId)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ReportDownloadTokenInvalid,
                "Token de descarga invalido para esta solicitud.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ReportDownloadTokenInvalid));
        }

        if (expiresAt <= _clock.UtcNow)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ReportDownloadTokenExpired,
                "Token de descarga expirado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ReportDownloadTokenExpired));
        }

        var reportRequest = await _dbContext.ReportRequests
            .Include(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == request.ReportRequestId, cancellationToken);

        if (reportRequest is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ReportRequestNotFound,
                "Solicitud de reporte no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ReportRequestNotFound));
        }

        if (!await _reportStorageService.ExistsAsync(reportRequest.Id, cancellationToken))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ReportFileNotFound,
                "Archivo de reporte no disponible.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ReportFileNotFound));
        }

        var bytes = await _reportStorageService.ReadAsync(reportRequest.Id, cancellationToken);

        _dbContext.ReportDownloadEvents.Add(new ReportDownloadEvent
        {
            Id = Guid.NewGuid(),
            ReportRequestId = reportRequest.Id,
            DownloadedAt = _clock.UtcNow,
            IpAddress = request.IpAddress,
            UserAgent = request.UserAgent
        });

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Report downloaded. RequestId={RequestId} DownloadedAt={DownloadedAt} Ip={IpAddress}",
            reportRequest.Id,
            _clock.UtcNow,
            request.IpAddress);

        var filePrefix = reportRequest.RequestType == ProcesosAcademicos.Domain.Enums.ReportRequestType.CierreDePensum
            ? "cierre-pensum"
            : "certificacion-cursos";
        var fileName = $"{filePrefix}-{reportRequest.Student.StudentCode}-{_clock.UtcNow:yyyyMMdd}.pdf";
        return new ReportFileDownloadResultDto(fileName, "application/pdf", bytes);
    }
}
