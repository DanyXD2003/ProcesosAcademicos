using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class ProfessorProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [Required]
    [MaxLength(30)]
    public string ProfessorCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(160)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Department { get; set; } = string.Empty;

    [MaxLength(120)]
    public string? Speciality { get; set; }

    public User User { get; set; } = default!;

    public ICollection<CourseOffering> CourseOfferings { get; set; } = new List<CourseOffering>();

    public ICollection<TeacherAvailabilitySnapshot> AvailabilitySnapshots { get; set; } = new List<TeacherAvailabilitySnapshot>();
}
