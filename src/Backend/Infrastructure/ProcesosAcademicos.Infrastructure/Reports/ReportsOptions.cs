namespace ProcesosAcademicos.Infrastructure.Reports;

public sealed class ReportsOptions
{
    public const string SectionName = "Reports";

    public string StorageRootPath { get; set; } = "App_Data/reports";

    public int DownloadTokenDays { get; set; } = 7;

    public int RetentionDays { get; set; } = 30;
}
