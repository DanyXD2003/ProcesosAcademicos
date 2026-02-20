namespace ProcesosAcademicos.Domain.Entities;

public class CurriculumCourse
{
    public Guid CurriculumVersionId { get; set; }

    public Guid CourseId { get; set; }

    public short? TermNumber { get; set; }

    public bool IsMandatory { get; set; } = true;

    public CurriculumVersion CurriculumVersion { get; set; } = default!;

    public Course Course { get; set; } = default!;
}
