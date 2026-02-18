import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { studentDashboardMock } from "../mocks/student.mock";
import { getStudentSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 6;

export default function StudentAcademicRecordPage() {
  const { page, totalPages, setPage } = usePaginationQuery(studentDashboardMock.history.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const rows = studentDashboardMock.history.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
          Descargar historial PDF
        </button>
      }
      navItems={getStudentSidebarItems()}
      profile={studentDashboardMock.profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar asignatura"
      subtitle="Consolidado de cursos aprobados"
      title="Registro academico"
    >
      <SectionCard right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>} title="Historial de cursos">
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
              {rows.map((row) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={`${row.code}-${row.period}`}>
                  <td className="px-3 py-3 font-semibold text-white">{row.code}</td>
                  <td className="px-3 py-3">{row.subject}</td>
                  <td className="px-3 py-3 text-slate-300">{row.period}</td>
                  <td className="px-3 py-3 text-slate-300">{row.credits}</td>
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
      </SectionCard>
    </DashboardLayout>
  );
}
