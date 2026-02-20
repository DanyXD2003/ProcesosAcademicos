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

namespace ProcesosAcademicos.Application.Professor;

public sealed record GetProfessorDashboardQuery(Guid UserId) : IRequest<ProfessorDashboardDto>;

public sealed class GetProfessorDashboardQueryHandler : IRequestHandler<GetProfessorDashboardQuery, ProfessorDashboardDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetProfessorDashboardQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProfessorDashboardDto> Handle(GetProfessorDashboardQuery request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var classes = await ProfessorHelpers.GetProfessorClassesAsync(_dbContext, professor.Id, cancellationToken);

        var activeCourses = classes.Count(x => x.Status != "Cerrado");
        var pendingGrades = classes
            .Where(x => x.Status == "Activo" && !x.GradesPublished)
            .Sum(x => Math.Max(0, x.StudentsCount - (int)Math.Round(x.StudentsCount * (x.ProgressPercent / 100m), 0)));

        var studentCount = await _dbContext.Enrollments
            .AsNoTracking()
            .Where(x => x.CourseOffering.ProfessorId == professor.Id)
            .Select(x => x.StudentId)
            .Distinct()
            .CountAsync(cancellationToken);

        return new ProfessorDashboardDto(
            new ProfessorDashboardStatsDto(activeCourses, pendingGrades, studentCount),
            classes);
    }
}

public sealed record GetProfessorClassesQuery(Guid UserId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<ProfessorClassDto>>;

public sealed class GetProfessorClassesQueryValidator : AbstractValidator<GetProfessorClassesQuery>
{
    public GetProfessorClassesQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public sealed class GetProfessorClassesQueryHandler
    : IRequestHandler<GetProfessorClassesQuery, PagedResult<ProfessorClassDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetProfessorClassesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<ProfessorClassDto>> Handle(GetProfessorClassesQuery request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var query = _dbContext.CourseOfferings
            .AsNoTracking()
            .Include(x => x.Course)
            .Include(x => x.Enrollments)
            .Include(x => x.GradeEntries)
            .Where(x => x.ProfessorId == professor.Id)
            .OrderBy(x => x.OfferingCode)
            .Select(x => new ProfessorClassDto(
                x.Id.ToString(),
                x.Id.ToString(),
                x.OfferingCode,
                x.Course.Code,
                x.Course.Name,
                x.Term,
                x.Section,
                x.Status.ToString(),
                x.GradeEntries.Any() && x.GradeEntries.All(g => g.IsPublished),
                x.Enrollments.Count(),
                x.Enrollments.Count() == 0 ? 0 : (int)Math.Round(100m * x.GradeEntries.Count(g => g.DraftGrade.HasValue) / x.Enrollments.Count())));

        return await query.ToPagedResultAsync(request.SafePage, request.SafePageSize, cancellationToken);
    }
}

public sealed record GetProfessorClassStudentsQuery(Guid UserId, Guid ClassId) : IRequest<ProfessorClassStudentsDto>;

public sealed class GetProfessorClassStudentsQueryHandler : IRequestHandler<GetProfessorClassStudentsQuery, ProfessorClassStudentsDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetProfessorClassStudentsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProfessorClassStudentsDto> Handle(GetProfessorClassStudentsQuery request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var courseOffering = await _dbContext.CourseOfferings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.ClassId, cancellationToken);

        if (courseOffering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassNotFound,
                "Clase no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassNotFound));
        }

        if (courseOffering.ProfessorId != professor.Id)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ForbiddenClassAccess,
                "No tiene acceso a esta clase.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ForbiddenClassAccess));
        }

        var enrolledStudents = await _dbContext.Enrollments
            .AsNoTracking()
            .Where(x => x.CourseOfferingId == request.ClassId)
            .Select(x => new
            {
                x.StudentId,
                StudentCode = x.Student.StudentCode,
                StudentName = x.Student.FullName,
                CareerName = x.Student.Career != null ? x.Student.Career.Name : "Sin carrera"
            })
            .ToListAsync(cancellationToken);

        var gradesByStudentId = await _dbContext.GradeEntries
            .AsNoTracking()
            .Where(x => x.CourseOfferingId == request.ClassId)
            .Select(x => new
            {
                x.StudentId,
                x.DraftGrade,
                x.PublishedGrade
            })
            .ToDictionaryAsync(x => x.StudentId, cancellationToken);

        var students = enrolledStudents
            .Select(student =>
            {
                gradesByStudentId.TryGetValue(student.StudentId, out var grade);

                return new ProfessorClassStudentDto(
                    student.StudentId.ToString(),
                    student.StudentCode,
                    student.StudentName,
                    student.CareerName,
                    grade?.DraftGrade,
                    grade?.PublishedGrade);
            })
            .ToList();

        return new ProfessorClassStudentsDto(request.ClassId.ToString(), students);
    }
}

public sealed record UpsertDraftGradesCommand(Guid UserId, Guid ClassId, UpsertDraftGradesRequestDto Request)
    : IRequest<UpsertDraftGradesResultDto>;

public sealed class UpsertDraftGradesCommandValidator : AbstractValidator<UpsertDraftGradesCommand>
{
    public UpsertDraftGradesCommandValidator()
    {
        RuleFor(x => x.Request.Grades).NotNull();
        RuleForEach(x => x.Request.Grades).ChildRules(child =>
        {
            child.RuleFor(x => x.StudentId)
                .NotEmpty()
                .Must(value => Guid.TryParse(value, out _));
            child.RuleFor(x => x.Grade).InclusiveBetween(0, 100);
        });
    }
}

public sealed class UpsertDraftGradesCommandHandler : IRequestHandler<UpsertDraftGradesCommand, UpsertDraftGradesResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public UpsertDraftGradesCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<UpsertDraftGradesResultDto> Handle(UpsertDraftGradesCommand request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var courseOffering = await _dbContext.CourseOfferings
            .Include(x => x.GradeEntries)
            .FirstOrDefaultAsync(x => x.Id == request.ClassId, cancellationToken);

        if (courseOffering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassNotFound,
                "Clase no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassNotFound));
        }

        if (courseOffering.ProfessorId != professor.Id)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ForbiddenClassAccess,
                "No tiene acceso a esta clase.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ForbiddenClassAccess));
        }

        if (courseOffering.Status == CourseOfferingStatus.Cerrado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.GradeEditLocked,
                "No es posible editar notas de una clase cerrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.GradeEditLocked));
        }

        var enrollmentStudentIds = await _dbContext.Enrollments
            .AsNoTracking()
            .Where(x => x.CourseOfferingId == request.ClassId)
            .Select(x => x.StudentId)
            .ToHashSetAsync(cancellationToken);

        var updatedCount = 0;

        foreach (var gradeItem in request.Request.Grades)
        {
            if (!Guid.TryParse(gradeItem.StudentId, out var studentId))
            {
                continue;
            }

            if (!enrollmentStudentIds.Contains(studentId))
            {
                continue;
            }

            var gradeEntry = courseOffering.GradeEntries.FirstOrDefault(x => x.StudentId == studentId);
            if (gradeEntry is null)
            {
                gradeEntry = new GradeEntry
                {
                    Id = Guid.NewGuid(),
                    CourseOfferingId = request.ClassId,
                    StudentId = studentId,
                    UpdatedByUserId = request.UserId,
                    UpdatedAt = _clock.UtcNow
                };
                _dbContext.GradeEntries.Add(gradeEntry);
            }

            try
            {
                gradeEntry.SetDraftGrade(gradeItem.Grade, request.UserId, _clock.UtcNow);
            }
            catch (InvalidOperationException ex)
            {
                var code = ex.Message is FunctionalErrorCodes.GradeOutOfRange or FunctionalErrorCodes.GradeEditLocked
                    ? ex.Message
                    : FunctionalErrorCodes.GradeEditLocked;

                throw new FunctionalException(code, "No fue posible actualizar notas.", FunctionalErrorHttpMapper.Resolve(code));
            }

            updatedCount++;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpsertDraftGradesResultDto(request.ClassId.ToString(), updatedCount);
    }
}

public sealed record PublishGradesCommand(Guid UserId, Guid ClassId) : IRequest<PublishGradesResultDto>;

public sealed class PublishGradesCommandHandler : IRequestHandler<PublishGradesCommand, PublishGradesResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public PublishGradesCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<PublishGradesResultDto> Handle(PublishGradesCommand request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var offering = await _dbContext.CourseOfferings
            .Include(x => x.GradeEntries)
            .Include(x => x.Enrollments)
            .FirstOrDefaultAsync(x => x.Id == request.ClassId, cancellationToken);

        if (offering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassNotFound,
                "Clase no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassNotFound));
        }

        if (offering.ProfessorId != professor.Id)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ForbiddenClassAccess,
                "No tiene acceso a esta clase.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ForbiddenClassAccess));
        }

        if (offering.Status == CourseOfferingStatus.Cerrado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassAlreadyClosed,
                "La clase ya esta cerrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassAlreadyClosed));
        }

        if (offering.Status != CourseOfferingStatus.Activo)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassNotActiveForGrading,
                "Solo se pueden publicar notas en clases activas.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassNotActiveForGrading));
        }

        if (offering.GradeEntries.Any() && offering.GradeEntries.All(x => x.IsPublished))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.GradesAlreadyPublished,
                "Las notas ya fueron publicadas.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.GradesAlreadyPublished));
        }

        var studentIds = offering.Enrollments.Select(x => x.StudentId).ToHashSet();
        if (studentIds.Count == 0)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.GradesIncomplete,
                "No hay estudiantes en la clase.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.GradesIncomplete));
        }

        var gradeMap = offering.GradeEntries.ToDictionary(x => x.StudentId);
        foreach (var studentId in studentIds)
        {
            if (!gradeMap.TryGetValue(studentId, out var entry) || !entry.DraftGrade.HasValue)
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.GradesIncomplete,
                    "Existen estudiantes sin nota cargada.",
                    FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.GradesIncomplete));
            }
        }

        foreach (var entry in offering.GradeEntries)
        {
            try
            {
                entry.Publish(request.UserId, _clock.UtcNow);
            }
            catch (InvalidOperationException ex)
            {
                var code = ex.Message is FunctionalErrorCodes.GradesAlreadyPublished or FunctionalErrorCodes.GradesIncomplete
                    ? ex.Message
                    : FunctionalErrorCodes.GradesIncomplete;

                throw new FunctionalException(code, "No fue posible publicar notas.", FunctionalErrorHttpMapper.Resolve(code));
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new PublishGradesResultDto(request.ClassId.ToString(), _clock.UtcNow.ToString("O"), true);
    }
}

public sealed record CloseClassCommand(Guid UserId, Guid ClassId) : IRequest<CloseClassResultDto>;

public sealed class CloseClassCommandHandler : IRequestHandler<CloseClassCommand, CloseClassResultDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClock _clock;

    public CloseClassCommandHandler(IApplicationDbContext dbContext, IClock clock)
    {
        _dbContext = dbContext;
        _clock = clock;
    }

    public async Task<CloseClassResultDto> Handle(CloseClassCommand request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var offering = await _dbContext.CourseOfferings
            .Include(x => x.Enrollments)
            .Include(x => x.GradeEntries)
            .FirstOrDefaultAsync(x => x.Id == request.ClassId, cancellationToken);

        if (offering is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassNotFound,
                "Clase no encontrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassNotFound));
        }

        if (offering.ProfessorId != professor.Id)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ForbiddenClassAccess,
                "No tiene acceso a esta clase.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ForbiddenClassAccess));
        }

        if (offering.Status == CourseOfferingStatus.Cerrado)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ClassAlreadyClosed,
                "La clase ya esta cerrada.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ClassAlreadyClosed));
        }

        if (!offering.GradeEntries.Any() || offering.GradeEntries.Any(x => !x.IsPublished))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.CourseCannotCloseUntilGradesPublished,
                "No se puede cerrar la clase hasta publicar notas.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.CourseCannotCloseUntilGradesPublished));
        }

        offering.Close(true);

        foreach (var enrollment in offering.Enrollments)
        {
            enrollment.Close(_clock.UtcNow);
        }

        var courseCredits = await _dbContext.Courses
            .Where(x => x.Id == offering.CourseId)
            .Select(x => x.Credits)
            .FirstOrDefaultAsync(cancellationToken);

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
                Grade = grade,
                Credits = courseCredits,
                ResultStatus = AcademicRules.IsApproved(grade) ? ResultStatus.Aprobado : ResultStatus.Reprobado,
                ProfessorNameSnapshot = professor.FullName,
                CreatedAt = _clock.UtcNow
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CloseClassResultDto(request.ClassId.ToString(), _clock.UtcNow.ToString("O"), "Cerrado");
    }
}

public sealed record GetProfessorStudentsSummaryQuery(Guid UserId, int Page = 1, int PageSize = 10)
    : PagingQuery(Page, PageSize), IRequest<PagedResult<ProfessorStudentSummaryDto>>;

public sealed class GetProfessorStudentsSummaryQueryHandler
    : IRequestHandler<GetProfessorStudentsSummaryQuery, PagedResult<ProfessorStudentSummaryDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetProfessorStudentsSummaryQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<ProfessorStudentSummaryDto>> Handle(GetProfessorStudentsSummaryQuery request, CancellationToken cancellationToken)
    {
        var professor = await ProfessorHelpers.GetProfessorByUserIdAsync(_dbContext, request.UserId, cancellationToken);

        var rows = await _dbContext.Enrollments
            .AsNoTracking()
            .Where(x => x.CourseOffering.ProfessorId == professor.Id)
            .Select(enrollment => new
            {
                enrollment.StudentId,
                enrollment.Student.StudentCode,
                enrollment.Student.FullName,
                CareerName = enrollment.Student.Career != null ? enrollment.Student.Career.Name : "Sin carrera",
                Grade = _dbContext.GradeEntries
                    .Where(g => g.CourseOfferingId == enrollment.CourseOfferingId && g.StudentId == enrollment.StudentId)
                    .Select(g => g.PublishedGrade ?? g.DraftGrade)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        var results = rows
            .GroupBy(x => new { x.StudentId, x.StudentCode, x.FullName, x.CareerName })
            .Select(group =>
            {
                var approvedGrades = group
                    .Select(x => x.Grade)
                    .Where(x => x.HasValue && x.Value >= AcademicRules.PassingGrade)
                    .Select(x => x!.Value)
                    .ToArray();

                decimal? average = approvedGrades.Length == 0 ? null : decimal.Round(approvedGrades.Average(), 2);

                return new ProfessorStudentSummaryDto(
                    group.Key.StudentId.ToString(),
                    group.Key.StudentCode,
                    group.Key.FullName,
                    group.Key.CareerName,
                    average);
            })
            .OrderBy(x => x.Name)
            .ToList();

        var total = results.Count;
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)request.SafePageSize));
        var page = Math.Min(request.SafePage, totalPages);
        var items = results.Skip((page - 1) * request.SafePageSize).Take(request.SafePageSize).ToList();

        return new PagedResult<ProfessorStudentSummaryDto>(items, new PaginationMeta(page, request.SafePageSize, total, totalPages));
    }
}

internal static class ProfessorHelpers
{
    public static async Task<ProfessorProfile> GetProfessorByUserIdAsync(
        IApplicationDbContext dbContext,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var profile = await dbContext.Professors
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (profile is null)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ProfessorProfileNotFound,
                "Perfil de profesor no encontrado.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ProfessorProfileNotFound));
        }

        return profile;
    }

    public static async Task<IReadOnlyCollection<ProfessorClassDto>> GetProfessorClassesAsync(
        IApplicationDbContext dbContext,
        Guid professorId,
        CancellationToken cancellationToken)
    {
        return await dbContext.CourseOfferings
            .AsNoTracking()
            .Include(x => x.Course)
            .Include(x => x.Enrollments)
            .Include(x => x.GradeEntries)
            .Where(x => x.ProfessorId == professorId)
            .OrderBy(x => x.OfferingCode)
            .Select(x => new ProfessorClassDto(
                x.Id.ToString(),
                x.Id.ToString(),
                x.OfferingCode,
                x.Course.Code,
                x.Course.Name,
                x.Term,
                x.Section,
                x.Status.ToString(),
                x.GradeEntries.Any() && x.GradeEntries.All(g => g.IsPublished),
                x.Enrollments.Count(),
                x.Enrollments.Count() == 0 ? 0 : (int)Math.Round(100m * x.GradeEntries.Count(g => g.DraftGrade.HasValue) / x.Enrollments.Count())))
            .ToListAsync(cancellationToken);
    }
}
