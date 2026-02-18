import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 4;

function reportStatusClass(status) {
  if (status === "Publicado") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (status === "Revision") {
    return "bg-amber-500/20 text-amber-200";
  }

  return "bg-slate-700 text-slate-200";
}

export default function DirectorReportsPage() {
  const { page, totalPages, setPage } = usePaginationQuery(directorDashboardMock.reportsRegistry.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const reports = directorDashboardMock.reportsRegistry.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Programar envio
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Crear reporte
          </button>
        </>
      }
      navItems={getDirectorSidebarItems()}
      profile={directorDashboardMock.profile}
      roleLabel="Director"
      searchPlaceholder="Buscar reporte"
      subtitle="Centro de reporteria institucional"
      title="Reportes"
    >
      <SectionCard
        right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
        subtitle="Listado de reportes publicados y pendientes"
        title="Biblioteca de reportes"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Reporte</th>
                <th className="px-3 py-3">Periodo</th>
                <th className="px-3 py-3">Responsable</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={report.id}>
                  <td className="px-3 py-3 font-semibold text-white">{report.id}</td>
                  <td className="px-3 py-3">{report.name}</td>
                  <td className="px-3 py-3 text-slate-300">{report.period}</td>
                  <td className="px-3 py-3 text-slate-300">{report.owner}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${reportStatusClass(report.status)}`}>
                      {report.status}
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
