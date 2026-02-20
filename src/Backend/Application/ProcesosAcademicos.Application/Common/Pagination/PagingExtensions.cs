using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Application.Common.Models;

namespace ProcesosAcademicos.Application.Common.Pagination;

public static class PagingExtensions
{
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> query,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var safePage = Math.Max(1, page);
        var safePageSize = Math.Clamp(pageSize, 1, 100);

        var total = await query.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)safePageSize));
        var normalizedPage = Math.Min(safePage, totalPages);

        var items = await query
            .Skip((normalizedPage - 1) * safePageSize)
            .Take(safePageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<T>(items, new PaginationMeta(normalizedPage, safePageSize, total, totalPages));
    }
}
