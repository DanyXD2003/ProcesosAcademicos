namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface ICurrentUser
{
    Guid UserId { get; }

    string RoleCode { get; }

    string RoleLabel { get; }

    Guid ProfileId { get; }

    Guid? CareerId { get; }

    bool IsAuthenticated { get; }
}
