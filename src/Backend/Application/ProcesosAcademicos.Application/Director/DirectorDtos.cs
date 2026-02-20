namespace ProcesosAcademicos.Application.Director;

public sealed record DirectorDashboardStatsDto(int TotalStudents, int TotalProfessors, int ActiveClasses, int PendingClasses);

public sealed record DirectorCapacityDto(int ActiveStudents, int PendingCapacity, int TotalCapacity);

public sealed record DirectorDashboardDto(
    DirectorDashboardStatsDto Stats,
    DirectorCapacityDto Capacity,
    IReadOnlyCollection<DirectorCourseDto> Classes,
    IReadOnlyCollection<TeacherAvailabilityDto> TeacherAvailability);

public sealed record DirectorCourseDto(
    string CourseOfferingId,
    string OfferingCode,
    string BaseCourseCode,
    string CourseName,
    string CareerName,
    string Term,
    string Section,
    string? ProfessorId,
    string ProfessorName,
    int SeatsTaken,
    int SeatsTotal,
    bool GradesPublished,
    string Status);

public sealed record CreateDirectorCourseRequestDto(
    string BaseCourseId,
    string CareerId,
    string Section,
    string Term,
    string? ProfessorId,
    int Capacity,
    string? OfferingCode);

public sealed record PublishCourseResultDto(string CourseOfferingId, string PreviousStatus, string CurrentStatus, string PublishedAt);

public sealed record ActivateCourseResultDto(string CourseOfferingId, string PreviousStatus, string CurrentStatus, string ActivatedAt);

public sealed record CloseCourseResultDto(string CourseOfferingId, string PreviousStatus, string CurrentStatus, string ClosedAt);

public sealed record AssignProfessorRequestDto(string ProfessorId);

public sealed record AssignProfessorResultDto(string CourseOfferingId, string ProfessorId, string AssignedAt);

public sealed record DirectorProfessorDto(
    string ProfessorId,
    string ProfessorCode,
    string Name,
    string Department,
    int LoadAssigned,
    int LoadMax);

public sealed record DirectorStudentDto(
    string StudentId,
    string StudentCode,
    string Name,
    string Program,
    short? Semester,
    decimal Average0to100);

public sealed record DirectorReportRequestDto(
    string RequestId,
    string StudentName,
    string RequestType,
    string RequestedAt,
    string? IssuedAt,
    string? DownloadedAt,
    int DownloadsCount);

public sealed record TeacherAvailabilityDto(string ProfessorId, string Name, string? Speciality, string Status);

public sealed record TeacherAvailabilityListDto(IReadOnlyCollection<TeacherAvailabilityDto> Items);

public sealed record CurriculumVersionDto(
    string CurriculumVersionId,
    string CareerId,
    string CareerName,
    string VersionCode,
    string DisplayName,
    string EffectiveFrom,
    string? EffectiveTo,
    bool IsActive);

public sealed record CreateCurriculumVersionRequestDto(
    string CareerId,
    string VersionCode,
    string DisplayName,
    string EffectiveFrom,
    string? EffectiveTo);

public sealed record StudentCurriculumAssignmentDto(
    string StudentId,
    string CurriculumVersionId,
    string AssignedAt,
    bool IsActive);

public sealed record AssignStudentCurriculumRequestDto(string CurriculumVersionId, string? AssignedAt);

public sealed record CourseEquivalenceDto(
    string EquivalenceId,
    string SourceCourseId,
    string SourceCourseCode,
    string TargetCourseId,
    string TargetCourseCode,
    string EquivalenceType,
    string EffectiveFrom,
    string? EffectiveTo,
    bool IsActive);

public sealed record CreateCourseEquivalenceRequestDto(
    string SourceCourseId,
    string TargetCourseId,
    string EquivalenceType,
    string EffectiveFrom,
    string? EffectiveTo,
    bool? IsActive);
