using System.Diagnostics;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Common.Constants;
using ProcesosAcademicos.Application.Common.Exceptions;
using ProcesosAcademicos.Application.Common.Models;
using ProcesosAcademicos.Application.Common.Pagination;
using ProcesosAcademicos.Application.Common.Utilities;
using ProcesosAcademicos.Domain.Common;
using ProcesosAcademicos.Domain.Entities;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Application.Student;

public sealed record GetStudentProfileQuery(Guid UserId) : IRequest<StudentProfileDto>;

public sealed class GetStudentProfileQueryHandler : IRequestHandler<GetStudentProfileQuery, StudentProfileDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetStudentProfileQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StudentProfileDto> Handle(GetStudentProfileQuery request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var careerName = student.Career?.Name;
        return new StudentProfileDto(
            student.Id.ToString(),
            student.FullName,
            student.CareerId?.ToString(),
            careerName,
            careerName ?? "Sin carrera asignada",
            student.Faculty,
            student.Semester,
            student.Email,
            student.Phone);
    }
}

public sealed record EnrollStudentCareerCommand(Guid UserId, StudentCareerEnrollmentRequestDto Request)
    : IRequest<StudentCareerEnrollmentResultDto>;

public sealed class EnrollStudentCareerCommandValidator : AbstractValidator<EnrollStudentCareerCommand>
{
    public EnrollStudentCareerCommandValidator()
    {
        RuleFor(x => x.Request.CareerId)
            .NotEmpty()
            .Must(value => Guid.TryParse(value, out _))
            .WithMessage("careerId debe ser GUID valido.");
    }
}

public sealed class EnrollStudentCareerCommandHandler : IRequestHandler<EnrollStudentCareerCommand, StudentCareerEnrollmentResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public EnrollStudentCareerCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<StudentCareerEnrollmentResultDto> Handle(EnrollStudentCareerCommand request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken, forUpdate: true);

        if (student.CareerId.HasValue)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.StudentAlreadyHasCareer,
                "El estudiante ya tiene carrera activa.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.StudentAlreadyHasCareer));
        }

        var careerId = Guid.Parse(request.Request.CareerId);
        var career = await _dbContext.Careers.FirstOrDefaultAsync(x => x.Id == careerId, cancellationToken);
        if (career is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CareerNotFound,
                "Carrera no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CareerNotFound));
        }

        var curriculum = await _dbContext.CurriculumVersions
            .Where(x => x.CareerId == careerId && x.IsActive)
            .OrderByDescending(x => x.EffectiveFrom)
            .FirstOrDefaultAsync(cancellationToken);

        if (curriculum is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CareerWithoutActiveCurriculum,
                "La carrera no tiene pensum activo.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CareerWithoutActiveCurriculum));
        }

        student.CareerId = careerId;

        var existingActive = await _dbContext.StudentCurriculumAssignments
            .Where(x => x.StudentId == student.Id && x.IsActive)
            .ToListAsync(cancellationToken);

        foreach (var item in existingActive)
        {
            item.IsActive = false;
        }

        var assignedAt = _clock.UtcNow;
        var assignment = new StudentCurriculumAssignment
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            CurriculumVersionId = curriculum.Id,
            AssignedAt = assignedAt,
            IsActive = true
        };

        _dbContext.StudentCurriculumAssignments.Add(assignment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new StudentCareerEnrollmentResultDto(
            student.Id.ToString(),
            career.Id.ToString(),
            career.Name,
            curriculum.Id.ToString(),
            assignedAt.ToString("O"));
    }
}

public sealed record GetStudentDashboardQuery(Guid UserId) : IRequest<StudentDashboardDto>;

public sealed class GetStudentDashboardQueryHandler : IRequestHandler<GetStudentDashboardQuery, StudentDashboardDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetStudentDashboardQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StudentDashboardDto> Handle(GetStudentDashboardQuery request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var activeCourses = await StudentHelpers.GetActiveCoursesAsync(_dbContext, student.Id, cancellationToken, page: 1, pageSize: 200);

        var historyRows = await _dbContext.AcademicRecords
            .AsNoTracking()
            .Where(x => x.StudentId == student.Id)
            .Include(x => x.Course)
            .OrderByDescending(x => x.Period)
            .Take(5)
            .Select(x => new AcademicRecordRowDto(
                x.Course.Code,
                x.Course.Name,
                x.Period,
                x.Credits,
                x.Grade,
                x.ResultStatus == ResultStatus.Aprobado ? "Aprobado" : "Reprobado"))
            .ToListAsync(cancellationToken);

        var progress = await StudentHelpers.CalculateProgressAsync(_dbContext, student, cancellationToken);

        var avg = await _dbContext.AcademicRecords
            .Where(x => x.StudentId == student.Id)
            .Select(x => (decimal?)x.Grade)
            .AverageAsync(cancellationToken) ?? 0m;

        return new StudentDashboardDto(
            decimal.Round(avg, 2),
            progress.Approved,
            progress.Pending,
            activeCourses.Items.Count,
            activeCourses.Items,
            historyRows);
    }
}

public sealed record GetStudentAvailableCoursesQuery(Guid UserId, int Page = 1, int PageSize = 10, string? Search = null)
    : PagingQuery(Page, PageSize, Search), IRequest<PagedResult<StudentAvailableCourseDto>>;

public sealed class GetStudentAvailableCoursesQueryValidator : AbstractValidator<GetStudentAvailableCoursesQuery>
{
    public GetStudentAvailableCoursesQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public sealed class GetStudentAvailableCoursesQueryHandler
    : IRequestHandler<GetStudentAvailableCoursesQuery, PagedResult<StudentAvailableCourseDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetStudentAvailableCoursesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<StudentAvailableCourseDto>> Handle(GetStudentAvailableCoursesQuery request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken);
        if (!student.CareerId.HasValue)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.StudentWithoutCareer,
                "El estudiante no tiene carrera activa.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.StudentWithoutCareer));
        }

        var progress = await StudentHelpers.CalculateProgressAsync(_dbContext, student, cancellationToken);
        var approved = progress.ApprovedCourseIds.Select(Guid.Parse).ToHashSet();

        var activeBaseCourseIds = await _dbContext.Enrollments
            .AsNoTracking()
            .Where(x => x.StudentId == student.Id && x.Status == EnrollmentStatus.Activa)
            .Select(x => x.CourseOffering.CourseId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var search = request.Search?.Trim().ToUpperInvariant();

        var query = _dbContext.CourseOfferings
            .AsNoTracking()
            .Include(x => x.Course)
            .Include(x => x.Career)
            .Include(x => x.Professor)
            .Where(x => x.CareerId == student.CareerId.Value)
            .Where(x => x.Status == CourseOfferingStatus.Publicado)
            .Where(x => x.SeatsTaken < x.SeatsTotal)
            .Where(x => !approved.Contains(x.CourseId))
            .Where(x => !activeBaseCourseIds.Contains(x.CourseId));

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.OfferingCode.ToUpper().Contains(search) ||
                x.Course.Code.ToUpper().Contains(search) ||
                x.Course.Name.ToUpper().Contains(search));
        }

        return await query
            .OrderBy(x => x.OfferingCode)
            .Select(x => new StudentAvailableCourseDto(
                x.Id.ToString(),
                x.OfferingCode,
                x.Course.Code,
                x.Course.Name,
                x.Term,
                x.Career.Name,
                x.Section,
                x.Professor != null ? x.Professor.FullName : "Sin asignar",
                x.SeatsTaken,
                x.SeatsTotal,
                x.Status.ToString()))
            .ToPagedResultAsync(request.SafePage, request.SafePageSize, cancellationToken);
    }
}

public sealed record GetStudentActiveCoursesQuery(Guid UserId, int Page = 1, int PageSize = 10, string? Search = null)
    : PagingQuery(Page, PageSize, Search), IRequest<PagedResult<StudentActiveCourseDto>>;

public sealed class GetStudentActiveCoursesQueryValidator : AbstractValidator<GetStudentActiveCoursesQuery>
{
    public GetStudentActiveCoursesQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public sealed class GetStudentActiveCoursesQueryHandler
    : IRequestHandler<GetStudentActiveCoursesQuery, PagedResult<StudentActiveCourseDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetStudentActiveCoursesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<StudentActiveCourseDto>> Handle(GetStudentActiveCoursesQuery request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken);
        return await StudentHelpers.GetActiveCoursesAsync(_dbContext, student.Id, cancellationToken, request.SafePage, request.SafePageSize, request.Search);
    }
}

public sealed record EnrollStudentCourseCommand(Guid UserId, Guid OfferingId) : IRequest<StudentEnrollmentResultDto>;

public sealed class EnrollStudentCourseCommandHandler : IRequestHandler<EnrollStudentCourseCommand, StudentEnrollmentResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public EnrollStudentCourseCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<StudentEnrollmentResultDto> Handle(EnrollStudentCourseCommand request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken, forUpdate: true);
        if (!student.CareerId.HasValue)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.StudentWithoutCareer,
                "El estudiante no tiene carrera activa.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.StudentWithoutCareer));
        }

        var offering = await _dbContext.CourseOfferings
            .FirstOrDefaultAsync(x => x.Id == request.OfferingId, cancellationToken);

        if (offering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingNotFound,
                "Oferta no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingNotFound));
        }

        if (offering.Status != CourseOfferingStatus.Publicado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingNotPublished,
                "La oferta no esta publicada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingNotPublished));
        }

        if (!offering.HasAvailableSeats())
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingCapacityExhausted,
                "No hay cupos disponibles.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingCapacityExhausted));
        }

        if (offering.CareerId != student.CareerId.Value)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CareerMismatch,
                "La oferta no corresponde a la carrera del estudiante.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CareerMismatch));
        }

        var exists = await _dbContext.Enrollments
            .AnyAsync(x => x.StudentId == student.Id && x.CourseOfferingId == offering.Id, cancellationToken);

        if (exists)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.EnrollmentAlreadyExists,
                "El estudiante ya se encuentra inscrito en esta oferta.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.EnrollmentAlreadyExists));
        }

        var enrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            CourseOfferingId = offering.Id,
            Status = EnrollmentStatus.Activa,
            EnrolledAt = _clock.UtcNow
        };

        offering.SeatsTaken = Math.Min(offering.SeatsTotal, offering.SeatsTaken + 1);

        _dbContext.Enrollments.Add(enrollment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new StudentEnrollmentResultDto(
            enrollment.Id.ToString(),
            enrollment.StudentId.ToString(),
            enrollment.CourseOfferingId.ToString(),
            enrollment.Status.ToString(),
            enrollment.EnrolledAt.ToString("O"));
    }
}

public sealed record GetStudentAcademicRecordQuery(Guid UserId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<AcademicRecordRowDto>>;

public sealed class GetStudentAcademicRecordQueryHandler
    : IRequestHandler<GetStudentAcademicRecordQuery, PagedResult<AcademicRecordRowDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetStudentAcademicRecordQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<AcademicRecordRowDto>> Handle(GetStudentAcademicRecordQuery request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        return await _dbContext.AcademicRecords
            .AsNoTracking()
            .Include(x => x.Course)
            .Where(x => x.StudentId == student.Id)
            .OrderByDescending(x => x.Period)
            .Select(x => new AcademicRecordRowDto(
                x.Course.Code,
                x.Course.Name,
                x.Period,
                x.Credits,
                x.Grade,
                x.ResultStatus == ResultStatus.Aprobado ? "Aprobado" : "Reprobado"))
            .ToPagedResultAsync(request.SafePage, request.SafePageSize, cancellationToken);
    }
}

public sealed record CreateStudentReportRequestCommand(Guid UserId, CreateReportRequestDto Request)
    : IRequest<StudentReportRequestResultDto>;

public sealed class CreateStudentReportRequestCommandValidator : AbstractValidator<CreateStudentReportRequestCommand>
{
    public CreateStudentReportRequestCommandValidator()
    {
        RuleFor(x => x.Request.RequestType)
            .Must(type => type == "Certificacion de cursos" || type == "Cierre de pensum")
            .WithMessage("Tipo de solicitud invalido.");
    }
}

public sealed class CreateStudentReportRequestCommandHandler
    : IRequestHandler<CreateStudentReportRequestCommand, StudentReportRequestResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;
    private readonly ICourseCertificatePdfGenerator _certificatePdfGenerator;
    private readonly IReportStorageService _reportStorageService;
    private readonly IReportDownloadTokenService _reportDownloadTokenService;
    private readonly ILogger<CreateStudentReportRequestCommandHandler> _logger;

    public CreateStudentReportRequestCommandHandler(
        IApplicationDbContext dbContext,
        IClock clock,
        ICourseCertificatePdfGenerator certificatePdfGenerator,
        IReportStorageService reportStorageService,
        IReportDownloadTokenService reportDownloadTokenService,
        ILogger<CreateStudentReportRequestCommandHandler> logger)
    {
        _dbContext = dbContext;
        _clock = clock;
        _certificatePdfGenerator = certificatePdfGenerator;
        _reportStorageService = reportStorageService;
        _reportDownloadTokenService = reportDownloadTokenService;
        _logger = logger;
    }

    public async Task<StudentReportRequestResultDto> Handle(CreateStudentReportRequestCommand request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken, forUpdate: true);

        var requestType = request.Request.RequestType switch
        {
            "Certificacion de cursos" => ReportRequestType.CertificacionDeCursos,
            "Cierre de pensum" => ReportRequestType.CierreDePensum,
            _ => throw new FunctionalException(
                FunctionalErrorCodes.ReportTypeInvalid,
                "Tipo de solicitud no valido.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ReportTypeInvalid))
        };

        var now = _clock.UtcNow;
        var reportRequestId = Guid.NewGuid();
        string downloadUrl;
        string reportTitle;
        string reportSubtitle;
        IReadOnlyCollection<CourseCertificatePdfRowModel> reportRows;

        var stopwatch = Stopwatch.StartNew();

        if (requestType == ReportRequestType.CertificacionDeCursos)
        {
            var historyRows = await _dbContext.AcademicRecords
                .AsNoTracking()
                .Where(x => x.StudentId == student.Id)
                .Include(x => x.Course)
                .OrderByDescending(x => x.Period)
                .ThenBy(x => x.Course.Code)
                .ToListAsync(cancellationToken);

            reportTitle = "Certificacion de cursos";
            reportSubtitle = "Historial academico de cursos cerrados";
            reportRows = historyRows.Select(x => new CourseCertificatePdfRowModel(
                    x.Course.Code,
                    x.Course.Name,
                    x.Period,
                    x.Grade,
                    x.ResultStatus == ResultStatus.Aprobado ? "Aprobado" : "Reprobado",
                    string.IsNullOrWhiteSpace(x.ProfessorNameSnapshot) ? "N/D" : x.ProfessorNameSnapshot))
                .ToList();
        }
        else
        {
            var progress = await StudentHelpers.CalculateProgressAsync(_dbContext, student, cancellationToken);
            if (progress.Pending > 0)
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.CurriculumNotCompletedForClosure,
                    "No se puede generar cierre de pensum hasta aprobar todos los cursos requeridos del pensum activo.",
                    FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CurriculumNotCompletedForClosure),
                    new
                    {
                        pendingCount = progress.Pending,
                        approvedCount = progress.Approved,
                        totalRequired = progress.TotalRequired
                    });
            }

            var curriculumVersionId = Guid.Parse(progress.CurriculumVersionId);

            var requiredCourses = await _dbContext.CurriculumCourses
                .AsNoTracking()
                .Include(x => x.Course)
                .Where(x => x.CurriculumVersionId == curriculumVersionId)
                .OrderBy(x => x.TermNumber)
                .ThenBy(x => x.Course.Code)
                .Select(x => new
                {
                    x.CourseId,
                    x.Course.Code,
                    x.Course.Name
                })
                .ToListAsync(cancellationToken);

            var requiredCourseIds = requiredCourses
                .Select(x => x.CourseId)
                .Distinct()
                .ToList();

            var approvedRecords = await _dbContext.AcademicRecords
                .AsNoTracking()
                .Where(x => x.StudentId == student.Id)
                .Where(x => requiredCourseIds.Contains(x.CourseId))
                .Where(x => x.Grade >= AcademicRules.PassingGrade)
                .OrderByDescending(x => x.CreatedAt)
                .ThenByDescending(x => x.Period)
                .ToListAsync(cancellationToken);

            var latestApprovedByCourse = approvedRecords
                .GroupBy(x => x.CourseId)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .OrderByDescending(x => x.CreatedAt)
                        .ThenByDescending(x => x.Period)
                        .First());

            var missingCourseIds = requiredCourseIds
                .Where(courseId => !latestApprovedByCourse.ContainsKey(courseId))
                .Select(x => x.ToString())
                .ToArray();

            if (missingCourseIds.Length > 0)
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.CurriculumNotCompletedForClosure,
                    "No se puede generar cierre de pensum hasta aprobar todos los cursos requeridos del pensum activo.",
                    FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CurriculumNotCompletedForClosure),
                    new
                    {
                        pendingCount = missingCourseIds.Length,
                        approvedCount = requiredCourseIds.Count - missingCourseIds.Length,
                        totalRequired = requiredCourseIds.Count,
                        missingCourseIds
                    });
            }

            reportTitle = "Certificacion de cierre de pensum";
            reportSubtitle = "Cumplimiento total del pensum activo";
            reportRows = requiredCourses
                .Select(requiredCourse =>
                {
                    var approvedRecord = latestApprovedByCourse[requiredCourse.CourseId];
                    return new CourseCertificatePdfRowModel(
                        requiredCourse.Code,
                        requiredCourse.Name,
                        approvedRecord.Period,
                        approvedRecord.Grade,
                        "Aprobado",
                        string.IsNullOrWhiteSpace(approvedRecord.ProfessorNameSnapshot) ? "N/D" : approvedRecord.ProfessorNameSnapshot);
                })
                .ToList();

            if (reportRows.Count != requiredCourseIds.Count)
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.CurriculumNotCompletedForClosure,
                    "No se puede generar cierre de pensum hasta aprobar todos los cursos requeridos del pensum activo.",
                    FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CurriculumNotCompletedForClosure),
                    new
                    {
                        pendingCount = requiredCourseIds.Count - reportRows.Count,
                        approvedCount = reportRows.Count,
                        totalRequired = requiredCourseIds.Count
                    });
            }
        }

        var pdfModel = new CourseCertificatePdfModel(
            reportRequestId.ToString(),
            reportTitle,
            reportSubtitle,
            student.StudentCode,
            student.FullName,
            student.Career?.Name ?? "Sin carrera",
            now,
            reportRows);

        var pdfBytes = _certificatePdfGenerator.Generate(pdfModel);
        await _reportStorageService.SaveAsync(reportRequestId, pdfBytes, cancellationToken);

        var expiresAt = now.AddDays(7);
        var token = _reportDownloadTokenService.CreateToken(reportRequestId, expiresAt);
        downloadUrl = $"/api/v1/reports/{reportRequestId}/download?token={Uri.EscapeDataString(token)}";

        stopwatch.Stop();
        _logger.LogInformation(
            "Report generated. RequestId={RequestId} StudentId={StudentId} Type={RequestType} Rows={Rows} ElapsedMs={ElapsedMs}",
            reportRequestId,
            student.Id,
            requestType.ToString(),
            pdfModel.Rows.Count,
            stopwatch.ElapsedMilliseconds);

        var reportRequest = new ReportRequest
        {
            Id = reportRequestId,
            StudentId = student.Id,
            RequestType = requestType,
            RequestedAt = now,
            IssuedAt = now,
            LegacyImported = false,
            DownloadUrl = downloadUrl
        };

        _dbContext.ReportRequests.Add(reportRequest);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new StudentReportRequestResultDto(
            reportRequest.Id.ToString(),
            request.Request.RequestType,
            reportRequest.RequestedAt.ToString("O"),
            reportRequest.IssuedAt?.ToString("O") ?? reportRequest.RequestedAt.ToString("O"),
            reportRequest.DownloadUrl ?? string.Empty);
    }
}

public sealed record GetStudentCurriculumProgressQuery(Guid UserId) : IRequest<StudentCurriculumProgressDto>;

public sealed class GetStudentCurriculumProgressQueryHandler
    : IRequestHandler<GetStudentCurriculumProgressQuery, StudentCurriculumProgressDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetStudentCurriculumProgressQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StudentCurriculumProgressDto> Handle(GetStudentCurriculumProgressQuery request, CancellationToken cancellationToken)
    {
        var student = await StudentHelpers.GetStudentByUserIdAsync(_dbContext, request.UserId, cancellationToken);
        var progress = await StudentHelpers.CalculateProgressAsync(_dbContext, student, cancellationToken);

        return new StudentCurriculumProgressDto(
            progress.CurriculumVersionId,
            progress.CurriculumVersionCode,
            progress.TotalRequired,
            progress.Approved,
            progress.Pending,
            progress.ApprovedCourseIds,
            progress.PendingCourseIds,
            progress.ResolvedByEquivalences);
    }
}

internal static class StudentHelpers
{
    internal sealed record ProgressCalculation(
        string CurriculumVersionId,
        string CurriculumVersionCode,
        int TotalRequired,
        int Approved,
        int Pending,
        IReadOnlyCollection<string> ApprovedCourseIds,
        IReadOnlyCollection<string> PendingCourseIds,
        IReadOnlyCollection<string> ResolvedByEquivalences);

    public static async Task<StudentProfile> GetStudentByUserIdAsync(
        IApplicationDbContext dbContext,
        Guid userId,
        CancellationToken cancellationToken,
        bool forUpdate = false)
    {
        var query = dbContext.Students
            .Include(x => x.Career)
            .Where(x => x.UserId == userId);

        var student = forUpdate
            ? await query.FirstOrDefaultAsync(cancellationToken)
            : await query.AsNoTracking().FirstOrDefaultAsync(cancellationToken);

        if (student is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.StudentProfileNotFound,
                "Perfil de estudiante no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.StudentProfileNotFound));
        }

        return student;
    }

    public static async Task<PagedResult<StudentActiveCourseDto>> GetActiveCoursesAsync(
        IApplicationDbContext dbContext,
        Guid studentId,
        CancellationToken cancellationToken,
        int page,
        int pageSize,
        string? search = null)
    {
        var term = search?.Trim().ToUpperInvariant();

        var query = dbContext.Enrollments
            .AsNoTracking()
            .Include(x => x.CourseOffering)
            .ThenInclude(x => x.Course)
            .Include(x => x.CourseOffering.Career)
            .Include(x => x.CourseOffering.Professor)
            .Where(x => x.StudentId == studentId && x.Status == EnrollmentStatus.Activa)
            .Where(x => x.CourseOffering.Status != CourseOfferingStatus.Cerrado)
            .Select(x => x.CourseOffering);

        if (!string.IsNullOrWhiteSpace(term))
        {
            query = query.Where(x =>
                x.OfferingCode.ToUpper().Contains(term) ||
                x.Course.Code.ToUpper().Contains(term) ||
                x.Course.Name.ToUpper().Contains(term));
        }

        return await query
            .OrderBy(x => x.OfferingCode)
            .Select(x => new StudentActiveCourseDto(
                x.Id.ToString(),
                x.OfferingCode,
                x.Course.Code,
                x.Course.Name,
                x.Term,
                x.Career.Name,
                x.Section,
                x.Professor != null ? x.Professor.FullName : "Sin asignar",
                x.SeatsTaken,
                x.SeatsTotal,
                x.Status.ToString()))
            .ToPagedResultAsync(page, pageSize, cancellationToken);
    }

    public static async Task<ProgressCalculation> CalculateProgressAsync(
        IApplicationDbContext dbContext,
        StudentProfile student,
        CancellationToken cancellationToken)
    {
        if (!student.CareerId.HasValue)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.StudentWithoutCareer,
                "El estudiante no tiene carrera activa.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.StudentWithoutCareer));
        }

        var assignment = await dbContext.StudentCurriculumAssignments
            .AsNoTracking()
            .Include(x => x.CurriculumVersion)
            .Where(x => x.StudentId == student.Id && x.IsActive)
            .OrderByDescending(x => x.AssignedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (assignment is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CurriculumVersionNotAssigned,
                "No existe version de pensum asignada para el estudiante.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CurriculumVersionNotAssigned));
        }

        var requiredCourses = await dbContext.CurriculumCourses
            .AsNoTracking()
            .Where(x => x.CurriculumVersionId == assignment.CurriculumVersionId)
            .Select(x => x.CourseId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var directlyApproved = await dbContext.AcademicRecords
            .AsNoTracking()
            .Where(x => x.StudentId == student.Id && x.Grade >= AcademicRules.PassingGrade)
            .Select(x => x.CourseId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var activeEquivalences = await dbContext.CourseEquivalences
            .AsNoTracking()
            .Where(x => x.IsActive)
            .Select(x => new { x.SourceCourseId, x.TargetCourseId })
            .ToListAsync(cancellationToken);

        var graph = BuildEquivalenceGraph(activeEquivalences.Select(x => (x.SourceCourseId, x.TargetCourseId)));

        var approvedExpanded = new HashSet<Guid>(directlyApproved);
        foreach (var approvedCourse in directlyApproved)
        {
            foreach (var equivalent in CollectEquivalentCourses(approvedCourse, graph))
            {
                approvedExpanded.Add(equivalent);
            }
        }

        var requiredSet = requiredCourses.ToHashSet();
        var approvedSet = requiredSet.Where(approvedExpanded.Contains).ToHashSet();
        var pendingSet = requiredSet.Where(x => !approvedSet.Contains(x)).ToHashSet();

        var resolvedByEquivalences = requiredSet
            .Where(courseId => !directlyApproved.Contains(courseId) && approvedExpanded.Contains(courseId))
            .Select(x => x.ToString())
            .ToArray();

        return new ProgressCalculation(
            assignment.CurriculumVersionId.ToString(),
            assignment.CurriculumVersion.VersionCode,
            requiredSet.Count,
            approvedSet.Count,
            pendingSet.Count,
            approvedSet.Select(x => x.ToString()).ToArray(),
            pendingSet.Select(x => x.ToString()).ToArray(),
            resolvedByEquivalences);
    }

    private static Dictionary<Guid, HashSet<Guid>> BuildEquivalenceGraph(IEnumerable<(Guid source, Guid target)> edges)
    {
        var graph = new Dictionary<Guid, HashSet<Guid>>();

        foreach (var edge in edges)
        {
            var source = edge.source;
            var target = edge.target;

            if (!graph.ContainsKey(source))
            {
                graph[source] = new HashSet<Guid>();
            }

            if (!graph.ContainsKey(target))
            {
                graph[target] = new HashSet<Guid>();
            }

            graph[source].Add(target);
            graph[target].Add(source);
        }

        return graph;
    }

    private static IReadOnlyCollection<Guid> CollectEquivalentCourses(Guid courseId, Dictionary<Guid, HashSet<Guid>> graph)
    {
        if (!graph.ContainsKey(courseId))
        {
            return Array.Empty<Guid>();
        }

        var visited = new HashSet<Guid> { courseId };
        var queue = new Queue<Guid>();
        queue.Enqueue(courseId);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            if (!graph.TryGetValue(current, out var neighbors))
            {
                continue;
            }

            foreach (var neighbor in neighbors)
            {
                if (visited.Add(neighbor))
                {
                    queue.Enqueue(neighbor);
                }
            }
        }

        return visited;
    }
}
