namespace ProcesosAcademicos.Application.Common.Models;

public sealed record CourseCertificatePdfRowModel(
    string CourseCode,
    string CourseName,
    string Period,
    decimal Grade,
    string ResultStatus,
    string ProfessorName);

public sealed record CourseCertificatePdfModel(
    string RequestId,
    string Title,
    string Subtitle,
    string StudentCode,
    string StudentName,
    string ProgramName,
    DateTimeOffset IssuedAt,
    IReadOnlyCollection<CourseCertificatePdfRowModel> Rows);
