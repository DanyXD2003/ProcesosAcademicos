using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class CurriculumVersion
{
    public Guid Id { get; set; }

    public Guid CareerId { get; set; }

    [Required]
    [MaxLength(30)]
    public string VersionCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string DisplayName { get; set; } = string.Empty;

    public DateOnly EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Career Career { get; set; } = default!;

    public ICollection<CurriculumCourse> Courses { get; set; } = new List<CurriculumCourse>();

    public ICollection<StudentCurriculumAssignment> StudentAssignments { get; set; } = new List<StudentCurriculumAssignment>();
}
