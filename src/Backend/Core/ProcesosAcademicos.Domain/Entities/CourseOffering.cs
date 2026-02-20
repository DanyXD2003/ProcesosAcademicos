using System.ComponentModel.DataAnnotations;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class CourseOffering
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string OfferingCode { get; set; } = string.Empty;

    public Guid CourseId { get; set; }

    public Guid CareerId { get; set; }

    public Guid? ProfessorId { get; set; }

    [Required]
    [MaxLength(10)]
    public string Section { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Term { get; set; } = string.Empty;

    public CourseOfferingStatus Status { get; set; } = CourseOfferingStatus.Borrador;

    [Range(1, int.MaxValue)]
    public int SeatsTotal { get; set; }

    [Range(0, int.MaxValue)]
    public int SeatsTaken { get; set; }

    public Guid CreatedByUserId { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Course Course { get; set; } = default!;

    public Career Career { get; set; } = default!;

    public ProfessorProfile? Professor { get; set; }

    public User CreatedByUser { get; set; } = default!;

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public ICollection<GradeEntry> GradeEntries { get; set; } = new List<GradeEntry>();

    public bool HasAvailableSeats() => SeatsTaken < SeatsTotal;

    public void Publish()
    {
        if (Status != CourseOfferingStatus.Borrador)
        {
            return;
        }

        Status = CourseOfferingStatus.Publicado;
    }

    public void Activate()
    {
        if (Status != CourseOfferingStatus.Publicado)
        {
            return;
        }

        Status = CourseOfferingStatus.Activo;
    }

    public void Close(bool gradesPublished)
    {
        if (!gradesPublished)
        {
            throw new InvalidOperationException("COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED");
        }

        if (Status == CourseOfferingStatus.Cerrado)
        {
            throw new InvalidOperationException("COURSE_OFFERING_ALREADY_CLOSED");
        }

        Status = CourseOfferingStatus.Cerrado;
    }
}
