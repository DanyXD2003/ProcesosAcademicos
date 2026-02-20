using ProcesosAcademicos.Application.Common.Models;

namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface ICourseCertificatePdfGenerator
{
    byte[] Generate(CourseCertificatePdfModel model);
}
