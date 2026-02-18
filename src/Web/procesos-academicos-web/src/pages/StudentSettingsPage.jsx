import SectionCard from "../components/domain/SectionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { studentDashboardMock } from "../mocks/student.mock";
import { getStudentSidebarItems } from "../navigation/sidebarItems";

export default function StudentSettingsPage() {
  return (
    <DashboardLayout
      actions={<button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="button">Guardar cambios</button>}
      navItems={getStudentSidebarItems()}
      profile={studentDashboardMock.profile}
      roleLabel="Estudiante"
      searchPlaceholder="Buscar ajuste"
      subtitle="Preferencias de cuenta y notificaciones"
      title="Configuracion"
    >
      <SectionCard subtitle="Preferencias de tu cuenta" title="Ajustes disponibles">
        <div className="space-y-3">
          {studentDashboardMock.settings.map((setting) => (
            <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-4" key={setting.key}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{setting.label}</p>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                    setting.value === "Activo"
                      ? "bg-emerald-500/20 text-emerald-200"
                      : setting.value === "Pendiente"
                        ? "bg-amber-500/20 text-amber-200"
                        : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {setting.value}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{setting.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </DashboardLayout>
  );
}
