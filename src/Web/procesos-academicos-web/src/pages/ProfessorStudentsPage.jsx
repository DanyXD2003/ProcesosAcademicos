import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

export default function ProfessorStudentsPage() {
  const { professorProfile, professorStudentsSummary } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(professorStudentsSummary.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const students = professorStudentsSummary.slice(start, start + PAGE_SIZE);

  return (
    <DashboardLayout
      navItems={getProfessorSidebarItems()}
      profile={professorProfile}
      roleLabel="Profesor"
      searchPlaceholder="Buscar estudiante"
      subtitle="Listado de alumnos asignados a tus cursos"
      title="Estudiantes"
    >
      <SectionCard right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>} title="Listado de estudiantes">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Nombre</th>
                <th className="px-3 py-3">Carrera</th>
                <th className="px-3 py-3">Promedio notas aprobadas</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.id}>
                  <td className="px-3 py-3 font-semibold text-white">{student.id}</td>
                  <td className="px-3 py-3">{student.name}</td>
                  <td className="px-3 py-3 text-slate-300">{student.career}</td>
                  <td className="px-3 py-3 text-slate-300">{student.approvedAverage}</td>
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
