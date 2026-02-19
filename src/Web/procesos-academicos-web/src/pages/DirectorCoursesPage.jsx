import { useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import NewCourseModal from "../components/director/NewCourseModal";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

function publicationStatusClass(status) {
  if (status === "Activo") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (status === "Publicado") {
    return "bg-amber-500/20 text-amber-200";
  }

  if (status === "Borrador") {
    return "bg-slate-700 text-slate-200";
  }

  return "bg-rose-500/20 text-rose-200";
}

export default function DirectorCoursesPage() {
  const { careersCatalog, coursesCatalog, createDraftCourse, publishCourse } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(coursesCatalog.length, PAGE_SIZE);
  const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);
  const start = (page - 1) * PAGE_SIZE;
  const courses = coursesCatalog.slice(start, start + PAGE_SIZE);

  const publishedCourses = coursesCatalog.filter((item) => item.publicationStatus === "Publicado").length;
  const activeCourses = coursesCatalog.filter((item) => item.publicationStatus === "Activo").length;

  return (
    <>
      <DashboardLayout
        actions={
          <button
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            onClick={() => setNewCourseModalOpen(true)}
            type="button"
          >
            Nuevo curso
          </button>
        }
        navItems={getDirectorSidebarItems()}
        profile={directorDashboardMock.profile}
        roleLabel="Director"
        searchPlaceholder="Buscar curso o codigo"
        subtitle="Creacion, asignacion docente y publicacion de cursos"
        title="Cursos"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Total cursos</p>
            <p className="mt-2 text-3xl font-bold text-white">{coursesCatalog.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Publicados (pendientes activacion)</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">{publishedCourses}</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Cursos activos</p>
            <p className="mt-2 text-3xl font-bold text-emerald-200">{activeCourses}</p>
          </article>
        </div>

        <SectionCard
          right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
          subtitle="El director puede crear y publicar cursos"
          title="Catalogo de cursos"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">Codigo</th>
                <th className="px-3 py-3">Curso</th>
                <th className="px-3 py-3">Carrera</th>
                <th className="px-3 py-3">Profesor</th>
                <th className="px-3 py-3">Cupos</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={course.code}>
                    <td className="px-3 py-3 font-semibold text-white">{course.code}</td>
                    <td className="px-3 py-3">
                      <p>{course.course}</p>
                      <p className="text-xs text-slate-400">Seccion {course.section}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{course.career}</td>
                    <td className="px-3 py-3 text-slate-300">{course.professor}</td>
                    <td className="px-3 py-3 text-slate-300">{course.seats}</td>
                  <td className="px-3 py-3">
                    {course.publicationStatus === "Borrador" ? (
                      <button
                        className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                        onClick={() => publishCourse(course.code)}
                        type="button"
                      >
                        Publicar
                      </button>
                    ) : (
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${publicationStatusClass(course.publicationStatus)}`}>
                        {course.publicationStatus === "Publicado" ? "Pendiente activacion" : course.publicationStatus}
                      </span>
                    )}
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
      <NewCourseModal
        careers={careersCatalog}
        onClose={() => setNewCourseModalOpen(false)}
        onCreate={createDraftCourse}
        open={newCourseModalOpen}
      />
    </>
  );
}
