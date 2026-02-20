import { NavLink, useNavigate } from "react-router-dom";
import { useAcademicDemo } from "../../context/AcademicDemoContext";
import { appPaths } from "../../router/paths";

function NavItem({ item }) {
  if (item.to) {
    return (
      <NavLink
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
            isActive
              ? "border-sky-400/40 bg-sky-500/15 text-sky-100"
              : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white"
          }`
        }
        end={item.end ?? true}
        to={item.to}
      >
        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    );
  }

  return (
    <button
      className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/80 hover:text-white"
      type="button"
    >
      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
}

export default function RoleSidebar({ roleLabel, profile, navItems, isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAcademicDemo();

  async function handleLogout() {
    await logout();
    navigate(appPaths.login, { replace: true });
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col border-r border-slate-800 bg-slate-950 p-6 transition duration-200 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-slate-950">
              <span className="material-symbols-outlined">school</span>
            </span>
            <div>
              <p className="text-lg font-bold text-white">EduPortal</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-sky-300">{roleLabel}</p>
            </div>
          </div>
          <button className="text-slate-400 md:hidden" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-sky-200">
              {profile.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
              <p className="truncate text-xs text-slate-400">{profile.subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="mt-7 space-y-1.5">
          {navItems.map((item) => (
            <NavItem item={item} key={item.label} />
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
            onClick={handleLogout}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar sesion
          </button>
        </div>
      </aside>
      {isOpen ? (
        <button
          aria-label="Cerrar menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          type="button"
        />
      ) : null}
    </>
  );
}
