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

function OfferingRow({ action, actionLabel, badgeClassName, badgeLabel, course }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300">{course.offeringCode}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{course.course}</h3>
          <p className="mt-1 text-xs text-slate-400">
            Base: {course.baseCourseCode} | Seccion {course.section} | Termino {course.term}
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
    availableOfferingsForEnrollment,
    enrollStudentInOffering,
    pendingCurriculumCount,
    pendingCurriculumCourses,
    profile,
    studentActiveOfferings,
    studentCareer
  } = useAcademicDemo();
  const [searchTerm, setSearchTerm] = useState("");

  if (!studentCareer) {
    return <Navigate replace to={withPage(appPaths.dashboard.student)} />;
  }

  const filteredAvailableCourses = useMemo(() => {
    const query = normalizeText(searchTerm);
    if (!query) {
      return availableOfferingsForEnrollment;
    }

    return availableOfferingsForEnrollment.filter((course) =>
      normalizeText(`${course.offeringCode} ${course.baseCourseCode} ${course.course}`).includes(query)
    );
  }, [availableOfferingsForEnrollment, searchTerm]);

  const filteredActiveCourses = useMemo(() => {
    const query = normalizeText(searchTerm);
    if (!query) {
      return studentActiveOfferings;
    }

    return studentActiveOfferings.filter((course) =>
      normalizeText(`${course.offeringCode} ${course.baseCourseCode} ${course.course}`).includes(query)
    );
  }, [searchTerm, studentActiveOfferings]);

  return (
    <DashboardLayout
      navItems={getStudentSidebarItems()}
      profile={profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar oferta disponible"
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
          <p className="mt-2 text-3xl font-bold text-emerald-200">{studentActiveOfferings.length}</p>
        </article>
      </section>

      <SectionCard subtitle="Cursos base que aun debes aprobar para completar tu pensum" title="Cursos pendientes del pensum">
        <div className="grid gap-3 md:grid-cols-2">
          {pendingCurriculumCourses.length > 0 ? (
            pendingCurriculumCourses.map((course) => (
              <article className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3" key={course.courseId}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">{course.code}</p>
                <p className="mt-1 text-sm font-semibold text-white">{course.subject}</p>
                <p className="mt-1 text-xs text-slate-400">Semestre sugerido: {course.termNumber}</p>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-emerald-200">
              No tienes cursos pendientes en tu pensum actual.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard subtitle="Ofertas publicadas de tu carrera para el termino vigente" title="Cursos disponibles para inscribirse">
        <label className="mb-4 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-400">Busqueda</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Codigo de oferta, curso base o nombre"
            type="text"
            value={searchTerm}
          />
        </label>

        <div className="space-y-3">
          {filteredAvailableCourses.length > 0 ? (
            filteredAvailableCourses.map((course) => (
              <OfferingRow
                action={() => enrollStudentInOffering(course.offeringId)}
                actionLabel="Inscribirme"
                badgeClassName="bg-amber-500/20 text-amber-200"
                badgeLabel="Disponible"
                course={course}
                key={course.offeringId}
              />
            ))
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
              No hay ofertas disponibles para inscribirse con los filtros actuales.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        right={<span className="text-xs text-slate-400">Cursos en progreso del estudiante</span>}
        subtitle="Ofertas en las que ya estas inscrito"
        title="Mis cursos activos"
      >
        <div className="space-y-3">
          {filteredActiveCourses.length > 0 ? (
            filteredActiveCourses.map((course) => (
              <OfferingRow
                badgeClassName="bg-emerald-500/20 text-emerald-200"
                badgeLabel="Activa"
                course={course}
                key={course.offeringId}
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
