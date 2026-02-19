# Integracion Front/Back - Contrato Funcional v1

## 1. Proposito y alcance

Este documento define el contrato funcional y tecnico para conectar el frontend actual con un backend futuro.

Objetivo principal:
- Permitir que la aplicacion web funcione sin datos quemados, respetando exactamente los flujos actuales por rol (Estudiante, Profesor, Director).

Alcance de esta version:
- Contrato HTTP versionado en `/api/v1`.
- Auth completa.
- Endpoints MVP obligatorios y endpoints opcionales.
- Modelo de dominio conceptual.
- Modelo relacional para PostgreSQL.
- DTOs, errores y reglas de negocio.
- Guia de implementacion futura con EF Core code-first (sin implementar codigo aun).

Fuera de alcance en esta iteracion:
- Implementacion de codigo backend.
- Entidades reales, controladores reales, migraciones reales.
- Integraciones externas (correo, almacenamiento de archivos, pasarelas).

---

## 2. Estado actual del frontend y que necesita del backend

### 2.1 Estado general

El frontend actual es una SPA por roles con rutas activas y logica local.
Para pasar a entorno real necesita:
- Autenticacion y sesion por rol.
- Carga de dashboards y listados desde API.
- Comandos de negocio para inscripciones, notas, cierre de curso, solicitudes y publicacion.

### 2.2 Rutas activas del frontend

- Base:
  - `/`
  - `/login`

- Director:
  - `/dashboard/director`
  - `/dashboard/director/cursos`
  - `/dashboard/director/profesores`
  - `/dashboard/director/estudiantes`
  - `/dashboard/director/reportes`

- Profesor:
  - `/dashboard/profesor`
  - `/dashboard/profesor/mis-clases`
  - `/dashboard/profesor/estudiantes`

- Estudiante:
  - `/dashboard/estudiante`
  - `/dashboard/estudiante/mis-cursos`
  - `/dashboard/estudiante/perfil`
  - `/dashboard/estudiante/registro-academico`

### 2.3 Necesidades funcionales por rol

- Estudiante:
  - Inscripcion de carrera inicial.
  - Dashboard con metricas y cursos activos.
  - Cursos disponibles por carrera y pensum.
  - Historial academico.
  - Creacion de solicitudes de reporte (certificacion/cierre de pensum).

- Profesor:
  - Clases asignadas.
  - Lista de alumnos por clase.
  - Guardado de notas en borrador.
  - Publicacion de notas.
  - Cierre de curso con regla de bloqueo.
  - Tabla resumen de estudiantes con promedio de notas aprobadas.

- Director:
  - Dashboard con KPIs operativos.
  - Catalogo de cursos (crear borrador, publicar).
  - Listado de profesores y carga.
  - Listado de estudiantes.
  - Historial de solicitudes de reportes.

---

## 3. Convenciones globales de API

### 3.1 Versionado y base path

- Version obligatoria por URL: `/api/v1`.
- Todos los endpoints de negocio deben iniciar con `/api/v1/...`.

### 3.2 Envelope estandar de respuesta

Respuesta exitosa (comando o detalle):

```json
{
  "data": {
    "id": "..."
  },
  "meta": {
    "traceId": "8f3f57c3a0f24a24",
    "timestamp": "2026-02-19T18:20:01Z"
  },
  "errors": []
}
```

Respuesta paginada:

```json
{
  "data": {
    "items": []
  },
  "meta": {
    "traceId": "5c8d18f19f6a4d2d",
    "timestamp": "2026-02-19T18:20:01Z",
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 42,
      "totalPages": 5
    }
  },
  "errors": []
}
```

Respuesta con error:

```json
{
  "data": null,
  "meta": {
    "traceId": "d1918e43e13645f8",
    "timestamp": "2026-02-19T18:20:01Z"
  },
  "errors": [
    {
      "code": "STUDENT_WITHOUT_CAREER",
      "message": "El estudiante no tiene carrera activa.",
      "details": null
    }
  ]
}
```

### 3.3 Formato de datos

- Fechas: ISO-8601 UTC.
- Identificadores tecnicos: UUID en backend.
- Codigos de negocio visibles (ejemplo `CL-2026-001`) se mantienen como campo separado.
- Estados y tipos: enumeraciones controladas.

---

## 4. Seguridad y autenticacion

### 4.1 Roles

- `Estudiante`
- `Profesor`
- `Director`

### 4.2 Claims minimas esperadas

- `sub` (id usuario)
- `role`
- `profileId` (student/professor/director)
- `careerId` (solo cuando aplique)

### 4.3 Endpoints de auth (MVP)

#### `POST /api/v1/auth/login`
- Auth: Publico
- Request (`LoginRequestDto`): `usernameOrEmail`, `password`
- Response (`AuthSessionDto`): `accessToken`, `refreshToken`, `expiresIn`, `user`
- Errores: `AUTH_INVALID_CREDENTIALS`, `AUTH_USER_DISABLED`

#### `POST /api/v1/auth/refresh`
- Auth: Publico (con refresh token valido)
- Request (`RefreshTokenRequestDto`): `refreshToken`
- Response (`AuthSessionDto`)
- Errores: `AUTH_REFRESH_INVALID`, `AUTH_REFRESH_EXPIRED`

#### `POST /api/v1/auth/logout`
- Auth: Token valido
- Request (`LogoutRequestDto`): `refreshToken` (opcional segun estrategia)
- Response: confirmacion de cierre
- Errores: `AUTH_INVALID_TOKEN`

#### `GET /api/v1/auth/me`
- Auth: Token valido
- Response (`CurrentUserDto`): usuario, rol, perfil asociado
- Errores: `AUTH_INVALID_TOKEN`, `AUTH_TOKEN_EXPIRED`

---

## 5. Matriz Front -> Endpoint por pantalla/accion

| Rol | Pantalla | Accion frontend | Endpoint requerido |
|---|---|---|---|
| Estudiante | Login | Iniciar sesion | `POST /api/v1/auth/login` |
| Estudiante | Dashboard (sin carrera) | Cargar carreras | `GET /api/v1/student/profile` + `GET /api/v1/student/dashboard` |
| Estudiante | Dashboard (sin carrera) | Inscribirse a carrera | `POST /api/v1/student/career-enrollment` |
| Estudiante | Dashboard | Ver metricas y cursos activos | `GET /api/v1/student/dashboard` |
| Estudiante | Dashboard | Solicitar certificacion/cierre | `POST /api/v1/student/report-requests` |
| Estudiante | Mis cursos | Ver cursos disponibles | `GET /api/v1/student/courses/available` |
| Estudiante | Mis cursos | Inscribirse a curso | `POST /api/v1/student/courses/{offeringId}/enroll` |
| Estudiante | Mis cursos | Ver cursos activos | `GET /api/v1/student/courses/active` |
| Estudiante | Perfil | Ver perfil | `GET /api/v1/student/profile` |
| Estudiante | Registro academico | Ver historial | `GET /api/v1/student/academic-record` |
| Profesor | Dashboard | Ver KPIs y clases | `GET /api/v1/professor/dashboard` |
| Profesor | Dashboard/Mis clases | Abrir alumnos de clase | `GET /api/v1/professor/classes/{classId}/students` *(classId == courseOfferingId)* |
| Profesor | Dashboard/Mis clases | Guardar borrador de notas | `PUT /api/v1/professor/classes/{classId}/grades/draft` |
| Profesor | Dashboard/Mis clases | Publicar notas | `POST /api/v1/professor/classes/{classId}/grades/publish` |
| Profesor | Dashboard/Mis clases | Cerrar curso | `POST /api/v1/professor/classes/{classId}/close` |
| Profesor | Estudiantes | Ver resumen alumnos | `GET /api/v1/professor/students` |
| Director | Dashboard | Ver KPIs y capacidad | `GET /api/v1/director/dashboard` |
| Director | Dashboard | Ver disponibilidad docente | `GET /api/v1/director/teacher-availability` |
| Director | Cursos | Listar cursos | `GET /api/v1/director/courses` |
| Director | Cursos | Crear curso borrador | `POST /api/v1/director/courses` |
| Director | Cursos | Publicar curso | `POST /api/v1/director/courses/{offeringId}/publish` |
| Director | Cursos | Activar curso publicado | `POST /api/v1/director/courses/{offeringId}/activate` |
| Director | Cursos | Cerrar curso | `POST /api/v1/director/courses/{offeringId}/close` |
| Director | Cursos | Asignar profesor | `POST /api/v1/director/courses/{offeringId}/assign-professor` |
| Director | Profesores | Ver directorio | `GET /api/v1/director/professors` |
| Director | Estudiantes | Ver directorio | `GET /api/v1/director/students` |
| Director | Reportes | Ver historial solicitudes | `GET /api/v1/director/report-requests` |

---

## 6. Catalogo de endpoints MVP obligatorios

## 6.1 Auth

### `POST /api/v1/auth/login`
- Auth: Publico
- Request: `LoginRequestDto`
- Response: `AuthSessionDto`
- Errores: `AUTH_INVALID_CREDENTIALS`, `AUTH_USER_DISABLED`

### `POST /api/v1/auth/refresh`
- Auth: Publico
- Request: `RefreshTokenRequestDto`
- Response: `AuthSessionDto`
- Errores: `AUTH_REFRESH_INVALID`, `AUTH_REFRESH_EXPIRED`

### `POST /api/v1/auth/logout`
- Auth: Token
- Request: `LogoutRequestDto`
- Response: `{ success: true }`
- Errores: `AUTH_INVALID_TOKEN`

### `GET /api/v1/auth/me`
- Auth: Token
- Response: `CurrentUserDto`
- Errores: `AUTH_INVALID_TOKEN`, `AUTH_TOKEN_EXPIRED`

## 6.2 Estudiante

### `GET /api/v1/student/profile`
- Auth: `Estudiante`
- Query: none
- Response: `StudentProfileDto`
- Errores: `STUDENT_PROFILE_NOT_FOUND`

### `POST /api/v1/student/career-enrollment`
- Auth: `Estudiante`
- Request: `StudentCareerEnrollmentRequestDto`
- Response: `StudentCareerEnrollmentResultDto`
- Errores: `CAREER_NOT_FOUND`, `STUDENT_ALREADY_HAS_CAREER`

### `GET /api/v1/student/dashboard`
- Auth: `Estudiante`
- Query: none
- Response: `StudentDashboardDto`
- Errores: `STUDENT_PROFILE_NOT_FOUND`

### `GET /api/v1/student/courses/available`
- Auth: `Estudiante`
- Query: `search?`, `page`, `pageSize`
- Response: paginado `StudentAvailableCourseDto`
- Errores: `STUDENT_WITHOUT_CAREER`

### `GET /api/v1/student/courses/active`
- Auth: `Estudiante`
- Query: `search?`, `page`, `pageSize`
- Response: paginado `StudentActiveCourseDto`
- Errores: `STUDENT_PROFILE_NOT_FOUND`

### `POST /api/v1/student/courses/{offeringId}/enroll`
- Auth: `Estudiante`
- Request: vacio (path param)
- Response: `StudentEnrollmentResultDto`
- Errores: `STUDENT_WITHOUT_CAREER`, `COURSE_OFFERING_NOT_FOUND`, `COURSE_OFFERING_NOT_PUBLISHED`, `COURSE_OFFERING_CAPACITY_EXHAUSTED`, `CAREER_MISMATCH`, `ENROLLMENT_ALREADY_EXISTS`

### `GET /api/v1/student/academic-record`
- Auth: `Estudiante`
- Query: `page`, `pageSize`
- Response: paginado `AcademicRecordRowDto`
- Errores: `STUDENT_PROFILE_NOT_FOUND`

### `POST /api/v1/student/report-requests`
- Auth: `Estudiante`
- Request: `CreateReportRequestDto`
- Response: `ReportRequestDto`
- Errores: `REPORT_TYPE_INVALID`

### `GET /api/v1/student/curriculum/progress`
- Auth: `Estudiante`
- Query: none
- Response: `StudentCurriculumProgressDto`
- Errores: `STUDENT_WITHOUT_CAREER`, `CURRICULUM_VERSION_NOT_ASSIGNED`

## 6.3 Profesor

### `GET /api/v1/professor/dashboard`
- Auth: `Profesor`
- Response: `ProfessorDashboardDto`
- Errores: `PROFESSOR_PROFILE_NOT_FOUND`

### `GET /api/v1/professor/classes`
- Auth: `Profesor`
- Query: `page`, `pageSize`
- Response: paginado `ProfessorClassDto`
- Errores: `PROFESSOR_PROFILE_NOT_FOUND`

### `GET /api/v1/professor/classes/{classId}/students`
- Auth: `Profesor`
- Nota: `classId` representa `courseOfferingId`.
- Response: `ProfessorClassStudentsDto`
- Errores: `CLASS_NOT_FOUND`, `FORBIDDEN_CLASS_ACCESS`

### `PUT /api/v1/professor/classes/{classId}/grades/draft`
- Auth: `Profesor`
- Nota: `classId` representa `courseOfferingId`.
- Request: `UpsertDraftGradesRequestDto`
- Response: `UpsertDraftGradesResultDto`
- Errores: `CLASS_NOT_FOUND`, `GRADE_EDIT_LOCKED`, `GRADE_OUT_OF_RANGE`

### `POST /api/v1/professor/classes/{classId}/grades/publish`
- Auth: `Profesor`
- Nota: `classId` representa `courseOfferingId`.
- Request: none
- Response: `PublishGradesResultDto`
- Errores: `CLASS_NOT_FOUND`, `GRADES_ALREADY_PUBLISHED`, `GRADES_INCOMPLETE`

### `POST /api/v1/professor/classes/{classId}/close`
- Auth: `Profesor`
- Nota: `classId` representa `courseOfferingId`.
- Request: none
- Response: `CloseClassResultDto`
- Errores: `CLASS_NOT_FOUND`, `COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED`, `CLASS_ALREADY_CLOSED`

### `GET /api/v1/professor/students`
- Auth: `Profesor`
- Query: `page`, `pageSize`
- Response: paginado `ProfessorStudentSummaryDto`
- Errores: `PROFESSOR_PROFILE_NOT_FOUND`

## 6.4 Director

### `GET /api/v1/director/dashboard`
- Auth: `Director`
- Response: `DirectorDashboardDto`
- Errores: `DIRECTOR_PROFILE_NOT_FOUND`

### `GET /api/v1/director/courses`
- Auth: `Director`
- Query: `status?`, `careerId?`, `page`, `pageSize`
- Response: paginado `DirectorCourseDto`
- Errores: none funcionales relevantes

### `POST /api/v1/director/courses`
- Auth: `Director`
- Request: `CreateDirectorCourseRequestDto`
- Response: `DirectorCourseDto`
- Errores: `COURSE_OFFERING_CODE_ALREADY_EXISTS`, `COURSE_NOT_FOUND`, `CAREER_NOT_FOUND`, `INVALID_CAPACITY`

### `POST /api/v1/director/courses/{offeringId}/publish`
- Auth: `Director`
- Request: none
- Response: `PublishCourseResultDto`
- Errores: `COURSE_OFFERING_NOT_FOUND`, `COURSE_OFFERING_ALREADY_PUBLISHED`, `COURSE_OFFERING_ALREADY_ACTIVE`, `COURSE_OFFERING_ALREADY_CLOSED`

### `POST /api/v1/director/courses/{offeringId}/activate`
- Auth: `Director`
- Request: none
- Response: `ActivateCourseResultDto`
- Errores: `COURSE_OFFERING_NOT_FOUND`, `COURSE_OFFERING_ALREADY_ACTIVE`, `COURSE_OFFERING_ALREADY_CLOSED`

### `POST /api/v1/director/courses/{offeringId}/close`
- Auth: `Director`
- Request: none
- Response: `CloseCourseResultDto`
- Errores: `COURSE_OFFERING_NOT_FOUND`, `COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED`, `COURSE_OFFERING_ALREADY_CLOSED`

### `POST /api/v1/director/courses/{offeringId}/assign-professor`
- Auth: `Director`
- Request: `AssignProfessorRequestDto`
- Response: `AssignProfessorResultDto`
- Errores: `COURSE_OFFERING_NOT_FOUND`, `PROFESSOR_PROFILE_NOT_FOUND`

### `GET /api/v1/director/professors`
- Auth: `Director`
- Query: `page`, `pageSize`
- Response: paginado `DirectorProfessorDto`

### `GET /api/v1/director/students`
- Auth: `Director`
- Query: `page`, `pageSize`
- Response: paginado `DirectorStudentDto`

### `GET /api/v1/director/report-requests`
- Auth: `Director`
- Query: `type?`, `page`, `pageSize`
- Response: paginado `ReportRequestDto`

### `GET /api/v1/director/teacher-availability`
- Auth: `Director`
- Query: none
- Response: array `TeacherAvailabilityDto`

### `GET /api/v1/director/curriculum-versions`
- Auth: `Director`
- Query: `careerId`, `page`, `pageSize`
- Response: paginado `CurriculumVersionDto`

### `POST /api/v1/director/curriculum-versions`
- Auth: `Director`
- Request: `CreateCurriculumVersionRequestDto`
- Response: `CurriculumVersionDto`
- Errores: `CAREER_NOT_FOUND`, `CURRICULUM_VERSION_ALREADY_EXISTS`

### `POST /api/v1/director/students/{studentId}/curriculum-assignment`
- Auth: `Director`
- Request: `AssignStudentCurriculumRequestDto`
- Response: `StudentCurriculumAssignmentDto`
- Errores: `STUDENT_NOT_FOUND`, `CURRICULUM_VERSION_NOT_FOUND`, `CURRICULUM_ASSIGNMENT_CONFLICT`

### `GET /api/v1/director/course-equivalences`
- Auth: `Director`
- Query: `careerId?`, `page`, `pageSize`
- Response: paginado `CourseEquivalenceDto`

### `POST /api/v1/director/course-equivalences`
- Auth: `Director`
- Request: `CreateCourseEquivalenceRequestDto`
- Response: `CourseEquivalenceDto`
- Errores: `COURSE_NOT_FOUND`, `COURSE_EQUIVALENCE_INVALID`, `COURSE_EQUIVALENCE_DUPLICATE`

---

## 7. Catalogo de endpoints opcionales (no bloqueantes)

1. `PUT /api/v1/student/profile`
- Actualizacion de correo/telefono.

2. `POST /api/v1/student/academic-record/certification-request`
- Variante dedicada si se separa de `report-requests` general.

3. `GET /api/v1/director/students/export`
- Export CSV/Excel del directorio.

4. `POST /api/v1/director/notifications`
- Envio de notificaciones desde dashboard estudiantes.

5. `POST /api/v1/director/professors/import`
- Carga masiva desde archivo.

---

## 8. Reglas de negocio e invariantes

1. Umbral de aprobacion:
- Nota `>= 61` => aprobado.
- Nota `<= 60` => reprobado.

2. Estudiante sin carrera:
- No puede inscribirse a cursos.
- Debe completar `career-enrollment`.

3. Elegibilidad de inscripcion:
- La oferta (`CourseOffering`) debe estar en estado `Publicado`.
- Debe existir cupo disponible.
- La carrera del estudiante debe coincidir con la carrera de la oferta.
- No se permite doble inscripcion del mismo estudiante al mismo curso ofertado.
- La identidad operativa de inscripcion es `courseOfferingId` (`offeringId` en endpoint).

4. Curso base vs oferta por periodo:
- `Course` representa la materia base (identidad academica estable).
- `CourseOffering` representa la clase ofertada en un periodo (term, seccion, profesor, cupos).
- El director crea y publica ofertas, no redefine la materia base cada anio.

5. Cohorte y version de pensum:
- Cada estudiante queda asignado a una version de pensum (`CurriculumVersion`) segun cohorte.
- Los pendientes se calculan contra esa version de pensum.
- Cambios de malla futuros no cambian automaticamente la version del estudiante.

6. Calculo academico de pendientes:
- Un estudiante completa cursos base del pensum, no ofertas puntuales de un anio.
- `Pendientes = cursos requeridos del pensum - cursos aprobados (incluyendo equivalencias)`.
- Si aprueba una oferta en 2025, ese curso base no debe aparecer pendiente en 2026.

7. Equivalencias de cursos:
- Si cambia codigo o nombre de materia, se usa `CourseEquivalence`.
- Las equivalencias se consideran en el calculo de pendientes y progreso.

8. Ciclo de curso:
- `Borrador -> Publicado -> Activo -> Cerrado`.
- La transicion `Publicado -> Activo` en director es manual.

9. Flujo profesor de notas:
- `draft` editable solo antes de publicar.
- `publish` bloquea edicion.
- `close` solo despues de `publish`.

10. Cierre de oferta por director:
- El director puede cerrar oferta solo si las notas ya fueron publicadas.
- Si no hay notas publicadas, debe responder `COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED`.

11. Solicitudes de reporte:
- La solicitud se procesa de forma automatica y se emite en el momento.
- En UI no se expone estado operativo; solo registro de solicitud/emision.

---

## 9. Modelo de dominio conceptual

Entidades principales:
- `User`
- `Role`
- `StudentProfile`
- `ProfessorProfile`
- `Career`
- `Course`
- `CourseOffering`
- `CurriculumVersion`
- `CurriculumCourse`
- `StudentCurriculumAssignment`
- `CourseEquivalence`
- `Enrollment`
- `GradeEntry`
- `AcademicRecord`
- `ReportRequest`
- `TeacherAvailabilitySnapshot`

Relaciones clave:
- Un `User` puede tener uno o varios `Role`.
- Un `StudentProfile` pertenece a un `User` y puede tener una `Career` activa.
- Un `Course` puede ofertarse muchas veces (`CourseOffering`) por periodo/seccion.
- `CurriculumVersion` versiona el pensum por carrera/cohorte.
- `CurriculumCourse` vincula una version de pensum con cursos requeridos.
- `StudentCurriculumAssignment` vincula al estudiante con una version activa de pensum.
- `CourseEquivalence` permite mapear cambios de codigo entre cursos base.
- `Enrollment` vincula estudiante con curso ofertado.
- `GradeEntry` vincula estudiante + curso ofertado para notas.
- `AcademicRecord` refleja historial consolidado de cursos cursados.
- `ReportRequest` pertenece a estudiante y se consulta por director.

---

## 10. Modelo de datos PostgreSQL

## 10.1 Tablas minimas

### `users`
- `id uuid pk`
- `email varchar(180) unique not null`
- `password_hash varchar(256) not null`
- `is_active boolean not null default true`
- `created_at timestamptz not null`

### `roles`
- `id smallint pk`
- `code varchar(30) unique not null` (`ESTUDIANTE`, `PROFESOR`, `DIRECTOR`)

### `user_roles`
- `user_id uuid fk users(id)`
- `role_id smallint fk roles(id)`
- PK compuesto (`user_id`, `role_id`)

### `careers`
- `id uuid pk`
- `code varchar(30) unique not null`
- `name varchar(120) unique not null`
- `is_active boolean not null default true`

### `students`
- `id uuid pk`
- `user_id uuid unique fk users(id)`
- `student_code varchar(30) unique not null`
- `career_id uuid null fk careers(id)`
- `full_name varchar(160) not null`
- `faculty varchar(120) null`
- `semester smallint null`
- `email varchar(180) not null`
- `phone varchar(40) null`

### `professors`
- `id uuid pk`
- `user_id uuid unique fk users(id)`
- `professor_code varchar(30) unique not null`
- `full_name varchar(160) not null`
- `department varchar(120) not null`

### `courses`
- `id uuid pk`
- `code varchar(30) unique not null`
- `name varchar(180) not null`
- `department varchar(120) not null`
- `credits smallint null`

### `course_offerings`
- `id uuid pk`
- `course_id uuid fk courses(id)`
- `career_id uuid fk careers(id)`
- `professor_id uuid null fk professors(id)`
- `section varchar(10) not null`
- `term varchar(20) not null`
- `status varchar(20) not null` (`Borrador`, `Publicado`, `Activo`, `Cerrado`)
- `seats_total int not null`
- `seats_taken int not null default 0`
- `created_by uuid fk users(id)`
- `created_at timestamptz not null`

### `curriculum_courses`
- `curriculum_version_id uuid fk curriculum_versions(id)`
- `course_id uuid fk courses(id)`
- `term_number smallint null`
- `is_mandatory boolean not null default true`
- PK compuesto (`curriculum_version_id`, `course_id`)

### `curriculum_versions`
- `id uuid pk`
- `career_id uuid fk careers(id)`
- `version_code varchar(30) not null` (ej: `INGSIS-2025`)
- `display_name varchar(120) not null`
- `effective_from date not null`
- `effective_to date null`
- `is_active boolean not null default true`
- `created_at timestamptz not null`

### `student_curriculum_assignments`
- `id uuid pk`
- `student_id uuid fk students(id)`
- `curriculum_version_id uuid fk curriculum_versions(id)`
- `assigned_at timestamptz not null`
- `is_active boolean not null default true`

### `course_equivalences`
- `id uuid pk`
- `source_course_id uuid fk courses(id)`
- `target_course_id uuid fk courses(id)`
- `equivalence_type varchar(20) not null` (`Total`, `Parcial`)
- `effective_from date not null`
- `effective_to date null`
- `is_active boolean not null default true`
- `notes varchar(255) null`

### `enrollments`
- `id uuid pk`
- `student_id uuid fk students(id)`
- `course_offering_id uuid fk course_offerings(id)`
- `status varchar(20) not null` (`Activa`, `Cerrada`)
- `enrolled_at timestamptz not null`
- `closed_at timestamptz null`

### `grade_entries`
- `id uuid pk`
- `course_offering_id uuid fk course_offerings(id)`
- `student_id uuid fk students(id)`
- `draft_grade numeric(5,2) null`
- `published_grade numeric(5,2) null`
- `is_published boolean not null default false`
- `updated_by uuid fk users(id)`
- `updated_at timestamptz not null`

### `academic_records`
- `id uuid pk`
- `student_id uuid fk students(id)`
- `course_id uuid fk courses(id)`
- `period varchar(20) not null`
- `credits smallint null`
- `grade numeric(5,2) not null`
- `result_status varchar(20) not null` (`Aprobado`, `Reprobado`)

### `report_requests`
- `id uuid pk`
- `student_id uuid fk students(id)`
- `request_type varchar(40) not null` (`Certificacion de cursos`, `Cierre de pensum`)
- `requested_at timestamptz not null`
- `issued_at timestamptz null`
- `download_url varchar(512) null`

### `teacher_availability_snapshots`
- `id uuid pk`
- `professor_id uuid fk professors(id)`
- `status varchar(20) not null` (`Libre`, `En clase`, `Ocupado`)
- `speciality varchar(120) null`
- `captured_at timestamptz not null`

## 10.2 Constraints e indices minimos

- `unique(student_id, course_offering_id)` en `enrollments`.
- `unique(career_id, version_code)` en `curriculum_versions`.
- `unique(student_id) filter (is_active = true)` en `student_curriculum_assignments`.
- `check(source_course_id <> target_course_id)` en `course_equivalences`.
- `check (draft_grade between 0 and 100)` y `check (published_grade between 0 and 100)`.
- `check (seats_taken >= 0 and seats_taken <= seats_total)`.
- Indices sugeridos:
  - `course_offerings(status)`
  - `course_offerings(career_id, status)`
  - `curriculum_versions(career_id, is_active)`
  - `student_curriculum_assignments(student_id, is_active)`
  - `curriculum_courses(curriculum_version_id)`
  - `course_equivalences(source_course_id, target_course_id, is_active)`
  - `enrollments(student_id)`
  - `enrollments(course_offering_id)`
  - `grade_entries(course_offering_id)`
  - `report_requests(requested_at)`
  - `students(career_id)`

---

## 11. DTOs y contratos de request/response

## 11.1 Auth DTOs

### `LoginRequestDto`
- `usernameOrEmail: string`
- `password: string`

### `AuthSessionDto`
- `accessToken: string`
- `refreshToken: string`
- `expiresIn: int`
- `user: CurrentUserDto`

### `CurrentUserDto`
- `userId: string`
- `role: string`
- `displayName: string`
- `profileId: string`
- `careerId: string?`

## 11.2 Student DTOs

### `StudentProfileDto`
- `studentId`
- `fullName`
- `careerId?`
- `careerName?`
- `program`
- `faculty`
- `semester`
- `email`
- `phone`

### `StudentDashboardDto`
- `averageGrade`
- `approvedCourses`
- `pendingCourses`
- `activeCoursesCount`
- `activeCourses: StudentActiveCourseDto[]`
- `historyPreview: AcademicRecordRowDto[]`

### `StudentCurriculumProgressDto`
- `curriculumVersionId`
- `curriculumVersionCode`
- `totalRequired`
- `approved`
- `pending`
- `approvedCourseIds: string[]`
- `pendingCourseIds: string[]`
- `resolvedByEquivalences: string[]`

### `StudentAvailableCourseDto`
- `courseOfferingId`
- `offeringCode`
- `baseCourseCode`
- `courseName`
- `term`
- `careerName`
- `section`
- `professorName`
- `seatsTaken`
- `seatsTotal`
- `status`

### `StudentActiveCourseDto`
- `courseOfferingId`
- `offeringCode`
- `baseCourseCode`
- `courseName`
- `term`
- `careerName`
- `section`
- `professorName`
- `seatsTaken`
- `seatsTotal`
- `status`

### `AcademicRecordRowDto`
- `code`
- `subject`
- `period`
- `credits`
- `grade`
- `status`

### `CreateReportRequestDto`
- `requestType` (`Certificacion de cursos` | `Cierre de pensum`)

## 11.3 Professor DTOs

### `ProfessorDashboardDto`
- `stats: { activeCourses, pendingGrades, students }`
- `classes: ProfessorClassDto[]`

### `ProfessorClassDto`
- `classId` (alias de `courseOfferingId` para continuidad)
- `courseOfferingId`
- `offeringCode`
- `baseCourseCode`
- `title`
- `term`
- `status`
- `gradesPublished`
- `studentsCount`
- `progressPercent`

### `ProfessorClassStudentsDto`
- `classId`
- `students: ProfessorClassStudentDto[]`

### `ProfessorClassStudentDto`
- `studentId`
- `studentName`
- `careerName`
- `gradeDraft?`
- `gradePublished?`

### `UpsertDraftGradesRequestDto`
- `grades: [{ studentId, grade }]`

### `UpsertDraftGradesResultDto`
- `classId`
- `updatedCount`

### `PublishGradesResultDto`
- `classId`
- `publishedAt`
- `gradesPublished: true`

### `CloseClassResultDto`
- `classId`
- `closedAt`
- `status: Cerrado`

### `ProfessorStudentSummaryDto`
- `studentId`
- `name`
- `career`
- `approvedAverage`

## 11.4 Director DTOs

### `DirectorDashboardDto`
- `stats: { totalStudents, totalProfessors, activeClasses, pendingClasses }`
- `capacity: { activeStudents, pendingCapacity, totalCapacity }`
- `classes: DirectorCourseDto[]`
- `teacherAvailability: TeacherAvailabilityDto[]`

### `DirectorCourseDto`
- `courseOfferingId`
- `offeringCode`
- `baseCourseCode`
- `courseName`
- `careerName`
- `term`
- `section`
- `professorName`
- `seatsTaken`
- `seatsTotal`
- `status`

### `CreateDirectorCourseRequestDto`
- `baseCourseId`
- `careerId`
- `section`
- `term`
- `professorId?`
- `capacity`
- `offeringCode?`

### `PublishCourseResultDto`
- `courseOfferingId`
- `previousStatus`
- `currentStatus`
- `publishedAt`

### `ActivateCourseResultDto`
- `courseOfferingId`
- `previousStatus`
- `currentStatus`
- `activatedAt`

### `CloseCourseResultDto`
- `courseOfferingId`
- `previousStatus`
- `currentStatus`
- `closedAt`

### `AssignProfessorRequestDto`
- `professorId`

### `AssignProfessorResultDto`
- `courseOfferingId`
- `professorId`
- `assignedAt`

### `DirectorProfessorDto`
- `professorId`
- `name`
- `department`
- `loadAssigned`
- `loadMax` (5)

### `DirectorStudentDto`
- `studentId`
- `name`
- `program`
- `semester`
- `average0to100`

### `ReportRequestDto`
- `requestId`
- `studentName`
- `requestType`
- `requestedAt`
- `issuedAt?`
- `downloadUrl?`

### `TeacherAvailabilityDto`
- `professorId`
- `name`
- `speciality`
- `status`

### `CurriculumVersionDto`
- `curriculumVersionId`
- `careerId`
- `careerName`
- `versionCode`
- `displayName`
- `effectiveFrom`
- `effectiveTo?`
- `isActive`

### `StudentCurriculumAssignmentDto`
- `studentId`
- `curriculumVersionId`
- `assignedAt`
- `isActive`

### `CourseEquivalenceDto`
- `equivalenceId`
- `sourceCourseId`
- `sourceCourseCode`
- `targetCourseId`
- `targetCourseCode`
- `equivalenceType`
- `effectiveFrom`
- `effectiveTo?`
- `isActive`

---

## 12. Errores estandarizados y codigos funcionales

Codigos HTTP base:
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `422 Unprocessable Entity`

Codigos funcionales sugeridos:
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_INVALID_TOKEN`
- `AUTH_TOKEN_EXPIRED`
- `AUTH_REFRESH_INVALID`
- `AUTH_REFRESH_EXPIRED`
- `FORBIDDEN_ROLE`
- `STUDENT_PROFILE_NOT_FOUND`
- `STUDENT_WITHOUT_CAREER`
- `CURRICULUM_VERSION_NOT_ASSIGNED`
- `CURRICULUM_VERSION_NOT_FOUND`
- `CURRICULUM_VERSION_ALREADY_EXISTS`
- `CURRICULUM_ASSIGNMENT_CONFLICT`
- `CAREER_NOT_FOUND`
- `STUDENT_ALREADY_HAS_CAREER`
- `COURSE_NOT_FOUND`
- `COURSE_OFFERING_NOT_FOUND`
- `COURSE_EQUIVALENCE_INVALID`
- `COURSE_EQUIVALENCE_DUPLICATE`
- `COURSE_OFFERING_CODE_ALREADY_EXISTS`
- `COURSE_OFFERING_NOT_PUBLISHED`
- `COURSE_OFFERING_CAPACITY_EXHAUSTED`
- `COURSE_OFFERING_ALREADY_PUBLISHED`
- `COURSE_OFFERING_ALREADY_ACTIVE`
- `COURSE_OFFERING_ALREADY_CLOSED`
- `ENROLLMENT_ALREADY_EXISTS`
- `CAREER_MISMATCH`
- `GRADE_OUT_OF_RANGE`
- `GRADE_EDIT_LOCKED`
- `GRADES_ALREADY_PUBLISHED`
- `GRADES_INCOMPLETE`
- `COURSE_CANNOT_CLOSE_UNTIL_GRADES_PUBLISHED`
- `CLASS_ALREADY_CLOSED`
- `REPORT_TYPE_INVALID`

---

## 13. Paginacion, filtros y ordenamiento

Reglas comunes para listados:
- Query params:
  - `page` (default 1)
  - `pageSize` (default 10, max 100)
  - `search` opcional
  - `sortBy` opcional
  - `sortOrder` opcional (`asc`, `desc`)

Filtros esperados por modulo:
- Cursos director: `status`, `careerId`.
- Solicitudes director: `type`.
- Cursos estudiante disponibles/activos: `search`.
- Clases profesor: `status` (opcional futuro).

---

## 14. Guia futura de implementacion con EF Core code-first

Nota: esta seccion es guia para fase de implementacion; no se implementa ahora.

## 14.1 Estrategia general

1. El dominio y las entidades son la fuente de verdad.
2. EF Core code-first generara el esquema con migraciones.
3. Cada cambio de dominio persistible debe llegar con migracion propia.
4. Motor objetivo: PostgreSQL (`Npgsql`).

## 14.2 Configuracion mixta (Data Annotations + Fluent API)

Uso recomendado:

- Data Annotations para reglas simples:
  - `[Required]`
  - `[MaxLength]`
  - `[Range]`
  - `[EmailAddress]`

- Fluent API para reglas avanzadas:
  - relaciones 1-N y N-N
  - `HasIndex(...).IsUnique()`
  - `HasCheckConstraint(...)`
  - precision decimal
  - delete behaviors (`Restrict`, `Cascade`)
  - conversiones de enums

## 14.3 Convenciones de modelado

1. Entidades en `Domain`.
2. `DbContext` y `EntityTypeConfiguration` en `Infrastructure`.
3. Una clase `IEntityTypeConfiguration<T>` por entidad.
4. Evitar logica de negocio compleja dentro de `DbContext`.

## 14.4 Migraciones y despliegue

Convenciones recomendadas:
- Nombre: `YYYYMMDDHHmm_Feature_Change`.
- Una migracion por cambio logico cohesivo.
- No mezclar refactors masivos con cambios funcionales en la misma migracion.

Comandos de referencia:

```bash
dotnet ef migrations add 202602191900_InitialAcademicFlow \
  --project src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure \
  --startup-project src/Backend/Api/ProcesosAcademicos.Api


dotnet ef database update \
  --project src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure \
  --startup-project src/Backend/Api/ProcesosAcademicos.Api
```

Para ambientes:
- Generar script SQL versionado por release.
- Revisar script antes de ejecutar en staging/prod.
- Definir plan de rollback cuando haya cambios destructivos.

## 14.5 Reglas de consistencia a preservar en implementacion

- No permitir inscripcion sin carrera.
- No permitir inscripcion en curso cerrado/no publicado/sin cupo.
- No permitir cierre de curso sin publicar notas.
- Bloquear edicion de notas despues de publicar.
- Mantener calculo de aprobado/reprobado con umbral 61.

---

## 15. Orden recomendado de implementacion backend

1. Auth base (login, me, refresh, logout).
2. Catalogos y perfiles (`careers`, `students`, `professors`).
3. Cursos + course offerings + curriculum.
4. Endpoints estudiante (profile/dashboard/available/enroll/active/record).
5. Endpoints profesor (classes/students/grades draft/publish/close).
6. Endpoints director (dashboard/courses/create/publish/activate/close/assign-professor/professors/students/report-requests).
7. Endurecimiento de validaciones y codigos de error.
8. Integracion frontend por modulo con feature flags.

---

## 16. Checklist de done para integracion real

- [ ] Auth completa operativa en `/api/v1/auth/*`.
- [ ] Todos los endpoints MVP del documento disponibles.
- [ ] Envelope estandar aplicado en 100% de endpoints.
- [ ] Errores funcionales implementados con codigos consistentes.
- [ ] Paginacion uniforme en todos los listados.
- [ ] Reglas de negocio criticas cubiertas por tests.
- [ ] Migraciones code-first ejecutables en PostgreSQL.
- [ ] Frontend reemplaza datos mock por API sin romper flujos por rol.
- [ ] No existen contradicciones entre el contrato y el comportamiento real de UI.

---

## 17. Ejemplo narrativo de cursos por periodo

Escenario:
- Existe el curso base `MAT-102` (Matematicas II) en catalogo (`courses`).
- En 2025-2 se crea una oferta `MAT-102` seccion A con profesor X.
- En 2026-1 se crea otra oferta `MAT-102` seccion B con profesor Y.

Comportamiento esperado:
- El estudiante se inscribe y aprueba la oferta de 2025-2.
- En su progreso de pensum, `MAT-102` queda como aprobado.
- Cuando llega 2026-1, la nueva oferta puede existir para otros estudiantes, pero ese estudiante ya no la ve como pendiente.

Caso con cambio de codigo:
- Si `MAT-102` pasa a `MAT-202`, se registra una equivalencia activa en `course_equivalences`.
- El sistema reconoce el aprobado historico y mantiene el curso como cumplido en el pensum.
