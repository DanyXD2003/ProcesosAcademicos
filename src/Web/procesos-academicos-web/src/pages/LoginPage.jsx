import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAcademicDemo } from "../context/AcademicDemoContext";
import { appPaths, withPage } from "../router/paths";

function roleHomePath(roleCode) {
  if (roleCode === "DIRECTOR") {
    return withPage(appPaths.dashboard.director);
  }

  if (roleCode === "PROFESOR") {
    return withPage(appPaths.dashboard.professor);
  }

  return withPage(appPaths.dashboard.student);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { authError, isAuthenticated, isBootstrapping, login, currentUser } = useAcademicDemo();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !currentUser || isBootstrapping) {
      return;
    }

    navigate(roleHomePath(currentUser.roleCode), { replace: true });
  }, [currentUser, isAuthenticated, isBootstrapping, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    setLocalError("");
    setIsSubmitting(true);

    try {
      const user = await login({
        usernameOrEmail,
        password
      });

      navigate(roleHomePath(user.roleCode), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No fue posible iniciar sesion.";
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const resolvedError = localError || authError;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.28),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.24),transparent_30%),linear-gradient(160deg,#020617_0%,#0b1120_45%,#111827_100%)] px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-700/60 bg-slate-950/80 shadow-[0_50px_80px_-40px_rgba(2,6,23,0.95)] backdrop-blur">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-slate-800/80 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Portal universitario</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">Acceso al ecosistema academico</h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300">
              Autenticacion real conectada con backend y API versionada en /api/v1.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Modulos</p>
                <p className="mt-2 text-2xl font-bold text-sky-200">3</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Estado</p>
                <p className="mt-2 text-2xl font-bold text-emerald-200">Online</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Integracion API</p>
                <p className="mt-2 text-2xl font-bold text-sky-200">Activa</p>
              </article>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
              <p className="font-semibold uppercase tracking-[0.12em] text-slate-400">Credenciales seed</p>
              <p className="mt-2">Estudiante: <span className="font-semibold text-white">20230104</span> / Demo123!</p>
              <p>Profesor: <span className="font-semibold text-white">PR-040</span> / Demo123!</p>
              <p>Director: <span className="font-semibold text-white">DIR-001</span> / Demo123!</p>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-white">Iniciar sesion</h2>
            <p className="mt-2 text-sm text-slate-400">Ingresa tus credenciales para acceder al dashboard segun tu rol.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Usuario o correo</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  onChange={(event) => setUsernameOrEmail(event.target.value)}
                  placeholder="Ej: 20230104"
                  required
                  type="text"
                  value={usernameOrEmail}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Contrasena</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  required
                  type="password"
                  value={password}
                />
              </label>

              {resolvedError ? (
                <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-200">
                  {resolvedError}
                </p>
              ) : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || isBootstrapping}
                type="submit"
              >
                {isSubmitting ? "Autenticando..." : "Entrar al dashboard"}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
