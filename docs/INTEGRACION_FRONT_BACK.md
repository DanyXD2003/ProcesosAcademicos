# Integracion Front/Back - Inscripciones por Rol

## 1. Objetivo y alcance

Este documento define el contrato tecnico inicial para conectar el frontend actual (SPA React demo) con el backend futuro en .NET, sobre el flujo de:

- Publicacion de cursos por director.
- Inscripcion de cursos por estudiante.
- Regla de elegibilidad por carrera (match exacto).

Alcance:

- Incluye reglas de negocio visibles hoy en frontend.
- Propone endpoints, payloads y respuestas JSON de referencia.
- Define errores esperados, roles y orden sugerido de implementacion backend.

Fuera de alcance en esta iteracion:

- Pago de matricula.
- Aprobaciones manuales.
- Cupos avanzados, colisiones de horario y prerrequisitos complejos.

## 2. Reglas de negocio consumidas por frontend

Reglas vigentes:

- Ciclo de curso: `Borrador -> Publicado`.
- Solo `Director` puede publicar un curso.
- Solo `Estudiante` puede inscribirse a un curso.
- Estado de estudiante:
  - `Pendiente`: curso publicado, misma carrera, no inscrito.
  - `Activa`: curso inscrito por estudiante.
- Match exacto de carrera:
  - `carrera_estudiante === carrera_curso`.
- Si el estudiante no tiene carrera asignada:
  - Frontend muestra bloque informativo.
  - No muestra pendientes/activos de inscripcion.

## 3. Checklist tecnico de endpoints backend

### 3.1 Cursos publicados por carrera

- `GET /api/student/courses/published?career={career}`
- Auth: `Estudiante`
- Objetivo: traer cursos publicados elegibles por carrera.

### 3.2 Inscripcion de estudiante a curso

- `POST /api/student/enrollments`
- Auth: `Estudiante`
- Objetivo: registrar inscripcion y devolver estado `Activa`.

### 3.3 Cursos activos del estudiante

- `GET /api/student/enrollments/active`
- Auth: `Estudiante`
- Objetivo: poblar dashboard y pagina `/dashboard/estudiante/mis-cursos`.

### 3.4 Perfil academico del estudiante (incluye carrera)

- `GET /api/student/profile`
- Auth: `Estudiante`
- Objetivo: validar si tiene carrera asignada y aplicar reglas de elegibilidad.

### 3.5 Publicacion de curso por director

- `PATCH /api/director/courses/{courseId}/publish`
- Auth: `Director`
- Objetivo: mover curso de `Borrador` a `Publicado`.

## 4. Payloads y respuestas JSON de referencia

### 4.1 Curso (DTO sugerido)

```json
{
  "id": "CL-2026-001",
  "code": "CL-2026-001",
  "name": "Arquitectura de Software",
  "career": "Ingenieria de Sistemas",
  "section": "A",
  "modality": "Presencial",
  "seats": {
    "taken": 20,
    "total": 30
  },
  "professor": {
    "id": "PR-001",
    "name": "Dra. Helena Vance"
  },
  "publicationStatus": "Publicado"
}
```

### 4.2 `GET /api/student/profile` (200)

```json
{
  "studentId": "20230104",
  "fullName": "Juan Sebastian Perez",
  "career": "Ingenieria de Sistemas",
  "semester": 6,
  "email": "juan.perez@eduportal.edu"
}
```

### 4.3 `GET /api/student/courses/published?career=Ingenieria%20de%20Sistemas` (200)

```json
{
  "items": [
    {
      "id": "CL-2026-003",
      "code": "CL-2026-003",
      "name": "Redes Avanzadas",
      "career": "Ingenieria de Sistemas",
      "publicationStatus": "Publicado"
    }
  ],
  "total": 1
}
```

### 4.4 `POST /api/student/enrollments` (201)

Request:

```json
{
  "courseId": "CL-2026-003"
}
```

Response:

```json
{
  "enrollmentId": "ENR-90012",
  "studentId": "20230104",
  "courseId": "CL-2026-003",
  "status": "Activa",
  "enrolledAt": "2026-02-18T14:35:00Z"
}
```

### 4.5 `GET /api/student/enrollments/active` (200)

```json
{
  "items": [
    {
      "courseId": "CL-2026-001",
      "courseCode": "CL-2026-001",
      "courseName": "Arquitectura de Software",
      "status": "Activa"
    }
  ],
  "total": 1
}
```

### 4.6 `PATCH /api/director/courses/{courseId}/publish` (200)

```json
{
  "courseId": "CL-2026-002",
  "previousStatus": "Borrador",
  "currentStatus": "Publicado",
  "publishedAt": "2026-02-18T14:20:00Z"
}
```

## 5. Validaciones y errores esperados

Codigos sugeridos:

- `400 Bad Request`
  - Payload invalido.
- `401 Unauthorized`
  - Token ausente o invalido.
- `403 Forbidden`
  - Rol sin permiso.
- `404 Not Found`
  - Curso o estudiante no existe.
- `409 Conflict`
  - Curso ya publicado o ya inscrito.
- `422 Unprocessable Entity`
  - Carrera no coincide.

Mensajes sugeridos:

```json
{
  "code": "CAREER_MISMATCH",
  "message": "La carrera del estudiante no coincide con la carrera del curso."
}
```

```json
{
  "code": "COURSE_NOT_PUBLISHED",
  "message": "El curso no esta publicado y no puede inscribirse."
}
```

```json
{
  "code": "STUDENT_WITHOUT_CAREER",
  "message": "El estudiante no tiene carrera asignada."
}
```

## 6. Auth y roles

Roles requeridos:

- `Director`
  - Puede publicar cursos.
  - No puede inscribir estudiantes.
- `Profesor`
  - Sin permisos de publicacion/inscripcion en este flujo.
- `Estudiante`
  - Puede consultar publicados elegibles.
  - Puede inscribirse a cursos.
  - Puede consultar cursos activos.

Recomendacion de claims minimos:

- `sub` (id usuario)
- `role`
- `studentId` (cuando aplique)
- `career` (opcional, o derivable desde perfil)

## 7. Orden recomendado de implementacion backend

1. Modelo base de dominio y tablas:
- `Course`, `CoursePublication`, `StudentProfile`, `Enrollment`.

2. Endpoint de perfil de estudiante:
- `GET /api/student/profile`.

3. Endpoint de publicacion por director:
- `PATCH /api/director/courses/{courseId}/publish`.

4. Endpoint de cursos publicados por carrera:
- `GET /api/student/courses/published`.

5. Endpoint de inscripcion:
- `POST /api/student/enrollments`.

6. Endpoint de cursos activos:
- `GET /api/student/enrollments/active`.

7. Endurecer validaciones de negocio:
- Match de carrera.
- No duplicar inscripcion.
- No inscribir en curso no publicado.

8. Integracion final con frontend:
- Reemplazar estado mock/in-memory.
- Mantener contratos definidos aqui.

## 8. Nota de estado actual frontend

Actualmente el frontend opera en modo demo:

- Sin llamadas HTTP reales.
- Publicacion e inscripcion viven en memoria de sesion.
- Al recargar la pagina se pierde el estado temporal.

Cuando backend este listo, este documento es la base de contrato para conectar la funcionalidad real.
