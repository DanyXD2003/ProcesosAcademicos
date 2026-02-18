import PaginationControls from "../components/common/PaginationControls";
import StatCard from "../components/common/StatCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { studentDashboardMock } from "../mocks/student.mock";
import { getStudentSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 4;

export default function StudentDashboardPage() {
  const { activeCourses } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(studentDashboardMock.history.length, PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const historyRows = studentDashboardMock.history.slice(startIndex, startIndex + PAGE_SIZE);

  const dashboardStats = studentDashboardMock.stats.map((item) => {
    if (item.label !== "Cursos en progreso") {
      return item;
    }

    return {
      ...item,
      change: activeCourses.length > 0 ? "Activo" : "Sin cursos",
      value: `${activeCourses.length}`
    };
  });

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Generar certificado
          </button>
          <button className="rounded-xl border border-sky-400/50 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/10" type="button">
            Cierre de pensum
          </button>
        </>
      }
      navItems={getStudentSidebarItems()}
      profile={studentDashboardMock.profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar curso o actividad"
      subtitle="Vista visual del portal del estudiante"
      title="Dashboard del estudiante"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((item) => (
          <StatCard change={item.change} changeTone={item.changeTone} icon={item.icon} key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Resumen rapido de cursos activos</h2>
          <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{activeCourses.length} activos</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => (
              <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4" key={course.code}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300">{course.code}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{course.course}</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-200">Activa</span>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Carrera: {course.career} | Profesor: {course.professor}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Seccion {course.section} | {course.modality} | Cupos {course.seats}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              Aun no tienes cursos activos. Ve a "Mis cursos" para inscribirte en cursos publicados.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Historial de cursos</h2>
          <span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">Codigo</th>
                <th className="px-3 py-3">Asignatura</th>
                <th className="px-3 py-3">Periodo</th>
                <th className="px-3 py-3">Creditos</th>
                <th className="px-3 py-3">Nota</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={`${row.code}-${row.period}`}>
                  <td className="px-3 py-3 font-semibold">{row.code}</td>
                  <td className="px-3 py-3">{row.subject}</td>
                  <td className="px-3 py-3 text-slate-400">{row.period}</td>
                  <td className="px-3 py-3">{row.credits}</td>
                  <td className="px-3 py-3 font-semibold text-sky-200">{row.grade}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-200">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 border-t border-slate-800 pt-4">
          <PaginationControls onPageChange={setPage} page={page} totalPages={totalPages} />
        </div>
      </section>
    </DashboardLayout>
  );
}
