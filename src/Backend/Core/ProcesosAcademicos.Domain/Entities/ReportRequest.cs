using System.ComponentModel.DataAnnotations;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class ReportRequest
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public ReportRequestType RequestType { get; set; }

    public DateTimeOffset RequestedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? IssuedAt { get; set; }

    public bool LegacyImported { get; set; }

    [MaxLength(512)]
    public string? DownloadUrl { get; set; }

    public StudentProfile Student { get; set; } = default!;
    public ICollection<ReportDownloadEvent> DownloadEvents { get; set; } = new List<ReportDownloadEvent>();

    public void Issue(DateTimeOffset issuedAt, string? downloadUrl)
    {
        IssuedAt = issuedAt;
        DownloadUrl = downloadUrl;
        LegacyImported = false;
    }
}
