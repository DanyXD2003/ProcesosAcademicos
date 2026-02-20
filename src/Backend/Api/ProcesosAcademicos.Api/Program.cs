using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Api.Extensions;
using ProcesosAcademicos.Api.Middleware;
using ProcesosAcademicos.Application.DependencyInjection;
using ProcesosAcademicos.Infrastructure.DependencyInjection;
using ProcesosAcademicos.Infrastructure.Seeding;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddApiDocs();
builder.Services.AddApiAuth(builder.Configuration);
builder.Services.AddApiCors(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (builder.Configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup"))
{
    await app.Services.InitializeDatabaseAsync();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(ApiCorsPolicy.FrontendPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    timestamp = DateTimeOffset.UtcNow
}));

app.MapControllers();

app.Run();
