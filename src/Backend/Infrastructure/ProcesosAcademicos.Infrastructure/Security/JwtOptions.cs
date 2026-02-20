namespace ProcesosAcademicos.Infrastructure.Security;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "ProcesosAcademicos";

    public string Audience { get; set; } = "ProcesosAcademicos.Web";

    public string SigningKey { get; set; } = "CHANGE_ME_AT_RUNTIME_WITH_USER_SECRETS";

    public int AccessTokenMinutes { get; set; } = 30;
}
