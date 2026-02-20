using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Professor;

namespace ProcesosAcademicos.Api.Controllers;

[Authorize]
[Route("api/v1/professor")]
public sealed class ProfessorController : ApiControllerBase
{
    private readonly ISender _sender;

    public ProfessorController(ISender sender, ICurrentUser currentUser)
        : base(currentUser)
    {
        _sender = sender;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken cancellationToken)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new GetProfessorDashboardQuery(CurrentUserId), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("classes")]
    public async Task<IActionResult> GetClasses([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new GetProfessorClassesQuery(CurrentUserId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpGet("classes/{classId}/students")]
    public async Task<IActionResult> GetClassStudents([FromRoute] string classId, CancellationToken cancellationToken)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new GetProfessorClassStudentsQuery(CurrentUserId, ParseGuidOrValidation(classId, "classId")), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPut("classes/{classId}/grades/draft")]
    public async Task<IActionResult> UpsertDraftGrades([FromRoute] string classId, [FromBody] UpsertDraftGradesRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new UpsertDraftGradesCommand(CurrentUserId, ParseGuidOrValidation(classId, "classId"), request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("classes/{classId}/grades/publish")]
    public async Task<IActionResult> PublishGrades([FromRoute] string classId, CancellationToken cancellationToken)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new PublishGradesCommand(CurrentUserId, ParseGuidOrValidation(classId, "classId")), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("classes/{classId}/close")]
    public async Task<IActionResult> CloseClass([FromRoute] string classId, CancellationToken cancellationToken)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new CloseClassCommand(CurrentUserId, ParseGuidOrValidation(classId, "classId")), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetStudents([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("PROFESOR");
        var result = await _sender.Send(new GetProfessorStudentsSummaryQuery(CurrentUserId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }
}
