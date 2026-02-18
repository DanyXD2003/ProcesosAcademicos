import { useMemo, useState } from "react";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { studentDashboardMock } from "../mocks/student.mock";
import { getStudentSidebarItems } from "../navigation/sidebarItems";

const STATUS_FILTERS = ["Todos", "Pendiente", "Activa"];

function normalizeText(value) {
  return value.toLowerCase().trim();
}

function CourseRow({ action, actionLabel, badgeClassName, badgeLabel, course }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300">{course.code}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{course.course}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {course.career} | Seccion {course.section} | {course.modality}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Profesor: {course.professor} | Cupos: {course.seats}
          </p>
        </div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${badgeClassName}`}>{badgeLabel}</span>
      </div>

      {action ? (
        <div className="mt-4">
          <button
            className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
            onClick={action}
            type="button"
          >
            {actionLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default function StudentMyCoursesPage() {
  const { activeCourses, careersCatalog, enrollStudentInCourse, pendingCourses, studentCareer } = useAcademicDemo();
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [careerFilter, setCareerFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const availableCareers = useMemo(() => ["Todas", ...careersCatalog], [careersCatalog]);

  const filteredPendingCourses = useMemo(() => {
    if (!studentCareer) {
      return [];
    }

    return pendingCourses.filter((course) => {
      if (statusFilter !== "Todos" && statusFilter !== "Pendiente") {
        return false;
      }

      if (careerFilter !== "Todas" && course.career !== careerFilter) {
        return false;
      }

      const query = normalizeText(searchTerm);

      if (!query) {
        return true;
      }

      return normalizeText(`${course.code} ${course.course}`).includes(query);
    });
  }, [careerFilter, pendingCourses, searchTerm, statusFilter, studentCareer]);

  const filteredActiveCourses = useMemo(() => {
    if (!studentCareer) {
      return [];
    }

    return activeCourses.filter((course) => {
      if (statusFilter !== "Todos" && statusFilter !== "Activa") {
        return false;
      }

      if (careerFilter !== "Todas" && course.career !== careerFilter) {
        return false;
      }

      const query = normalizeText(searchTerm);

      if (!query) {
        return true;
      }

      return normalizeText(`${course.code} ${course.course}`).includes(query);
    });
  }, [activeCourses, careerFilter, searchTerm, statusFilter, studentCareer]);

  return (
    <DashboardLayout
      actions={
        <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
          Ver reglamento
        </button>
      }
      navItems={getStudentSidebarItems()}
      profile={studentDashboardMock.profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar curso disponible"
      subtitle="Inscripcion visual a cursos publicados"
      title="Mis cursos"
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Carrera activa</p>
          <p className="mt-2 text-sm font-semibold text-white">{studentCareer || "Sin carrera asignada"}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Pendientes para inscribirme</p>
          <p className="mt-2 text-3xl font-bold text-amber-200">{pendingCourses.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Cursos activos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-200">{activeCourses.length}</p>
        </article>
      </section>

      {!studentCareer ? (
        <SectionCard subtitle="Debes tener una carrera registrada para inscribirte a cursos publicados" title="Inscripcion de carrera pendiente">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <p className="text-sm text-amber-100">
              No encontramos una carrera asociada a tu perfil. Completa tu inscripcion academica para habilitar cursos pendientes y activos.
            </p>
            <button className="mt-4 rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-300" type="button">
              Completar inscripcion de carrera
            </button>
          </div>
        </SectionCard>
      ) : (
        <>
          <SectionCard subtitle="Filtra por estado, carrera y texto de busqueda" title="Filtros de inscripcion">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-400">Estado</span>
                <select
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  onChange={(event) => setStatusFilter(event.target.value)}
                  value={statusFilter}
                >
                  {STATUS_FILTERS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-400">Carrera</span>
                <select
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  onChange={(event) => setCareerFilter(event.target.value)}
                  value={careerFilter}
                >
                  {availableCareers.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-400">Busqueda</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Codigo o nombre del curso"
                  type="text"
                  value={searchTerm}
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard
            right={<span className="text-xs text-slate-400">Cursos publicados y elegibles por carrera</span>}
            subtitle="Pendientes para inscribirme"
            title="Cursos pendientes"
          >
            <div className="space-y-3">
              {filteredPendingCourses.length > 0 ? (
                filteredPendingCourses.map((course) => (
                  <CourseRow
                    action={() => enrollStudentInCourse(course.code)}
                    actionLabel="Inscribirme"
                    badgeClassName="bg-amber-500/20 text-amber-200"
                    badgeLabel="Pendiente"
                    course={course}
                    key={course.code}
                  />
                ))
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  No hay cursos pendientes que cumplan con los filtros actuales.
                </p>
              )}
            </div>
          </SectionCard>

          <SectionCard right={<span className="text-xs text-slate-400">Cursos ya inscritos por el estudiante</span>} subtitle="Cursos activos" title="Mis cursos activos">
            <div className="space-y-3">
              {filteredActiveCourses.length > 0 ? (
                filteredActiveCourses.map((course) => (
                  <CourseRow
                    badgeClassName="bg-emerald-500/20 text-emerald-200"
                    badgeLabel="Activa"
                    course={course}
                    key={course.code}
                  />
                ))
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  No hay cursos activos que coincidan con los filtros.
                </p>
              )}
            </div>
          </SectionCard>
        </>
      )}
    </DashboardLayout>
  );
}
