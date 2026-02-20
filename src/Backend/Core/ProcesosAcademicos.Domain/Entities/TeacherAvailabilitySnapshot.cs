using System.ComponentModel.DataAnnotations;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class TeacherAvailabilitySnapshot
{
    public Guid Id { get; set; }

    public Guid ProfessorId { get; set; }

    public TeacherAvailabilityStatus Status { get; set; }

    [MaxLength(120)]
    public string? Speciality { get; set; }

    public DateTimeOffset CapturedAt { get; set; } = DateTimeOffset.UtcNow;

    public ProfessorProfile Professor { get; set; } = default!;
}
