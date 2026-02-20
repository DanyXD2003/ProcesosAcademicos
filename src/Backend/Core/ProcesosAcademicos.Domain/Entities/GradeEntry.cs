using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class GradeEntry
{
    public Guid Id { get; set; }

    public Guid CourseOfferingId { get; set; }

    public Guid StudentId { get; set; }

    [Range(0, 100)]
    public decimal? DraftGrade { get; set; }

    [Range(0, 100)]
    public decimal? PublishedGrade { get; set; }

    public bool IsPublished { get; set; }

    public Guid UpdatedByUserId { get; set; }

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public CourseOffering CourseOffering { get; set; } = default!;

    public StudentProfile Student { get; set; } = default!;

    public User UpdatedByUser { get; set; } = default!;

    public void SetDraftGrade(decimal grade, Guid updatedBy, DateTimeOffset updatedAt)
    {
        if (IsPublished)
        {
            throw new InvalidOperationException("GRADE_EDIT_LOCKED");
        }

        if (grade < 0 || grade > 100)
        {
            throw new InvalidOperationException("GRADE_OUT_OF_RANGE");
        }

        DraftGrade = decimal.Round(grade, 2);
        UpdatedByUserId = updatedBy;
        UpdatedAt = updatedAt;
    }

    public void Publish(Guid updatedBy, DateTimeOffset updatedAt)
    {
        if (IsPublished)
        {
            throw new InvalidOperationException("GRADES_ALREADY_PUBLISHED");
        }

        if (!DraftGrade.HasValue)
        {
            throw new InvalidOperationException("GRADES_INCOMPLETE");
        }

        PublishedGrade = DraftGrade.Value;
        IsPublished = true;
        UpdatedByUserId = updatedBy;
        UpdatedAt = updatedAt;
    }
}
