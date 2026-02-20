using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class StudentProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [Required]
    [MaxLength(30)]
    public string StudentCode { get; set; } = string.Empty;

    public Guid? CareerId { get; set; }

    [Required]
    [MaxLength(160)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(120)]
    public string? Faculty { get; set; }

    public short? Semester { get; set; }

    [Required]
    [MaxLength(180)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(40)]
    public string? Phone { get; set; }

    public User User { get; set; } = default!;

    public Career? Career { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public ICollection<AcademicRecord> AcademicRecords { get; set; } = new List<AcademicRecord>();

    public ICollection<ReportRequest> ReportRequests { get; set; } = new List<ReportRequest>();

    public ICollection<StudentCurriculumAssignment> CurriculumAssignments { get; set; } = new List<StudentCurriculumAssignment>();
}
