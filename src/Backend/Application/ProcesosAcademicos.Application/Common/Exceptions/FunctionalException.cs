using System.Net;

namespace ProcesosAcademicos.Application.Common.Exceptions;

public class FunctionalException : Exception
{
    public FunctionalException(string code, string message, HttpStatusCode statusCode, object? details = null)
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
        Details = details;
    }

    public string Code { get; }

    public HttpStatusCode StatusCode { get; }

    public object? Details { get; }
}
