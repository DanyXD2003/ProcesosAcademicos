# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ProcesosAcademicos.sln ./
COPY src/Backend/Core/ProcesosAcademicos.Domain/ProcesosAcademicos.Domain.csproj src/Backend/Core/ProcesosAcademicos.Domain/
COPY src/Backend/Application/ProcesosAcademicos.Application/ProcesosAcademicos.Application.csproj src/Backend/Application/ProcesosAcademicos.Application/
COPY src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/ProcesosAcademicos.Infrastructure.csproj src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/
COPY src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj src/Backend/Api/ProcesosAcademicos.Api/

RUN dotnet restore src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj

COPY src ./src

RUN dotnet publish src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    DOTNET_RUNNING_IN_CONTAINER=true

COPY --from=build /app/publish ./

# Default storage path for generated reports. You can override it
# with Reports__StorageRootPath in Render environment variables.
RUN mkdir -p /app/App_Data/reports

EXPOSE 10000

# Render provides PORT dynamically.
CMD ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet ProcesosAcademicos.Api.dll"]
