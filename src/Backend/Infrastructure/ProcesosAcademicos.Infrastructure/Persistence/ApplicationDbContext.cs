using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Domain.Entities;
using ProcesosAcademicos.Domain.Enums;

namespace ProcesosAcademicos.Infrastructure.Persistence;

public sealed class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Career> Careers => Set<Career>();
    public DbSet<StudentProfile> Students => Set<StudentProfile>();
    public DbSet<ProfessorProfile> Professors => Set<ProfessorProfile>();
    public DbSet<DirectorProfile> Directors => Set<DirectorProfile>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseOffering> CourseOfferings => Set<CourseOffering>();
    public DbSet<CurriculumVersion> CurriculumVersions => Set<CurriculumVersion>();
    public DbSet<CurriculumCourse> CurriculumCourses => Set<CurriculumCourse>();
    public DbSet<StudentCurriculumAssignment> StudentCurriculumAssignments => Set<StudentCurriculumAssignment>();
    public DbSet<CourseEquivalence> CourseEquivalences => Set<CourseEquivalence>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<GradeEntry> GradeEntries => Set<GradeEntry>();
    public DbSet<AcademicRecord> AcademicRecords => Set<AcademicRecord>();
    public DbSet<ReportRequest> ReportRequests => Set<ReportRequest>();
    public DbSet<ReportDownloadEvent> ReportDownloadEvents => Set<ReportDownloadEvent>();
    public DbSet<TeacherAvailabilitySnapshot> TeacherAvailabilitySnapshots => Set<TeacherAvailabilitySnapshot>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUsers(modelBuilder);
        ConfigureRoles(modelBuilder);
        ConfigureCareers(modelBuilder);
        ConfigureProfiles(modelBuilder);
        ConfigureCourses(modelBuilder);
        ConfigureCurriculum(modelBuilder);
        ConfigureEnrollments(modelBuilder);
        ConfigureGrades(modelBuilder);
        ConfigureAcademicRecords(modelBuilder);
        ConfigureReports(modelBuilder);
        ConfigureAvailability(modelBuilder);
        ConfigureRefreshTokens(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }

    private static void ConfigureUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Email).HasMaxLength(180).IsRequired();
            entity.Property(x => x.PasswordHash).HasMaxLength(256).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.IsActive).HasDefaultValue(true);
            entity.Property(x => x.CreatedAt).IsRequired();
        });
    }

    private static void ConfigureRoles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Code).HasConversion<string>().HasMaxLength(30).IsRequired();
            entity.HasIndex(x => x.Code).IsUnique();
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("user_roles");
            entity.HasKey(x => new { x.UserId, x.RoleId });

            entity.HasOne(x => x.User)
                .WithMany(x => x.UserRoles)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Role)
                .WithMany(x => x.UserRoles)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureCareers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Career>(entity =>
        {
            entity.ToTable("careers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Code).HasMaxLength(30).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.IsActive).HasDefaultValue(true);
            entity.HasIndex(x => x.Code).IsUnique();
            entity.HasIndex(x => x.Name).IsUnique();
        });
    }

    private static void ConfigureProfiles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StudentProfile>(entity =>
        {
            entity.ToTable("students");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.StudentCode).HasMaxLength(30).IsRequired();
            entity.Property(x => x.FullName).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Faculty).HasMaxLength(120);
            entity.Property(x => x.Email).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(40);
            entity.HasIndex(x => x.UserId).IsUnique();
            entity.HasIndex(x => x.StudentCode).IsUnique();

            entity.HasOne(x => x.User)
                .WithOne(x => x.StudentProfile)
                .HasForeignKey<StudentProfile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Career)
                .WithMany(x => x.Students)
                .HasForeignKey(x => x.CareerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(x => x.CareerId);
        });

        modelBuilder.Entity<ProfessorProfile>(entity =>
        {
            entity.ToTable("professors");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.ProfessorCode).HasMaxLength(30).IsRequired();
            entity.Property(x => x.FullName).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Department).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Speciality).HasMaxLength(120);
            entity.HasIndex(x => x.UserId).IsUnique();
            entity.HasIndex(x => x.ProfessorCode).IsUnique();

            entity.HasOne(x => x.User)
                .WithOne(x => x.ProfessorProfile)
                .HasForeignKey<ProfessorProfile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DirectorProfile>(entity =>
        {
            entity.ToTable("directors");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.DirectorCode).HasMaxLength(30).IsRequired();
            entity.Property(x => x.FullName).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Campus).HasMaxLength(120);
            entity.HasIndex(x => x.UserId).IsUnique();
            entity.HasIndex(x => x.DirectorCode).IsUnique();

            entity.HasOne(x => x.User)
                .WithOne(x => x.DirectorProfile)
                .HasForeignKey<DirectorProfile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureCourses(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.ToTable("courses");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Code).HasMaxLength(30).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Department).HasMaxLength(120).IsRequired();
            entity.HasIndex(x => x.Code).IsUnique();
        });

        modelBuilder.Entity<CourseOffering>(entity =>
        {
            entity.ToTable("course_offerings", tableBuilder =>
            {
                tableBuilder.HasCheckConstraint("ck_course_offerings_seats_total", "\"SeatsTotal\" > 0");
                tableBuilder.HasCheckConstraint("ck_course_offerings_seats_taken", "\"SeatsTaken\" >= 0 AND \"SeatsTaken\" <= \"SeatsTotal\"");
            });
            entity.HasKey(x => x.Id);
            entity.Property(x => x.OfferingCode).HasMaxLength(30).IsRequired();
            entity.Property(x => x.Section).HasMaxLength(10).IsRequired();
            entity.Property(x => x.Term).HasMaxLength(20).IsRequired();
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.HasIndex(x => x.OfferingCode).IsUnique();
            entity.HasIndex(x => x.Status);
            entity.HasIndex(x => new { x.CareerId, x.Status });

            entity.HasOne(x => x.Course)
                .WithMany(x => x.Offerings)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Career)
                .WithMany(x => x.CourseOfferings)
                .HasForeignKey(x => x.CareerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Professor)
                .WithMany(x => x.CourseOfferings)
                .HasForeignKey(x => x.ProfessorId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureCurriculum(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CurriculumVersion>(entity =>
        {
            entity.ToTable("curriculum_versions");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.VersionCode).HasMaxLength(30).IsRequired();
            entity.Property(x => x.DisplayName).HasMaxLength(120).IsRequired();
            entity.Property(x => x.IsActive).HasDefaultValue(true);
            entity.HasIndex(x => new { x.CareerId, x.VersionCode }).IsUnique();
            entity.HasIndex(x => new { x.CareerId, x.IsActive });

            entity.HasOne(x => x.Career)
                .WithMany(x => x.CurriculumVersions)
                .HasForeignKey(x => x.CareerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CurriculumCourse>(entity =>
        {
            entity.ToTable("curriculum_courses");
            entity.HasKey(x => new { x.CurriculumVersionId, x.CourseId });
            entity.Property(x => x.IsMandatory).HasDefaultValue(true);
            entity.HasIndex(x => x.CurriculumVersionId);

            entity.HasOne(x => x.CurriculumVersion)
                .WithMany(x => x.Courses)
                .HasForeignKey(x => x.CurriculumVersionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Course)
                .WithMany(x => x.CurriculumCourses)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentCurriculumAssignment>(entity =>
        {
            entity.ToTable("student_curriculum_assignments");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.IsActive).HasDefaultValue(true);
            entity.HasIndex(x => x.StudentId).HasFilter("\"IsActive\" = true").IsUnique();
            entity.HasIndex(x => new { x.StudentId, x.IsActive });

            entity.HasOne(x => x.Student)
                .WithMany(x => x.CurriculumAssignments)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.CurriculumVersion)
                .WithMany(x => x.StudentAssignments)
                .HasForeignKey(x => x.CurriculumVersionId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CourseEquivalence>(entity =>
        {
            entity.ToTable("course_equivalences", tableBuilder =>
            {
                tableBuilder.HasCheckConstraint("ck_course_equivalences_not_same", "\"SourceCourseId\" <> \"TargetCourseId\"");
            });
            entity.HasKey(x => x.Id);
            entity.Property(x => x.EquivalenceType).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.Property(x => x.Notes).HasMaxLength(255);
            entity.Property(x => x.IsActive).HasDefaultValue(true);

            entity.Property<Guid>("pair_left")
                .HasComputedColumnSql("LEAST(\"SourceCourseId\", \"TargetCourseId\")", true);
            entity.Property<Guid>("pair_right")
                .HasComputedColumnSql("GREATEST(\"SourceCourseId\", \"TargetCourseId\")", true);

            entity.HasIndex("pair_left", "pair_right")
                .HasFilter("\"IsActive\" = true")
                .IsUnique();

            entity.HasIndex(x => new { x.SourceCourseId, x.TargetCourseId, x.IsActive });

            entity.HasOne(x => x.SourceCourse)
                .WithMany(x => x.SourceEquivalences)
                .HasForeignKey(x => x.SourceCourseId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.TargetCourse)
                .WithMany(x => x.TargetEquivalences)
                .HasForeignKey(x => x.TargetCourseId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureEnrollments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.ToTable("enrollments");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.HasIndex(x => new { x.StudentId, x.CourseOfferingId }).IsUnique();
            entity.HasIndex(x => x.StudentId);
            entity.HasIndex(x => x.CourseOfferingId);

            entity.HasOne(x => x.Student)
                .WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.CourseOffering)
                .WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.CourseOfferingId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureGrades(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GradeEntry>(entity =>
        {
            entity.ToTable("grade_entries", tableBuilder =>
            {
                tableBuilder.HasCheckConstraint("ck_grade_entries_draft", "\"DraftGrade\" IS NULL OR (\"DraftGrade\" >= 0 AND \"DraftGrade\" <= 100)");
                tableBuilder.HasCheckConstraint("ck_grade_entries_published", "\"PublishedGrade\" IS NULL OR (\"PublishedGrade\" >= 0 AND \"PublishedGrade\" <= 100)");
            });
            entity.HasKey(x => x.Id);
            entity.Property(x => x.DraftGrade).HasPrecision(5, 2);
            entity.Property(x => x.PublishedGrade).HasPrecision(5, 2);
            entity.Property(x => x.IsPublished).HasDefaultValue(false);

            entity.HasIndex(x => new { x.CourseOfferingId, x.StudentId }).IsUnique();
            entity.HasIndex(x => x.CourseOfferingId);

            entity.HasOne(x => x.CourseOffering)
                .WithMany(x => x.GradeEntries)
                .HasForeignKey(x => x.CourseOfferingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Student)
                .WithMany()
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.UpdatedByUser)
                .WithMany()
                .HasForeignKey(x => x.UpdatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureAcademicRecords(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AcademicRecord>(entity =>
        {
            entity.ToTable("academic_records");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Period).HasMaxLength(20).IsRequired();
            entity.Property(x => x.Grade).HasPrecision(5, 2);
            entity.Property(x => x.ResultStatus).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.Property(x => x.ProfessorNameSnapshot).HasMaxLength(160);

            entity.HasOne(x => x.Student)
                .WithMany(x => x.AcademicRecords)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Course)
                .WithMany(x => x.AcademicRecords)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureReports(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ReportRequest>(entity =>
        {
            entity.ToTable("report_requests", tableBuilder =>
            {
                tableBuilder.HasCheckConstraint("ck_report_requests_issued", "\"LegacyImported\" = true OR \"IssuedAt\" IS NOT NULL");
            });
            entity.HasKey(x => x.Id);
            entity.Property(x => x.RequestType)
                .HasConversion(
                    value => value == ReportRequestType.CierreDePensum ? "Cierre de pensum" : "Certificacion de cursos",
                    value => value == "Cierre de pensum" ? ReportRequestType.CierreDePensum : ReportRequestType.CertificacionDeCursos)
                .HasMaxLength(40)
                .IsRequired();
            entity.Property(x => x.DownloadUrl).HasMaxLength(512);
            entity.Property(x => x.LegacyImported).HasDefaultValue(false);
            entity.HasIndex(x => x.RequestedAt);

            entity.HasOne(x => x.Student)
                .WithMany(x => x.ReportRequests)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ReportDownloadEvent>(entity =>
        {
            entity.ToTable("report_download_events");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.IpAddress).HasMaxLength(64);
            entity.Property(x => x.UserAgent).HasMaxLength(512);
            entity.HasIndex(x => x.ReportRequestId);
            entity.HasIndex(x => x.DownloadedAt);

            entity.HasOne(x => x.ReportRequest)
                .WithMany(x => x.DownloadEvents)
                .HasForeignKey(x => x.ReportRequestId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureAvailability(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TeacherAvailabilitySnapshot>(entity =>
        {
            entity.ToTable("teacher_availability_snapshots");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Status)
                .HasConversion(
                    value => value == TeacherAvailabilityStatus.EnClase
                        ? "En clase"
                        : value == TeacherAvailabilityStatus.Ocupado
                            ? "Ocupado"
                            : "Libre",
                    value => value == "En clase"
                        ? TeacherAvailabilityStatus.EnClase
                        : value == "Ocupado"
                            ? TeacherAvailabilityStatus.Ocupado
                            : TeacherAvailabilityStatus.Libre)
                .HasMaxLength(20)
                .IsRequired();
            entity.Property(x => x.Speciality).HasMaxLength(120);

            entity.HasOne(x => x.Professor)
                .WithMany(x => x.AvailabilitySnapshots)
                .HasForeignKey(x => x.ProfessorId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureRefreshTokens(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("refresh_tokens");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.TokenHash).HasMaxLength(256).IsRequired();
            entity.Property(x => x.ReplacedByTokenHash).HasMaxLength(256);
            entity.HasIndex(x => x.TokenHash).IsUnique();
            entity.HasIndex(x => x.UserId);

            entity.HasOne(x => x.User)
                .WithMany(x => x.RefreshTokens)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
