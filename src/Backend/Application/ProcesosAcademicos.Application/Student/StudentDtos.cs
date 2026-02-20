namespace ProcesosAcademicos.Application.Student;

public sealed record StudentProfileDto(
    string StudentId,
    string FullName,
    string? CareerId,
    string? CareerName,
    string Program,
    string? Faculty,
    short? Semester,
    string Email,
    string? Phone);

public sealed record StudentCareerEnrollmentRequestDto(string CareerId);

public sealed record StudentCareerEnrollmentResultDto(
    string StudentId,
    string CareerId,
    string CareerName,
    string CurriculumVersionId,
    string EnrolledAt);

public sealed record StudentDashboardDto(
    decimal AverageGrade,
    int ApprovedCourses,
    int PendingCourses,
    int ActiveCoursesCount,
    IReadOnlyCollection<StudentActiveCourseDto> ActiveCourses,
    IReadOnlyCollection<AcademicRecordRowDto> HistoryPreview);

public sealed record StudentCurriculumProgressDto(
    string CurriculumVersionId,
    string CurriculumVersionCode,
    int TotalRequired,
    int Approved,
    int Pending,
    IReadOnlyCollection<string> ApprovedCourseIds,
    IReadOnlyCollection<string> PendingCourseIds,
    IReadOnlyCollection<string> ResolvedByEquivalences);

public sealed record StudentAvailableCourseDto(
    string CourseOfferingId,
    string OfferingCode,
    string BaseCourseCode,
    string CourseName,
    string Term,
    string CareerName,
    string Section,
    string ProfessorName,
    int SeatsTaken,
    int SeatsTotal,
    string Status);

public sealed record StudentActiveCourseDto(
    string CourseOfferingId,
    string OfferingCode,
    string BaseCourseCode,
    string CourseName,
    string Term,
    string CareerName,
    string Section,
    string ProfessorName,
    int SeatsTaken,
    int SeatsTotal,
    string Status);

public sealed record AcademicRecordRowDto(
    string Code,
    string Subject,
    string Period,
    short? Credits,
    decimal Grade,
    string Status);

public sealed record CreateReportRequestDto(string RequestType);

public sealed record StudentReportRequestResultDto(
    string RequestId,
    string RequestType,
    string RequestedAt,
    string IssuedAt,
    string DownloadUrl);

public sealed record StudentEnrollmentResultDto(
    string EnrollmentId,
    string StudentId,
    string CourseOfferingId,
    string Status,
    string EnrolledAt);
