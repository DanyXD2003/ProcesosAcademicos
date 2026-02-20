using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Director;

namespace ProcesosAcademicos.Api.Controllers;

[Authorize]
[Route("api/v1/director")]
public sealed class DirectorController : ApiControllerBase
{
    private readonly ISender _sender;

    public DirectorController(ISender sender, ICurrentUser currentUser)
        : base(currentUser)
    {
        _sender = sender;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetDirectorDashboardQuery(CurrentUserId), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses(
        [FromQuery] string? status,
        [FromQuery] string? careerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetDirectorCoursesQuery(CurrentUserId, status, careerId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateDirectorCourseRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new CreateDirectorCourseCommand(CurrentUserId, request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("courses/{offeringId}/publish")]
    public async Task<IActionResult> PublishCourse([FromRoute] string offeringId, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new PublishCourseCommand(CurrentUserId, ParseGuidOrValidation(offeringId, "offeringId")), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("courses/{offeringId}/activate")]
    public async Task<IActionResult> ActivateCourse([FromRoute] string offeringId, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new ActivateCourseCommand(CurrentUserId, ParseGuidOrValidation(offeringId, "offeringId")), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("courses/{offeringId}/close")]
    public async Task<IActionResult> CloseCourse([FromRoute] string offeringId, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new CloseCourseCommand(CurrentUserId, ParseGuidOrValidation(offeringId, "offeringId")), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("courses/{offeringId}/assign-professor")]
    public async Task<IActionResult> AssignProfessor([FromRoute] string offeringId, [FromBody] AssignProfessorRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new AssignProfessorCommand(CurrentUserId, ParseGuidOrValidation(offeringId, "offeringId"), request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("professors")]
    public async Task<IActionResult> GetProfessors([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetDirectorProfessorsQuery(CurrentUserId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetStudents([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetDirectorStudentsQuery(CurrentUserId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpGet("report-requests")]
    public async Task<IActionResult> GetReportRequests(
        [FromQuery] string? type,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetDirectorReportRequestsQuery(CurrentUserId, type, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpGet("teacher-availability")]
    public async Task<IActionResult> GetTeacherAvailability(CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetTeacherAvailabilityQuery(CurrentUserId), cancellationToken);
        return OkItems(result.Items);
    }

    [HttpGet("curriculum-versions")]
    public async Task<IActionResult> GetCurriculumVersions([FromQuery] string careerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new GetCurriculumVersionsQuery(CurrentUserId, ParseGuidOrValidation(careerId, "careerId"), page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpPost("curriculum-versions")]
    public async Task<IActionResult> CreateCurriculumVersion([FromBody] CreateCurriculumVersionRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new CreateCurriculumVersionCommand(CurrentUserId, request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("students/{studentId}/curriculum-assignment")]
    public async Task<IActionResult> AssignStudentCurriculum([FromRoute] string studentId, [FromBody] AssignStudentCurriculumRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new AssignStudentCurriculumCommand(CurrentUserId, ParseGuidOrValidation(studentId, "studentId"), request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("course-equivalences")]
    public async Task<IActionResult> GetCourseEquivalences([FromQuery] string? careerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("DIRECTOR");
        Guid? parsedCareerId = Guid.TryParse(careerId, out var guid) ? guid : null;
        var result = await _sender.Send(new GetCourseEquivalencesQuery(CurrentUserId, parsedCareerId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpPost("course-equivalences")]
    public async Task<IActionResult> CreateCourseEquivalence([FromBody] CreateCourseEquivalenceRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("DIRECTOR");
        var result = await _sender.Send(new CreateCourseEquivalenceCommand(CurrentUserId, request), cancellationToken);
        return OkEnvelope(result);
    }
}
