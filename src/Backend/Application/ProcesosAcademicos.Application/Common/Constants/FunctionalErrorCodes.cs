namespace ProcesosAcademicos.Application.Common.Constants;

public static class FunctionalErrorCodes
{
    public const string AuthInvalidCredentials = "AUTH_INVALID_CREDENTIALS";
    public const string AuthInvalidToken = "AUTH_INVALID_TOKEN";
    public const string AuthTokenExpired = "AUTH_TOKEN_EXPIRED";
    public const string AuthRefreshInvalid = "AUTH_REFRESH_INVALID";
    public const string AuthRefreshExpired = "AUTH_REFRESH_EXPIRED";
    public const string AuthUserDisabled = "AUTH_USER_DISABLED";
    public const string ForbiddenRole = "FORBIDDEN_ROLE";
    public const string ForbiddenClassAccess = "FORBIDDEN_CLASS_ACCESS";

    public const string StudentNotFound = "STUDENT_NOT_FOUND";
    public const string StudentProfileNotFound = "STUDENT_PROFILE_NOT_FOUND";
    public const string StudentWithoutCareer = "STUDENT_WITHOUT_CAREER";
    public const string StudentAlreadyHasCareer = "STUDENT_ALREADY_HAS_CAREER";

    public const string ProfessorProfileNotFound = "PROFESSOR_PROFILE_NOT_FOUND";
    public const string DirectorProfileNotFound = "DIRECTOR_PROFILE_NOT_FOUND";

    public const string CurriculumVersionNotAssigned = "CURRICULUM_VERSION_NOT_ASSIGNED";
    public const string CurriculumVersionNotFound = "CURRICULUM_VERSION_NOT_FOUND";
    public const string CurriculumVersionAlreadyExists = "CURRICULUM_VERSION_ALREADY_EXISTS";
    public const string CurriculumAssignmentConflict = "CURRICULUM_ASSIGNMENT_CONFLICT";

    public const string CareerNotFound = "CAREER_NOT_FOUND";
    public const string CareerWithoutActiveCurriculum = "CAREER_WITHOUT_ACTIVE_CURRICULUM";

    public const string CourseNotFound = "COURSE_NOT_FOUND";
    public const string CourseOfferingNotFound = "COURSE_OFFERING_NOT_FOUND";
    public const string CourseOfferingNotPublished = "COURSE_OFFERING_NOT_PUBLISHED";
    public const string CourseOfferingCapacityExhausted = "COURSE_OFFERING_CAPACITY_EXHAUSTED";
    public const string CourseOfferingAlreadyPublished = "COURSE_OFFERING_ALREADY_PUBLISHED";
    public const string CourseOfferingAlreadyActive = "COURSE_OFFERING_ALREADY_ACTIVE";
    public const string CourseOfferingAlreadyClosed = "COURSE_OFFERING_ALREADY_CLOSED";
    public const string CourseOfferingCodeAlreadyExists = "COURSE_OFFERING_CODE_ALREADY_EXISTS";

    public const string EnrollmentAlreadyExists = "ENROLLMENT_ALREADY_EXISTS";
    public const string CareerMismatch = "CAREER_MISMATCH";

    public const string ClassNotFound = "CLASS_NOT_FOUND";
    public const string ClassNotActiveForGrading = "CLASS_NOT_ACTIVE_FOR_GRADING";
    public const string ClassAlreadyClosed = "CLASS_ALREADY_CLOSED";

    public const string GradeOutOfRange = "GRADE_OUT_OF_RANGE";
    public const string GradeEditLocked = "GRADE_EDIT_LOCKED";
    public const string GradesAlreadyPublished = "GRADES_ALREADY_PUBLISHED";
    public const string GradesIncomplete = "GRADES_INCOMPLETE";

    public const string CourseCannotCloseUntilGradesPublished = "COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED";

    public const string CourseEquivalenceInvalid = "COURSE_EQUIVALENCE_INVALID";
    public const string CourseEquivalenceDuplicate = "COURSE_EQUIVALENCE_DUPLICATE";

    public const string InvalidCapacity = "INVALID_CAPACITY";
    public const string ReportTypeInvalid = "REPORT_TYPE_INVALID";
    public const string CurriculumNotCompletedForClosure = "CURRICULUM_NOT_COMPLETED_FOR_CLOSURE";
    public const string ReportRequestNotFound = "REPORT_REQUEST_NOT_FOUND";
    public const string ReportDownloadTokenInvalid = "REPORT_DOWNLOAD_TOKEN_INVALID";
    public const string ReportDownloadTokenExpired = "REPORT_DOWNLOAD_TOKEN_EXPIRED";
    public const string ReportFileNotFound = "REPORT_FILE_NOT_FOUND";

    public const string ValidationFailed = "VALIDATION_FAILED";
}
