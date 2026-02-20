#!/usr/bin/env bash
set -euo pipefail

if [ -z "${CONNECTION_STRING_TEST:-}" ]; then
  echo "Define CONNECTION_STRING_TEST con la cadena de Neon test"
  exit 1
fi

cd "$(dirname "$0")/../.."

ConnectionStrings__Main="$CONNECTION_STRING_TEST" \
ASPNETCORE_ENVIRONMENT=Development \
  dotnet ef database update \
  --project src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure \
  --startup-project src/Backend/Api/ProcesosAcademicos.Api \
  --context ApplicationDbContext
