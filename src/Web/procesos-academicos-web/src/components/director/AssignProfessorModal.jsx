import { useEffect, useMemo, useState } from "react";

function normalize(value) {
  return `${value ?? ""}`.toLowerCase().trim();
}

export default function AssignProfessorModal({ offering, onClose, onConfirm, onSelect, open, selectedTeacherId, teachers }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const filteredTeachers = useMemo(() => {
    const query = normalize(searchTerm);
    if (!query) {
      return teachers;
    }

    return teachers.filter((teacher) => normalize(`${teacher.name} ${teacher.speciality}`).includes(query));
  }, [searchTerm, teachers]);

  if (!open || !offering) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-800/60 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-sky-200">Asignar profesor</h3>
            <p className="text-xs text-slate-400">
              {offering.course} ({offering.offeringCode})
            </p>
          </div>
          <button className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Buscar</span>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej. Helena Vance"
              type="text"
              value={searchTerm}
            />
          </label>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {filteredTeachers.map((teacher) => {
              const selected = selectedTeacherId === teacher.id;

              return (
                <button
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                    selected
                      ? "border-sky-400/70 bg-sky-500/20 text-sky-100"
                      : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500"
                  }`}
                  key={teacher.id}
                  onClick={() => onSelect(teacher.id)}
                  type="button"
                >
                  <div>
                    <p className="text-sm font-semibold">{teacher.name}</p>
                    <p className="text-xs text-slate-400">{teacher.speciality}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                      teacher.status === "Disponible"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : teacher.status === "Carga media"
                          ? "bg-amber-500/20 text-amber-200"
                          : "bg-rose-500/20 text-rose-200"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-[11px] text-sky-100">
            Esta asignacion se guarda en estado local del prototipo.
          </p>
        </div>

        <footer className="flex gap-3 border-t border-slate-800 bg-slate-800/40 px-6 py-4">
          <button
            className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition enabled:hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedTeacherId}
            onClick={onConfirm}
            type="button"
          >
            Confirmar cambio
          </button>
          <button
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
}
