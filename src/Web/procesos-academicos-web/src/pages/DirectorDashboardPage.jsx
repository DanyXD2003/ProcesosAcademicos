import { useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import StatCard from "../components/common/StatCard";
import AssignProfessorModal from "../components/director/AssignProfessorModal";
import NewCourseModal from "../components/director/NewCourseModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 4;

function parseSeats(value) {
  const [usedRaw = "0", capacityRaw = "0"] = `${value}`.split("/");
  const used = Number(usedRaw);
  const capacity = Number(capacityRaw);

  return {
    used: Number.isFinite(used) ? used : 0,
    capacity: Number.isFinite(capacity) ? capacity : 0
  };
}

function progressTone(value) {
  if (value >= 90) {
    return "bg-rose-400";
  }

  if (value >= 70) {
    return "bg-emerald-400";
  }

  return "bg-amber-400";
}

function statusTone(status) {
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

export default function DirectorDashboardPage() {
  const { careersCatalog, coursesCatalog, createDraftCourse, directorCapacity, directorStats, teacherAvailability, teachers } = useAcademicDemo();
  const { page, totalPages, setPage } = usePaginationQuery(coursesCatalog.length, PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id ?? "");
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleClasses = coursesCatalog.slice(startIndex, startIndex + PAGE_SIZE);

  const dashboardStats = [
    { icon: "group", label: "Total alumnos", value: `${directorStats.totalStudents}` },
    { icon: "co_present", label: "Profesores activos", value: `${directorStats.totalProfessors}` },
    { icon: "class", label: "Clases activas", value: `${directorStats.activeClasses}` },
    { icon: "pending_actions", label: "Clases pendientes", value: `${directorStats.pendingClasses}` }
  ];

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
        searchPlaceholder="Buscar registros"
        subtitle="Panel administrativo y operativo"
        title="Dashboard administrativo"
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <StatCard icon={item.icon} key={item.label} label={item.label} value={item.value} />
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Gestion de clases y asignaciones</h2>
            <span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                  <th className="px-3 py-3">Clase</th>
                  <th className="px-3 py-3">Profesor</th>
                  <th className="px-3 py-3">Capacidad</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleClasses.map((course) => {
                  const seats = parseSeats(course.seats);
                  const occupancyPercent = seats.capacity > 0 ? Math.round((seats.used / seats.capacity) * 100) : 0;

                  return (
                    <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={course.code}>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-white">{course.course}</p>
                        <p className="text-xs text-slate-400">
                          {course.code} | Seccion {course.section}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                            course.professor === "Sin asignar" ? "bg-rose-500/20 text-rose-200" : "bg-emerald-500/20 text-emerald-200"
                          }`}
                        >
                          {course.professor}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="w-40">
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                            <span>{course.seats}</span>
                            <span>{occupancyPercent}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800">
                            <div className={`h-full rounded-full ${progressTone(occupancyPercent)}`} style={{ width: `${occupancyPercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusTone(course.publicationStatus)}`}>
                          {course.publicationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          className="rounded-lg border border-sky-400/50 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/10"
                          onClick={() => setModalOpen(true)}
                          type="button"
                        >
                          Asignar profesor
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
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-bold text-white">Disponibilidad docente</h3>
            <div className="mt-4 space-y-3">
              {teacherAvailability.map((teacher) => (
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2" key={teacher.name}>
                  <div>
                    <p className="text-sm font-semibold text-white">{teacher.name}</p>
                    <p className="text-xs text-slate-400">{teacher.speciality}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                      teacher.status === "Libre"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : teacher.status === "En clase"
                          ? "bg-amber-500/20 text-amber-200"
                          : "bg-rose-500/20 text-rose-200"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-bold text-white">Capacidad de clases</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Alumnos en clases activas</p>
                <p className="mt-2 text-3xl font-bold text-emerald-200">{directorCapacity.activeStudents}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Capacidad en clases pendientes</p>
                <p className="mt-2 text-3xl font-bold text-amber-200">{directorCapacity.pendingCapacity}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Capacidad total</p>
                <p className="mt-2 text-3xl font-bold text-sky-200">{directorCapacity.totalCapacity}</p>
              </div>
            </div>
          </article>
        </section>
      </DashboardLayout>

      <AssignProfessorModal
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        onSelect={setSelectedTeacherId}
        open={modalOpen}
        selectedTeacherId={selectedTeacherId}
        teachers={teachers}
      />
      <NewCourseModal
        careers={careersCatalog}
        onClose={() => setNewCourseModalOpen(false)}
        onCreate={createDraftCourse}
        open={newCourseModalOpen}
      />
    </>
  );
}
