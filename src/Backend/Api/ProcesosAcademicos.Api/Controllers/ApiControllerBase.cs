using System.Net;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Api.Models;
using ProcesosAcademicos.Application.Common.Abstractions;
using ProcesosAcademicos.Application.Common.Constants;
using ProcesosAcademicos.Application.Common.Exceptions;
using ProcesosAcademicos.Application.Common.Models;
using ProcesosAcademicos.Application.Common.Utilities;

namespace ProcesosAcademicos.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected ApiControllerBase(ICurrentUser currentUser)
    {
        CurrentUser = currentUser;
    }

    protected ICurrentUser CurrentUser { get; }

    protected Guid CurrentUserId
    {
        get
        {
            if (!CurrentUser.IsAuthenticated || CurrentUser.UserId == Guid.Empty)
            {
                throw new FunctionalException(
                    FunctionalErrorCodes.AuthInvalidToken,
                    "Token invalido.",
                    HttpStatusCode.Unauthorized);
            }

            return CurrentUser.UserId;
        }
    }

    protected void EnsureRoles(params string[] roleCodes)
    {
        if (!CurrentUser.IsAuthenticated)
        {
            throw new FunctionalException(
                FunctionalErrorCodes.AuthInvalidToken,
                "Token invalido.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.AuthInvalidToken));
        }

        if (!roleCodes.Contains(CurrentUser.RoleCode, StringComparer.OrdinalIgnoreCase))
        {
            throw new FunctionalException(
                FunctionalErrorCodes.ForbiddenRole,
                "Rol no autorizado para esta operacion.",
                FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ForbiddenRole));
        }
    }

    protected IActionResult OkEnvelope<T>(T data)
    {
        return Ok(ApiResponseFactory.Success(HttpContext, data));
    }

    protected IActionResult OkItems<T>(IReadOnlyCollection<T> items)
    {
        return Ok(ApiResponseFactory.Items(HttpContext, items));
    }

    protected IActionResult OkPaged<T>(PagedResult<T> paged)
    {
        return Ok(ApiResponseFactory.Paged(HttpContext, paged));
    }

    protected Guid ParseGuidOrValidation(string value, string fieldName)
    {
        if (Guid.TryParse(value, out var parsed))
        {
            return parsed;
        }

        throw new FunctionalException(
            FunctionalErrorCodes.ValidationFailed,
            $"El campo {fieldName} debe ser un GUID valido.",
            FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ValidationFailed),
            new Dictionary<string, string[]>
            {
                [fieldName] = new[] { "Debe ser GUID valido." }
            });
    }
}
