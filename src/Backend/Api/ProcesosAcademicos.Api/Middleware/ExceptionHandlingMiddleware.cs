using System.Net;
using System.Text.Json;
using ProcesosAcademicos.Api.Models;
using ProcesosAcademicos.Application.Common.Exceptions;

namespace ProcesosAcademicos.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (FunctionalException ex)
        {
            context.Response.StatusCode = (int)ex.StatusCode;
            context.Response.ContentType = "application/json";

            var response = ApiResponseFactory.Error(context, ex.Code, ex.Message, ex.Details);
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected unhandled exception.");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var response = ApiResponseFactory.Error(context, "UNEXPECTED_ERROR", "Ocurrio un error inesperado.");
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
