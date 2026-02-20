using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Domain.Entities;

namespace ProcesosAcademicos.Application.Common.Abstractions;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }

    DbSet<Role> Roles { get; }

    DbSet<UserRole> UserRoles { get; }

    DbSet<Career> Careers { get; }

    DbSet<StudentProfile> Students { get; }

    DbSet<ProfessorProfile> Professors { get; }

    DbSet<DirectorProfile> Directors { get; }

    DbSet<Course> Courses { get; }

    DbSet<CourseOffering> CourseOfferings { get; }

    DbSet<CurriculumVersion> CurriculumVersions { get; }

    DbSet<CurriculumCourse> CurriculumCourses { get; }

    DbSet<StudentCurriculumAssignment> StudentCurriculumAssignments { get; }

    DbSet<CourseEquivalence> CourseEquivalences { get; }

    DbSet<Enrollment> Enrollments { get; }

    DbSet<GradeEntry> GradeEntries { get; }

    DbSet<AcademicRecord> AcademicRecords { get; }

    DbSet<ReportRequest> ReportRequests { get; }
    DbSet<ReportDownloadEvent> ReportDownloadEvents { get; }

    DbSet<TeacherAvailabilitySnapshot> TeacherAvailabilitySnapshots { get; }

    DbSet<RefreshToken> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
