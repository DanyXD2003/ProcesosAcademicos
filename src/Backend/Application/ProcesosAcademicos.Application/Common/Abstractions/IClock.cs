namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface IClock
{
    DateTimeOffset UtcNow { get; }
}
