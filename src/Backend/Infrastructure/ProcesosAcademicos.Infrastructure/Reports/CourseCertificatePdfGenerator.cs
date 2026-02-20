using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Common.Models;
using ProcesosAcademicos.Infrastructure.Reports.Documents;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace ProcesosAcademicos.Infrastructure.Reports;

public sealed class CourseCertificatePdfGenerator : ICourseCertificatePdfGenerator
{
    private static bool _licenseConfigured;
    private static readonly object LicenseLock = new();

    public byte[] Generate(CourseCertificatePdfModel model)
    {
        EnsureQuestPdfLicense();
        var document = new CourseCertificateDocument(model);
        return document.GeneratePdf();
    }

    private static void EnsureQuestPdfLicense()
    {
        if (_licenseConfigured)
        {
            return;
        }

        lock (LicenseLock)
        {
            if (_licenseConfigured)
            {
                return;
            }

            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
            _licenseConfigured = true;
        }
    }
}
