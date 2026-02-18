export default function TopHeader({ title, subtitle, actions, onMenuOpen, searchPlaceholder }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button className="rounded-lg border border-slate-700 p-2 text-slate-300 md:hidden" onClick={onMenuOpen} type="button">
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-[220px]">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-2.5 text-slate-500">search</span>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              placeholder={searchPlaceholder}
              type="text"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
      </div>
    </header>
  );
}
