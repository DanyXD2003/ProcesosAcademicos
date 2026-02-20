using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class Enrollment
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public Guid CourseOfferingId { get; set; }

    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Activa;

    public DateTimeOffset EnrolledAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? ClosedAt { get; set; }

    public StudentProfile Student { get; set; } = default!;

    public CourseOffering CourseOffering { get; set; } = default!;

    public void Close(DateTimeOffset closedAt)
    {
        Status = EnrollmentStatus.Cerrada;
        ClosedAt = closedAt;
    }
}
