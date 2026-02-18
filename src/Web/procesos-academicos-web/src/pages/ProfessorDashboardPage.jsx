import PaginationControls from "../components/common/PaginationControls";
import StatCard from "../components/common/StatCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { professorDashboardMock } from "../mocks/professor.mock";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 2;

function statusTone(status) {
  if (status === "En curso") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (status === "Pendiente") {
    return "bg-amber-500/20 text-amber-200";
  }

  return "bg-slate-700 text-slate-300";
}

export default function ProfessorDashboardPage() {
  const { page, totalPages, setPage } = usePaginationQuery(professorDashboardMock.classes.length, PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentClasses = professorDashboardMock.classes.slice(startIndex, startIndex + PAGE_SIZE);

  const navItems = getProfessorSidebarItems();

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Notificaciones
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Nuevo reporte
          </button>
        </>
      }
      navItems={navItems}
      profile={professorDashboardMock.profile}
      roleLabel="Profesor"
      searchPlaceholder="Buscar curso, alumno o periodo"
      subtitle="Periodo academico 2026-1"
      title="Mis clases"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {professorDashboardMock.stats.map((item) => (
          <StatCard change={item.change} changeTone={item.changeTone} icon={item.icon} key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Lista de clases</h2>
          <span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>
        </div>

        <div className="space-y-4">
          {currentClasses.map((course) => (
            <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5" key={course.title}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-sky-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-sky-200">
                      Seccion {course.id}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusTone(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {course.schedule} | {course.students} estudiantes
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
                    Asignar notas
                  </button>
                  <button className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
                    Publicar notas
                  </button>
                  <button className="rounded-lg border border-rose-500/50 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/10" type="button">
                    Cerrar curso
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Progreso de calificaciones</span>
                  <span className="font-semibold text-sky-200">{course.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 border-t border-slate-800 pt-4">
          <PaginationControls onPageChange={setPage} page={page} totalPages={totalPages} />
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-bold text-white">Recordatorios</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {professorDashboardMock.reminders.map((item) => (
              <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-bold text-white">Actividad reciente</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {professorDashboardMock.activity.map((item) => (
              <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </DashboardLayout>
  );
}
