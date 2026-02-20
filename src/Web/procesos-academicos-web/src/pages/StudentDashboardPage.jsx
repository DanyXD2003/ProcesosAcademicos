import { useState } from "react";
import PaginationControls from "../components/common/PaginationControls";
import StatCard from "../components/common/StatCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import usePaginationQuery from "../hooks/usePaginationQuery";
import { getStudentSidebarItems } from "../navigation/sidebarItems";

const PAGE_SIZE = 4;

export default function StudentDashboardPage() {
  const {
    approvedCurriculumCount,
    careersOptions,
    createStudentRequest,
    enrollCareer,
    pendingCurriculumCount,
    profile,
    studentActiveOfferings,
    studentAverageGrade,
    studentCareer,
    studentHistory
  } = useAcademicDemo();
  const [requestMessage, setRequestMessage] = useState("");

  const { page, totalPages, setPage } = usePaginationQuery(studentHistory.length, PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const historyRows = studentHistory.slice(startIndex, startIndex + PAGE_SIZE);
  const canRequestPensumClosure = pendingCurriculumCount <= 0;

  const dashboardStats = [
    {
      icon: "trending_up",
      label: "Promedio general",
      value: studentAverageGrade,
      change: "Historico",
      changeTone: "neutral"
    },
    {
      icon: "school",
      label: "Cursos aprobados/pendientes",
      value: `${approvedCurriculumCount}/${pendingCurriculumCount}`,
      change: "Pensum",
      changeTone: "neutral"
    },
    {
      icon: "menu_book",
      label: "Cursos en progreso",
      value: `${studentActiveOfferings.length}`,
      change: studentActiveOfferings.length > 0 ? "Activo" : "Sin cursos",
      changeTone: "neutral"
    }
  ];

  if (!studentCareer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
        <section className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-xs uppercase tracking-[0.12em] text-sky-300">Portal estudiante</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Inscribete en una carrera para iniciar</h1>
          <p className="mt-2 text-sm text-slate-300">
            Antes de usar el modulo academico, debes seleccionar una carrera activa.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careersOptions.map((career) => (
              <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4" key={career.id}>
                <h2 className="text-base font-semibold text-white">{career.name}</h2>
                <p className="mt-2 text-sm text-slate-400">Se habilitara tu dashboard y tus cursos segun este pensum.</p>
                <button
                  className="mt-4 w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  onClick={() => enrollCareer(career.id)}
                  type="button"
                >
                  Inscribirme
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <DashboardLayout
      actions={
        <>
          <button
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            onClick={async () => {
              const ok = await createStudentRequest("Certificacion de cursos");
              if (ok) {
                setRequestMessage("Certificacion generada y descarga iniciada.");
              }
            }}
            type="button"
          >
            Generar certificado
          </button>
          <button
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              canRequestPensumClosure
                ? "border-sky-400/50 text-sky-200 hover:bg-sky-500/10"
                : "cursor-not-allowed border-slate-700 text-slate-400"
            }`}
            onClick={async () => {
              const ok = await createStudentRequest("Cierre de pensum");
              if (ok) {
                setRequestMessage("Cierre de pensum generado y descarga iniciada.");
              }
            }}
            disabled={!canRequestPensumClosure}
            type="button"
          >
            Cierre de pensum
          </button>
          {!canRequestPensumClosure ? <span className="text-xs text-slate-400">Te faltan {pendingCurriculumCount} cursos</span> : null}
        </>
      }
      navItems={getStudentSidebarItems()}
      profile={profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar curso o actividad"
      subtitle="Vista visual del portal del estudiante"
      title="Dashboard del estudiante"
    >
      {requestMessage ? (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{requestMessage}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((item) => (
          <StatCard change={item.change} changeTone={item.changeTone} icon={item.icon} key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Resumen rapido de cursos activos</h2>
          <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{studentActiveOfferings.length} activos</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {studentActiveOfferings.length > 0 ? (
            studentActiveOfferings.map((course) => (
              <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4" key={course.offeringId}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300">{course.offeringCode}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{course.course}</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-200">Activa</span>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Base: {course.baseCourseCode} | Profesor: {course.professor}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Termino {course.term} | Seccion {course.section} | Cupos {course.seats}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              Aun no tienes cursos activos. Ve a "Mis cursos" para inscribirte en ofertas publicadas.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Historial de cursos</h2>
          <span className="text-xs text-slate-400">Page size: {PAGE_SIZE}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                <th className="px-3 py-3">Codigo</th>
                <th className="px-3 py-3">Asignatura</th>
                <th className="px-3 py-3">Periodo</th>
                <th className="px-3 py-3">Creditos</th>
                <th className="px-3 py-3">Nota</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={row.id}>
                  <td className="px-3 py-3 font-semibold">{row.code}</td>
                  <td className="px-3 py-3">{row.subject}</td>
                  <td className="px-3 py-3 text-slate-400">{row.period}</td>
                  <td className="px-3 py-3">{row.credits}</td>
                  <td className="px-3 py-3 font-semibold text-sky-200">{row.grade}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                        row.status === "Aprobado" ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
                      }`}
                    >
                      {row.status}
                    </span>
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
    </DashboardLayout>
  );
}
