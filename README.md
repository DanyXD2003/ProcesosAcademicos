# ProcesosAcademicos

Base de arquitectura DDD con backend en .NET y frontend en React + Tailwind.

## Documentacion Historica

Para trazabilidad tecnica completa de lo implementado hasta ahora (fases, decisiones, estado real y pendientes), revisar:

- `docs/HISTORICO.md`

## Integracion Front/Back

Contrato tecnico inicial para conectar frontend y backend del flujo de publicacion/inscripcion:

- `docs/INTEGRACION_FRONT_BACK.md`

## Estructura

```
.
├── src/
│   ├── Backend/
│   │   ├── Core/
│   │   │   └── ProcesosAcademicos.Domain/
│   │   ├── Application/
│   │   │   └── ProcesosAcademicos.Application/
│   │   ├── Infrastructure/
│   │   │   └── ProcesosAcademicos.Infrastructure/
│   │   └── Api/
│   │       └── ProcesosAcademicos.Api/
│   └── Web/
│       └── procesos-academicos-web/
└── ProcesosAcademicos.sln
```

## Relaciones entre capas

- `Domain`: capa base del dominio (plantilla inicial).
- `Application`: capa de casos de uso y contratos (plantilla inicial).
- `Infrastructure`: capa de persistencia e integraciones (plantilla inicial).
- `Api`: capa de entrada HTTP (plantilla inicial).
- `Web`: SPA React + Tailwind por roles (`login`, `estudiante`, `profesor`, `director`) con datos mock visuales.

Dependencias de proyectos:

- `Application -> Domain`
- `Infrastructure -> Application + Domain`
- `Api -> Application + Infrastructure`

Estado actual del backend:

- Esqueleto DDD limpio para iniciar implementación desde cero.
- Se conservan proyectos `.csproj` y dependencias entre capas.
- No hay código fuente ni configuración funcional en backend en esta etapa.

## Ejecutar frontend

```bash
cd src/Web/procesos-academicos-web
npm install
npm run dev
```

Rutas del frontend demo:

- `/` redirige a `/login`
- `/login`
- `/dashboard/estudiante?page=1`
- `/dashboard/profesor?page=1`
- `/dashboard/director?page=1`

Rutas de modulos por rol:

- Director: `/dashboard/director/cursos?page=1`, `/dashboard/director/profesores?page=1`, `/dashboard/director/estudiantes?page=1`, `/dashboard/director/reportes?page=1`
- Profesor: `/dashboard/profesor/mis-clases?page=1`, `/dashboard/profesor/horario?page=1`, `/dashboard/profesor/reportes?page=1`, `/dashboard/profesor/estudiantes?page=1`
- Estudiante: `/dashboard/estudiante/perfil`, `/dashboard/estudiante/registro-academico?page=1`, `/dashboard/estudiante/configuracion`
- Estudiante (inscripciones): `/dashboard/estudiante/mis-cursos`

Nota: por ahora el frontend esta desacoplado del backend y no realiza llamadas a API.
