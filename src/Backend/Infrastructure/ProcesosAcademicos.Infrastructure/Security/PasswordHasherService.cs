using Microsoft.AspNetCore.Identity;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Domain.Entities;

namespace ProcesosAcademicos.Infrastructure.Security;

public sealed class PasswordHasherService : IPasswordHasherService
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(new User(), password);
    }

    public bool VerifyPassword(string passwordHash, string providedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(new User(), passwordHash, providedPassword);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
