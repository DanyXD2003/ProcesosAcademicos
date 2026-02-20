import { useEffect, useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

export default function DirectorProfessorsPage() {
  const { directorProfile, getDirectorProfessorsPage } = useAcademicDemo();
  const [page, setPage] = useState(1);
  const pagedProfessors = getDirectorProfessorsPage({ page, pageSize: PAGE_SIZE });
  const professors = pagedProfessors.items;
  const totalPages = pagedProfessors.pagination.totalPages;

  useEffect(() => {
    setPage((current) => Math.max(1, Math.min(current, totalPages)));
  }, [totalPages]);

  return (
    <DashboardLayout
      actions={
        <>
          <button
            className="cursor-not-allowed rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-400 opacity-80"
            disabled
            title="Proximamente"
            type="button"
          >
            Importar hoja (Proximamente)
          </button>
          <button
            className="cursor-not-allowed rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 opacity-80"
            disabled
            title="Proximamente"
            type="button"
          >
            Nuevo profesor (Proximamente)
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
                const loadAssigned = professor.loadAssigned ?? professor.load ?? 0;
                const loadMax = professor.loadMax && professor.loadMax > 0 ? professor.loadMax : 1;
                const loadPercent = Math.max(0, (loadAssigned / loadMax) * 100);
                const percent = Math.min(100, Math.round(loadPercent));
                const barColorClass = loadPercent >= 100 ? "bg-rose-400" : loadPercent >= 80 ? "bg-amber-400" : "bg-emerald-400";

                return (
                  <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={professor.professorId}>
                    <td className="px-3 py-3 font-semibold text-white">{professor.professorCode ?? professor.code ?? professor.professorId}</td>
                    <td className="px-3 py-3">{professor.name}</td>
                    <td className="px-3 py-3 text-slate-300">{professor.department}</td>
                    <td className="px-3 py-3">
                      <div className="w-44">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                          <span>{loadAssigned}/{loadMax} cursos</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${barColorClass}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="cursor-not-allowed rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 opacity-80"
                        disabled
                        title="Proximamente"
                        type="button"
                      >
                        Ver detalle (Proximamente)
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
