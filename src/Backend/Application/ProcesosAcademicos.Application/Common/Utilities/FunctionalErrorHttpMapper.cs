using System.Net;
using ProcesosAcademicos.Application.Common.Constants;

namespace ProcesosAcademicos.Application.Common.Utilities;

public static class FunctionalErrorHttpMapper
{
    private static readonly IReadOnlyDictionary<string, HttpStatusCode> Map = new Dictionary<string, HttpStatusCode>
    {
        [FunctionalErrorCodes.AuthInvalidCredentials] = HttpStatusCode.Unauthorized,
        [FunctionalErrorCodes.AuthInvalidToken] = HttpStatusCode.Unauthorized,
        [FunctionalErrorCodes.AuthTokenExpired] = HttpStatusCode.Unauthorized,
        [FunctionalErrorCodes.AuthRefreshInvalid] = HttpStatusCode.Unauthorized,
        [FunctionalErrorCodes.AuthRefreshExpired] = HttpStatusCode.Unauthorized,

        [FunctionalErrorCodes.AuthUserDisabled] = HttpStatusCode.Forbidden,
        [FunctionalErrorCodes.ForbiddenRole] = HttpStatusCode.Forbidden,
        [FunctionalErrorCodes.ForbiddenClassAccess] = HttpStatusCode.Forbidden,

        [FunctionalErrorCodes.StudentProfileNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.StudentNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.ProfessorProfileNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.DirectorProfileNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.ClassNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.CourseNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.CourseOfferingNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.CareerNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.CurriculumVersionNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.ReportRequestNotFound] = HttpStatusCode.NotFound,
        [FunctionalErrorCodes.ReportFileNotFound] = HttpStatusCode.NotFound,

        [FunctionalErrorCodes.StudentAlreadyHasCareer] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.EnrollmentAlreadyExists] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CourseOfferingAlreadyPublished] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CourseOfferingAlreadyActive] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CourseOfferingAlreadyClosed] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.ClassAlreadyClosed] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CurriculumVersionAlreadyExists] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CurriculumAssignmentConflict] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CourseEquivalenceDuplicate] = HttpStatusCode.Conflict,
        [FunctionalErrorCodes.CourseOfferingCodeAlreadyExists] = HttpStatusCode.Conflict,

        [FunctionalErrorCodes.StudentWithoutCareer] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CurriculumVersionNotAssigned] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CareerWithoutActiveCurriculum] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CourseOfferingNotPublished] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CourseOfferingCapacityExhausted] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CareerMismatch] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.ClassNotActiveForGrading] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.GradeOutOfRange] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.GradeEditLocked] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.GradesAlreadyPublished] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.GradesIncomplete] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CourseCannotCloseUntilGradesPublished] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CourseEquivalenceInvalid] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.InvalidCapacity] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.ReportTypeInvalid] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.CurriculumNotCompletedForClosure] = HttpStatusCode.UnprocessableEntity,
        [FunctionalErrorCodes.ReportDownloadTokenInvalid] = HttpStatusCode.Unauthorized,
        [FunctionalErrorCodes.ReportDownloadTokenExpired] = HttpStatusCode.Unauthorized,
        [FunctionalErrorCodes.ValidationFailed] = HttpStatusCode.UnprocessableEntity
    };

    public static HttpStatusCode Resolve(string errorCode)
    {
        return Map.TryGetValue(errorCode, out var status) ? status : HttpStatusCode.BadRequest;
    }
}
