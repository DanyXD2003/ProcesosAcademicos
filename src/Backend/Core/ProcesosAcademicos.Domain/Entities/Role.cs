using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Domain.Entities;

public class Role
{
    public short Id { get; set; }

    public UserRoleCode Code { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
