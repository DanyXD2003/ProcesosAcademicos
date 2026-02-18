import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { professorDashboardMock } from "../mocks/professor.mock";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 6;

export default function ProfessorSchedulePage() {
  const { page, totalPages, setPage } = usePaginationQuery(professorDashboardMock.schedule.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const schedule = professorDashboardMock.schedule.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={<button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">Sincronizar calendario</button>}
      navItems={getProfessorSidebarItems()}
      profile={professorDashboardMock.profile}
      roleLabel="Profesor"
      searchPlaceholder="Buscar bloque horario"
      subtitle="Agenda semanal de clases"
      title="Horario"
    >
      <SectionCard right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>} title="Bloques programados">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">Dia</th>
                <th className="px-3 py-3">Hora</th>
                <th className="px-3 py-3">Clase</th>
                <th className="px-3 py-3">Aula</th>
                <th className="px-3 py-3">Modalidad</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={`${item.day}-${item.hour}-${index}`}>
                  <td className="px-3 py-3 font-semibold text-white">{item.day}</td>
                  <td className="px-3 py-3 text-slate-300">{item.hour}</td>
                  <td className="px-3 py-3">{item.className}</td>
                  <td className="px-3 py-3 text-slate-300">{item.room}</td>
                  <td className="px-3 py-3 text-slate-300">{item.modality}</td>
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
