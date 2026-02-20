using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Infrastructure.Reports;

public sealed class ReportFileStorageService : IReportStorageService
{
    private readonly ILogger<ReportFileStorageService> _logger;
    private readonly string _rootPath;

    public ReportFileStorageService(
        IOptions<ReportsOptions> options,
        IHostEnvironment hostEnvironment,
        ILogger<ReportFileStorageService> logger)
    {
        _logger = logger;

        var configuredPath = string.IsNullOrWhiteSpace(options.Value.StorageRootPath)
            ? "App_Data/reports"
            : options.Value.StorageRootPath.Trim();

        _rootPath = Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(hostEnvironment.ContentRootPath, configuredPath);
    }

    public async Task SaveAsync(Guid reportRequestId, byte[] content, CancellationToken cancellationToken)
    {
        EnsureStorageDirectory();
        var path = BuildPath(reportRequestId);
        await File.WriteAllBytesAsync(path, content, cancellationToken);
    }

    public Task<bool> ExistsAsync(Guid reportRequestId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(File.Exists(BuildPath(reportRequestId)));
    }

    public Task<byte[]> ReadAsync(Guid reportRequestId, CancellationToken cancellationToken)
    {
        var path = BuildPath(reportRequestId);
        return File.ReadAllBytesAsync(path, cancellationToken);
    }

    public Task<int> DeleteOlderThanAsync(DateTimeOffset cutoff, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!Directory.Exists(_rootPath))
        {
            return Task.FromResult(0);
        }

        var removed = 0;
        var cutoffUtc = cutoff.UtcDateTime;

        foreach (var file in Directory.EnumerateFiles(_rootPath, "*.pdf", SearchOption.TopDirectoryOnly))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var lastWriteUtc = File.GetLastWriteTimeUtc(file);
            if (lastWriteUtc >= cutoffUtc)
            {
                continue;
            }

            try
            {
                File.Delete(file);
                removed++;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "No se pudo borrar el archivo de reporte antiguo: {FilePath}", file);
            }
        }

        return Task.FromResult(removed);
    }

    private string BuildPath(Guid reportRequestId)
    {
        return Path.Combine(_rootPath, $"{reportRequestId:N}.pdf");
    }

    private void EnsureStorageDirectory()
    {
        Directory.CreateDirectory(_rootPath);
    }
}
