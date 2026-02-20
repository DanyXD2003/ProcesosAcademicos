using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Common.Constants;
using ProcesosAcademicos.Application.Common.Exceptions;
using ProcesosAcademicos.Application.Common.Models;
using ProcesosAcademicos.Application.Common.Pagination;
using ProcesosAcademicos.Application.Common.Utilities;
using ProcesosAcademicos.Domain.Common;
using ProcesosAcademicos.Domain.Entities;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Application.Director;

public sealed record GetDirectorDashboardQuery(Guid UserId) : IRequest<DirectorDashboardDto>;

public sealed class GetDirectorDashboardQueryHandler : IRequestHandler<GetDirectorDashboardQuery, DirectorDashboardDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetDirectorDashboardQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DirectorDashboardDto> Handle(GetDirectorDashboardQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var totalStudents = await _dbContext.Students.CountAsync(cancellationToken);
        var totalProfessors = await _dbContext.Professors.CountAsync(cancellationToken);
        var activeClasses = await _dbContext.CourseOfferings.CountAsync(x => x.Status == CourseOfferingStatus.Activo, cancellationToken);
        var pendingClasses = await _dbContext.CourseOfferings.CountAsync(x => x.Status == CourseOfferingStatus.Publicado, cancellationToken);

        var activeOfferingIds = await _dbContext.CourseOfferings
            .Where(x => x.Status == CourseOfferingStatus.Activo)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var activeStudents = await _dbContext.Enrollments
            .CountAsync(x => x.Status == EnrollmentStatus.Activa && activeOfferingIds.Contains(x.CourseOfferingId), cancellationToken);

        var pendingCapacity = await _dbContext.CourseOfferings
            .Where(x => x.Status == CourseOfferingStatus.Publicado)
            .SumAsync(x => x.SeatsTotal, cancellationToken);

        var classes = await DirectorHelpers.BuildDirectorCoursesQuery(_dbContext)
            .Take(20)
            .ToListAsync(cancellationToken);

        var availability = await DirectorHelpers.GetTeacherAvailabilityRowsAsync(_dbContext, cancellationToken);

        return new DirectorDashboardDto(
            new DirectorDashboardStatsDto(totalStudents, totalProfessors, activeClasses, pendingClasses),
            new DirectorCapacityDto(activeStudents, pendingCapacity, activeStudents + pendingCapacity),
            classes,
            availability);
    }
}

public sealed record GetDirectorCoursesQuery(
    Guid UserId,
    string? Status,
    string? CareerId,
    int Page = 1,
    int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<DirectorCourseDto>>;

public sealed class GetDirectorCoursesQueryValidator : AbstractValidator<GetDirectorCoursesQuery>
{
    public GetDirectorCoursesQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public sealed class GetDirectorCoursesQueryHandler : IRequestHandler<GetDirectorCoursesQuery, PagedResult<DirectorCourseDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetDirectorCoursesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<DirectorCourseDto>> Handle(GetDirectorCoursesQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var query = DirectorHelpers.BuildDirectorCoursesQuery(_dbContext);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<CourseOfferingStatus>(request.Status, out var parsedStatus))
        {
            query = query.Where(x => x.Status == parsedStatus.ToString());
        }

        if (!string.IsNullOrWhiteSpace(request.CareerId) && Guid.TryParse(request.CareerId, out var careerId))
        {
            var careerName = await _dbContext.Careers
                .Where(c => c.Id == careerId)
                .Select(c => c.Name)
                .FirstOrDefaultAsync(cancellationToken);

            query = string.IsNullOrWhiteSpace(careerName)
                ? query.Where(_ => false)
                : query.Where(x => x.CareerName == careerName);
        }

        return await query
            .ToPagedResultAsync(request.SafePage, request.SafePageSize, cancellationToken);
    }
}

public sealed record CreateDirectorCourseCommand(Guid UserId, CreateDirectorCourseRequestDto Request) : IRequest<DirectorCourseDto>;

public sealed class CreateDirectorCourseCommandValidator : AbstractValidator<CreateDirectorCourseCommand>
{
    public CreateDirectorCourseCommandValidator()
    {
        RuleFor(x => x.Request.BaseCourseId).Must(value => Guid.TryParse(value, out _));
        RuleFor(x => x.Request.CareerId).Must(value => Guid.TryParse(value, out _));
        RuleFor(x => x.Request.Section).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Request.Term).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Request.Capacity).GreaterThan(0);
    }
}

public sealed class CreateDirectorCourseCommandHandler : IRequestHandler<CreateDirectorCourseCommand, DirectorCourseDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public CreateDirectorCourseCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<DirectorCourseDto> Handle(CreateDirectorCourseCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        if (request.Request.Capacity <= 0)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.InvalidCapacity,
                "La capacidad debe ser mayor a 0.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.InvalidCapacity));
        }

        var courseId = Guid.Parse(request.Request.BaseCourseId);
        var careerId = Guid.Parse(request.Request.CareerId);

        var course = await _dbContext.Courses.FirstOrDefaultAsync(x => x.Id == courseId, cancellationToken);
        if (course is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseNotFound,
                "Curso base no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseNotFound));
        }

        var career = await _dbContext.Careers.FirstOrDefaultAsync(x => x.Id == careerId, cancellationToken);
        if (career is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CareerNotFound,
                "Carrera no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CareerNotFound));
        }

        var offeringCode = string.IsNullOrWhiteSpace(request.Request.OfferingCode)
            ? await DirectorHelpers.GenerateOfferingCodeAsync(_dbContext, request.Request.Term, cancellationToken)
            : request.Request.OfferingCode.Trim().ToUpperInvariant();

        var duplicatedCode = await _dbContext.CourseOfferings.AnyAsync(x => x.OfferingCode == offeringCode, cancellationToken);
        if (duplicatedCode)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingCodeAlreadyExists,
                "El codigo de oferta ya existe.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingCodeAlreadyExists));
        }

        Guid? professorId = null;
        if (!string.IsNullOrWhiteSpace(request.Request.ProfessorId))
        {
            if (!Guid.TryParse(request.Request.ProfessorId, out var parsedProfessorId))
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.ProfessorProfileNotFound,
                    "Profesor no encontrado.",
                    FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ProfessorProfileNotFound));
            }

            var professorExists = await _dbContext.Professors.AnyAsync(x => x.Id == parsedProfessorId, cancellationToken);
            if (!professorExists)
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.ProfessorProfileNotFound,
                    "Profesor no encontrado.",
                    FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ProfessorProfileNotFound));
            }

            professorId = parsedProfessorId;
        }

        var offering = new CourseOffering
        {
            Id = Guid.NewGuid(),
            OfferingCode = offeringCode,
            CourseId = courseId,
            CareerId = careerId,
            ProfessorId = professorId,
            Section = request.Request.Section.Trim().ToUpperInvariant(),
            Term = request.Request.Term.Trim(),
            Status = CourseOfferingStatus.Borrador,
            SeatsTotal = request.Request.Capacity,
            SeatsTaken = 0,
            CreatedAt = _clock.UtcNow,
            CreatedByUserId = request.UserId
        };

        _dbContext.CourseOfferings.Add(offering);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new DirectorCourseDto(
            offering.Id.ToString(),
            offering.OfferingCode,
            course.Code,
            course.Name,
            career.Name,
            offering.Term,
            offering.Section,
            offering.ProfessorId?.ToString(),
            offering.ProfessorId.HasValue
                ? await _dbContext.Professors.Where(x => x.Id == offering.ProfessorId.Value).Select(x => x.FullName).FirstOrDefaultAsync(cancellationToken) ?? "Sin asignar"
                : "Sin asignar",
            offering.SeatsTaken,
            offering.SeatsTotal,
            false,
            offering.Status.ToString());
    }
}

public sealed record PublishCourseCommand(Guid UserId, Guid OfferingId) : IRequest<PublishCourseResultDto>;

public sealed class PublishCourseCommandHandler : IRequestHandler<PublishCourseCommand, PublishCourseResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public PublishCourseCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<PublishCourseResultDto> Handle(PublishCourseCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);
        var offering = await DirectorHelpers.GetOfferingOrFailAsync(_dbContext, request.OfferingId, cancellationToken);

        var previous = offering.Status.ToString();
        if (offering.Status == CourseOfferingStatus.Publicado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingAlreadyPublished,
                "La oferta ya esta publicada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingAlreadyPublished));
        }

        if (offering.Status == CourseOfferingStatus.Activo)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingAlreadyActive,
                "La oferta ya esta activa.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingAlreadyActive));
        }

        if (offering.Status == CourseOfferingStatus.Cerrado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingAlreadyClosed,
                "La oferta ya esta cerrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingAlreadyClosed));
        }

        offering.Publish();
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new PublishCourseResultDto(offering.Id.ToString(), previous, offering.Status.ToString(), _clock.UtcNow.ToString("O"));
    }
}

public sealed record ActivateCourseCommand(Guid UserId, Guid OfferingId) : IRequest<ActivateCourseResultDto>;

public sealed class ActivateCourseCommandHandler : IRequestHandler<ActivateCourseCommand, ActivateCourseResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public ActivateCourseCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<ActivateCourseResultDto> Handle(ActivateCourseCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);
        var offering = await DirectorHelpers.GetOfferingOrFailAsync(_dbContext, request.OfferingId, cancellationToken);

        var previous = offering.Status.ToString();
        if (offering.Status == CourseOfferingStatus.Activo)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingAlreadyActive,
                "La oferta ya esta activa.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingAlreadyActive));
        }

        if (offering.Status == CourseOfferingStatus.Cerrado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingAlreadyClosed,
                "La oferta ya esta cerrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingAlreadyClosed));
        }

        offering.Activate();
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ActivateCourseResultDto(offering.Id.ToString(), previous, offering.Status.ToString(), _clock.UtcNow.ToString("O"));
    }
}

public sealed record CloseCourseCommand(Guid UserId, Guid OfferingId) : IRequest<CloseCourseResultDto>;

public sealed class CloseCourseCommandHandler : IRequestHandler<CloseCourseCommand, CloseCourseResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public CloseCourseCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<CloseCourseResultDto> Handle(CloseCourseCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var offering = await _dbContext.CourseOfferings
            .Include(x => x.Enrollments)
            .Include(x => x.GradeEntries)
            .FirstOrDefaultAsync(x => x.Id == request.OfferingId, cancellationToken);

        if (offering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingNotFound,
                "Oferta no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingNotFound));
        }

        if (offering.Status == CourseOfferingStatus.Cerrado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingAlreadyClosed,
                "La oferta ya esta cerrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingAlreadyClosed));
        }

        if (!offering.GradeEntries.Any() || offering.GradeEntries.Any(x => !x.IsPublished))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseCannotCloseUntilGradesPublished,
                "No se puede cerrar la oferta hasta publicar notas.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseCannotCloseUntilGradesPublished));
        }

        var previous = offering.Status.ToString();
        offering.Close(true);

        foreach (var enrollment in offering.Enrollments)
        {
            enrollment.Close(_clock.UtcNow);
        }

        var courseCredits = await _dbContext.Courses
            .Where(x => x.Id == offering.CourseId)
            .Select(x => x.Credits)
            .FirstOrDefaultAsync(cancellationToken);

        var professorNameSnapshot = offering.ProfessorId.HasValue
            ? await _dbContext.Professors
                .Where(x => x.Id == offering.ProfessorId.Value)
                .Select(x => x.FullName)
                .FirstOrDefaultAsync(cancellationToken)
            : null;

        var existingRecords = await _dbContext.AcademicRecords
            .Where(x => x.CourseId == offering.CourseId && offering.Enrollments.Select(e => e.StudentId).Contains(x.StudentId) && x.Period == offering.Term)
            .ToListAsync(cancellationToken);

        if (existingRecords.Count > 0)
        {
            _dbContext.AcademicRecords.RemoveRange(existingRecords);
        }

        foreach (var enrollment in offering.Enrollments)
        {
            var grade = offering.GradeEntries.First(x => x.StudentId == enrollment.StudentId).PublishedGrade ?? 0;
            _dbContext.AcademicRecords.Add(new AcademicRecord
            {
                Id = Guid.NewGuid(),
                StudentId = enrollment.StudentId,
                CourseId = offering.CourseId,
                Period = offering.Term,
                Credits = courseCredits,
                Grade = grade,
                ResultStatus = AcademicRules.IsApproved(grade) ? ResultStatus.Aprobado : ResultStatus.Reprobado,
                ProfessorNameSnapshot = string.IsNullOrWhiteSpace(professorNameSnapshot) ? "N/D" : professorNameSnapshot,
                CreatedAt = _clock.UtcNow
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CloseCourseResultDto(offering.Id.ToString(), previous, offering.Status.ToString(), _clock.UtcNow.ToString("O"));
    }
}

public sealed record AssignProfessorCommand(Guid UserId, Guid OfferingId, AssignProfessorRequestDto Request)
    : IRequest<AssignProfessorResultDto>;

public sealed class AssignProfessorCommandValidator : AbstractValidator<AssignProfessorCommand>
{
    public AssignProfessorCommandValidator()
    {
        RuleFor(x => x.Request.ProfessorId)
            .NotEmpty()
            .Must(value => Guid.TryParse(value, out _));
    }
}

public sealed class AssignProfessorCommandHandler : IRequestHandler<AssignProfessorCommand, AssignProfessorResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public AssignProfessorCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<AssignProfessorResultDto> Handle(AssignProfessorCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var offering = await DirectorHelpers.GetOfferingOrFailAsync(_dbContext, request.OfferingId, cancellationToken);
        var professorId = Guid.Parse(request.Request.ProfessorId);

        var professor = await _dbContext.Professors.FirstOrDefaultAsync(x => x.Id == professorId, cancellationToken);
        if (professor is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ProfessorProfileNotFound,
                "Profesor no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ProfessorProfileNotFound));
        }

        offering.ProfessorId = professorId;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new AssignProfessorResultDto(offering.Id.ToString(), professorId.ToString(), _clock.UtcNow.ToString("O"));
    }
}

public sealed record GetDirectorProfessorsQuery(Guid UserId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<DirectorProfessorDto>>;

public sealed class GetDirectorProfessorsQueryHandler
    : IRequestHandler<GetDirectorProfessorsQuery, PagedResult<DirectorProfessorDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetDirectorProfessorsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<DirectorProfessorDto>> Handle(GetDirectorProfessorsQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var sourceQuery = _dbContext.Professors
            .AsNoTracking()
            .OrderBy(x => x.FullName);

        var total = await sourceQuery.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)request.SafePageSize));
        var page = Math.Min(request.SafePage, totalPages);

        var items = await sourceQuery
            .Skip((page - 1) * request.SafePageSize)
            .Take(request.SafePageSize)
            .Select(x => new DirectorProfessorDto(
                x.Id.ToString(),
                x.ProfessorCode,
                x.FullName,
                x.Department,
                _dbContext.CourseOfferings.Count(offering => offering.ProfessorId == x.Id && offering.Status != CourseOfferingStatus.Cerrado),
                5))
            .ToListAsync(cancellationToken);

        return new PagedResult<DirectorProfessorDto>(items, new PaginationMeta(page, request.SafePageSize, total, totalPages));
    }
}

public sealed record GetDirectorStudentsQuery(Guid UserId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<DirectorStudentDto>>;

public sealed class GetDirectorStudentsQueryHandler
    : IRequestHandler<GetDirectorStudentsQuery, PagedResult<DirectorStudentDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetDirectorStudentsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<DirectorStudentDto>> Handle(GetDirectorStudentsQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var sourceQuery = _dbContext.Students
            .AsNoTracking()
            .OrderBy(student => student.FullName);

        var total = await sourceQuery.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)request.SafePageSize));
        var page = Math.Min(request.SafePage, totalPages);

        var items = await sourceQuery
            .Skip((page - 1) * request.SafePageSize)
            .Take(request.SafePageSize)
            .Select(student => new
            {
                student.Id,
                student.StudentCode,
                student.FullName,
                Program = student.Career != null ? student.Career.Name : "Sin carrera",
                student.Semester,
                Average = _dbContext.AcademicRecords
                    .Where(record => record.StudentId == student.Id)
                    .Select(record => (decimal?)record.Grade)
                    .Average() ?? 0m
            })
            .ToListAsync(cancellationToken);

        var mappedItems = items
            .Select(student => new DirectorStudentDto(
                student.Id.ToString(),
                student.StudentCode,
                student.FullName,
                student.Program,
                student.Semester,
                decimal.Round(student.Average, 2)))
            .ToList();

        return new PagedResult<DirectorStudentDto>(mappedItems, new PaginationMeta(page, request.SafePageSize, total, totalPages));
    }
}

public sealed record GetDirectorReportRequestsQuery(Guid UserId, string? Type, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<DirectorReportRequestDto>>;

public sealed class GetDirectorReportRequestsQueryHandler
    : IRequestHandler<GetDirectorReportRequestsQuery, PagedResult<DirectorReportRequestDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetDirectorReportRequestsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<DirectorReportRequestDto>> Handle(GetDirectorReportRequestsQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var sourceQuery = _dbContext.ReportRequests
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            sourceQuery = sourceQuery.Where(x =>
                (request.Type == "Certificacion de cursos" && x.RequestType == ReportRequestType.CertificacionDeCursos) ||
                (request.Type == "Cierre de pensum" && x.RequestType == ReportRequestType.CierreDePensum));
        }

        sourceQuery = sourceQuery
            .OrderByDescending(x => x.RequestedAt)
            .ThenBy(x => x.Id);

        var total = await sourceQuery.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)request.SafePageSize));
        var page = Math.Min(request.SafePage, totalPages);

        var items = await sourceQuery
            .Skip((page - 1) * request.SafePageSize)
            .Take(request.SafePageSize)
            .Select(x => new
            {
                x.Id,
                StudentName = x.Student.FullName,
                x.RequestType,
                x.RequestedAt,
                x.IssuedAt,
                DownloadsCount = _dbContext.ReportDownloadEvents.Count(e => e.ReportRequestId == x.Id),
                DownloadedAt = _dbContext.ReportDownloadEvents
                    .Where(e => e.ReportRequestId == x.Id)
                    .Max(e => (DateTimeOffset?)e.DownloadedAt)
            })
            .ToListAsync(cancellationToken);

        var mappedItems = items
            .Select(x => new DirectorReportRequestDto(
                x.Id.ToString(),
                x.StudentName,
                x.RequestType == ReportRequestType.CertificacionDeCursos ? "Certificacion de cursos" : "Cierre de pensum",
                x.RequestedAt.ToString("O"),
                x.IssuedAt.HasValue ? x.IssuedAt.Value.ToString("O") : null,
                x.DownloadedAt.HasValue ? x.DownloadedAt.Value.ToString("O") : null,
                x.DownloadsCount))
            .ToList();

        return new PagedResult<DirectorReportRequestDto>(mappedItems, new PaginationMeta(page, request.SafePageSize, total, totalPages));
    }
}

public sealed record GetTeacherAvailabilityQuery(Guid UserId) : IRequest<TeacherAvailabilityListDto>;

public sealed class GetTeacherAvailabilityQueryHandler : IRequestHandler<GetTeacherAvailabilityQuery, TeacherAvailabilityListDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetTeacherAvailabilityQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TeacherAvailabilityListDto> Handle(GetTeacherAvailabilityQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);
        var items = await DirectorHelpers.GetTeacherAvailabilityRowsAsync(_dbContext, cancellationToken);
        return new TeacherAvailabilityListDto(items);
    }
}

public sealed record GetCurriculumVersionsQuery(Guid UserId, Guid CareerId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<CurriculumVersionDto>>;

public sealed class GetCurriculumVersionsQueryHandler
    : IRequestHandler<GetCurriculumVersionsQuery, PagedResult<CurriculumVersionDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCurriculumVersionsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<CurriculumVersionDto>> Handle(GetCurriculumVersionsQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        return await _dbContext.CurriculumVersions
            .AsNoTracking()
            .Include(x => x.Career)
            .Where(x => x.CareerId == request.CareerId)
            .OrderByDescending(x => x.EffectiveFrom)
            .Select(x => new CurriculumVersionDto(
                x.Id.ToString(),
                x.CareerId.ToString(),
                x.Career.Name,
                x.VersionCode,
                x.DisplayName,
                x.EffectiveFrom.ToString("yyyy-MM-dd"),
                x.EffectiveTo.HasValue ? x.EffectiveTo.Value.ToString("yyyy-MM-dd") : null,
                x.IsActive))
            .ToPagedResultAsync(request.SafePage, request.SafePageSize, cancellationToken);
    }
}

public sealed record CreateCurriculumVersionCommand(Guid UserId, CreateCurriculumVersionRequestDto Request)
    : IRequest<CurriculumVersionDto>;

public sealed class CreateCurriculumVersionCommandValidator : AbstractValidator<CreateCurriculumVersionCommand>
{
    public CreateCurriculumVersionCommandValidator()
    {
        RuleFor(x => x.Request.CareerId).Must(value => Guid.TryParse(value, out _));
        RuleFor(x => x.Request.VersionCode).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Request.DisplayName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Request.EffectiveFrom).NotEmpty();
    }
}

public sealed class CreateCurriculumVersionCommandHandler : IRequestHandler<CreateCurriculumVersionCommand, CurriculumVersionDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public CreateCurriculumVersionCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<CurriculumVersionDto> Handle(CreateCurriculumVersionCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var careerId = Guid.Parse(request.Request.CareerId);
        var career = await _dbContext.Careers.FirstOrDefaultAsync(x => x.Id == careerId, cancellationToken);
        if (career is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CareerNotFound,
                "Carrera no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CareerNotFound));
        }

        var duplicated = await _dbContext.CurriculumVersions.AnyAsync(
            x => x.CareerId == careerId && x.VersionCode == request.Request.VersionCode,
            cancellationToken);

        if (duplicated)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CurriculumVersionAlreadyExists,
                "Ya existe una version con ese codigo para la carrera.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CurriculumVersionAlreadyExists));
        }

        var version = new CurriculumVersion
        {
            Id = Guid.NewGuid(),
            CareerId = careerId,
            VersionCode = request.Request.VersionCode.Trim().ToUpperInvariant(),
            DisplayName = request.Request.DisplayName.Trim(),
            EffectiveFrom = DateOnly.Parse(request.Request.EffectiveFrom),
            EffectiveTo = string.IsNullOrWhiteSpace(request.Request.EffectiveTo) ? null : DateOnly.Parse(request.Request.EffectiveTo),
            IsActive = true,
            CreatedAt = _clock.UtcNow
        };

        _dbContext.CurriculumVersions.Add(version);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CurriculumVersionDto(
            version.Id.ToString(),
            careerId.ToString(),
            career.Name,
            version.VersionCode,
            version.DisplayName,
            version.EffectiveFrom.ToString("yyyy-MM-dd"),
            version.EffectiveTo?.ToString("yyyy-MM-dd"),
            version.IsActive);
    }
}

public sealed record AssignStudentCurriculumCommand(Guid UserId, Guid StudentId, AssignStudentCurriculumRequestDto Request)
    : IRequest<StudentCurriculumAssignmentDto>;

public sealed class AssignStudentCurriculumCommandValidator : AbstractValidator<AssignStudentCurriculumCommand>
{
    public AssignStudentCurriculumCommandValidator()
    {
        RuleFor(x => x.Request.CurriculumVersionId).Must(value => Guid.TryParse(value, out _));
    }
}

public sealed class AssignStudentCurriculumCommandHandler
    : IRequestHandler<AssignStudentCurriculumCommand, StudentCurriculumAssignmentDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public AssignStudentCurriculumCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<StudentCurriculumAssignmentDto> Handle(AssignStudentCurriculumCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var student = await _dbContext.Students.FirstOrDefaultAsync(x => x.Id == request.StudentId, cancellationToken);
        if (student is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.StudentNotFound,
                "Estudiante no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.StudentNotFound));
        }

        var curriculumVersionId = Guid.Parse(request.Request.CurriculumVersionId);
        var version = await _dbContext.CurriculumVersions.FirstOrDefaultAsync(x => x.Id == curriculumVersionId, cancellationToken);
        if (version is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CurriculumVersionNotFound,
                "Version de pensum no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CurriculumVersionNotFound));
        }

        var activeAssignments = await _dbContext.StudentCurriculumAssignments
            .Where(x => x.StudentId == student.Id && x.IsActive)
            .ToListAsync(cancellationToken);

        foreach (var assignment in activeAssignments)
        {
            assignment.IsActive = false;
        }

        var assignedAt = string.IsNullOrWhiteSpace(request.Request.AssignedAt)
            ? _clock.UtcNow
            : DateTimeOffset.Parse(request.Request.AssignedAt);

        var newAssignment = new StudentCurriculumAssignment
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            CurriculumVersionId = version.Id,
            AssignedAt = assignedAt,
            IsActive = true
        };

        _dbContext.StudentCurriculumAssignments.Add(newAssignment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new StudentCurriculumAssignmentDto(
            student.Id.ToString(),
            version.Id.ToString(),
            newAssignment.AssignedAt.ToString("O"),
            true);
    }
}

public sealed record GetCourseEquivalencesQuery(Guid UserId, Guid? CareerId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<CourseEquivalenceDto>>;

public sealed class GetCourseEquivalencesQueryHandler
    : IRequestHandler<GetCourseEquivalencesQuery, PagedResult<CourseEquivalenceDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCourseEquivalencesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<CourseEquivalenceDto>> Handle(GetCourseEquivalencesQuery request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var query = _dbContext.CourseEquivalences
            .AsNoTracking()
            .Include(x => x.SourceCourse)
            .Include(x => x.TargetCourse)
            .AsQueryable();

        if (request.CareerId.HasValue)
        {
            var courseIds = await _dbContext.CurriculumVersions
                .Where(x => x.CareerId == request.CareerId.Value)
                .SelectMany(x => x.Courses.Select(c => c.CourseId))
                .Distinct()
                .ToListAsync(cancellationToken);

            query = query.Where(x => courseIds.Contains(x.SourceCourseId) || courseIds.Contains(x.TargetCourseId));
        }

        return await query
            .OrderByDescending(x => x.EffectiveFrom)
            .Select(x => new CourseEquivalenceDto(
                x.Id.ToString(),
                x.SourceCourseId.ToString(),
                x.SourceCourse.Code,
                x.TargetCourseId.ToString(),
                x.TargetCourse.Code,
                x.EquivalenceType.ToString(),
                x.EffectiveFrom.ToString("yyyy-MM-dd"),
                x.EffectiveTo.HasValue ? x.EffectiveTo.Value.ToString("yyyy-MM-dd") : null,
                x.IsActive))
            .ToPagedResultAsync(request.SafePage, request.SafePageSize, cancellationToken);
    }
}

public sealed record CreateCourseEquivalenceCommand(Guid UserId, CreateCourseEquivalenceRequestDto Request)
    : IRequest<CourseEquivalenceDto>;

public sealed class CreateCourseEquivalenceCommandValidator : AbstractValidator<CreateCourseEquivalenceCommand>
{
    public CreateCourseEquivalenceCommandValidator()
    {
        RuleFor(x => x.Request.SourceCourseId).Must(value => Guid.TryParse(value, out _));
        RuleFor(x => x.Request.TargetCourseId).Must(value => Guid.TryParse(value, out _));
        RuleFor(x => x.Request.EquivalenceType).Must(value => value is "Total" or "Parcial");
        RuleFor(x => x.Request.EffectiveFrom).NotEmpty();
    }
}

public sealed class CreateCourseEquivalenceCommandHandler
    : IRequestHandler<CreateCourseEquivalenceCommand, CourseEquivalenceDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateCourseEquivalenceCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CourseEquivalenceDto> Handle(CreateCourseEquivalenceCommand request, CancellationToken cancellationToken)
    {
        await DirectorHelpers.GetDirectorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var sourceId = Guid.Parse(request.Request.SourceCourseId);
        var targetId = Guid.Parse(request.Request.TargetCourseId);

        if (sourceId == targetId)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseEquivalenceInvalid,
                "No es posible crear equivalencia del mismo curso.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseEquivalenceInvalid));
        }

        var source = await _dbContext.Courses.FirstOrDefaultAsync(x => x.Id == sourceId, cancellationToken);
        var target = await _dbContext.Courses.FirstOrDefaultAsync(x => x.Id == targetId, cancellationToken);

        if (source is null || target is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseNotFound,
                "Curso no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseNotFound));
        }

        var duplicated = await _dbContext.CourseEquivalences.AnyAsync(
            x => x.IsActive &&
                 ((x.SourceCourseId == sourceId && x.TargetCourseId == targetId) ||
                  (x.SourceCourseId == targetId && x.TargetCourseId == sourceId)),
            cancellationToken);

        if (duplicated)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseEquivalenceDuplicate,
                "Ya existe una equivalencia activa para ese par de cursos.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseEquivalenceDuplicate));
        }

        var equivalenceType = request.Request.EquivalenceType == "Parcial" ? EquivalenceType.Parcial : EquivalenceType.Total;

        var equivalence = new CourseEquivalence
        {
            Id = Guid.NewGuid(),
            SourceCourseId = sourceId,
            TargetCourseId = targetId,
            EquivalenceType = equivalenceType,
            EffectiveFrom = DateOnly.Parse(request.Request.EffectiveFrom),
            EffectiveTo = string.IsNullOrWhiteSpace(request.Request.EffectiveTo) ? null : DateOnly.Parse(request.Request.EffectiveTo),
            IsActive = request.Request.IsActive ?? true
        };

        equivalence.EnsureValid();

        _dbContext.CourseEquivalences.Add(equivalence);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CourseEquivalenceDto(
            equivalence.Id.ToString(),
            source.Id.ToString(),
            source.Code,
            target.Id.ToString(),
            target.Code,
            equivalence.EquivalenceType.ToString(),
            equivalence.EffectiveFrom.ToString("yyyy-MM-dd"),
            equivalence.EffectiveTo?.ToString("yyyy-MM-dd"),
            equivalence.IsActive);
    }
}

internal static class DirectorHelpers
{
    public static async Task<DirectorProfile> GetDirectorByUserIdAsync(
        IApplicationDbContext dbContext,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var profile = await dbContext.Directors
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (profile is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.DirectorProfileNotFound,
                "Perfil de director no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.DirectorProfileNotFound));
        }

        return profile;
    }

    public static IQueryable<DirectorCourseDto> BuildDirectorCoursesQuery(IApplicationDbContext dbContext)
    {
        return dbContext.CourseOfferings
            .AsNoTracking()
            .Include(x => x.Course)
            .Include(x => x.Career)
            .Include(x => x.Professor)
            .Include(x => x.GradeEntries)
            .OrderBy(x => x.OfferingCode)
            .Select(x => new DirectorCourseDto(
                x.Id.ToString(),
                x.OfferingCode,
                x.Course.Code,
                x.Course.Name,
                x.Career.Name,
                x.Term,
                x.Section,
                x.ProfessorId.HasValue ? x.ProfessorId.Value.ToString() : null,
                x.Professor != null ? x.Professor.FullName : "Sin asignar",
                x.SeatsTaken,
                x.SeatsTotal,
                x.GradeEntries.Any() && x.GradeEntries.All(g => g.IsPublished),
                x.Status.ToString()));
    }

    public static async Task<IReadOnlyCollection<TeacherAvailabilityDto>> GetTeacherAvailabilityRowsAsync(
        IApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var snapshots = await dbContext.TeacherAvailabilitySnapshots
            .AsNoTracking()
            .OrderByDescending(x => x.CapturedAt)
            .ToListAsync(cancellationToken);

        var latestByProfessor = snapshots
            .GroupBy(x => x.ProfessorId)
            .ToDictionary(x => x.Key, x => x.First());

        var professors = await dbContext.Professors.AsNoTracking().OrderBy(x => x.FullName).ToListAsync(cancellationToken);

        return professors
            .Select(p =>
            {
                latestByProfessor.TryGetValue(p.Id, out var snapshot);
                var status = snapshot?.Status switch
                {
                    TeacherAvailabilityStatus.EnClase => "En clase",
                    TeacherAvailabilityStatus.Ocupado => "Ocupado",
                    _ => "Libre"
                };

                return new TeacherAvailabilityDto(p.Id.ToString(), p.FullName, snapshot?.Speciality ?? p.Speciality, status);
            })
            .ToArray();
    }

    public static async Task<CourseOffering> GetOfferingOrFailAsync(
        IApplicationDbContext dbContext,
        Guid offeringId,
        CancellationToken cancellationToken)
    {
        var offering = await dbContext.CourseOfferings.FirstOrDefaultAsync(x => x.Id == offeringId, cancellationToken);

        if (offering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseOfferingNotFound,
                "Oferta no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseOfferingNotFound));
        }

        return offering;
    }

    public static async Task<string> GenerateOfferingCodeAsync(
        IApplicationDbContext dbContext,
        string term,
        CancellationToken cancellationToken)
    {
        var year = term.Split('-', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? DateTime.UtcNow.Year.ToString();
        var prefix = $"CL-{year}-";

        var lastCode = await dbContext.CourseOfferings
            .Where(x => x.OfferingCode.StartsWith(prefix))
            .OrderByDescending(x => x.OfferingCode)
            .Select(x => x.OfferingCode)
            .FirstOrDefaultAsync(cancellationToken);

        var sequence = 1;
        if (!string.IsNullOrWhiteSpace(lastCode))
        {
            var suffix = lastCode[(prefix.Length)..];
            if (int.TryParse(suffix, out var parsed))
            {
                sequence = parsed + 1;
            }
        }

        return $"{prefix}{sequence:000}";
    }
}
