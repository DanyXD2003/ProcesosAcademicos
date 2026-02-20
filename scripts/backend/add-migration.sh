#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: $0 <YYYYMMDDHHmm_Feature_Change>"
  exit 1
fi

NAME="$1"

cd "$(dirname "$0")/../.."

ASPNETCORE_ENVIRONMENT=Development dotnet ef migrations add "$NAME" \
  --project src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure \
  --startup-project src/Backend/Api/ProcesosAcademicos.Api \
  --context ApplicationDbContext \
  --output-dir Persistence/Migrations
