import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

function statusClass(status) {
  if (status === "Disponible") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (status === "En clase") {
    return "bg-amber-500/20 text-amber-200";
  }

  return "bg-rose-500/20 text-rose-200";
}

export default function DirectorProfessorsPage() {
  const { page, totalPages, setPage } = usePaginationQuery(directorDashboardMock.professorsRegistry.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const professors = directorDashboardMock.professorsRegistry.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Importar hoja
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Nuevo profesor
          </button>
        </>
      }
      navItems={getDirectorSidebarItems()}
      profile={directorDashboardMock.profile}
      roleLabel="Director"
      searchPlaceholder="Buscar profesor"
      subtitle="Gestion de planta docente"
      title="Profesores"
    >
      <SectionCard
        right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
        subtitle="Control visual de carga docente por departamento"
        title="Directorio de profesores"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Nombre</th>
                <th className="px-3 py-3">Departamento</th>
                <th className="px-3 py-3">Carga</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Accion</th>
              </tr>
            </thead>
            <tbody>
              {professors.map((professor) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={professor.id}>
                  <td className="px-3 py-3 font-semibold text-white">{professor.id}</td>
                  <td className="px-3 py-3">{professor.name}</td>
                  <td className="px-3 py-3 text-slate-300">{professor.department}</td>
                  <td className="px-3 py-3 text-slate-300">{professor.load}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusClass(professor.status)}`}>
                      {professor.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
                      Ver detalle
                    </button>
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
