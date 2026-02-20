import { useEffect, useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

export default function ProfessorStudentsPage() {
  const { getProfessorStudentsSummaryPage, professorProfile } = useAcademicDemo();
  const [page, setPage] = useState(1);
  const pagedStudents = getProfessorStudentsSummaryPage({ page, pageSize: PAGE_SIZE });
  const students = pagedStudents.items;
  const totalPages = pagedStudents.pagination.totalPages;

  useEffect(() => {
    setPage((current) => Math.max(1, Math.min(current, totalPages)));
  }, [totalPages]);

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
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.studentId}>
                  <td className="px-3 py-3 font-semibold text-white">{student.studentCode}</td>
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
