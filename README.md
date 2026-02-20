# ProcesosAcademicos

Plataforma academica con backend `.NET 9` (DDD + CQRS + EF Core + PostgreSQL/Neon) y frontend `React + Vite + Tailwind` consumiendo API real `/api/v1`.

## Estructura

```text
src/
  Backend/
    Core/ProcesosAcademicos.Domain
    Application/ProcesosAcademicos.Application
    Infrastructure/ProcesosAcademicos.Infrastructure
    Api/ProcesosAcademicos.Api
  Web/procesos-academicos-web
```

## Estado actual

- Backend implementado con:
  - Auth JWT + refresh token en DB
  - Modulos Student/Professor/Director/Catalog
  - Envelope uniforme `data/meta/errors`
  - EF Core code-first + migracion inicial + seed minimo
- Frontend conectado a API real (sin mocks de login/rol).

## Documentacion clave

- Contrato integración: `docs/INTEGRACION_FRONT_BACK.md`
- Playbook backend: `docs/CODEX_BACKEND.md`
- Setup operativo: `docs/BACKEND_SETUP.md`
- Histórico técnico: `docs/HISTORICO.md`

## Quickstart backend (local)

1. Configurar secretos (`ConnectionStrings:Main`, `Jwt:SigningKey`) en `src/Backend/Api/ProcesosAcademicos.Api`.
2. Aplicar migraciones: `scripts/backend/update-dev.sh`
3. Levantar API:

```bash
cd src/Backend/Api/ProcesosAcademicos.Api
ASPNETCORE_ENVIRONMENT=Development Database__ApplyMigrationsOnStartup=true dotnet run --urls http://localhost:5055
```

4. Smoke:

```bash
BASE_URL=http://localhost:5055 scripts/backend/smoke.sh
```

## Quickstart frontend (local)

```bash
cd src/Web/procesos-academicos-web
cp .env.example .env
npm install
npm run dev
```

`VITE_API_BASE_URL` por defecto apunta a `http://localhost:5055`.

## Notas importantes

- El SQL de migraciones en `src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/Persistence/Migrations/*.sql` se mantiene versionado (auditoría/ejecución manual).
- Tras cerrar integración/despliegue, rotar credenciales Neon y `Jwt:SigningKey`.
