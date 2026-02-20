import { useEffect, useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 6;

export default function DirectorStudentsPage() {
  const { directorProfile, getDirectorStudentsPage } = useAcademicDemo();
  const [page, setPage] = useState(1);
  const pagedStudents = getDirectorStudentsPage({ page, pageSize: PAGE_SIZE });
  const students = pagedStudents.items;
  const totalPages = pagedStudents.pagination.totalPages;

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
            Exportar CSV (Proximamente)
          </button>
          <button
            className="cursor-not-allowed rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 opacity-80"
            disabled
            title="Proximamente"
            type="button"
          >
            Enviar notificacion (Proximamente)
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
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.studentId}>
                  <td className="px-3 py-3 font-semibold text-white">{student.studentCode ?? student.code ?? student.studentId}</td>
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
