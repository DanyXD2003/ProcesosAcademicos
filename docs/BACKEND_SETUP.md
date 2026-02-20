# Backend Setup (Neon + .NET 9)

## 1) Secretos y configuracion base

Desde `src/Backend/Api/ProcesosAcademicos.Api`:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Main" "Host=<neon-host>;Port=5432;Database=<db>;Username=<user>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true;Channel Binding=Require"
dotnet user-secrets set "Jwt:SigningKey" "<secret-min-32-chars>"
```

Notas:

- `appsettings.json` no debe tener credenciales reales.
- `appsettings.Development.example.json` es solo plantilla.
- `ConnectionStrings:Main` acepta ambos formatos: `Host=...;Port=...;...` y `postgresql://...`.
- Si defines `ConnectionStrings__Main` en variables de entorno, ese valor tiene prioridad sobre User Secrets.

## 2) Restore + build

```bash
dotnet restore ProcesosAcademicos.sln
```

Si `dotnet build` se bloquea en este entorno, usa el workaround por proyecto:

```bash
dotnet build src/Backend/Core/ProcesosAcademicos.Domain/ProcesosAcademicos.Domain.csproj --no-restore -m:1 /nr:false
dotnet build src/Backend/Application/ProcesosAcademicos.Application/ProcesosAcademicos.Application.csproj --no-restore -m:1 /nr:false
dotnet build src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/ProcesosAcademicos.Infrastructure.csproj --no-restore -m:1 /nr:false
dotnet build src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj --no-restore -m:1 /nr:false
```

## 3) Migraciones

Crear migracion:

```bash
scripts/backend/add-migration.sh 202602201500_Feature_Change
```

Aplicar migraciones en dev (usa User Secrets por defecto):

```bash
scripts/backend/update-dev.sh
```

Aplicar en test con cadena explicita:

```bash
CONNECTION_STRING_TEST="Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true;Channel Binding=Require" scripts/backend/update-test.sh
```

## 4) Seed minimo funcional

Al ejecutar API con:

- `Database__ApplyMigrationsOnStartup=true`

se aplican migraciones + seed si corresponde.

Credenciales seed:

- Estudiante: `20230104` o `estudiante.demo@procesos.local` / `Demo123!`
- Profesor: `PR-040` o `profesor.demo@procesos.local` / `Demo123!`
- Director: `DIR-001` o `director.demo@procesos.local` / `Demo123!`

## 5) Smoke rapido

Con API en `http://localhost:5055`:

```bash
BASE_URL=http://localhost:5055 scripts/backend/smoke.sh
```

Salida esperada: archivos JSON en `/tmp/smoke_*.json`.

## 6) CORS y frontend

Orígenes configurados en `Cors:AllowedOrigins`:

- `http://localhost:5173`
- `https://procesos-academicos.vercel.app`

Frontend usa `VITE_API_BASE_URL` (ver `src/Web/procesos-academicos-web/.env.example`).

## 7) Estrategia SQL

El SQL generado de migracion **se mantiene versionado** para auditoria y ejecución manual.
La fuente de verdad evolutiva sigue siendo EF (`*.cs` + snapshot).

## 8) Seguridad

Al terminar integración y despliegue:

1. Rotar credenciales Neon usadas durante implementación.
2. Rotar `Jwt:SigningKey`.
3. Actualizar secretos en local/Render/Vercel y repetir smoke corto.
