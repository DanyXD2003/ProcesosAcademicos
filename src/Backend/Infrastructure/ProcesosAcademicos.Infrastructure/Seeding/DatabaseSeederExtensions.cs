using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ProcesosAcademicos.Infrastructure.Persistence;

namespace ProcesosAcademicos.Infrastructure.Seeding;

public static class DatabaseSeederExtensions
{
    public static async Task InitializeDatabaseAsync(this IServiceProvider serviceProvider, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseInitializer");
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();

        await dbContext.Database.MigrateAsync(cancellationToken);
        await seeder.SeedAsync(cancellationToken);

        logger.LogInformation("Database migration and seed completed successfully.");
    }
}
