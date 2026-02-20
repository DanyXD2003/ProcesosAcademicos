using System.ComponentModel.DataAnnotations;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class CourseEquivalence
{
    public Guid Id { get; set; }

    public Guid SourceCourseId { get; set; }

    public Guid TargetCourseId { get; set; }

    public EquivalenceType EquivalenceType { get; set; } = EquivalenceType.Total;

    public DateOnly EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public bool IsActive { get; set; } = true;

    [MaxLength(255)]
    public string? Notes { get; set; }

    public Course SourceCourse { get; set; } = default!;

    public Course TargetCourse { get; set; } = default!;

    public void EnsureValid()
    {
        if (SourceCourseId == TargetCourseId)
        {
            throw new InvalidOperationException("COURSE_EQUIVALENCE_INVALID");
        }
    }
}
