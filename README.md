# ProcesosAcademicos

Base de arquitectura DDD con backend en .NET y frontend en React + Tailwind.

## Documentacion Historica

Para trazabilidad tecnica completa de lo implementado hasta ahora (fases, decisiones, estado real y pendientes), revisar:

- `/Users/danielelis/RiderProjects/ProcesosAcademicos/docs/HISTORICO.md`

## Integracion Front/Back

Contrato tecnico inicial para conectar frontend y backend del flujo de publicacion/inscripcion:

- `/Users/danielelis/RiderProjects/ProcesosAcademicos/docs/INTEGRACION_FRONT_BACK.md`

## Estructura

```
/Users/danielelis/RiderProjects/ProcesosAcademicos
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
cd /Users/danielelis/RiderProjects/ProcesosAcademicos/src/Web/procesos-academicos-web
npm install
npm run dev
```

Rutas del frontend demo:

- `http://localhost:5173/` redirige a `/login`
- `http://localhost:5173/login`
- `http://localhost:5173/dashboard/estudiante?page=1`
- `http://localhost:5173/dashboard/profesor?page=1`
- `http://localhost:5173/dashboard/director?page=1`

Rutas de modulos por rol:

- Director: `http://localhost:5173/dashboard/director/cursos?page=1`, `http://localhost:5173/dashboard/director/profesores?page=1`, `http://localhost:5173/dashboard/director/estudiantes?page=1`, `http://localhost:5173/dashboard/director/reportes?page=1`
- Profesor: `http://localhost:5173/dashboard/profesor/mis-clases?page=1`, `http://localhost:5173/dashboard/profesor/horario?page=1`, `http://localhost:5173/dashboard/profesor/reportes?page=1`, `http://localhost:5173/dashboard/profesor/estudiantes?page=1`
- Estudiante: `http://localhost:5173/dashboard/estudiante/perfil`, `http://localhost:5173/dashboard/estudiante/registro-academico?page=1`, `http://localhost:5173/dashboard/estudiante/configuracion`
- Estudiante (inscripciones): `http://localhost:5173/dashboard/estudiante/mis-cursos`

Nota: por ahora el frontend esta desacoplado del backend y no realiza llamadas a API.
