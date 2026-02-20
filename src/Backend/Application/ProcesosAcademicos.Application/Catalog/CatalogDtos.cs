namespace ProcesosAcademicos.Application.Catalog;

public sealed record CareerOptionDto(string CareerId, string CareerCode, string CareerName, bool IsActive);

public sealed record CareerOptionsListDto(IReadOnlyCollection<CareerOptionDto> Items);

public sealed record BaseCourseOptionDto(string CourseId, string CourseCode, string CourseName, string Department);

public sealed record BaseCourseOptionsListDto(IReadOnlyCollection<BaseCourseOptionDto> Items);
