# Manual de usuario funcional (app completa)

## 1. Proposito y audiencia

Este documento describe como funciona hoy la plataforma `ProcesosAcademicos` desde la perspectiva funcional.

Audiencia principal:
- Usuarios funcionales (estudiante, profesor, director).
- QA y analistas funcionales.
- Equipo tecnico que necesita validar cobertura funcional sin leer todo el codigo.

Objetivos:
- Explicar que hace hoy la app en cada modulo.
- Dejar claro que esta implementado, que esta parcial y que esta pendiente.
- Alinear rutas de frontend, acciones UI y comportamiento backend real.

## 2. Alcance actual de la aplicacion

Tecnologia y arquitectura:
- Frontend: React + Vite + Tailwind.
- Backend: .NET 9, CQRS con MediatR, EF Core, PostgreSQL (Neon).
- API versionada: `/api/v1`.
- Respuestas API: envelope `data/meta/errors`.

Modulos funcionales:
- Autenticacion y sesion por rol.
- Estudiante.
- Profesor.
- Director.
- Catalogos.
- Reportes PDF con descarga auditada.

## 3. Mapa de navegacion por rol (rutas reales)

### 3.1 Rutas base

| Modulo | Ruta |
|---|---|
| Raiz | `/` |
| Login | `/login` |

### 3.2 Rutas Estudiante

| Pantalla | Ruta |
|---|---|
| Dashboard | `/dashboard/estudiante` |
| Mis cursos | `/dashboard/estudiante/mis-cursos` |
| Perfil | `/dashboard/estudiante/perfil` |
| Registro academico | `/dashboard/estudiante/registro-academico` |

### 3.3 Rutas Profesor

| Pantalla | Ruta |
|---|---|
| Dashboard | `/dashboard/profesor` |
| Mis clases | `/dashboard/profesor/mis-clases` |
| Estudiantes | `/dashboard/profesor/estudiantes` |

### 3.4 Rutas Director

| Pantalla | Ruta |
|---|---|
| Dashboard | `/dashboard/director` |
| Cursos | `/dashboard/director/cursos` |
| Profesores | `/dashboard/director/profesores` |
| Estudiantes | `/dashboard/director/estudiantes` |
| Reportes | `/dashboard/director/reportes` |

## 4. Comportamientos transversales

### 4.1 Autenticacion, sesion y redireccion por rol

- Login real con `POST /api/v1/auth/login`.
- El backend retorna `roleCode` canonico (`ESTUDIANTE`, `PROFESOR`, `DIRECTOR`).
- El frontend redirige automaticamente segun rol:
  - `ESTUDIANTE` -> `/dashboard/estudiante`
  - `PROFESOR` -> `/dashboard/profesor`
  - `DIRECTOR` -> `/dashboard/director`

### 4.2 Persistencia de sesion

- El frontend guarda la sesion en `localStorage`.
- Campos persistidos:
  - `accessToken`
  - `refreshToken`
  - `expiresAt`
  - `currentUser`

### 4.3 Refresh token y expiracion

- Si una llamada protegida responde 401 o error de token, el cliente intenta `POST /api/v1/auth/refresh` una vez.
- Si refresh falla:
  - se limpia sesion local,
  - se redirige a login.

### 4.4 Envelope de respuesta API

- Comandos/detalles: `data` + `meta` + `errors`.
- Listados paginados: `data.items` + `meta.pagination`.
- Listados no paginados: `data.items`.
- Excepcion explicita: descarga de archivo en `GET /api/v1/reports/{requestId}/download` retorna binario PDF.

### 4.5 Paginacion funcional

- El frontend consume paginacion backend y limita `pageSize` maximo a 100.
- Las vistas usan paginacion visual local sobre datos ya normalizados para UX, sin romper el contrato API.

## 5. Manual por rol

## 5.1 Estudiante

### 5.1.1 Que puede hacer hoy

1. Iniciar sesion por codigo o correo.
2. Inscribirse a una carrera (si aun no tiene carrera).
3. Ver dashboard con promedio, cursos aprobados/pendientes y cursos activos.
4. Ver y gestionar cursos:
- Consultar ofertas disponibles.
- Inscribirse a oferta publicada.
- Ver cursos activos.
5. Consultar historial academico paginado.
6. Solicitar y descargar:
- Certificacion de cursos.
- Cierre de pensum (si cumple elegibilidad).

### 5.1.2 Flujo funcional rapido

1. Login en `/login`.
2. Si no tiene carrera activa:
- elegir carrera en dashboard.
3. Ir a `Mis cursos` para inscribirse en ofertas.
4. Volver a dashboard para generar reportes cuando aplique.

### 5.1.3 Reglas funcionales clave

- Inscripcion de carrera requiere pensum activo para la carrera.
- Inscripcion a oferta valida:
  - carrera compatible,
  - oferta publicada/activa segun regla,
  - cupos disponibles,
  - no duplicidad.
- Cierre de pensum:
  - solo si `pending = 0` en pensum activo,
  - se permite historial con reprobada previa si luego existe aprobada.

### 5.1.4 Endpoints relevantes

- `GET /api/v1/student/profile`
- `POST /api/v1/student/career-enrollment`
- `GET /api/v1/student/dashboard`
- `GET /api/v1/student/courses/available`
- `GET /api/v1/student/courses/active`
- `POST /api/v1/student/courses/{offeringId}/enroll`
- `GET /api/v1/student/academic-record`
- `GET /api/v1/student/curriculum/progress`
- `POST /api/v1/student/report-requests`
- `GET /api/v1/reports/{requestId}/download?token=...`

### 5.1.5 Implementado vs parcial

- Implementado:
  - flujo principal de estudiante completo.
- Parcial:
  - en `Registro academico` existe boton visual de descarga marcado como "Proximamente".
  - la generacion real de certificados ya funciona desde dashboard.

## 5.2 Profesor

### 5.2.1 Que puede hacer hoy

1. Ver dashboard con metricas operativas.
2. Ver clases asignadas.
3. Abrir modal de asignacion de notas por clase.
4. Guardar notas draft.
5. Publicar notas.
6. Cerrar curso cuando cumple reglas.
7. Consultar resumen de estudiantes.

### 5.2.2 Flujo funcional rapido

1. Login.
2. Abrir `Mis clases`.
3. Entrar a `Asignar notas`.
4. Completar notas de todos los estudiantes.
5. Publicar notas.
6. Cerrar curso.

### 5.2.3 Reglas funcionales clave

- No se publica fuera de estado `Activo`.
- Publicacion requiere notas completas en la clase.
- No se puede editar nota luego de publicada/cerrada.
- Cierre de curso exige notas publicadas.

### 5.2.4 Endpoints relevantes

- `GET /api/v1/professor/dashboard`
- `GET /api/v1/professor/classes`
- `GET /api/v1/professor/classes/{classId}/students`
- `PUT /api/v1/professor/classes/{classId}/grades/draft`
- `POST /api/v1/professor/classes/{classId}/grades/publish`
- `POST /api/v1/professor/classes/{classId}/close`
- `GET /api/v1/professor/students`

### 5.2.5 Implementado vs parcial

- Implementado:
  - flujo principal de clases y notas completo.
- Parcial:
  - sin huecos criticos del flujo principal.
  - mejoras UX posibles en validaciones visuales y mensajes de progreso.

## 5.3 Director

### 5.3.1 Que puede hacer hoy

1. Ver dashboard operativo.
2. Gestionar ofertas de curso:
- crear borrador,
- publicar,
- activar,
- cerrar.
3. Asignar profesor a oferta.
4. Consultar profesores.
5. Consultar estudiantes.
6. Consultar solicitudes de reportes y auditoria de descargas.
7. Consultar disponibilidad docente.

### 5.3.2 Flujo funcional rapido

1. Login.
2. Ir a `Cursos`.
3. Crear oferta borrador.
4. Publicar y luego activar.
5. Asignar profesor.
6. Cerrar cuando notas esten publicadas.

### 5.3.3 Reglas funcionales clave

- `Borrador -> Publicado -> Activo -> Cerrado`.
- No se cierra oferta sin notas publicadas.
- Asignacion docente valida profesor existente.
- Reportes muestran `downloadedAt` y `downloadsCount`.

### 5.3.4 Endpoints relevantes

- `GET /api/v1/director/dashboard`
- `GET /api/v1/director/courses`
- `POST /api/v1/director/courses`
- `POST /api/v1/director/courses/{offeringId}/publish`
- `POST /api/v1/director/courses/{offeringId}/activate`
- `POST /api/v1/director/courses/{offeringId}/close`
- `POST /api/v1/director/courses/{offeringId}/assign-professor`
- `GET /api/v1/director/professors`
- `GET /api/v1/director/students`
- `GET /api/v1/director/report-requests`
- `GET /api/v1/director/teacher-availability`

### 5.3.5 Implementado vs parcial

- Implementado:
  - flujo principal operativo del director.
- Parcial:
  - acciones de UI etiquetadas "Proximamente" en pantallas de profesores/estudiantes.

## 6. Estado funcional global

### 6.1 Funcionalidades implementadas

- Auth completa: login, refresh, logout, me.
- Navegacion protegida por rol.
- Modulo Estudiante completo para operacion academica base.
- Modulo Profesor completo para ciclo de notas.
- Modulo Director completo para ciclo de oferta.
- Generacion de PDF:
  - certificacion de cursos,
  - cierre de pensum.
- Descarga de reportes con token firmado y auditoria de eventos.

### 6.2 Funcionalidades parciales

- Controles UI de "Proximamente" aun visibles en algunas pantallas.
- Busqueda global de topbar sin backend conectado.

### 6.3 Funcionalidades pendientes

- Ver seccion 9 (pendientes priorizados por rol).

## 7. Funcionalidades backend disponibles sin UI aun

Las siguientes capacidades backend existen, pero no tienen flujo completo en UI principal:

1. Gestion de versiones de pensum:
- `GET /api/v1/director/curriculum-versions`
- `POST /api/v1/director/curriculum-versions`
2. Asignacion de pensum a estudiante:
- `POST /api/v1/director/students/{studentId}/curriculum-assignment`
3. Gestion de equivalencias de cursos:
- `GET /api/v1/director/course-equivalences`
- `POST /api/v1/director/course-equivalences`
4. Descarga directa de archivo de reporte (endpoint tecnico):
- `GET /api/v1/reports/{requestId}/download?token=...`

## 8. Catalogo de errores funcionales frecuentes

Tabla orientada a usuario/QA.

| Codigo | Cuando aparece | Significado funcional | Accion sugerida |
|---|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | Login | Usuario/password invalidos | Verificar credenciales |
| `AUTH_INVALID_TOKEN` | Sesion protegida | Token invalido | Re-login |
| `AUTH_TOKEN_EXPIRED` | Sesion expirada | Access token vencido | Refrescar o re-login |
| `AUTH_REFRESH_INVALID` | Refresh | Refresh token invalido | Re-login |
| `AUTH_REFRESH_EXPIRED` | Refresh | Refresh token vencido | Re-login |
| `FORBIDDEN_ROLE` | Ruta de otro rol | Rol no autorizado | Usar usuario del rol correcto |
| `CAREER_WITHOUT_ACTIVE_CURRICULUM` | Inscripcion de carrera | Carrera sin pensum activo | Activar pensum en backoffice |
| `COURSE_OFFERING_CAPACITY_EXHAUSTED` | Inscripcion a curso | No hay cupos | Elegir otra oferta |
| `ENROLLMENT_ALREADY_EXISTS` | Inscripcion a curso | Ya inscrito en esa oferta | Evitar duplicado |
| `CAREER_MISMATCH` | Inscripcion a curso | Oferta no corresponde a carrera | Elegir oferta valida |
| `CLASS_NOT_ACTIVE_FOR_GRADING` | Publicar notas | Clase no activa para calificar | Activar oferta o revisar estado |
| `GRADES_INCOMPLETE` | Publicar notas | Faltan notas | Completar notas faltantes |
| `GRADE_EDIT_LOCKED` | Editar notas | Nota bloqueada por publicacion/cierre | No editable |
| `COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED` | Cierre curso/oferta | No se puede cerrar sin notas publicadas | Publicar notas primero |
| `CURRICULUM_NOT_COMPLETED_FOR_CLOSURE` | Cierre de pensum | Faltan cursos requeridos del pensum | Completar pendientes |
| `REPORT_DOWNLOAD_TOKEN_INVALID` | Descargar reporte | Token de descarga invalido | Regenerar solicitud |
| `REPORT_DOWNLOAD_TOKEN_EXPIRED` | Descargar reporte | Token expirado | Regenerar solicitud |

## 9. Pendientes priorizados por rol

## 9.1 Estudiante

| Prioridad | Pendiente | Objetivo funcional esperado | Criterio de completado |
|---|---|---|---|
| Alta | Editar perfil | Permitir actualizacion de telefono/correo y campos editables | Boton "Editar perfil" habilita formulario, persiste cambios y refresca vista |
| Media | Descarga desde `Registro academico` | Unificar experiencia de descarga en pantalla de historial | Boton deja de ser "Proximamente" y genera reporte real |

## 9.2 Profesor

| Prioridad | Pendiente | Objetivo funcional esperado | Criterio de completado |
|---|---|---|---|
| Media | Mejora de UX en notas | Mejor feedback de validaciones y guardado | Mensajes inline claros por estudiante y estado de operacion |
| Baja | Filtros/busqueda en listados | Facilitar manejo de volumen alto de clases/alumnos | Filtros funcionales conectados a backend |

## 9.3 Director

| Prioridad | Pendiente | Objetivo funcional esperado | Criterio de completado |
|---|---|---|---|
| Media | Importar hoja | Carga masiva de profesores/cursos | Flujo de importacion con validaciones y resultado |
| Media | Nuevo profesor | Alta de profesor desde UI | Formulario funcional y persistencia real |
| Media | Ver detalle profesor | Explorar carga y clases del profesor | Vista detalle navegable y consistente |
| Media | Exportar CSV | Exportar estudiantes/profesores | Archivo CSV descargable con filtros actuales |
| Baja | Enviar notificacion | Notificar estudiantes/profesores desde UI | Accion ejecuta envio y muestra resultado |

## 9.4 Pendientes transversales

| Prioridad | Pendiente | Objetivo funcional esperado | Criterio de completado |
|---|---|---|---|
| Media | Busqueda global topbar | Busqueda transversal por contexto de pagina | Input deja de estar en modo "Proximamente" y filtra datos reales |
| Media | UI para backoffice curricular | Exponer capacidades ya implementadas en API | Pantallas para pensum/equivalencias/asignaciones curriculares |

## 10. Anexo de credenciales demo y ambientes

## 10.1 Credenciales seed

Password comun demo: `Demo123!`

| Rol | Usuario principal | Usuario alterno | Password |
|---|---|---|---|
| Estudiante | `20230104` | `estudiante.demo@procesos.local` | `Demo123!` |
| Estudiante (pensum completo) | `20230105` | `estudiante.cierre@procesos.local` | `Demo123!` |
| Profesor | `PR-040` | `profesor.demo@procesos.local` | `Demo123!` |
| Director | `DIR-001` | `director.demo@procesos.local` | `Demo123!` |

Nota:
- `20230105` esta preparado para probar cierre de pensum exitoso.

## 10.2 Ambientes de ejecucion

| Ambiente | Frontend | Backend |
|---|---|---|
| Local desarrollo | `http://localhost:5173` | `http://localhost:5055` |
| Produccion actual | `https://procesos-academicos.vercel.app` | `https://procesosacademicos.onrender.com` |

## 10.3 Configuracion minima de entorno

Frontend (Vercel/local):
- `VITE_API_BASE_URL`

Backend (Render/local):
- `ConnectionStrings__Main`
- `Jwt__SigningKey`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Cors__AllowedOrigins__*`
- `Database__ApplyMigrationsOnStartup`
- `Reports__StorageRootPath`
