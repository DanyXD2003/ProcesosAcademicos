import { useMemo, useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import SectionCard from "../components/domain/SectionCard";
import AssignGradesModal from "../components/professor/AssignGradesModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getProfessorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 3;

function statusClass(status) {
  if (status === "Activo") {
    return "bg-emerald-500/20 text-emerald-200";
  }

  if (status === "Publicado") {
    return "bg-amber-500/20 text-amber-200";
  }

  if (status === "Borrador") {
    return "bg-slate-700 text-slate-300";
  }

  return "bg-rose-500/20 text-rose-200";
}

function progressOfClass(students, grades) {
  if (students.length === 0) {
    return 0;
  }

  const graded = students.filter((student) => Number.isFinite(grades?.[student.id]) && grades[student.id] > 0).length;
  return Math.round((graded / students.length) * 100);
}

export default function ProfessorClassesPage() {
  const {
    classGrades,
    closeClass,
    professorClassStudents,
    professorClasses,
    professorProfile,
    publishClassGrades,
    setDraftGrade
  } = useAcademicDemo();
  const [selectedClassId, setSelectedClassId] = useState("");

  const { page, totalPages, setPage } = usePaginationQuery(professorClasses.length, PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const classes = professorClasses.slice(start, start + PAGE_SIZE);
  const selectedClass = useMemo(() => professorClasses.find((course) => course.id === selectedClassId) ?? null, [professorClasses, selectedClassId]);

  return (
    <>
      <DashboardLayout
        navItems={getProfessorSidebarItems()}
        profile={professorProfile}
        roleLabel="Profesor"
        searchPlaceholder="Buscar clase"
        subtitle="Control de cursos por seccion"
        title="Mis clases"
      >
        <SectionCard right={<span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>} title="Cursos asignados">
          <div className="space-y-4">
            {classes.map((course) => {
              const students = professorClassStudents[course.id] ?? [];
              const progress = progressOfClass(students, classGrades[course.id]);

              return (
                <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5" key={course.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-sky-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-sky-200">Seccion {course.section}</span>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase text-slate-200">{course.offeringCode}</span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusClass(course.status)}`}>
                          {course.status}
                        </span>
                        {course.gradesPublished ? (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-200">
                            Notas publicadas
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {course.code} | {students.length} estudiantes | Termino {course.term}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                        onClick={() => setSelectedClassId(course.id)}
                        type="button"
                      >
                        Asignar notas
                      </button>
                      <button
                        className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={course.gradesPublished || course.status === "Cerrado"}
                        onClick={() => publishClassGrades(course.id)}
                        type="button"
                      >
                        Publicar notas
                      </button>
                      <button
                        className="rounded-lg border border-rose-500/50 px-3 py-2 text-xs font-semibold text-rose-200 transition enabled:hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!course.gradesPublished || course.status === "Cerrado"}
                        onClick={() => closeClass(course.id)}
                        type="button"
                      >
                        Cerrar curso
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>Progreso de calificaciones</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-sky-400" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-800 pt-4">
            <PaginationControls onPageChange={setPage} page={page} totalPages={totalPages} />
          </div>
        </SectionCard>
      </DashboardLayout>

      <AssignGradesModal
        classItem={selectedClass}
        grades={selectedClass ? classGrades[selectedClass.id] : {}}
        onClose={() => setSelectedClassId("")}
        onGradeChange={setDraftGrade}
        open={Boolean(selectedClass)}
        students={selectedClass ? professorClassStudents[selectedClass.id] ?? [] : []}
      />
    </>
  );
}
