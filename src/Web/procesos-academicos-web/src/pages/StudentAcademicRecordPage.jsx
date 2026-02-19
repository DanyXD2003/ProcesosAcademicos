import { Navigate } from "react-router-dom";
import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getStudentSidebarItems } from "../navigation/sidebarItems";
import { appPaths, withPage } from "../router/paths";

const PAGE_SIZE = 6;

export default function StudentAcademicRecordPage() {
  const { profile, studentCareer, studentHistory } = useAcademicDemo();

  if (!studentCareer) {
    return <Navigate replace to={withPage(appPaths.dashboard.student)} />;
  }

  const { page, totalPages, setPage } = usePaginationQuery(studentHistory.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const rows = studentHistory.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
          Descargar certificacion de cursos
        </button>
      }
      navItems={getStudentSidebarItems()}
      profile={profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar asignatura"
      subtitle="Historial de cursos aprobados y reprobados"
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
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={row.id}>
                  <td className="px-3 py-3 font-semibold text-white">{row.code}</td>
                  <td className="px-3 py-3">{row.subject}</td>
                  <td className="px-3 py-3 text-slate-300">{row.period}</td>
                  <td className="px-3 py-3 text-slate-300">{row.credits}</td>
                  <td className="px-3 py-3 font-semibold text-sky-200">{row.grade}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                        row.status === "Aprobado" ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
                      }`}
                    >
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
