import { useMemo, useState } from "react";

function initialForm(careers) {
  return {
    code: "",
    course: "",
    career: careers[0] ?? "",
    section: "A",
    professor: "Sin asignar",
    department: "General",
    capacity: 30
  };
}

export default function NewCourseModal({ careers, onClose, onCreate, open }) {
  const baseForm = useMemo(() => initialForm(careers), [careers]);
  const [formState, setFormState] = useState(baseForm);

  if (!open) {
    return null;
  }

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onCreate(formState);
    setFormState(baseForm);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-800/60 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-sky-200">Nuevo curso</h3>
            <p className="text-xs text-slate-400">El curso se crea en estado borrador</p>
          </div>
          <button className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Codigo</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("code", event.target.value)}
                placeholder="CL-2026-020"
                required
                type="text"
                value={formState.code}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Seccion</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("section", event.target.value)}
                required
                type="text"
                value={formState.section}
              />
            </label>
          </div>

          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Nombre del curso</span>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              onChange={(event) => updateField("course", event.target.value)}
              required
              type="text"
              value={formState.course}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Carrera</span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("career", event.target.value)}
                required
                value={formState.career}
              >
                {careers.map((career) => (
                  <option key={career} value={career}>
                    {career}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Capacidad</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                min={1}
                onChange={(event) => updateField("capacity", Number(event.target.value))}
                required
                type="number"
                value={formState.capacity}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Departamento</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("department", event.target.value)}
                required
                type="text"
                value={formState.department}
              />
            </label>

            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Profesor</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("professor", event.target.value)}
                type="text"
                value={formState.professor}
              />
            </label>
          </div>

          <footer className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" type="submit">
              Crear borrador
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
