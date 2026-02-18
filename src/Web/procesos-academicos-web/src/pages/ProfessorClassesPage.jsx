import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { professorDashboardMock } from "../mocks/professor.mock";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 3;

function statusClass(status) {
  if (status === "En curso") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (status === "Pendiente") {
    return "bg-amber-500/20 text-amber-200";
  }

  return "bg-slate-700 text-slate-300";
}

export default function ProfessorClassesPage() {
  const { page, totalPages, setPage } = usePaginationQuery(professorDashboardMock.classes.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const classes = professorDashboardMock.classes.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Descargar actas
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Nueva evaluacion
          </button>
        </>
      }
      navItems={getProfessorSidebarItems()}
      profile={professorDashboardMock.profile}
      roleLabel="Profesor"
      searchPlaceholder="Buscar clase"
      subtitle="Control de cursos por seccion"
      title="Mis clases"
    >
      <SectionCard right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>} title="Cursos asignados">
        <div className="space-y-4">
          {classes.map((course) => (
            <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5" key={course.title}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-sky-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-sky-200">Seccion {course.id}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusClass(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{course.schedule}</p>
                </div>
                <p className="text-sm text-slate-300">{course.students} estudiantes</p>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-slate-400">
                  <span>Progreso de calificaciones</span>
                  <span>{course.progress}%</span>
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
      </SectionCard>
    </DashboardLayout>
  );
}
