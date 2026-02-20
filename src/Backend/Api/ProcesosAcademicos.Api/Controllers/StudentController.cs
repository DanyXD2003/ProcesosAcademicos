using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Student;

namespace ProcesosAcademicos.Api.Controllers;

[Authorize]
[Route("api/v1/student")]
public sealed class StudentController : ApiControllerBase
{
    private readonly ISender _sender;

    public StudentController(ISender sender, ICurrentUser currentUser)
        : base(currentUser)
    {
        _sender = sender;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new GetStudentProfileQuery(CurrentUserId), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpPost("career-enrollment")]
    public async Task<IActionResult> EnrollCareer([FromBody] StudentCareerEnrollmentRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new EnrollStudentCareerCommand(CurrentUserId, request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new GetStudentDashboardQuery(CurrentUserId), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("courses/available")]
    public async Task<IActionResult> GetAvailableCourses(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new GetStudentAvailableCoursesQuery(CurrentUserId, page, pageSize, search), cancellationToken);
        return OkPaged(result);
    }

    [HttpGet("courses/active")]
    public async Task<IActionResult> GetActiveCourses(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new GetStudentActiveCoursesQuery(CurrentUserId, page, pageSize, search), cancellationToken);
        return OkPaged(result);
    }

    [HttpPost("courses/{offeringId}/enroll")]
    public async Task<IActionResult> EnrollCourse([FromRoute] string offeringId, CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE");
        var parsedOfferingId = ParseGuidOrValidation(offeringId, "offeringId");
        var result = await _sender.Send(new EnrollStudentCourseCommand(CurrentUserId, parsedOfferingId), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("academic-record")]
    public async Task<IActionResult> GetAcademicRecord([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new GetStudentAcademicRecordQuery(CurrentUserId, page, pageSize), cancellationToken);
        return OkPaged(result);
    }

    [HttpPost("report-requests")]
    public async Task<IActionResult> CreateReportRequest([FromBody] CreateReportRequestDto request, CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new CreateStudentReportRequestCommand(CurrentUserId, request), cancellationToken);
        return OkEnvelope(result);
    }

    [HttpGet("curriculum/progress")]
    public async Task<IActionResult> GetCurriculumProgress(CancellationToken cancellationToken)
    {
        EnsureRoles("ESTUDIANTE");
        var result = await _sender.Send(new GetStudentCurriculumProgressQuery(CurrentUserId), cancellationToken);
        return OkEnvelope(result);
    }
}
