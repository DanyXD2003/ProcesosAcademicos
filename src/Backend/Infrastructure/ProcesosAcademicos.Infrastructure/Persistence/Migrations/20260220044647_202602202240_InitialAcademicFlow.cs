using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ProcesosAcademicos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class _202602202240_InitialAcademicFlow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "careers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_careers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Department = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Credits = table.Column<short>(type: "smallint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_courses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "curriculum_versions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CareerId = table.Column<Guid>(type: "uuid", nullable: false),
                    VersionCode = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_curriculum_versions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_curriculum_versions_careers_CareerId",
                        column: x => x.CareerId,
                        principalTable: "careers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "course_equivalences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceCourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    TargetCourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    EquivalenceType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Notes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    pair_left = table.Column<Guid>(type: "uuid", nullable: false, computedColumnSql: "LEAST(\"SourceCourseId\", \"TargetCourseId\")", stored: true),
                    pair_right = table.Column<Guid>(type: "uuid", nullable: false, computedColumnSql: "GREATEST(\"SourceCourseId\", \"TargetCourseId\")", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_equivalences", x => x.Id);
                    table.CheckConstraint("ck_course_equivalences_not_same", "\"SourceCourseId\" <> \"TargetCourseId\"");
                    table.ForeignKey(
                        name: "FK_course_equivalences_courses_SourceCourseId",
                        column: x => x.SourceCourseId,
                        principalTable: "courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_course_equivalences_courses_TargetCourseId",
                        column: x => x.TargetCourseId,
                        principalTable: "courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "directors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DirectorCode = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    FullName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Campus = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_directors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_directors_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "professors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessorCode = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    FullName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Department = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Speciality = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_professors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_professors_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "refresh_tokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TokenHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ExpiresAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    RevokedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ReplacedByTokenHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refresh_tokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_refresh_tokens_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "students",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentCode = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    CareerId = table.Column<Guid>(type: "uuid", nullable: true),
                    FullName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Faculty = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    Semester = table.Column<short>(type: "smallint", nullable: true),
                    Email = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Phone = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_students_careers_CareerId",
                        column: x => x.CareerId,
                        principalTable: "careers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_students_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_user_roles_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "curriculum_courses",
                columns: table => new
                {
                    CurriculumVersionId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    TermNumber = table.Column<short>(type: "smallint", nullable: true),
                    IsMandatory = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_curriculum_courses", x => new { x.CurriculumVersionId, x.CourseId });
                    table.ForeignKey(
                        name: "FK_curriculum_courses_courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_curriculum_courses_curriculum_versions_CurriculumVersionId",
                        column: x => x.CurriculumVersionId,
                        principalTable: "curriculum_versions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "course_offerings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OfferingCode = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    CareerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "uuid", nullable: true),
                    Section = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Term = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    SeatsTotal = table.Column<int>(type: "integer", nullable: false),
                    SeatsTaken = table.Column<int>(type: "integer", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_offerings", x => x.Id);
                    table.CheckConstraint("ck_course_offerings_seats_taken", "\"SeatsTaken\" >= 0 AND \"SeatsTaken\" <= \"SeatsTotal\"");
                    table.CheckConstraint("ck_course_offerings_seats_total", "\"SeatsTotal\" > 0");
                    table.ForeignKey(
                        name: "FK_course_offerings_careers_CareerId",
                        column: x => x.CareerId,
                        principalTable: "careers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_course_offerings_courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_course_offerings_professors_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_course_offerings_users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "teacher_availability_snapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Speciality = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    CapturedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_teacher_availability_snapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_teacher_availability_snapshots_professors_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "academic_records",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Period = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Credits = table.Column<short>(type: "smallint", nullable: true),
                    Grade = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    ResultStatus = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_academic_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_academic_records_courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_academic_records_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "report_requests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    RequestedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    IssuedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LegacyImported = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DownloadUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_report_requests", x => x.Id);
                    table.CheckConstraint("ck_report_requests_issued", "\"LegacyImported\" = true OR \"IssuedAt\" IS NOT NULL");
                    table.ForeignKey(
                        name: "FK_report_requests_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "student_curriculum_assignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CurriculumVersionId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_student_curriculum_assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_student_curriculum_assignments_curriculum_versions_Curricul~",
                        column: x => x.CurriculumVersionId,
                        principalTable: "curriculum_versions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_student_curriculum_assignments_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "enrollments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    EnrolledAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ClosedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_enrollments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_enrollments_course_offerings_CourseOfferingId",
                        column: x => x.CourseOfferingId,
                        principalTable: "course_offerings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_enrollments_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "grade_entries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    DraftGrade = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    PublishedGrade = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UpdatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grade_entries", x => x.Id);
                    table.CheckConstraint("ck_grade_entries_draft", "\"DraftGrade\" IS NULL OR (\"DraftGrade\" >= 0 AND \"DraftGrade\" <= 100)");
                    table.CheckConstraint("ck_grade_entries_published", "\"PublishedGrade\" IS NULL OR (\"PublishedGrade\" >= 0 AND \"PublishedGrade\" <= 100)");
                    table.ForeignKey(
                        name: "FK_grade_entries_course_offerings_CourseOfferingId",
                        column: x => x.CourseOfferingId,
                        principalTable: "course_offerings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_grade_entries_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_grade_entries_users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_academic_records_CourseId",
                table: "academic_records",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_academic_records_StudentId",
                table: "academic_records",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_careers_Code",
                table: "careers",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_careers_Name",
                table: "careers",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_course_equivalences_pair_left_pair_right",
                table: "course_equivalences",
                columns: new[] { "pair_left", "pair_right" },
                unique: true,
                filter: "\"IsActive\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_course_equivalences_SourceCourseId_TargetCourseId_IsActive",
                table: "course_equivalences",
                columns: new[] { "SourceCourseId", "TargetCourseId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_course_equivalences_TargetCourseId",
                table: "course_equivalences",
                column: "TargetCourseId");

            migrationBuilder.CreateIndex(
                name: "IX_course_offerings_CareerId_Status",
                table: "course_offerings",
                columns: new[] { "CareerId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_course_offerings_CourseId",
                table: "course_offerings",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_course_offerings_CreatedByUserId",
                table: "course_offerings",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_course_offerings_OfferingCode",
                table: "course_offerings",
                column: "OfferingCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_course_offerings_ProfessorId",
                table: "course_offerings",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_course_offerings_Status",
                table: "course_offerings",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_courses_Code",
                table: "courses",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_curriculum_courses_CourseId",
                table: "curriculum_courses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_curriculum_courses_CurriculumVersionId",
                table: "curriculum_courses",
                column: "CurriculumVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_curriculum_versions_CareerId_IsActive",
                table: "curriculum_versions",
                columns: new[] { "CareerId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_curriculum_versions_CareerId_VersionCode",
                table: "curriculum_versions",
                columns: new[] { "CareerId", "VersionCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_directors_DirectorCode",
                table: "directors",
                column: "DirectorCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_directors_UserId",
                table: "directors",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_enrollments_CourseOfferingId",
                table: "enrollments",
                column: "CourseOfferingId");

            migrationBuilder.CreateIndex(
                name: "IX_enrollments_StudentId",
                table: "enrollments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_enrollments_StudentId_CourseOfferingId",
                table: "enrollments",
                columns: new[] { "StudentId", "CourseOfferingId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_grade_entries_CourseOfferingId",
                table: "grade_entries",
                column: "CourseOfferingId");

            migrationBuilder.CreateIndex(
                name: "IX_grade_entries_CourseOfferingId_StudentId",
                table: "grade_entries",
                columns: new[] { "CourseOfferingId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_grade_entries_StudentId",
                table: "grade_entries",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_grade_entries_UpdatedByUserId",
                table: "grade_entries",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_professors_ProfessorCode",
                table: "professors",
                column: "ProfessorCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_professors_UserId",
                table: "professors",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_TokenHash",
                table: "refresh_tokens",
                column: "TokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_UserId",
                table: "refresh_tokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_report_requests_RequestedAt",
                table: "report_requests",
                column: "RequestedAt");

            migrationBuilder.CreateIndex(
                name: "IX_report_requests_StudentId",
                table: "report_requests",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_roles_Code",
                table: "roles",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_student_curriculum_assignments_CurriculumVersionId",
                table: "student_curriculum_assignments",
                column: "CurriculumVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_student_curriculum_assignments_StudentId",
                table: "student_curriculum_assignments",
                column: "StudentId",
                unique: true,
                filter: "\"IsActive\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_student_curriculum_assignments_StudentId_IsActive",
                table: "student_curriculum_assignments",
                columns: new[] { "StudentId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_students_CareerId",
                table: "students",
                column: "CareerId");

            migrationBuilder.CreateIndex(
                name: "IX_students_StudentCode",
                table: "students",
                column: "StudentCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_students_UserId",
                table: "students",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_teacher_availability_snapshots_ProfessorId",
                table: "teacher_availability_snapshots",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_RoleId",
                table: "user_roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "academic_records");

            migrationBuilder.DropTable(
                name: "course_equivalences");

            migrationBuilder.DropTable(
                name: "curriculum_courses");

            migrationBuilder.DropTable(
                name: "directors");

            migrationBuilder.DropTable(
                name: "enrollments");

            migrationBuilder.DropTable(
                name: "grade_entries");

            migrationBuilder.DropTable(
                name: "refresh_tokens");

            migrationBuilder.DropTable(
                name: "report_requests");

            migrationBuilder.DropTable(
                name: "student_curriculum_assignments");

            migrationBuilder.DropTable(
                name: "teacher_availability_snapshots");

            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropTable(
                name: "course_offerings");

            migrationBuilder.DropTable(
                name: "curriculum_versions");

            migrationBuilder.DropTable(
                name: "students");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "courses");

            migrationBuilder.DropTable(
                name: "professors");

            migrationBuilder.DropTable(
                name: "careers");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
