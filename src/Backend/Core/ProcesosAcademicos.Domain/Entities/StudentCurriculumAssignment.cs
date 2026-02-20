namespace ProcesosAcademicos.Domain.Entities;

public class StudentCurriculumAssignment
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public Guid CurriculumVersionId { get; set; }

    public DateTimeOffset AssignedAt { get; set; } = DateTimeOffset.UtcNow;

    public bool IsActive { get; set; } = true;

    public StudentProfile Student { get; set; } = default!;

    public CurriculumVersion CurriculumVersion { get; set; } = default!;
}
