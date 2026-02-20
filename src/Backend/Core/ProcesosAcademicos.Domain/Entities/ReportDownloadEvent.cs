using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class ReportDownloadEvent
{
    public Guid Id { get; set; }

    public Guid ReportRequestId { get; set; }

    public DateTimeOffset DownloadedAt { get; set; } = DateTimeOffset.UtcNow;

    [MaxLength(64)]
    public string? IpAddress { get; set; }

    [MaxLength(512)]
    public string? UserAgent { get; set; }

    public ReportRequest ReportRequest { get; set; } = default!;
}
