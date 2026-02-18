import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 6;

function riskClass(risk) {
  if (risk === "Bajo") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (risk === "Medio") {
    return "bg-amber-500/20 text-amber-200";
  }

  return "bg-rose-500/20 text-rose-200";
}

export default function DirectorStudentsPage() {
  const { page, totalPages, setPage } = usePaginationQuery(directorDashboardMock.studentsRegistry.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const students = directorDashboardMock.studentsRegistry.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Exportar CSV
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Enviar notificacion
          </button>
        </>
      }
      navItems={getDirectorSidebarItems()}
      profile={directorDashboardMock.profile}
      roleLabel="Director"
      searchPlaceholder="Buscar estudiante"
      subtitle="Seguimiento de rendimiento estudiantil sin gestion de inscripciones"
      title="Estudiantes"
    >
      <SectionCard
        right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
        subtitle="Vista de alumnos con indicadores de riesgo academico"
        title="Directorio de estudiantes"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Nombre</th>
                <th className="px-3 py-3">Programa</th>
                <th className="px-3 py-3">Semestre</th>
                <th className="px-3 py-3">GPA</th>
                <th className="px-3 py-3">Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.id}>
                  <td className="px-3 py-3 font-semibold text-white">{student.id}</td>
                  <td className="px-3 py-3">{student.name}</td>
                  <td className="px-3 py-3 text-slate-300">{student.program}</td>
                  <td className="px-3 py-3 text-slate-300">{student.semester}</td>
                  <td className="px-3 py-3 text-slate-300">{student.gpa}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${riskClass(student.risk)}`}>
                      {student.risk}
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
      </SectionCard>
    </DashboardLayout>
  );
}
