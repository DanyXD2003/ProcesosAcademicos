# Historico del sistema ProcesosAcademicos

## Proposito

Este documento cuenta, en lenguaje claro, como ha ido evolucionando el sistema.
No es una guia de codigo. Es una referencia para entender:
- que cambios se hicieron,
- por que se hicieron,
- como se comporta hoy el producto,
- que sigue en la siguiente fase.

---

## Resumen rapido del estado actual

Hoy la web ya esta organizada por roles y funciona como prototipo visual completo:
- Estudiante
- Profesor
- Director

El comportamiento por pantallas ya refleja reglas de negocio reales, pero aun usa datos locales.
La conexion con backend todavia no esta implementada.

---

## Linea de tiempo del proyecto

### Fase 1 - Base inicial backend por capas

Que se logro:
- Se preparo una estructura backend por capas (Domain, Application, Infrastructure, Api).
- Se dejaron proyectos y dependencias base listas para crecer.

Impacto:
- El equipo puede construir backend con una base ordenada.

### Fase 2 - Migracion del frontend a React

Que se logro:
- Se migraron vistas estaticas a SPA en React + Tailwind.
- Se habilito un login visual por rol.

Impacto:
- Se pudo validar experiencia de usuario antes de tener backend.

### Fase 3 - Navegacion modular por rol

Que se logro:
- Sidebar funcional por rol.
- Rutas separadas por modulos de Estudiante, Profesor y Director.

Impacto:
- El sistema paso de pantallas sueltas a una navegacion completa.

### Fase 4 - Limpieza del backend para reinicio controlado

Que se logro:
- Se limpio codigo funcional previo del backend.
- Se mantuvo la estructura por capas para arrancar implementacion desde cero.

Impacto:
- Se evita deuda tecnica temprana y se prepara una implementacion mas limpia.

### Fase 5 - Refactor funcional completo del frontend por roles (fase actual)

Objetivo de la fase:
- Ajustar el sistema a la operacion real esperada por rol.
- Eliminar pantallas/atributos que no aportaban al flujo actual.
- Dejar reglas visuales alineadas al negocio para integracion backend futura.

#### 5.1 Cambios principales para Estudiante

Antes:
- Entraba al dashboard con informacion general.

Ahora:
- Si no tiene carrera, primero ve una pantalla dedicada para inscribirse a una carrera.
- Solo despues de eso se habilita el resto del modulo.
- El indicador academico cambia a cursos aprobados/pendientes.
- En "Mis cursos", se priorizan cursos disponibles para inscribirse segun carrera/pensum.
- Perfil simplificado (sin docente asesor ni bloque de alertas).
- Registro academico mantiene historial de aprobados/reprobados.
- Se removio la seccion de configuracion del rol estudiante.

Impacto para el usuario:
- Flujo mas claro: primero carrera, luego vida academica.

#### 5.2 Cambios principales para Profesor

Antes:
- Tenia modulos extra (horario/reportes) y botones no esenciales para la fase.

Ahora:
- Se concentra en clases y estudiantes.
- Puede asignar notas desde modal por lista de alumnos.
- Publicar notas bloquea edicion.
- Cerrar curso solo se habilita luego de publicar notas.
- Dashboard y Mis clases comparten el mismo estado.
- Se eliminan pantallas de horario y reportes del flujo activo.

Impacto para el usuario:
- Menos ruido, mas foco en evaluacion y cierre de curso.

#### 5.3 Cambios principales para Director

Antes:
- Varias metricas mezclaban crecimiento y datos no necesarios para esta fase.

Ahora:
- Dashboard con indicadores operativos directos (alumnos, profesores, clases activas, clases pendientes).
- Gestion de clases sin atributo de horario.
- Bloque de capacidad mas entendible (alumnos activos, capacidad pendiente, capacidad total).
- En cursos:
  - sin modalidad,
  - sin columnas redundantes,
  - con accion de publicar integrada al estado.
- En profesores:
  - carga docente con barra de progreso sobre maximo 5 cursos.
- En estudiantes:
  - promedio en escala 0-100.
- En reportes:
  - historial de solicitudes de alumnos (certificacion/cierre de pensum).

Impacto para el usuario:
- Vista directiva mas accionable y menos administrativa.

#### 5.4 Cambios globales relevantes

- Se elimino el atributo horario como dato operativo de cursos en el flujo actual.
- Se formalizo ciclo de curso:
  - `Borrador -> Publicado -> Activo -> Cerrado`
- Se simplifico solicitud de documentos:
  - generacion y emision automatica sin estado visible en UI.
- Se mantuvo la app en modo datos locales (sin backend).

---

## Como funciona hoy el sistema (vista funcional)

## 1) Login

- El usuario selecciona rol para navegar al modulo correspondiente.

## 2) Modulo Estudiante

Rutas activas:
- `/dashboard/estudiante`
- `/dashboard/estudiante/mis-cursos`
- `/dashboard/estudiante/perfil`
- `/dashboard/estudiante/registro-academico`

Comportamiento clave:
- Sin carrera: solo inscripcion de carrera.
- Con carrera: dashboard completo y cursos por pensum.

## 3) Modulo Profesor

Rutas activas:
- `/dashboard/profesor`
- `/dashboard/profesor/mis-clases`
- `/dashboard/profesor/estudiantes`

Comportamiento clave:
- Gestion de notas por clase.
- Publicacion y cierre con reglas de bloqueo.

## 4) Modulo Director

Rutas activas:
- `/dashboard/director`
- `/dashboard/director/cursos`
- `/dashboard/director/profesores`
- `/dashboard/director/estudiantes`
- `/dashboard/director/reportes`

Comportamiento clave:
- KPIs operativos, gestion de cursos, carga docente y solicitudes de reportes.

---

## Lo que se elimino o simplifico en esta fase

- Configuracion del estudiante.
- Horario y reportes del profesor.
- Atributo horario en cursos para el flujo actual.
- Campos y tarjetas redundantes en dashboards.

---

## Impacto para la siguiente fase (integracion backend)

Este refactor deja el producto listo para conectar con API real.

Que ya quedo claro para backend:
- Flujos obligatorios por rol.
- Reglas de negocio que no deben cambiar.
- Estados de curso y estados de solicitud.
- Datos minimos que cada pantalla necesita.
- Identidad operativa por oferta (`courseOfferingId` / `offeringId`) y separacion de curso base vs oferta por periodo.

---

## Pendientes abiertos

1. Implementar backend real con auth, dominios y persistencia.
2. Reemplazar datos locales por llamadas API.
3. Agregar manejo de carga, error y reintentos en frontend conectado.
4. Validar rendimiento y consistencia en escenarios multiusuario.

---

## Registro de esta fase

- Fecha de cierre documental: 2026-02-19
- Tipo de cambio: Refactor funcional de experiencia por roles
- Estado: Completado en frontend (modo prototipo visual)
- Integracion backend: Pendiente de implementacion
