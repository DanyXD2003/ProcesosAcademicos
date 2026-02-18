import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { professorDashboardMock } from "../mocks/professor.mock";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

function riskClass(risk) {
  if (risk === "Bajo") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (risk === "Medio") {
    return "bg-amber-500/20 text-amber-200";
  }

  return "bg-rose-500/20 text-rose-200";
}

export default function ProfessorStudentsPage() {
  const { page, totalPages, setPage } = usePaginationQuery(professorDashboardMock.studentsRoster.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const students = professorDashboardMock.studentsRoster.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
          Exportar seguimiento
        </button>
      }
      navItems={getProfessorSidebarItems()}
      profile={professorDashboardMock.profile}
      roleLabel="Profesor"
      searchPlaceholder="Buscar estudiante"
      subtitle="Seguimiento de rendimiento por alumno"
      title="Estudiantes"
    >
      <SectionCard right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>} title="Listado de estudiantes">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Nombre</th>
                <th className="px-3 py-3">Curso</th>
                <th className="px-3 py-3">Asistencia</th>
                <th className="px-3 py-3">Pendientes</th>
                <th className="px-3 py-3">Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.id}>
                  <td className="px-3 py-3 font-semibold text-white">{student.id}</td>
                  <td className="px-3 py-3">{student.name}</td>
                  <td className="px-3 py-3 text-slate-300">{student.course}</td>
                  <td className="px-3 py-3 text-slate-300">{student.attendance}</td>
                  <td className="px-3 py-3 text-slate-300">{student.pending}</td>
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
