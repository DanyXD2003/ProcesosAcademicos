using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ProcesosAcademicos.Infrastructure.Persistence;

#nullable disable


namespace ProcesosAcademicos.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("202602201640_ReportCertificate_DownloadAudit")]
    public partial class ReportCertificate_DownloadAudit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfessorNameSnapshot",
                table: "academic_records",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "report_download_events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ReportRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    DownloadedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_report_download_events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_report_download_events_report_requests_ReportRequestId",
                        column: x => x.ReportRequestId,
                        principalTable: "report_requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_report_download_events_DownloadedAt",
                table: "report_download_events",
                column: "DownloadedAt");

            migrationBuilder.CreateIndex(
                name: "IX_report_download_events_ReportRequestId",
                table: "report_download_events",
                column: "ReportRequestId");

            migrationBuilder.Sql(
                """
                UPDATE academic_records ar
                SET "ProfessorNameSnapshot" = COALESCE(
                    (
                        SELECT p."FullName"
                        FROM enrollments e
                        INNER JOIN course_offerings o ON o."Id" = e."CourseOfferingId"
                        LEFT JOIN professors p ON p."Id" = o."ProfessorId"
                        WHERE e."StudentId" = ar."StudentId"
                          AND o."CourseId" = ar."CourseId"
                          AND o."Term" = ar."Period"
                        ORDER BY o."CreatedAt" DESC
                        LIMIT 1
                    ),
                    'N/D'
                )
                WHERE ar."ProfessorNameSnapshot" IS NULL;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "report_download_events");

            migrationBuilder.DropColumn(
                name: "ProfessorNameSnapshot",
                table: "academic_records");
        }
    }
}
