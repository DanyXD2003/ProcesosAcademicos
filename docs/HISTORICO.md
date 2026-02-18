# Historico Tecnico del Proyecto

## Proposito
Este documento registra la evolucion tecnica del proyecto `ProcesosAcademicos` para dar trazabilidad al equipo sobre:

- decisiones tomadas,
- cambios implementados,
- estado real actual del repositorio,
- pendientes para siguientes iteraciones.

Este archivo debe actualizarse al cierre de cada bloque de trabajo relevante.

---

## Linea De Tiempo Por Fases

### Fase 1 - Estructura DDD inicial backend (.NET)
**Objetivo**
- Levantar una base de arquitectura por capas para backend (`Domain`, `Application`, `Infrastructure`, `Api`) en .NET.

**Cambios implementados**
- Creacion de solucion y proyectos backend por capas.
- Conexion de referencias entre proyectos:
  - `Application -> Domain`
  - `Infrastructure -> Application + Domain`
  - `Api -> Application + Infrastructure`
- Estructura inicial de carpetas bajo `src/Backend`.

**Archivos clave**
- `ProcesosAcademicos.sln`
- `src/Backend/Core/ProcesosAcademicos.Domain/ProcesosAcademicos.Domain.csproj`
- `src/Backend/Application/ProcesosAcademicos.Application/ProcesosAcademicos.Application.csproj`
- `src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/ProcesosAcademicos.Infrastructure.csproj`
- `src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj`

**Decisiones y tradeoffs**
- Se priorizo estructura sobre complejidad funcional.
- Se dejo lista la topologia de capas para crecer incrementalmente.

**Resultado esperado vs observado**
- Esperado: base DDD navegable en solucion.
- Observado: solucion con capas separadas y referencias correctas.

---

### Fase 2 - Migracion frontend a React + Tailwind por roles
**Objetivo**
- Migrar vistas HTML a SPA React visual, sin dependencia de backend.

**Cambios implementados**
- Sustitucion de entry por router visual.
- Creacion de vistas para `login`, `estudiante`, `profesor`, `director`.
- Extraccion de componentes reutilizables de layout y UI.
- Implementacion de datos mock locales.

**Archivos clave**
- `src/Web/procesos-academicos-web/src/main.jsx`
- `src/Web/procesos-academicos-web/src/App.jsx`
- `src/Web/procesos-academicos-web/src/router/AppRouter.jsx`
- `src/Web/procesos-academicos-web/src/components/layout/DashboardLayout.jsx`
- `src/Web/procesos-academicos-web/src/mocks/*.js`

**Decisiones y tradeoffs**
- Se desacoplo frontend de API para avanzar diseño e interaccion temprano.
- Se uso mock data para acelerar feedback de UX sin bloquear por backend.

**Resultado esperado vs observado**
- Esperado: SPA visual navegable por roles.
- Observado: rutas base funcionales con build exitoso en Vite.

---

### Fase 3 - Navegacion modular por sidebar y rutas anidadas
**Objetivo**
- Hacer funcionales los links del sidebar en director/profesor/estudiante con paginas visuales reales.

**Cambios implementados**
- Definicion centralizada de rutas en `paths.js`.
- Definicion centralizada de menu lateral por rol en `sidebarItems.js`.
- Refactor de sidebar con `NavLink` para estado activo automatico.
- Creacion de paginas modulares por rol:
  - Director: `cursos`, `profesores`, `estudiantes`, `reportes`
  - Profesor: `mis-clases`, `horario`, `reportes`, `estudiantes`
  - Estudiante: `perfil`, `registro-academico`, `configuracion`
- Paginacion por query param (`?page=`) en modulos con listas/tablas.

**Archivos clave**
- `src/Web/procesos-academicos-web/src/router/paths.js`
- `src/Web/procesos-academicos-web/src/navigation/sidebarItems.js`
- `src/Web/procesos-academicos-web/src/components/navigation/RoleSidebar.jsx`
- `src/Web/procesos-academicos-web/src/pages/Director*.jsx`
- `src/Web/procesos-academicos-web/src/pages/Professor*.jsx`
- `src/Web/procesos-academicos-web/src/pages/Student*.jsx`

**Decisiones y tradeoffs**
- Se eligio slugs en espanol para consistencia con el dominio del negocio.
- Se mantuvo la interfaz visual sin integracion de datos reales.

**Resultado esperado vs observado**
- Esperado: todos los items de sidebar navegan a paginas reales.
- Observado: rutas anidadas por rol activas y build frontend exitoso.

---

### Fase 4 - Limpieza backend a plantilla inicial
**Objetivo**
- Dejar backend listo para iniciar desde cero, conservando estructura DDD y dependencias entre capas.

**Cambios implementados**
- Eliminacion de codigo fuente y configuracion funcional backend.
- Conservacion de `.csproj` y `ProcesosAcademicos.sln`.
- Uso de `.gitkeep` en carpetas vacias para conservar estructura en git.

**Archivos clave conservados**
- `ProcesosAcademicos.sln`
- `src/Backend/Core/ProcesosAcademicos.Domain/ProcesosAcademicos.Domain.csproj`
- `src/Backend/Application/ProcesosAcademicos.Application/ProcesosAcademicos.Application.csproj`
- `src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/ProcesosAcademicos.Infrastructure.csproj`
- `src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj`

**Decisiones y tradeoffs**
- Se prefirio mantener esqueleto de proyectos para facilitar arranque posterior.
- Se retiro toda logica para evitar arrastrar decisiones tempranas al desarrollo de equipo.

**Resultado esperado vs observado**
- Esperado: backend base, sin comportamiento funcional.
- Observado: estructura por capas intacta, backend sin logica de negocio ni API operativa.

---

## Estado Actual Del Backend (verificado)

### Estructura por capas
- `Core/ProcesosAcademicos.Domain`
- `Application/ProcesosAcademicos.Application`
- `Infrastructure/ProcesosAcademicos.Infrastructure`
- `Api/ProcesosAcademicos.Api`

### Que se conserva
- Proyectos `.csproj` por capa.
- Dependencias entre capas:
  - `Application -> Domain`
  - `Infrastructure -> Application + Domain`
  - `Api -> Application + Infrastructure`
- Carpetas de dominio/aplicacion/infraestructura/api con placeholders `.gitkeep` donde aplica.

### Que se elimino
- Codigo funcional backend (`*.cs` de dominio/aplicacion/infraestructura/api).
- Configuracion funcional API (`Program.cs`, `appsettings*.json`, `launchSettings.json`).

### Nota de estado local
- Si se ejecutan restore/build, pueden reaparecer artefactos locales en `obj/`.
- Esos artefactos estan ignorados por git (`obj/` y `bin/` en `.gitignore`) y no forman parte de la plantilla funcional.

---

## Estado Actual Del Frontend (verificado)

### Principio vigente
- Frontend visual desacoplado de backend (sin `fetch` a API en runtime).

### Mapa de rutas
- Base:
  - `/`
  - `/login`
- Director:
  - `/dashboard/director`
  - `/dashboard/director/cursos?page=1`
  - `/dashboard/director/profesores?page=1`
  - `/dashboard/director/estudiantes?page=1`
  - `/dashboard/director/reportes?page=1`
- Profesor:
  - `/dashboard/profesor`
  - `/dashboard/profesor/mis-clases?page=1`
  - `/dashboard/profesor/horario?page=1`
  - `/dashboard/profesor/reportes?page=1`
  - `/dashboard/profesor/estudiantes?page=1`
- Estudiante:
  - `/dashboard/estudiante`
  - `/dashboard/estudiante/perfil`
  - `/dashboard/estudiante/registro-academico?page=1`
  - `/dashboard/estudiante/configuracion`

### Componentes base reutilizables
- Layout/navegacion:
  - `src/Web/procesos-academicos-web/src/components/layout/DashboardLayout.jsx`
  - `src/Web/procesos-academicos-web/src/components/navigation/RoleSidebar.jsx`
  - `src/Web/procesos-academicos-web/src/components/navigation/TopHeader.jsx`
- UI comun:
  - `src/Web/procesos-academicos-web/src/components/common/StatCard.jsx`
  - `src/Web/procesos-academicos-web/src/components/common/PaginationControls.jsx`
  - `src/Web/procesos-academicos-web/src/components/domain/SectionCard.jsx`
  - `src/Web/procesos-academicos-web/src/components/director/AssignProfessorModal.jsx`

### Fuentes de datos mock
- `src/Web/procesos-academicos-web/src/mocks/student.mock.js`
- `src/Web/procesos-academicos-web/src/mocks/professor.mock.js`
- `src/Web/procesos-academicos-web/src/mocks/director.mock.js`

---

## Inventario Tecnico Resumido

| Area | Archivo/Carpeta | Estado | Observaciones |
|---|---|---|---|
| Solucion | `ProcesosAcademicos.sln` | Activo | Conserva proyectos backend y estructura de solucion. |
| Backend - Domain | `src/Backend/Core/ProcesosAcademicos.Domain/ProcesosAcademicos.Domain.csproj` | Activo | Proyecto base sin logica de dominio implementada. |
| Backend - Application | `src/Backend/Application/ProcesosAcademicos.Application/ProcesosAcademicos.Application.csproj` | Activo | Referencia a Domain intacta. |
| Backend - Infrastructure | `src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure/ProcesosAcademicos.Infrastructure.csproj` | Activo | Referencias a Application y Domain intactas. |
| Backend - Api | `src/Backend/Api/ProcesosAcademicos.Api/ProcesosAcademicos.Api.csproj` | Activo | Referencias a Application e Infrastructure intactas. |
| Backend - Carpetas vacias | `src/Backend/**/.gitkeep` | Activo | Preserva estructura en git. |
| Frontend - Router | `src/Web/procesos-academicos-web/src/router/AppRouter.jsx` | Activo | Rutas por rol y modulos registradas. |
| Frontend - Paths | `src/Web/procesos-academicos-web/src/router/paths.js` | Activo | Contrato centralizado de rutas. |
| Frontend - Sidebar | `src/Web/procesos-academicos-web/src/navigation/sidebarItems.js` | Activo | Menus funcionales por rol. |
| Frontend - Paginas | `src/Web/procesos-academicos-web/src/pages/` | Activo | Dashboards y modulos visuales sin backend. |
| Frontend - Mocks | `src/Web/procesos-academicos-web/src/mocks/` | Activo | Datos estaticos para demo visual. |

---

## Decisiones Arquitectonicas Vigentes

1. Backend en modo **plantilla DDD**:
- estructura y dependencias listas,
- sin implementacion funcional de negocio/API.

2. Frontend en modo **SPA visual por roles**:
- rutas anidadas por rol,
- componentes reutilizables,
- navegacion lateral funcional.

3. Paginacion en modulos listados:
- estandar `?page=`,
- normalizacion de valores invalidos por hook de paginacion.

4. Desacople front-back temporal:
- no hay integracion con endpoints backend en esta etapa.

---

## Pendientes Y Proximos Pasos Sugeridos

### Para backend (prioridad alta)
- [ ] Definir dominio inicial (entidades, agregados, value objects, invariantes).
- [ ] Definir casos de uso principales en Application.
- [ ] Definir estrategia de persistencia (EF Core + DB objetivo).
- [ ] Implementar API minima (health, auth base, modulo inicial).
- [ ] Agregar pruebas unitarias por capa.

### Para frontend
- [ ] Definir contrato API inicial (DTOs/errores/paginacion server-side).
- [ ] Conectar autenticacion real y manejo de sesion.
- [ ] Reemplazar mocks por datos remotos gradualmente por modulo.
- [ ] Introducir validaciones de formularios y estados de carga/error consistentes.

### Riesgos conocidos
- Desalineacion potencial entre mocks frontend y futuro contrato backend.
- Si el backend se implementa sin especificacion de dominio acordada, puede haber retrabajo de UI.
- Falta de pruebas de regresion frontend al crecer modulos visuales.

---

## Convencion De Mantenimiento Del Historico

Actualizar este archivo al cierre de cada iteracion relevante usando el siguiente formato minimo:

### Plantilla de entrada
- **Fecha:** `YYYY-MM-DD`
- **Autor/Equipo:** `nombre o squad`
- **Objetivo de la iteracion:** `descripcion breve`
- **Cambios principales:** `lista de cambios`
- **Archivos clave afectados:** `paths relativos del repositorio`
- **Impacto tecnico:** `arquitectura, rutas, contratos, build`
- **Pendientes abiertos:** `checklist`

### Reglas
- No registrar intenciones no implementadas como hechos.
- Siempre validar contra estado real del repositorio antes de documentar.
- Si hay cambios de decision, explicitar motivo y tradeoff.

---

## Referencias Rapidas
- Onboarding general: `README.md`
- Router principal frontend: `src/Web/procesos-academicos-web/src/router/AppRouter.jsx`
- Contrato de rutas frontend: `src/Web/procesos-academicos-web/src/router/paths.js`
- Solucion backend: `ProcesosAcademicos.sln`
