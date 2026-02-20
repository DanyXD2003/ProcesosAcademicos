import { useEffect, useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

export default function DirectorReportsPage() {
  const { directorProfile, getDirectorReportRequestsPage } = useAcademicDemo();
  const [page, setPage] = useState(1);
  const pagedReports = getDirectorReportRequestsPage({ page, pageSize: PAGE_SIZE });
  const reports = pagedReports.items;
  const totalPages = pagedReports.pagination.totalPages;

  useEffect(() => {
    setPage((current) => Math.max(1, Math.min(current, totalPages)));
  }, [totalPages]);

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
                <th className="px-3 py-3">Fecha descarga</th>
                <th className="px-3 py-3">Descargas</th>
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
                  <td className="px-3 py-3 text-slate-300">{report.downloadedAt || "-"}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-200">
                      {report.downloadsCount ?? 0}
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
