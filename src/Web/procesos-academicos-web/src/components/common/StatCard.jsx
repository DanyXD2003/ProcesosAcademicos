export default function StatCard({ icon, label, value, change, changeTone = "neutral" }) {
  const tones = {
    positive: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30",
    negative: "text-rose-300 bg-rose-500/10 border-rose-400/30",
    neutral: "text-sky-300 bg-sky-500/10 border-sky-400/30"
  };

  const toneClass = tones[changeTone] ?? tones.neutral;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_20px_40px_-34px_rgba(0,0,0,0.9)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-sky-300">
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        {change ? <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${toneClass}`}>{change}</span> : null}
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </article>
  );
}
