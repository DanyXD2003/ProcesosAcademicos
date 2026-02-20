namespace ProcesosAcademicos.Application.Common.Pagination;

public abstract record PagingQuery(int Page = 1, int PageSize = 10, string? Search = null)
{
    public int SafePage => Math.Max(1, Page);

    public int SafePageSize => Math.Clamp(PageSize, 1, 100);
}
