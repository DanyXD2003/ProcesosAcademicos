import { Navigate } from "react-router-dom";
import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { getStudentSidebarItems } from "../navigation/sidebarItems";
import { appPaths, withPage } from "../router/paths";

export default function StudentProfilePage() {
  const { profile, studentCareer, studentProfileDetails } = useAcademicDemo();

  if (!studentCareer) {
    return <Navigate replace to={withPage(appPaths.dashboard.student)} />;
  }

  return (
    <DashboardLayout
      actions={
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">
          Editar perfil
        </button>
      }
      navItems={getStudentSidebarItems()}
      profile={profile}
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
              <dd className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.fullName}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">ID</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.studentId}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Programa</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.program}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Facultad</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.faculty}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Semestre</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.semester}</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Carrera</dt>
              <dd className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.career}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard subtitle="Canales de contacto" title="Comunicacion">
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Correo</p>
              <p className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.email}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Telefono</p>
              <p className="mt-2 text-sm font-semibold text-white">{studentProfileDetails.phone}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
