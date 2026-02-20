using System.Security.Claims;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Api.Extensions;

public sealed class CurrentUserAccessor : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId => ParseGuidClaim(ClaimTypes.NameIdentifier) ?? ParseGuidClaim("sub") ?? Guid.Empty;

    public string RoleCode => GetClaim("roleCode") ?? string.Empty;

    public string RoleLabel => GetClaim("roleLabel") ?? string.Empty;

    public Guid ProfileId => ParseGuidClaim("profileId") ?? Guid.Empty;

    public Guid? CareerId => ParseGuidClaim("careerId");

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

    private string? GetClaim(string claimType)
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirstValue(claimType);
    }

    private Guid? ParseGuidClaim(string claimType)
    {
        var value = GetClaim(claimType);
        return Guid.TryParse(value, out var result) ? result : null;
    }
}
