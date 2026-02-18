import { useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import StatCard from "../components/common/StatCard";
import AssignProfessorModal from "../components/director/AssignProfessorModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { directorDashboardMock } from "../mocks/director.mock";
import { getDirectorSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 3;

function progressTone(value) {
  if (value >= 90) {
    return "bg-rose-400";
  }

  if (value >= 70) {
    return "bg-emerald-400";
  }

  return "bg-amber-400";
}

function metricTone(tone) {
  if (tone === "emerald") {
    return "bg-emerald-500/15 text-emerald-200";
  }

  if (tone === "rose") {
    return "bg-rose-500/15 text-rose-200";
  }

  return "bg-sky-500/15 text-sky-200";
}

export default function DirectorDashboardPage() {
  const { page, totalPages, setPage } = usePaginationQuery(directorDashboardMock.classes.length, PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(directorDashboardMock.teachers[0].id);
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleClasses = directorDashboardMock.classes.slice(startIndex, startIndex + PAGE_SIZE);

  const navItems = getDirectorSidebarItems();

  function handleConfirmModal() {
    setModalOpen(false);
  }

  return (
    <>
      <DashboardLayout
        actions={
          <>
            <button className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" type="button">
              Reporte
            </button>
            <button
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              onClick={() => setModalOpen(true)}
              type="button"
            >
              Nueva asignacion
            </button>
          </>
        }
        navItems={navItems}
        profile={directorDashboardMock.profile}
        roleLabel="Director"
        searchPlaceholder="Buscar registros"
        subtitle="Panel administrativo y operativo"
        title="Dashboard administrativo"
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {directorDashboardMock.stats.map((item) => (
            <StatCard change={item.change} changeTone={item.changeTone} icon={item.icon} key={item.label} label={item.label} value={item.value} />
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
                  <th className="px-3 py-3">Horario</th>
                  <th className="px-3 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleClasses.map((course) => (
                  <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={course.id}>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">{course.subject}</p>
                      <p className="text-xs text-slate-400">
                        {course.id} | {course.room}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                          course.assigned ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
                        }`}
                      >
                        {course.teacher}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="w-40">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                          <span>{course.occupancy}</span>
                          <span>{course.occupancyPercent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${progressTone(course.occupancyPercent)}`}
                            style={{ width: `${course.occupancyPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{course.schedule}</td>
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
                ))}
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
              {directorDashboardMock.teacherAvailability.map((teacher) => (
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
            <h3 className="text-lg font-bold text-white">Inscripciones</h3>
            <div className="mt-4 space-y-3">
              {directorDashboardMock.enrollmentOverview.map((metric) => (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3" key={metric.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{metric.label}</p>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${metricTone(metric.tone)}`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-sky-400" style={{ width: `${metric.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-800 pt-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Ultimas inscripciones</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {directorDashboardMock.recentEnrollments.map((student) => (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-2 py-2" key={student.name}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100">
                      {student.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.program}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>
      </DashboardLayout>

      <AssignProfessorModal
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmModal}
        onSelect={setSelectedTeacherId}
        open={modalOpen}
        selectedTeacherId={selectedTeacherId}
        teachers={directorDashboardMock.teachers}
      />
    </>
  );
}
