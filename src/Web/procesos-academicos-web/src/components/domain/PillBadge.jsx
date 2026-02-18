export default function PillBadge({ label, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-700 text-slate-200",
    positive: "bg-emerald-500/20 text-emerald-200",
    warning: "bg-amber-500/20 text-amber-200",
    danger: "bg-rose-500/20 text-rose-200",
    info: "bg-sky-500/20 text-sky-200"
  };

  return <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${tones[tone] ?? tones.neutral}`}>{label}</span>;
}
