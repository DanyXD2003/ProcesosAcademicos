import { useMemo, useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import AssignProfessorModal from "../components/director/AssignProfessorModal";
import NewCourseModal from "../components/director/NewCourseModal";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
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
  const {
    activateOffering,
    assignProfessorToOffering,
    baseCoursesCatalog,
    careersOptions,
    createDraftOffering,
    currentTerm,
    directorCourses,
    directorProfile,
    publishOffering,
    closeOffering,
    teachers
  } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(directorCourses.length, PAGE_SIZE);
  const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOfferingId, setSelectedOfferingId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const start = (page - 1) * PAGE_SIZE;
  const courses = directorCourses.slice(start, start + PAGE_SIZE);

  const selectedOffering = useMemo(
    () => directorCourses.find((item) => item.offeringId === selectedOfferingId) ?? null,
    [directorCourses, selectedOfferingId]
  );

  const publishedCourses = directorCourses.filter((item) => item.status === "Publicado").length;
  const activeCourses = directorCourses.filter((item) => item.status === "Activo").length;

  function openAssignModal(offering) {
    setSelectedOfferingId(offering.offeringId);
    setSelectedTeacherId(offering.professorId ?? "");
    setAssignModalOpen(true);
  }

  function confirmAssignProfessor() {
    if (!selectedOffering || !selectedTeacherId) {
      return;
    }

    assignProfessorToOffering(selectedOffering.offeringId, selectedTeacherId);
    setAssignModalOpen(false);
  }

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
        profile={directorProfile}
        roleLabel="Director"
        searchPlaceholder="Buscar curso o codigo"
        subtitle="Catalogo unificado de curso base y oferta academica"
        title="Cursos"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Total cursos</p>
            <p className="mt-2 text-3xl font-bold text-white">{directorCourses.length}</p>
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
          subtitle="Acciones por oferta: publicar, activar, cerrar y asignar profesor"
          title="Catalogo de cursos"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                  <th className="px-3 py-3">Oferta</th>
                  <th className="px-3 py-3">Curso base</th>
                  <th className="px-3 py-3">Carrera</th>
                  <th className="px-3 py-3">Termino</th>
                  <th className="px-3 py-3">Profesor</th>
                  <th className="px-3 py-3">Cupos</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={course.offeringId}>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">{course.offeringCode}</p>
                      <p className="text-xs text-slate-400">Seccion {course.section}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p>{course.course}</p>
                      <p className="text-xs text-slate-400">{course.baseCourseCode}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{course.career}</td>
                    <td className="px-3 py-3 text-slate-300">{course.term}</td>
                    <td className="px-3 py-3 text-slate-300">{course.professor}</td>
                    <td className="px-3 py-3 text-slate-300">{course.seats}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${publicationStatusClass(course.status)}`}>
                        {course.status === "Publicado" ? "Pendiente activacion" : course.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        {course.status === "Borrador" ? (
                          <button
                            className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                            onClick={() => publishOffering(course.offeringId)}
                            type="button"
                          >
                            Publicar
                          </button>
                        ) : null}

                        {course.status === "Publicado" ? (
                          <button
                            className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
                            onClick={() => activateOffering(course.offeringId)}
                            type="button"
                          >
                            Activar
                          </button>
                        ) : null}

                        {course.status === "Activo" || course.status === "Publicado" ? (
                          <button
                            className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/10"
                            onClick={() => closeOffering(course.offeringId)}
                            type="button"
                          >
                            Cerrar
                          </button>
                        ) : null}

                        <button
                          className="rounded-lg border border-sky-400/50 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/10"
                          onClick={() => openAssignModal(course)}
                          type="button"
                        >
                          Asignar profesor
                        </button>
                      </div>
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
        baseCourses={baseCoursesCatalog}
        careers={careersOptions}
        currentTerm={currentTerm}
        onClose={() => setNewCourseModalOpen(false)}
        onCreate={createDraftOffering}
        open={newCourseModalOpen}
        professors={teachers}
      />
      <AssignProfessorModal
        offering={selectedOffering}
        onClose={() => setAssignModalOpen(false)}
        onConfirm={confirmAssignProfessor}
        onSelect={setSelectedTeacherId}
        open={assignModalOpen}
        selectedTeacherId={selectedTeacherId}
        teachers={teachers}
      />
    </>
  );
}
