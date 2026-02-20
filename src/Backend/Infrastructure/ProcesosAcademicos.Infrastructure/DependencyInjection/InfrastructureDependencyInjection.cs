using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Infrastructure.Persistence;
using ProcesosAcademicos.Infrastructure.Reports;
using ProcesosAcademicos.Infrastructure.Security;
using ProcesosAcademicos.Infrastructure.Seeding;
using ProcesosAcademicos.Infrastructure.Services;

namespace ProcesosAcademicos.Infrastructure.DependencyInjection;

public static class InfrastructureDependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = ResolveConnectionString(configuration);

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString, sql =>
            {
                sql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                sql.EnableRetryOnFailure();
            });
        });

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<ReportsOptions>(configuration.GetSection(ReportsOptions.SectionName));
        services.AddDataProtection();

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IClock, SystemClock>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IPasswordHasherService, PasswordHasherService>();
        services.AddScoped<DatabaseSeeder>();
        services.AddSingleton<ICourseCertificatePdfGenerator, CourseCertificatePdfGenerator>();
        services.AddSingleton<IReportDownloadTokenService, ReportDownloadTokenService>();
        services.AddSingleton<IReportStorageService, ReportFileStorageService>();
        services.AddHostedService<ReportStorageCleanupHostedService>();

        return services;
    }

    private static string ResolveConnectionString(IConfiguration configuration)
    {
        var rawConnectionString = configuration.GetConnectionString("Main");

        if (string.IsNullOrWhiteSpace(rawConnectionString))
        {
            throw new InvalidOperationException("ConnectionStrings:Main no esta configurada.");
        }

        var trimmed = rawConnectionString.Trim();
        if ((trimmed.StartsWith('\'') && trimmed.EndsWith('\'')) ||
            (trimmed.StartsWith('"') && trimmed.EndsWith('"')))
        {
            trimmed = trimmed[1..^1].Trim();
        }
        if (trimmed.Contains("SET_IN_USER_SECRETS_OR_ENV", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "ConnectionStrings:Main aun tiene placeholder. Configure un valor real en User Secrets o variables de entorno.");
        }

        return NormalizeConnectionString(trimmed);
    }

    private static string NormalizeConnectionString(string value)
    {
        if (value.StartsWith("Host=", StringComparison.OrdinalIgnoreCase))
        {
            return value;
        }

        if (!value.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
            !value.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            return value;
        }

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
        {
            throw new InvalidOperationException("ConnectionStrings:Main (URI) no tiene formato valido.");
        }

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Database = uri.AbsolutePath.Trim('/')
        };

        var userInfo = uri.UserInfo.Split(':', 2, StringSplitOptions.None);
        if (userInfo.Length > 0 && !string.IsNullOrWhiteSpace(userInfo[0]))
        {
            builder.Username = Uri.UnescapeDataString(userInfo[0]);
        }

        if (userInfo.Length > 1)
        {
            builder.Password = Uri.UnescapeDataString(userInfo[1]);
        }

        foreach (var pair in ParseQueryString(uri.Query))
        {
            if (pair.Key.Equals("sslmode", StringComparison.OrdinalIgnoreCase) &&
                Enum.TryParse<SslMode>(pair.Value, true, out var sslMode))
            {
                builder.SslMode = sslMode;
                continue;
            }

            if (pair.Key.Equals("channel_binding", StringComparison.OrdinalIgnoreCase) &&
                Enum.TryParse<ChannelBinding>(pair.Value, true, out var channelBinding))
            {
                builder.ChannelBinding = channelBinding;
                continue;
            }

        }

        if (string.IsNullOrWhiteSpace(builder.Database))
        {
            throw new InvalidOperationException("ConnectionStrings:Main (URI) debe incluir nombre de base de datos.");
        }

        return builder.ConnectionString;
    }

    private static IReadOnlyList<KeyValuePair<string, string>> ParseQueryString(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return [];
        }

        return query.TrimStart('?')
            .Split('&', StringSplitOptions.RemoveEmptyEntries)
            .Select(segment =>
            {
                var parts = segment.Split('=', 2, StringSplitOptions.None);
                var key = Uri.UnescapeDataString(parts[0]);
                var value = parts.Length > 1 ? Uri.UnescapeDataString(parts[1]) : string.Empty;
                return new KeyValuePair<string, string>(key, value);
            })
            .ToList();
    }
}
