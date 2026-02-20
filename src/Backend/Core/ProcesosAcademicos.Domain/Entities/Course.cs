using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class Course
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Department { get; set; } = string.Empty;

    [Range(0, 40)]
    public short? Credits { get; set; }

    public ICollection<CourseOffering> Offerings { get; set; } = new List<CourseOffering>();

    public ICollection<CurriculumCourse> CurriculumCourses { get; set; } = new List<CurriculumCourse>();

    public ICollection<CourseEquivalence> SourceEquivalences { get; set; } = new List<CourseEquivalence>();

    public ICollection<CourseEquivalence> TargetEquivalences { get; set; } = new List<CourseEquivalence>();

    public ICollection<AcademicRecord> AcademicRecords { get; set; } = new List<AcademicRecord>();
}
