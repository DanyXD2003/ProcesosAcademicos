using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class Career
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public ICollection<StudentProfile> Students { get; set; } = new List<StudentProfile>();

    public ICollection<CourseOffering> CourseOfferings { get; set; } = new List<CourseOffering>();

    public ICollection<CurriculumVersion> CurriculumVersions { get; set; } = new List<CurriculumVersion>();
}
