using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Infrastructure.Security;

namespace ProcesosAcademicos.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = GetAllowedOrigins(configuration);

        services.AddCors(options =>
        {
            options.AddPolicy(ApiCorsPolicy.FrontendPolicy, policy =>
            {
                if (allowedOrigins.Length == 0)
                {
                    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    return;
                }

                policy.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IServiceCollection AddApiAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtOptions = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidAudience = jwtOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
                NameClaimType = "sub"
            };
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("ESTUDIANTE", policy => policy.RequireClaim("roleCode", "ESTUDIANTE"));
            options.AddPolicy("PROFESOR", policy => policy.RequireClaim("roleCode", "PROFESOR"));
            options.AddPolicy("DIRECTOR", policy => policy.RequireClaim("roleCode", "DIRECTOR"));
        });

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentUserAccessor>();

        return services;
    }

    public static IServiceCollection AddApiDocs(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProcesosAcademicos API", Version = "v1" });
            var scheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Token JWT Bearer"
            };
            c.AddSecurityDefinition("Bearer", scheme);
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                [scheme] = Array.Empty<string>()
            });
        });

        return services;
    }

    private static string[] GetAllowedOrigins(IConfiguration configuration)
    {
        var sectionOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        var rawOrigins = configuration["Cors:AllowedOrigins"];

        var combinedOrigins = sectionOrigins.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(rawOrigins))
        {
            combinedOrigins = combinedOrigins.Concat(
                rawOrigins.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
        }

        return combinedOrigins
            .Select(origin => origin.Trim())
            .Where(origin => !string.IsNullOrWhiteSpace(origin))
            .Select(origin => origin.TrimEnd('/'))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }
}

public static class ApiCorsPolicy
{
    public const string FrontendPolicy = "FrontendOrigins";
}
