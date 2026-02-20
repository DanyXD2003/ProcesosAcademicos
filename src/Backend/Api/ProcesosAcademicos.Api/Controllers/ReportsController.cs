using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Application.Reports;

namespace ProcesosAcademicos.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/reports")]
public sealed class ReportsController : ControllerBase
{
    private readonly ISender _sender;

    public ReportsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("{requestId:guid}/download")]
    public async Task<IActionResult> Download([FromRoute] Guid requestId, [FromQuery] string? token, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new DownloadReportFileQuery(
            requestId,
            token ?? string.Empty,
            HttpContext.Connection.RemoteIpAddress?.ToString(),
            Request.Headers.UserAgent.ToString()), cancellationToken);

        return File(result.Content, result.ContentType, result.FileName);
    }
}
