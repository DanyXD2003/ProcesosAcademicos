#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

if [ -n "${CONNECTION_STRING_MAIN:-}" ]; then
  ConnectionStrings__Main="$CONNECTION_STRING_MAIN" ASPNETCORE_ENVIRONMENT=Development dotnet ef database update \
    --project src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure \
    --startup-project src/Backend/Api/ProcesosAcademicos.Api \
    --context ApplicationDbContext
else
  ASPNETCORE_ENVIRONMENT=Development dotnet ef database update \
    --project src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure \
    --startup-project src/Backend/Api/ProcesosAcademicos.Api \
    --context ApplicationDbContext
fi
