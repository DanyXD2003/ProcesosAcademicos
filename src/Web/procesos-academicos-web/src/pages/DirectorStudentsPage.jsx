import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 6;

export default function DirectorStudentsPage() {
  const { directorProfile, directorStudents } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(directorStudents.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const students = directorStudents.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Exportar CSV
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Enviar notificacion
          </button>
        </>
      }
      navItems={getDirectorSidebarItems()}
      profile={directorProfile}
      roleLabel="Director"
      searchPlaceholder="Buscar estudiante"
      subtitle="Seguimiento de rendimiento estudiantil"
      title="Estudiantes"
    >
      <SectionCard
        right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
        subtitle="Vista de alumnos con indicadores academicos"
        title="Directorio de estudiantes"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Nombre</th>
                <th className="px-3 py-3">Programa</th>
                <th className="px-3 py-3">Semestre</th>
                <th className="px-3 py-3">Promedio (0-100)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.id}>
                  <td className="px-3 py-3 font-semibold text-white">{student.id}</td>
                  <td className="px-3 py-3">{student.name}</td>
                  <td className="px-3 py-3 text-slate-300">{student.program}</td>
                  <td className="px-3 py-3 text-slate-300">{student.semester}</td>
                  <td className="px-3 py-3 text-slate-300">{student.average}</td>
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
