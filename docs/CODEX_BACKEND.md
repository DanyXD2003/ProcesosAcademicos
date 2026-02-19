# CODEX_BACKEND.md

## 1. Proposito

Este documento es un playbook operativo para que una IA implemente el backend de `ProcesosAcademicos`.
No redefine el producto: usa como fuente funcional principal `docs/INTEGRACION_FRONT_BACK.md`.

Regla base:
- Si hay conflicto, prevalece `docs/INTEGRACION_FRONT_BACK.md`.

---

## 2. Reglas de ejecucion para IA

1. No modificar frontend en esta fase.
2. Implementar backend incremental por capas DDD existentes:
- Domain
- Application
- Infrastructure
- Api
3. Mantener API versionada en `/api/v1`.
4. Usar envelope estandar (`data`, `meta`, `errors`) en todas las respuestas.
5. Implementar EF Core code-first con PostgreSQL.
6. Configuracion mixta:
- Data Annotations para validaciones simples.
- Fluent API para relaciones, indices, constraints y conversiones.
7. No saltar pruebas minimas por flujo.

---

## 3. Contexto inicial del repositorio

Estructura backend esperada:
- `src/Backend/Core/ProcesosAcademicos.Domain`
- `src/Backend/Application/ProcesosAcademicos.Application`
- `src/Backend/Infrastructure/ProcesosAcademicos.Infrastructure`
- `src/Backend/Api/ProcesosAcademicos.Api`

Referencia funcional obligatoria:
- `docs/INTEGRACION_FRONT_BACK.md`

---

## 4. Fase 0 - Preflight

Objetivo:
- Dejar proyecto compilando con configuracion minima para iniciar implementacion.

Checklist:
- [ ] Restaurar paquetes en solucion.
- [ ] Configurar paquete Npgsql EF Core en Infrastructure/Api.
- [ ] Definir configuracion base de appsettings para cadena de conexion PostgreSQL.
- [ ] Verificar build de solucion sin errores.

Criterio de salida:
- `dotnet build` exitoso en solucion.

---

## 5. Fase 1 - Dominio

Objetivo:
- Crear modelo de dominio que soporte flujos por rol y reglas academicas.

Entidades minimas:
- User, Role, UserRole
- Career
- StudentProfile
- ProfessorProfile
- Course (catalogo base)
- CourseOffering (instancia por periodo)
- CurriculumVersion
- CurriculumCourse
- StudentCurriculumAssignment
- CourseEquivalence
- Enrollment
- GradeEntry
- AcademicRecord
- ReportRequest
- TeacherAvailabilitySnapshot

Enums minimos:
- CourseOfferingStatus (`Borrador`, `Publicado`, `Activo`, `Cerrado`)
- EquivalenceType (`Total`, `Parcial`)

Invariantes obligatorias:
- Aprobacion con nota >= 61.
- No cerrar curso sin publicar notas.
- Al cerrar una oferta, consolidar historial academico por oferta y cerrar inscripciones asociadas.
- No editar notas despues de publicar.
- No inscribir estudiante sin carrera activa.
- Pendientes por pensum de cohorte + equivalencias.
- Solicitudes de documentos con emision automatica (sin estado visible en UI).
- Reportes del director en modo solo lectura (sin accion de descarga en tabla).

Criterio de salida:
- Entidades y enums definidos, compilando en Domain.

---

## 6. Fase 2 - Application

Objetivo:
- Implementar casos de uso/contratos para endpoints MVP.

Estructura sugerida:
- `Commands/Queries` por modulo (Auth, Student, Professor, Director)
- `DTOs` request/response alineados a integracion
- `Validators` por comando
- `Abstractions` de repositorios y servicios de infraestructura

Casos minimos por modulo:
- Auth:
  - login, refresh, logout, me
- Student:
  - profile, career-enrollment, dashboard, available courses, active courses, enroll por `offeringId`, academic-record, report-request, curriculum-progress
- Professor:
  - dashboard, classes, class-students (classId == courseOfferingId), save draft grades, publish grades, close class, students summary
- Director:
  - dashboard, courses list/create/publish/activate/close/assign-professor, professors list, students list, report-requests list, teacher-availability, curriculum-versions, curriculum-assignment, course-equivalences

Criterio de salida:
- Handlers y contratos compilando, desacoplados de persistencia concreta.

---

## 7. Fase 3 - Infrastructure (EF Core code-first)

Objetivo:
- Persistencia real en PostgreSQL con EF Core.

Acciones:
1. Crear `DbContext` principal.
2. Configurar `IEntityTypeConfiguration<T>` por entidad.
3. Aplicar DataAnnotations en entidades para:
- Required
- MaxLength
- Range
- formatos basicos
4. Aplicar Fluent API para:
- relaciones
- claves compuestas
- unique indexes
- check constraints
- precision decimal
- conversion de enums
- delete behaviors

Constraints minimos obligatorios:
- `UNIQUE(student_id, course_offering_id)` en enrollments
- `CHECK grade BETWEEN 0 AND 100` en notas
- `CHECK seats_taken <= seats_total`
- `UNIQUE(career_id, version_code)` en curriculum_versions
- asignacion unica activa de curriculum por estudiante
- `CHECK(source_course_id <> target_course_id)` en equivalencias

Criterio de salida:
- Infraestructura persiste correctamente y respeta invariantes de DB.

---

## 8. Fase 4 - Migraciones

Objetivo:
- Generar esquema evolutivo reproducible.

Orden recomendado:
1. Base de seguridad y perfiles (`users`, `roles`, `careers`, `students`, `professors`)
2. Cursos y ofertas (`courses`, `course_offerings`)
3. Pensum por cohorte (`curriculum_versions`, `curriculum_courses`, `student_curriculum_assignments`)
4. Inscripciones y notas (`enrollments`, `grade_entries`, `academic_records`)
5. Reportes y disponibilidad (`report_requests`, `teacher_availability_snapshots`)
6. Equivalencias (`course_equivalences`)

Convencion de nombres:
- `YYYYMMDDHHmm_Feature_Change`

Criterio de salida:
- `dotnet ef database update` exitoso en entorno local.

---

## 9. Fase 5 - API

Objetivo:
- Exponer endpoints `/api/v1` y autorizacion por rol.

Reglas:
- Controllers versionados.
- Politicas de auth por rol.
- Respuesta envelope estandar en exito y error.
- Validacion de entrada consistente.
- Mapeo de errores funcionales definidos en integracion.

Criterio de salida:
- Endpoints MVP disponibles y consistentes con el documento de integracion.

---

## 10. Fase 6 - Pruebas minimas

Pruebas de dominio/aplicacion:
- Regla de aprobacion 61+
- Bloqueo de edicion post-publicacion
- Bloqueo de cierre sin publicacion
- Calculo pendientes por cohorte
- Resolucion de equivalencias

Pruebas API/integracion:
- Auth y autorizacion por rol
- Enroll con carrera valida usando `offeringId`
- Rechazo por cupo/carrera/duplicado
- Flujo profesor (draft -> publish -> close)
- Flujo director de cursos (create -> publish -> activate -> assign-professor -> close con bloqueo por notas)
- Validar que `close` actualiza estado de oferta, cierre de inscripciones y consolidacion academica.
- Flujo director de pensum/equivalencias

Criterio de salida:
- Suite minima verde en CI local.

---

## 11. Criterios de aceptacion por fase

Fase 0:
- Build limpio.

Fase 1:
- Modelo de dominio completo y consistente.

Fase 2:
- Casos de uso MVP listos y validados.

Fase 3:
- Mapping EF completo con constraints.

Fase 4:
- Migraciones aplicables y reproducibles.

Fase 5:
- Endpoints `/api/v1` responden segun contrato.

Fase 6:
- Pruebas clave de negocio y API en verde.

---

## 12. Guardrails

1. No mezclar cambios de frontend con backend.
2. No romper contrato de `docs/INTEGRACION_FRONT_BACK.md`.
3. No usar IDs de negocio como PK tecnica.
4. No calcular pendientes por oferta anual.
5. No omitir equivalencias en progreso academico.
6. No usar `courseId` como identidad operativa de inscripcion; usar `courseOfferingId` (`offeringId` en endpoint).

---

## 13. Prompt final para IA (copiar/pegar)

```text
Lee primero docs/INTEGRACION_FRONT_BACK.md y docs/CODEX_BACKEND.md.
Implementa el backend completo por fases (0 a 6) en la solucion .NET existente, respetando DDD por capas.
Usa PostgreSQL + EF Core code-first, DataAnnotations para validaciones simples y Fluent API para relaciones/constraints.
Manten API versionada en /api/v1 y envelope estandar (data/meta/errors).
No modifiques frontend.
Aplica migraciones en orden recomendado.
Entrega por fase: cambios realizados, archivos tocados, pruebas ejecutadas y resultados.
No avances a la siguiente fase si la actual no cumple criterios de aceptacion.
```
