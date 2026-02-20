using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Domain.Entities;
using ProcesosAcademicos.Domain.Enums;
using ProcesosAcademicos.Infrastructure.Persistence;

namespace ProcesosAcademicos.Infrastructure.Seeding;

public sealed class DatabaseSeeder
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPasswordHasherService _passwordHasher;
    private readonly IClock _clock;

    public DatabaseSeeder(ApplicationDbContext dbContext, IPasswordHasherService passwordHasher, IClock clock)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _clock = clock;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await SeedRolesAsync(cancellationToken);
        await SeedCatalogsAsync(cancellationToken);
        await SeedUsersAndProfilesAsync(cancellationToken);
        await SeedAcademicFlowAsync(cancellationToken);
    }

    private async Task SeedRolesAsync(CancellationToken cancellationToken)
    {
        if (!await _dbContext.Roles.AnyAsync(x => x.Id == 1 || x.Code == UserRoleCode.ESTUDIANTE, cancellationToken))
        {
            _dbContext.Roles.Add(new Role { Id = 1, Code = UserRoleCode.ESTUDIANTE });
        }

        if (!await _dbContext.Roles.AnyAsync(x => x.Id == 2 || x.Code == UserRoleCode.PROFESOR, cancellationToken))
        {
            _dbContext.Roles.Add(new Role { Id = 2, Code = UserRoleCode.PROFESOR });
        }

        if (!await _dbContext.Roles.AnyAsync(x => x.Id == 3 || x.Code == UserRoleCode.DIRECTOR, cancellationToken))
        {
            _dbContext.Roles.Add(new Role { Id = 3, Code = UserRoleCode.DIRECTOR });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedCatalogsAsync(CancellationToken cancellationToken)
    {
        if (!await _dbContext.Careers.AnyAsync(x => x.Id == SeedIds.CareerSis || x.Code == "INGSIS", cancellationToken))
        {
            _dbContext.Careers.Add(new Career
            {
                Id = SeedIds.CareerSis,
                Code = "INGSIS",
                Name = "Ingenieria de Sistemas",
                IsActive = true
            });
        }

        if (!await _dbContext.Careers.AnyAsync(x => x.Id == SeedIds.CareerDer || x.Code == "DER", cancellationToken))
        {
            _dbContext.Careers.Add(new Career
            {
                Id = SeedIds.CareerDer,
                Code = "DER",
                Name = "Derecho",
                IsActive = true
            });
        }

        if (!await _dbContext.Courses.AnyAsync(x => x.Id == SeedIds.CourseProg || x.Code == "PROG-101", cancellationToken))
        {
            _dbContext.Courses.Add(new Course
            {
                Id = SeedIds.CourseProg,
                Code = "PROG-101",
                Name = "Logica de Programacion",
                Department = "Ingenieria",
                Credits = 3
            });
        }

        if (!await _dbContext.Courses.AnyAsync(x => x.Id == SeedIds.CourseBd || x.Code == "BD-201", cancellationToken))
        {
            _dbContext.Courses.Add(new Course
            {
                Id = SeedIds.CourseBd,
                Code = "BD-201",
                Name = "Bases de Datos",
                Department = "Ingenieria",
                Credits = 3
            });
        }

        if (!await _dbContext.Courses.AnyAsync(x => x.Id == SeedIds.CourseSof || x.Code == "SOF-310", cancellationToken))
        {
            _dbContext.Courses.Add(new Course
            {
                Id = SeedIds.CourseSof,
                Code = "SOF-310",
                Name = "Arquitectura de Software",
                Department = "Ingenieria",
                Credits = 4
            });
        }

        if (!await _dbContext.Courses.AnyAsync(x => x.Id == SeedIds.CourseDer || x.Code == "DER-101", cancellationToken))
        {
            _dbContext.Courses.Add(new Course
            {
                Id = SeedIds.CourseDer,
                Code = "DER-101",
                Name = "Introduccion al Derecho",
                Department = "Sociales",
                Credits = 3
            });
        }

        if (!await _dbContext.CurriculumVersions.AnyAsync(
                x => x.Id == SeedIds.CurriculumSis2025 || (x.CareerId == SeedIds.CareerSis && x.VersionCode == "INGSIS-2025"),
                cancellationToken))
        {
            var version = new CurriculumVersion
            {
                Id = SeedIds.CurriculumSis2025,
                CareerId = SeedIds.CareerSis,
                VersionCode = "INGSIS-2025",
                DisplayName = "Pensum Ingenieria 2025",
                EffectiveFrom = new DateOnly(2025, 1, 1),
                IsActive = true,
                CreatedAt = _clock.UtcNow
            };

            _dbContext.CurriculumVersions.Add(version);
        }

        if (!await _dbContext.CurriculumCourses.AnyAsync(
                x => x.CurriculumVersionId == SeedIds.CurriculumSis2025 && x.CourseId == SeedIds.CourseProg,
                cancellationToken))
        {
            _dbContext.CurriculumCourses.Add(new CurriculumCourse
            {
                CurriculumVersionId = SeedIds.CurriculumSis2025,
                CourseId = SeedIds.CourseProg,
                TermNumber = 1,
                IsMandatory = true
            });
        }

        if (!await _dbContext.CurriculumCourses.AnyAsync(
                x => x.CurriculumVersionId == SeedIds.CurriculumSis2025 && x.CourseId == SeedIds.CourseBd,
                cancellationToken))
        {
            _dbContext.CurriculumCourses.Add(new CurriculumCourse
            {
                CurriculumVersionId = SeedIds.CurriculumSis2025,
                CourseId = SeedIds.CourseBd,
                TermNumber = 2,
                IsMandatory = true
            });
        }

        if (!await _dbContext.CurriculumCourses.AnyAsync(
                x => x.CurriculumVersionId == SeedIds.CurriculumSis2025 && x.CourseId == SeedIds.CourseSof,
                cancellationToken))
        {
            _dbContext.CurriculumCourses.Add(new CurriculumCourse
            {
                CurriculumVersionId = SeedIds.CurriculumSis2025,
                CourseId = SeedIds.CourseSof,
                TermNumber = 4,
                IsMandatory = true
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedUsersAndProfilesAsync(CancellationToken cancellationToken)
    {
        if (!await _dbContext.Users.AnyAsync(x => x.Id == SeedIds.UserStudent || x.Email == "estudiante.demo@procesos.local", cancellationToken))
        {
            _dbContext.Users.Add(new User
            {
                Id = SeedIds.UserStudent,
                Email = "estudiante.demo@procesos.local",
                PasswordHash = _passwordHasher.HashPassword("Demo123!"),
                IsActive = true,
                CreatedAt = _clock.UtcNow
            });
        }

        if (!await _dbContext.Users.AnyAsync(x => x.Id == SeedIds.UserStudentClosure || x.Email == "estudiante.cierre@procesos.local", cancellationToken))
        {
            _dbContext.Users.Add(new User
            {
                Id = SeedIds.UserStudentClosure,
                Email = "estudiante.cierre@procesos.local",
                PasswordHash = _passwordHasher.HashPassword("Demo123!"),
                IsActive = true,
                CreatedAt = _clock.UtcNow
            });
        }

        if (!await _dbContext.Users.AnyAsync(x => x.Id == SeedIds.UserProfessor || x.Email == "profesor.demo@procesos.local", cancellationToken))
        {
            _dbContext.Users.Add(new User
            {
                Id = SeedIds.UserProfessor,
                Email = "profesor.demo@procesos.local",
                PasswordHash = _passwordHasher.HashPassword("Demo123!"),
                IsActive = true,
                CreatedAt = _clock.UtcNow
            });
        }

        if (!await _dbContext.Users.AnyAsync(x => x.Id == SeedIds.UserDirector || x.Email == "director.demo@procesos.local", cancellationToken))
        {
            _dbContext.Users.Add(new User
            {
                Id = SeedIds.UserDirector,
                Email = "director.demo@procesos.local",
                PasswordHash = _passwordHasher.HashPassword("Demo123!"),
                IsActive = true,
                CreatedAt = _clock.UtcNow
            });
        }

        if (!await _dbContext.UserRoles.AnyAsync(x => x.UserId == SeedIds.UserStudent && x.RoleId == 1, cancellationToken))
        {
            _dbContext.UserRoles.Add(new UserRole { UserId = SeedIds.UserStudent, RoleId = 1 });
        }

        if (!await _dbContext.UserRoles.AnyAsync(x => x.UserId == SeedIds.UserStudentClosure && x.RoleId == 1, cancellationToken))
        {
            _dbContext.UserRoles.Add(new UserRole { UserId = SeedIds.UserStudentClosure, RoleId = 1 });
        }

        if (!await _dbContext.UserRoles.AnyAsync(x => x.UserId == SeedIds.UserProfessor && x.RoleId == 2, cancellationToken))
        {
            _dbContext.UserRoles.Add(new UserRole { UserId = SeedIds.UserProfessor, RoleId = 2 });
        }

        if (!await _dbContext.UserRoles.AnyAsync(x => x.UserId == SeedIds.UserDirector && x.RoleId == 3, cancellationToken))
        {
            _dbContext.UserRoles.Add(new UserRole { UserId = SeedIds.UserDirector, RoleId = 3 });
        }

        if (!await _dbContext.Students.AnyAsync(x => x.Id == SeedIds.StudentProfile || x.StudentCode == "20230104", cancellationToken))
        {
            _dbContext.Students.Add(new StudentProfile
            {
                Id = SeedIds.StudentProfile,
                UserId = SeedIds.UserStudent,
                StudentCode = "20230104",
                CareerId = SeedIds.CareerSis,
                FullName = "Juan Sebastian Perez",
                Faculty = "Facultad de Ingenieria",
                Semester = 6,
                Email = "juan.perez@eduportal.edu",
                Phone = "+57 315 000 1234"
            });
        }

        if (!await _dbContext.Students.AnyAsync(x => x.Id == SeedIds.StudentProfileClosure || x.StudentCode == "20230105", cancellationToken))
        {
            _dbContext.Students.Add(new StudentProfile
            {
                Id = SeedIds.StudentProfileClosure,
                UserId = SeedIds.UserStudentClosure,
                StudentCode = "20230105",
                CareerId = SeedIds.CareerSis,
                FullName = "Maria Fernanda Soto",
                Faculty = "Facultad de Ingenieria",
                Semester = 10,
                Email = "maria.soto@eduportal.edu",
                Phone = "+57 315 000 5678"
            });
        }

        if (!await _dbContext.Professors.AnyAsync(x => x.Id == SeedIds.ProfessorProfile || x.ProfessorCode == "PR-040", cancellationToken))
        {
            _dbContext.Professors.Add(new ProfessorProfile
            {
                Id = SeedIds.ProfessorProfile,
                UserId = SeedIds.UserProfessor,
                ProfessorCode = "PR-040",
                FullName = "Prof. Alejandro R.",
                Department = "Ingenieria",
                Speciality = "Arquitectura de Software"
            });
        }

        if (!await _dbContext.Directors.AnyAsync(x => x.Id == SeedIds.DirectorProfile || x.DirectorCode == "DIR-001", cancellationToken))
        {
            _dbContext.Directors.Add(new DirectorProfile
            {
                Id = SeedIds.DirectorProfile,
                UserId = SeedIds.UserDirector,
                DirectorCode = "DIR-001",
                FullName = "Dr. Alberto Ruiz",
                Campus = "Principal"
            });
        }

        if (!await _dbContext.StudentCurriculumAssignments.AnyAsync(
                x => x.Id == SeedIds.StudentCurriculumAssignment ||
                     (x.StudentId == SeedIds.StudentProfile && x.CurriculumVersionId == SeedIds.CurriculumSis2025 && x.IsActive),
                cancellationToken))
        {
            _dbContext.StudentCurriculumAssignments.Add(new StudentCurriculumAssignment
            {
                Id = SeedIds.StudentCurriculumAssignment,
                StudentId = SeedIds.StudentProfile,
                CurriculumVersionId = SeedIds.CurriculumSis2025,
                AssignedAt = _clock.UtcNow.AddMonths(-8),
                IsActive = true
            });
        }

        if (!await _dbContext.StudentCurriculumAssignments.AnyAsync(
                x => x.Id == SeedIds.StudentCurriculumAssignmentClosure ||
                     (x.StudentId == SeedIds.StudentProfileClosure && x.CurriculumVersionId == SeedIds.CurriculumSis2025 && x.IsActive),
                cancellationToken))
        {
            _dbContext.StudentCurriculumAssignments.Add(new StudentCurriculumAssignment
            {
                Id = SeedIds.StudentCurriculumAssignmentClosure,
                StudentId = SeedIds.StudentProfileClosure,
                CurriculumVersionId = SeedIds.CurriculumSis2025,
                AssignedAt = _clock.UtcNow.AddMonths(-12),
                IsActive = true
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedAcademicFlowAsync(CancellationToken cancellationToken)
    {
        if (!await _dbContext.CourseOfferings.AnyAsync(x => x.Id == SeedIds.OfferingActive || x.OfferingCode == "CL-2026-001", cancellationToken))
        {
            _dbContext.CourseOfferings.Add(new CourseOffering
            {
                Id = SeedIds.OfferingActive,
                OfferingCode = "CL-2026-001",
                CourseId = SeedIds.CourseSof,
                CareerId = SeedIds.CareerSis,
                ProfessorId = SeedIds.ProfessorProfile,
                Section = "A",
                Term = "2026-1",
                Status = CourseOfferingStatus.Activo,
                SeatsTotal = 30,
                SeatsTaken = 1,
                CreatedByUserId = SeedIds.UserDirector,
                CreatedAt = _clock.UtcNow.AddMonths(-1)
            });
        }

        if (!await _dbContext.CourseOfferings.AnyAsync(x => x.Id == SeedIds.OfferingPublished || x.OfferingCode == "CL-2026-002", cancellationToken))
        {
            _dbContext.CourseOfferings.Add(new CourseOffering
            {
                Id = SeedIds.OfferingPublished,
                OfferingCode = "CL-2026-002",
                CourseId = SeedIds.CourseBd,
                CareerId = SeedIds.CareerSis,
                ProfessorId = SeedIds.ProfessorProfile,
                Section = "B",
                Term = "2026-1",
                Status = CourseOfferingStatus.Publicado,
                SeatsTotal = 30,
                SeatsTaken = 0,
                CreatedByUserId = SeedIds.UserDirector,
                CreatedAt = _clock.UtcNow.AddMonths(-1)
            });
        }

        if (!await _dbContext.CourseOfferings.AnyAsync(x => x.Id == SeedIds.OfferingDraft || x.OfferingCode == "CL-2026-003", cancellationToken))
        {
            _dbContext.CourseOfferings.Add(new CourseOffering
            {
                Id = SeedIds.OfferingDraft,
                OfferingCode = "CL-2026-003",
                CourseId = SeedIds.CourseProg,
                CareerId = SeedIds.CareerSis,
                ProfessorId = SeedIds.ProfessorProfile,
                Section = "C",
                Term = "2026-1",
                Status = CourseOfferingStatus.Borrador,
                SeatsTotal = 25,
                SeatsTaken = 0,
                CreatedByUserId = SeedIds.UserDirector,
                CreatedAt = _clock.UtcNow.AddMonths(-1)
            });
        }

        if (!await _dbContext.Enrollments.AnyAsync(
                x => x.Id == SeedIds.Enrollment ||
                     (x.StudentId == SeedIds.StudentProfile && x.CourseOfferingId == SeedIds.OfferingActive),
                cancellationToken))
        {
            _dbContext.Enrollments.Add(new Enrollment
            {
                Id = SeedIds.Enrollment,
                StudentId = SeedIds.StudentProfile,
                CourseOfferingId = SeedIds.OfferingActive,
                Status = EnrollmentStatus.Activa,
                EnrolledAt = _clock.UtcNow.AddDays(-20)
            });
        }

        if (!await _dbContext.GradeEntries.AnyAsync(
                x => x.Id == SeedIds.GradeEntry ||
                     (x.StudentId == SeedIds.StudentProfile && x.CourseOfferingId == SeedIds.OfferingActive),
                cancellationToken))
        {
            _dbContext.GradeEntries.Add(new GradeEntry
            {
                Id = SeedIds.GradeEntry,
                CourseOfferingId = SeedIds.OfferingActive,
                StudentId = SeedIds.StudentProfile,
                DraftGrade = 88,
                PublishedGrade = 88,
                IsPublished = true,
                UpdatedByUserId = SeedIds.UserProfessor,
                UpdatedAt = _clock.UtcNow.AddDays(-10)
            });
        }

        if (!await _dbContext.AcademicRecords.AnyAsync(
                x => x.Id == SeedIds.AcademicRecord ||
                     (x.StudentId == SeedIds.StudentProfile && x.CourseId == SeedIds.CourseProg && x.Period == "2025-2"),
                cancellationToken))
        {
            _dbContext.AcademicRecords.Add(new AcademicRecord
            {
                Id = SeedIds.AcademicRecord,
                StudentId = SeedIds.StudentProfile,
                CourseId = SeedIds.CourseProg,
                Period = "2025-2",
                Credits = 3,
                Grade = 91,
                ResultStatus = ResultStatus.Aprobado,
                ProfessorNameSnapshot = "Prof. Alejandro R.",
                CreatedAt = _clock.UtcNow.AddMonths(-3)
            });
        }

        if (!await _dbContext.ReportRequests.AnyAsync(
                x => x.Id == SeedIds.ReportRequest ||
                     (x.StudentId == SeedIds.StudentProfile && x.RequestType == ReportRequestType.CertificacionDeCursos),
                cancellationToken))
        {
            _dbContext.ReportRequests.Add(new ReportRequest
            {
                Id = SeedIds.ReportRequest,
                StudentId = SeedIds.StudentProfile,
                RequestType = ReportRequestType.CertificacionDeCursos,
                RequestedAt = _clock.UtcNow.AddDays(-5),
                IssuedAt = _clock.UtcNow.AddDays(-5),
                LegacyImported = false,
                DownloadUrl = "https://temporary.example/reports/demo"
            });
        }

        if (!await _dbContext.TeacherAvailabilitySnapshots.AnyAsync(
                x => x.Id == SeedIds.TeacherSnapshot ||
                     (x.ProfessorId == SeedIds.ProfessorProfile && x.Status == TeacherAvailabilityStatus.Libre),
                cancellationToken))
        {
            _dbContext.TeacherAvailabilitySnapshots.Add(new TeacherAvailabilitySnapshot
            {
                Id = SeedIds.TeacherSnapshot,
                ProfessorId = SeedIds.ProfessorProfile,
                Status = TeacherAvailabilityStatus.Libre,
                Speciality = "Arquitectura de Software",
                CapturedAt = _clock.UtcNow
            });
        }

        if (!await _dbContext.AcademicRecords.AnyAsync(
                x => x.Id == SeedIds.ClosureAcademicRecordProg ||
                     (x.StudentId == SeedIds.StudentProfileClosure && x.CourseId == SeedIds.CourseProg && x.Period == "2024-2"),
                cancellationToken))
        {
            _dbContext.AcademicRecords.Add(new AcademicRecord
            {
                Id = SeedIds.ClosureAcademicRecordProg,
                StudentId = SeedIds.StudentProfileClosure,
                CourseId = SeedIds.CourseProg,
                Period = "2024-2",
                Credits = 3,
                Grade = 89,
                ResultStatus = ResultStatus.Aprobado,
                ProfessorNameSnapshot = "Prof. Alejandro R.",
                CreatedAt = _clock.UtcNow.AddMonths(-16)
            });
        }

        if (!await _dbContext.AcademicRecords.AnyAsync(
                x => x.Id == SeedIds.ClosureAcademicRecordBdFailed ||
                     (x.StudentId == SeedIds.StudentProfileClosure && x.CourseId == SeedIds.CourseBd && x.Period == "2025-1"),
                cancellationToken))
        {
            _dbContext.AcademicRecords.Add(new AcademicRecord
            {
                Id = SeedIds.ClosureAcademicRecordBdFailed,
                StudentId = SeedIds.StudentProfileClosure,
                CourseId = SeedIds.CourseBd,
                Period = "2025-1",
                Credits = 3,
                Grade = 49,
                ResultStatus = ResultStatus.Reprobado,
                ProfessorNameSnapshot = "Prof. Alejandro R.",
                CreatedAt = _clock.UtcNow.AddMonths(-12)
            });
        }

        if (!await _dbContext.AcademicRecords.AnyAsync(
                x => x.Id == SeedIds.ClosureAcademicRecordBdPassed ||
                     (x.StudentId == SeedIds.StudentProfileClosure && x.CourseId == SeedIds.CourseBd && x.Period == "2025-2"),
                cancellationToken))
        {
            _dbContext.AcademicRecords.Add(new AcademicRecord
            {
                Id = SeedIds.ClosureAcademicRecordBdPassed,
                StudentId = SeedIds.StudentProfileClosure,
                CourseId = SeedIds.CourseBd,
                Period = "2025-2",
                Credits = 3,
                Grade = 85,
                ResultStatus = ResultStatus.Aprobado,
                ProfessorNameSnapshot = "Prof. Alejandro R.",
                CreatedAt = _clock.UtcNow.AddMonths(-10)
            });
        }

        if (!await _dbContext.AcademicRecords.AnyAsync(
                x => x.Id == SeedIds.ClosureAcademicRecordSof ||
                     (x.StudentId == SeedIds.StudentProfileClosure && x.CourseId == SeedIds.CourseSof && x.Period == "2025-2"),
                cancellationToken))
        {
            _dbContext.AcademicRecords.Add(new AcademicRecord
            {
                Id = SeedIds.ClosureAcademicRecordSof,
                StudentId = SeedIds.StudentProfileClosure,
                CourseId = SeedIds.CourseSof,
                Period = "2025-2",
                Credits = 4,
                Grade = 92,
                ResultStatus = ResultStatus.Aprobado,
                ProfessorNameSnapshot = "Prof. Alejandro R.",
                CreatedAt = _clock.UtcNow.AddMonths(-8)
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static class SeedIds
    {
        public static readonly Guid UserStudent = Guid.Parse("11111111-1111-1111-1111-111111111111");
        public static readonly Guid UserStudentClosure = Guid.Parse("44444444-4444-4444-4444-444444444444");
        public static readonly Guid UserProfessor = Guid.Parse("22222222-2222-2222-2222-222222222222");
        public static readonly Guid UserDirector = Guid.Parse("33333333-3333-3333-3333-333333333333");

        public static readonly Guid StudentProfile = Guid.Parse("aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa");
        public static readonly Guid StudentProfileClosure = Guid.Parse("aaaaaaaa-2222-2222-2222-aaaaaaaaaaaa");
        public static readonly Guid ProfessorProfile = Guid.Parse("bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb");
        public static readonly Guid DirectorProfile = Guid.Parse("cccccccc-3333-3333-3333-cccccccccccc");

        public static readonly Guid CareerSis = Guid.Parse("dddddddd-4444-4444-4444-dddddddddddd");
        public static readonly Guid CareerDer = Guid.Parse("eeeeeeee-5555-5555-5555-eeeeeeeeeeee");

        public static readonly Guid CourseProg = Guid.Parse("10101010-0000-0000-0000-101010101010");
        public static readonly Guid CourseBd = Guid.Parse("20202020-0000-0000-0000-202020202020");
        public static readonly Guid CourseSof = Guid.Parse("30303030-0000-0000-0000-303030303030");
        public static readonly Guid CourseDer = Guid.Parse("40404040-0000-0000-0000-404040404040");

        public static readonly Guid CurriculumSis2025 = Guid.Parse("abababab-aaaa-aaaa-aaaa-abababababab");
        public static readonly Guid StudentCurriculumAssignment = Guid.Parse("bcbcbcbc-bbbb-bbbb-bbbb-bcbcbcbcbcbc");
        public static readonly Guid StudentCurriculumAssignmentClosure = Guid.Parse("bcbcbcbc-cccc-cccc-cccc-bcbcbcbcbcbc");

        public static readonly Guid OfferingActive = Guid.Parse("f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1");
        public static readonly Guid OfferingPublished = Guid.Parse("f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2");
        public static readonly Guid OfferingDraft = Guid.Parse("f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3");

        public static readonly Guid Enrollment = Guid.Parse("90909090-9090-9090-9090-909090909090");
        public static readonly Guid GradeEntry = Guid.Parse("80808080-8080-8080-8080-808080808080");
        public static readonly Guid AcademicRecord = Guid.Parse("70707070-7070-7070-7070-707070707070");
        public static readonly Guid ClosureAcademicRecordProg = Guid.Parse("71717171-7171-7171-7171-717171717171");
        public static readonly Guid ClosureAcademicRecordBdFailed = Guid.Parse("72727272-7272-7272-7272-727272727272");
        public static readonly Guid ClosureAcademicRecordBdPassed = Guid.Parse("73737373-7373-7373-7373-737373737373");
        public static readonly Guid ClosureAcademicRecordSof = Guid.Parse("74747474-7474-7474-7474-747474747474");
        public static readonly Guid ReportRequest = Guid.Parse("60606060-6060-6060-6060-606060606060");
        public static readonly Guid TeacherSnapshot = Guid.Parse("50505050-5050-5050-5050-505050505050");
    }
}
