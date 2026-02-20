namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface IReportStorageService
{
    Task SaveAsync(Guid reportRequestId, byte[] content, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(Guid reportRequestId, CancellationToken cancellationToken);

    Task<byte[]> ReadAsync(Guid reportRequestId, CancellationToken cancellationToken);

    Task<int> DeleteOlderThanAsync(DateTimeOffset cutoff, CancellationToken cancellationToken);
}
