using ProcesosAcademicos.Application.Common.Models;
using ProcesosAcademicos.Infrastructure.Reports.Templates;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ProcesosAcademicos.Infrastructure.Reports.Documents;

internal sealed class CourseCertificateDocument : IDocument
{
    private readonly CourseCertificatePdfModel _model;

    public CourseCertificateDocument(CourseCertificatePdfModel model)
    {
        _model = model;
    }

    public DocumentMetadata GetMetadata()
    {
        return DocumentMetadata.Default;
    }

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(24);
            page.DefaultTextStyle(x => x.FontSize(10));

            page.Header()
                .Column(column =>
                {
                    column.Spacing(4);
                    column.Item().Text(string.IsNullOrWhiteSpace(_model.Title) ? CourseCertificateTemplate.Title : _model.Title).SemiBold().FontSize(16);
                    column.Item().Text(string.IsNullOrWhiteSpace(_model.Subtitle) ? CourseCertificateTemplate.Subtitle : _model.Subtitle).FontSize(10).FontColor(Colors.Grey.Darken1);
                });

            page.Content()
                .PaddingVertical(12)
                .Column(column =>
                {
                    column.Spacing(8);
                    column.Item().Element(ComposeStudentSummary);
                    column.Item().Element(ComposeRowsTable);
                });

            page.Footer()
                .Row(row =>
                {
                    row.RelativeItem().Text(CourseCertificateTemplate.FooterDisclaimer).FontSize(9).FontColor(Colors.Grey.Darken1);
                    row.ConstantItem(130).AlignRight().Text($"Emitido: {_model.IssuedAt:yyyy-MM-dd HH:mm} UTC").FontSize(9).FontColor(Colors.Grey.Darken1);
                });
        });
    }

    private void ComposeStudentSummary(IContainer container)
    {
        container.Padding(10).Border(1).BorderColor(Colors.Grey.Lighten1).Column(column =>
        {
            column.Spacing(2);
            column.Item().Text($"Solicitud: {_model.RequestId}");
            column.Item().Text($"Estudiante: {_model.StudentName} ({_model.StudentCode})");
            column.Item().Text($"Carrera: {_model.ProgramName}");
            column.Item().Text($"Cursos incluidos: {_model.Rows.Count}");
        });
    }

    private void ComposeRowsTable(IContainer container)
    {
        if (_model.Rows.Count == 0)
        {
            container.Padding(10).Border(1).BorderColor(Colors.Grey.Lighten1)
                .Text("No hay cursos cerrados para mostrar.").Italic();
            return;
        }

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(70);
                columns.RelativeColumn(2.2f);
                columns.ConstantColumn(55);
                columns.RelativeColumn(1.7f);
                columns.ConstantColumn(60);
                columns.ConstantColumn(55);
            });

            table.Header(header =>
            {
                header.Cell().Element(HeaderCellStyle).Text("Codigo");
                header.Cell().Element(HeaderCellStyle).Text("Curso");
                header.Cell().Element(HeaderCellStyle).Text("Nota");
                header.Cell().Element(HeaderCellStyle).Text("Profesor");
                header.Cell().Element(HeaderCellStyle).Text("Estado");
                header.Cell().Element(HeaderCellStyle).Text("Periodo");
            });

            foreach (var row in _model.Rows)
            {
                table.Cell().Element(DataCellStyle).Text(row.CourseCode);
                table.Cell().Element(DataCellStyle).Text(row.CourseName);
                table.Cell().Element(DataCellStyle).Text(row.Grade.ToString("0.##"));
                table.Cell().Element(DataCellStyle).Text(row.ProfessorName);
                table.Cell().Element(DataCellStyle).Text(row.ResultStatus);
                table.Cell().Element(DataCellStyle).Text(row.Period);
            }
        });
    }

    private static IContainer HeaderCellStyle(IContainer container)
    {
        return container
            .BorderBottom(1)
            .BorderColor(Colors.Grey.Lighten1)
            .PaddingVertical(6)
            .PaddingHorizontal(4)
            .Background(Colors.Grey.Lighten4)
            .DefaultTextStyle(x => x.SemiBold().FontSize(9));
    }

    private static IContainer DataCellStyle(IContainer container)
    {
        return container
            .BorderBottom(1)
            .BorderColor(Colors.Grey.Lighten3)
            .PaddingVertical(5)
            .PaddingHorizontal(4);
    }
}
