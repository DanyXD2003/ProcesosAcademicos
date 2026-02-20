using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Infrastructure.Reports;

public sealed class ReportStorageCleanupHostedService : BackgroundService
{
    private readonly ILogger<ReportStorageCleanupHostedService> _logger;
    private readonly ReportsOptions _options;
    private readonly IReportStorageService _reportStorageService;

    public ReportStorageCleanupHostedService(
        IOptions<ReportsOptions> options,
        IReportStorageService reportStorageService,
        ILogger<ReportStorageCleanupHostedService> logger)
    {
        _options = options.Value;
        _reportStorageService = reportStorageService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            var retentionDays = Math.Max(1, _options.RetentionDays);
            var cutoff = DateTimeOffset.UtcNow.AddDays(-retentionDays);

            var removed = await _reportStorageService.DeleteOlderThanAsync(cutoff, stoppingToken);
            _logger.LogInformation(
                "Limpieza de reportes completada. RetentionDays={RetentionDays} Cutoff={Cutoff} RemovedFiles={RemovedFiles}",
                retentionDays,
                cutoff,
                removed);
        }
        catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogWarning(ex, "No se pudo completar la limpieza de reportes al arrancar.");
        }
    }
}
