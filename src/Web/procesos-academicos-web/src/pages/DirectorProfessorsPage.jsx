import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

export default function DirectorProfessorsPage() {
  const { directorProfile, directorProfessors } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(directorProfessors.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const professors = directorProfessors.slice(start, start + PAGE_SIZE);

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
      profile={directorProfile}
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
                <th className="px-3 py-3 text-right">Accion</th>
              </tr>
            </thead>
            <tbody>
              {professors.map((professor) => {
                const percent = Math.min(100, Math.round((professor.load / 5) * 100));

                return (
                  <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={professor.id}>
                    <td className="px-3 py-3 font-semibold text-white">{professor.id}</td>
                    <td className="px-3 py-3">{professor.name}</td>
                    <td className="px-3 py-3 text-slate-300">{professor.department}</td>
                    <td className="px-3 py-3">
                      <div className="w-44">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                          <span>{professor.load}/5 cursos</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${professor.load >= 5 ? "bg-rose-400" : professor.load >= 4 ? "bg-amber-400" : "bg-emerald-400"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
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
