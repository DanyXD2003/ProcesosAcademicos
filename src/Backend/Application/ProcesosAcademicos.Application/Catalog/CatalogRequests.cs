using MediatR;
using Microsoft.EntityFrameworkCore;
using ProcesosAcademicos.Application.Common.Abstractions;

namespace ProcesosAcademicos.Application.Catalog;

public sealed record GetCareerOptionsQuery : IRequest<CareerOptionsListDto>;

public sealed class GetCareerOptionsQueryHandler : IRequestHandler<GetCareerOptionsQuery, CareerOptionsListDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCareerOptionsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CareerOptionsListDto> Handle(GetCareerOptionsQuery request, CancellationToken cancellationToken)
    {
        var items = await _dbContext.Careers
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new CareerOptionDto(x.Id.ToString(), x.Code, x.Name, x.IsActive))
            .ToListAsync(cancellationToken);

        return new CareerOptionsListDto(items);
    }
}

public sealed record GetBaseCourseOptionsQuery(Guid? CareerId) : IRequest<BaseCourseOptionsListDto>;

public sealed class GetBaseCourseOptionsQueryHandler : IRequestHandler<GetBaseCourseOptionsQuery, BaseCourseOptionsListDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetBaseCourseOptionsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BaseCourseOptionsListDto> Handle(GetBaseCourseOptionsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Courses.AsNoTracking().AsQueryable();

        if (request.CareerId.HasValue)
        {
            query = query.Where(course => _dbContext.CurriculumCourses
                .Any(cc => cc.CourseId == course.Id && cc.CurriculumVersion.CareerId == request.CareerId.Value));
        }

        var items = await query
            .OrderBy(x => x.Code)
            .Select(x => new BaseCourseOptionDto(x.Id.ToString(), x.Code, x.Name, x.Department))
            .ToListAsync(cancellationToken);

        return new BaseCourseOptionsListDto(items);
    }
}
