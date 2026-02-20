using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Infrastructure.Services;

public sealed class SystemClock : IClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
