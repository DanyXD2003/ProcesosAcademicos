import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 5;

function publicationStatusClass(status) {
  if (status === "Publicado") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  return "bg-amber-500/20 text-amber-200";
}

export default function DirectorCoursesPage() {
  const { coursesCatalog, publishCourse } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(coursesCatalog.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const courses = coursesCatalog.slice(start, start + PAGE_SIZE);

  const publishedCourses = coursesCatalog.filter((item) => item.publicationStatus === "Publicado").length;
  const draftCourses = coursesCatalog.filter((item) => item.publicationStatus === "Borrador").length;

  return (
    <DashboardLayout
      actions={
        <>
          <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
            Exportar
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
            Nuevo curso
          </button>
        </>
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
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Publicados</p>
          <p className="mt-2 text-3xl font-bold text-emerald-200">{publishedCourses}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Borrador</p>
          <p className="mt-2 text-3xl font-bold text-amber-200">{draftCourses}</p>
        </article>
      </div>

      <SectionCard
        right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>}
        subtitle="El director puede crear y publicar cursos, pero no inscribir estudiantes"
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
                <th className="px-3 py-3">Modalidad</th>
                <th className="px-3 py-3">Cupos</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Accion</th>
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
                  <td className="px-3 py-3 text-slate-300">{course.modality}</td>
                  <td className="px-3 py-3 text-slate-300">{course.seats}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${publicationStatusClass(course.publicationStatus)}`}
                    >
                      {course.publicationStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {course.publicationStatus === "Borrador" ? (
                      <button
                        className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                        onClick={() => publishCourse(course.code)}
                        type="button"
                      >
                        Publicar
                      </button>
                    ) : (
                      <span className="rounded-lg border border-emerald-500/30 px-3 py-2 text-[11px] font-semibold uppercase text-emerald-200">
                        Publicado
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
  );
}
