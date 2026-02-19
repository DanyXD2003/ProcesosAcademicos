import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

export default function DirectorReportsPage() {
  const { directorProfile, reportRequests } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(reportRequests.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const reports = reportRequests.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      navItems={getDirectorSidebarItems()}
      profile={directorProfile}
      roleLabel="Director"
      searchPlaceholder="Buscar solicitud"
      subtitle="Historial de reportes solicitados por alumnos"
      title="Reportes"
    >
      <SectionCard
        right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
        subtitle="Solo lectura: historial de solicitudes emitidas por el sistema"
        title="Historial de solicitudes"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Estudiante</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Fecha solicitud</th>
                <th className="px-3 py-3">Fecha emision</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={report.id}>
                  <td className="px-3 py-3 font-semibold text-white">{report.id}</td>
                  <td className="px-3 py-3">{report.studentName}</td>
                  <td className="px-3 py-3 text-slate-300">{report.requestType}</td>
                  <td className="px-3 py-3 text-slate-300">{report.requestedAt}</td>
                  <td className="px-3 py-3 text-slate-300">{report.issuedAt || "-"}</td>
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
