using ProcesosAcademicos.Application.Common.Models;

namespace ProcesosAcademicos.Api.Models;

public static class ApiResponseFactory
{
    public static ApiEnvelope<T> Success<T>(HttpContext context, T data, PaginationMeta? pagination = null)
    {
        return new ApiEnvelope<T>(
            data,
            new ApiMeta(context.TraceIdentifier, DateTimeOffset.UtcNow, pagination),
            Array.Empty<ApiError>());
    }

    public static ApiEnvelope<object?> Error(HttpContext context, string code, string message, object? details = null)
    {
        return new ApiEnvelope<object?>(
            null,
            new ApiMeta(context.TraceIdentifier, DateTimeOffset.UtcNow),
            new[] { new ApiError(code, message, details) });
    }

    public static ApiEnvelope<ItemsEnvelope<T>> Items<T>(HttpContext context, IReadOnlyCollection<T> items)
    {
        return Success(context, new ItemsEnvelope<T>(items));
    }

    public static ApiEnvelope<ItemsEnvelope<T>> Paged<T>(HttpContext context, PagedResult<T> pagedResult)
    {
        return Success(context, new ItemsEnvelope<T>(pagedResult.Items), pagedResult.Pagination);
    }
}
