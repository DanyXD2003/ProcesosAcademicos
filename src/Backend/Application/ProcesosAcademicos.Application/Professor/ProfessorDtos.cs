namespace ProcesosAcademicos.Application.Professor;

public sealed record ProfessorDashboardStatsDto(int ActiveCourses, int PendingGrades, int Students);

public sealed record ProfessorDashboardDto(ProfessorDashboardStatsDto Stats, IReadOnlyCollection<ProfessorClassDto> Classes);

public sealed record ProfessorClassDto(
    string ClassId,
    string CourseOfferingId,
    string OfferingCode,
    string BaseCourseCode,
    string Title,
    string Term,
    string Section,
    string Status,
    bool GradesPublished,
    int StudentsCount,
    int ProgressPercent);

public sealed record ProfessorClassStudentsDto(string ClassId, IReadOnlyCollection<ProfessorClassStudentDto> Students);

public sealed record ProfessorClassStudentDto(
    string StudentId,
    string StudentCode,
    string StudentName,
    string CareerName,
    decimal? GradeDraft,
    decimal? GradePublished);

public sealed record UpsertDraftGradeItemDto(string StudentId, decimal Grade);

public sealed record UpsertDraftGradesRequestDto(IReadOnlyCollection<UpsertDraftGradeItemDto> Grades);

public sealed record UpsertDraftGradesResultDto(string ClassId, int UpdatedCount);

public sealed record PublishGradesResultDto(string ClassId, string PublishedAt, bool GradesPublished);

public sealed record CloseClassResultDto(string ClassId, string ClosedAt, string Status);

public sealed record ProfessorStudentSummaryDto(
    string StudentId,
    string StudentCode,
    string Name,
    string Career,
    decimal? ApprovedAverage);
