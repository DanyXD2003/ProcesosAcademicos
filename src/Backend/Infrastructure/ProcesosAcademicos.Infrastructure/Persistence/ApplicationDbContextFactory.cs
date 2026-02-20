using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace ProcesosAcademicos.Infrastructure.Persistence;

public sealed class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var basePath = Directory.GetCurrentDirectory();

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("Main")
            ?? Environment.GetEnvironmentVariable("ConnectionStrings__Main")
            ?? "Host=localhost;Port=5432;Database=procesos_academicos;Username=postgres;Password=postgres";

        connectionString = NormalizeConnectionString(connectionString);

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(connectionString, options => options.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));

        return new ApplicationDbContext(optionsBuilder.Options);
    }

    private static string NormalizeConnectionString(string value)
    {
        var trimmed = value.Trim();

        if ((trimmed.StartsWith('\'') && trimmed.EndsWith('\'')) ||
            (trimmed.StartsWith('"') && trimmed.EndsWith('"')))
        {
            trimmed = trimmed[1..^1].Trim();
        }

        if (!trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
            !trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            return trimmed;
        }

        if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        {
            return trimmed;
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
                var val = parts.Length > 1 ? Uri.UnescapeDataString(parts[1]) : string.Empty;
                return new KeyValuePair<string, string>(key, val);
            })
            .ToList();
    }
}
