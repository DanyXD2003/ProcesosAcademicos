using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class DirectorProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [Required]
    [MaxLength(30)]
    public string DirectorCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(160)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(120)]
    public string? Campus { get; set; }

    public User User { get; set; } = default!;
}
