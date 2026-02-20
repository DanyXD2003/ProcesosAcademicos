namespace ProcesosAcademicos.Application.Common.Models;

public sealed record ApiError(string Code, string Message, object? Details = null);

public sealed record PaginationMeta(int Page, int PageSize, int Total, int TotalPages);

public sealed record ApiMeta(string TraceId, DateTimeOffset Timestamp, PaginationMeta? Pagination = null);

public sealed record ApiEnvelope<T>(T? Data, ApiMeta Meta, IReadOnlyCollection<ApiError> Errors);

public sealed record ItemsEnvelope<T>(IReadOnlyCollection<T> Items);

public sealed record PagedResult<T>(IReadOnlyCollection<T> Items, PaginationMeta Pagination);
