import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { studentDashboardMock } from "../mocks/student.mock";
import { getStudentSidebarItems } from "../navigation/sidebarItems";

export default function StudentProfilePage() {
  const details = studentDashboardMock.profileDetails;

  return (
    <DashboardLayout
      actions={<button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">Editar perfil</button>}
      navItems={getStudentSidebarItems()}
      profile={studentDashboardMock.profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar en perfil"
      subtitle="Informacion personal y academica"
      title="Perfil"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard subtitle="Datos basicos del estudiante" title="Identidad academica">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Nombre completo</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{details.fullName}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">ID</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{details.studentId}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Programa</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{details.program}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Facultad</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{details.faculty}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Semestre</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{details.semester}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Docente asesor</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{details.advisor}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard subtitle="Canales de contacto" title="Comunicacion">
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Correo</p>
              <p className="mt-2 text-sm font-semibold text-white">{details.email}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Telefono</p>
              <p className="mt-2 text-sm font-semibold text-white">{details.phone}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard subtitle="Recordatorios importantes" title="Alertas" right={<span className="text-xs text-slate-400">Visual demo</span>}>
        <ul className="space-y-3">
          {studentDashboardMock.alerts.map((item) => (
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </DashboardLayout>
  );
}
