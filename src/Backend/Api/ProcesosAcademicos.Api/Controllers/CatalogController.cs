using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Application.Catalog;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Api.Controllers;

[Authorize]
[Route("api/v1/catalog")]
public sealed class CatalogController : ApiControllerBase
{
    private readonly ISender _sender;

    public CatalogController(ISender sender, ICurrentUser currentUser)
        : base(currentUser)
    {
        _sender = sender;
    }

    [HttpGet("careers")]
    public async Task<IActionResult> GetCareers(CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE", "DIRECTOR");
        var result = await _sender.Send(new GetCareerOptionsQuery(), cancellationToken);
        return OkItems(result.Items);
    }

    [HttpGet("base-courses")]
    public async Task<IActionResult> GetBaseCourses([FromQuery] string? careerId, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR", "ESTUDIANTE");
        Guid? parsedCareerId = Guid.TryParse(careerId, out var guid) ? guid : null;
        var result = await _sender.Send(new GetBaseCourseOptionsQuery(parsedCareerId), cancellationToken);
        return OkItems(result.Items);
    }
}
