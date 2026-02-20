using FluentValidation;
using MediatR;
using ProcesosAcademicos.Application.Common.Constants;
using ProcesosAcademicos.Application.Common.Exceptions;
using ProcesosAcademicos.Application.Common.Utilities;

namespace ProcesosAcademicos.Application.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
        var errors = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .GroupBy(x => x.PropertyName)
            .ToDictionary(
                key => key.Key,
                value => value.Select(v => v.ErrorMessage).Distinct().ToArray());

        if (errors.Count == 0)
        {
            return await next();
        }

        throw new FunctionalException(
            FunctionalErrorCodes.ValidationFailed,
            "La solicitud no cumple validaciones de negocio.",
            FunctionalErrorHttpMapper.Resolve(FunctionalErrorCodes.ValidationFailed),
            errors);
    }
}
