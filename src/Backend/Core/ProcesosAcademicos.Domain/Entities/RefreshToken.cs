using System.ComponentModel.DataAnnotations;

namespace ProcesosAcademicos.Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [Required]
    [MaxLength(256)]
    public string TokenHash { get; set; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? RevokedAt { get; set; }

    [MaxLength(256)]
    public string? ReplacedByTokenHash { get; set; }

    public User User { get; set; } = default!;

    public bool IsActive(DateTimeOffset now) => RevokedAt is null && ExpiresAt > now;

    public void Revoke(DateTimeOffset revokedAt, string? replacedByTokenHash = null)
    {
        RevokedAt = revokedAt;
        ReplacedByTokenHash = replacedByTokenHash;
    }
}
