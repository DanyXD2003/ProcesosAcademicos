import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { getStudentSidebarItems } from "../navigation/sidebarItems";
import { appPaths, withPage } from "../router/paths";

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
            {course.career} | Seccion {course.section}
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
  const {
    availableCoursesForEnrollment,
    enrollStudentInCourse,
    pendingCurriculumCount,
    profile,
    studentActiveCourses,
    studentCareer
  } = useAcademicDemo();
  const [searchTerm, setSearchTerm] = useState("");

  if (!studentCareer) {
    return <Navigate replace to={withPage(appPaths.dashboard.student)} />;
  }

  const filteredAvailableCourses = useMemo(() => {
    const query = normalizeText(searchTerm);
    if (!query) {
      return availableCoursesForEnrollment;
    }

    return availableCoursesForEnrollment.filter((course) => normalizeText(`${course.code} ${course.course}`).includes(query));
  }, [availableCoursesForEnrollment, searchTerm]);

  const filteredActiveCourses = useMemo(() => {
    const query = normalizeText(searchTerm);
    if (!query) {
      return studentActiveCourses;
    }

    return studentActiveCourses.filter((course) => normalizeText(`${course.code} ${course.course}`).includes(query));
  }, [searchTerm, studentActiveCourses]);

  return (
    <DashboardLayout
      navItems={getStudentSidebarItems()}
      profile={profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar curso disponible"
      subtitle="Cursos segun carrera activa y pensum"
      title="Mis cursos"
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Carrera activa</p>
          <p className="mt-2 text-sm font-semibold text-white">{studentCareer}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Cursos pendientes</p>
          <p className="mt-2 text-3xl font-bold text-amber-200">{pendingCurriculumCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Cursos activos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-200">{studentActiveCourses.length}</p>
        </article>
      </section>

      <SectionCard subtitle="Cursos de tu carrera que puedes inscribir en esta etapa" title="Cursos disponibles para inscribirse">
        <label className="mb-4 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-400">Busqueda</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Codigo o nombre del curso"
            type="text"
            value={searchTerm}
          />
        </label>

        <div className="space-y-3">
          {filteredAvailableCourses.length > 0 ? (
            filteredAvailableCourses.map((course) => (
              <CourseRow
                action={() => enrollStudentInCourse(course.code)}
                actionLabel="Inscribirme"
                badgeClassName="bg-amber-500/20 text-amber-200"
                badgeLabel="Disponible"
                course={course}
                key={course.code}
              />
            ))
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
              No hay cursos disponibles para inscribirse con los filtros actuales.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        right={<span className="text-xs text-slate-400">Cursos en progreso del estudiante</span>}
        subtitle="Cursos ya inscritos"
        title="Mis cursos activos"
      >
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
              Aun no tienes cursos activos.
            </p>
          )}
        </div>
      </SectionCard>
    </DashboardLayout>
  );
}
