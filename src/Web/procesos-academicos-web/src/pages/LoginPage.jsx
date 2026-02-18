import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPaths, withPage } from "../router/paths";

const roles = [
  { key: "estudiante", label: "Estudiante", icon: "school", to: withPage(appPaths.dashboard.student) },
  { key: "profesor", label: "Profesor", icon: "menu_book", to: withPage(appPaths.dashboard.professor) },
  { key: "director", label: "Director", icon: "account_balance", to: withPage(appPaths.dashboard.director) }
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("estudiante");

  function handleSubmit(event) {
    event.preventDefault();
    const selected = roles.find((item) => item.key === role);
    navigate(selected?.to ?? appPaths.login);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.28),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.24),transparent_30%),linear-gradient(160deg,#020617_0%,#0b1120_45%,#111827_100%)] px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-700/60 bg-slate-950/80 shadow-[0_50px_80px_-40px_rgba(2,6,23,0.95)] backdrop-blur">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-slate-800/80 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Portal universitario</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">Acceso visual al ecosistema academico</h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300">
              Esta version es un prototipo visual en React. No hay autenticacion real ni conexion con backend en esta etapa.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Modulos</p>
                <p className="mt-2 text-2xl font-bold text-sky-200">3</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Diseno</p>
                <p className="mt-2 text-2xl font-bold text-sky-200">100%</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Integracion API</p>
                <p className="mt-2 text-2xl font-bold text-sky-200">Pendiente</p>
              </article>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-white">Iniciar sesion</h2>
            <p className="mt-2 text-sm text-slate-400">Selecciona un rol para navegar al dashboard demo.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Rol de acceso</label>
                <div className="grid gap-2">
                  {roles.map((item) => (
                    <button
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        role === item.key
                          ? "border-sky-400/70 bg-sky-500/20 text-sky-100"
                          : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                      }`}
                      key={item.key}
                      onClick={() => setRole(item.key)}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        {item.label}
                      </span>
                      {role === item.key ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Usuario</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  placeholder="Ej: 20230001"
                  required
                  type="text"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Contrasena</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  placeholder="********"
                  required
                  type="password"
                />
              </label>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400"
                type="submit"
              >
                Entrar al dashboard
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
