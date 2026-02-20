using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcesosAcademicos.Application.Auth;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Api.Controllers;

[Route("api/v1/auth")]
public sealed class AuthController : ApiControllerBase
{
    private readonly ISender _sender;

    public AuthController(ISender sender, ICurrentUser currentUser)
        : base(currentUser)
    {
        _sender = sender;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new LoginCommand(request), cancellationToken);
        return OkEnvelope(result);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new RefreshTokenCommand(request), cancellationToken);
        return OkEnvelope(result);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new LogoutCommand(CurrentUserId, request), cancellationToken);
        return OkEnvelope(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCurrentUserQuery(CurrentUserId), cancellationToken);
        return OkEnvelope(result);
    }
}
