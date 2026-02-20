using System.ComponentModel.DataAnnotations;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class AcademicRecord
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public Guid CourseId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Period { get; set; } = string.Empty;

    [Range(0, 40)]
    public short? Credits { get; set; }

    [Range(0, 100)]
    public decimal Grade { get; set; }

    public ResultStatus ResultStatus { get; set; }

    [MaxLength(160)]
    public string? ProfessorNameSnapshot { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public StudentProfile Student { get; set; } = default!;

    public Course Course { get; set; } = default!;
}
