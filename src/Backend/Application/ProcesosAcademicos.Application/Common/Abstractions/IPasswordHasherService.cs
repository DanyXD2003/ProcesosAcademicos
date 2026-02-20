namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface IPasswordHasherService
{
    string HashPassword(string password);

    bool VerifyPassword(string passwordHash, string providedPassword);
}
