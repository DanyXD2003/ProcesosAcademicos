import { useEffect, useMemo, useState } from "react";

function initialForm(careers, baseCourses, currentTerm) {
  return {
    offeringCode: "",
    baseCourseId: baseCourses[0]?.id ?? "",
    careerId: careers[0]?.id ?? "",
    section: "A",
    term: currentTerm,
    capacity: 30,
    professorId: ""
  };
}

export default function NewCourseModal({ baseCourses, careers, currentTerm, onClose, onCreate, open, professors }) {
  const baseForm = useMemo(() => initialForm(careers, baseCourses, currentTerm), [baseCourses, careers, currentTerm]);
  const [formState, setFormState] = useState(baseForm);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormState(baseForm);
    setErrorMessage("");
  }, [baseForm, open]);

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

    const created = onCreate(formState);
    if (!created) {
      setErrorMessage("No se pudo crear la oferta. Verifica codigo unico y campos obligatorios.");
      return;
    }

    setFormState(baseForm);
    setErrorMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-800/60 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-sky-200">Nueva oferta de curso</h3>
            <p className="text-xs text-slate-400">Se crea en estado borrador sobre un curso base existente</p>
          </div>
          <button className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Codigo de oferta</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("offeringCode", event.target.value)}
                placeholder="CL-2026-020 (opcional)"
                type="text"
                value={formState.offeringCode}
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
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Curso base</span>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              onChange={(event) => updateField("baseCourseId", event.target.value)}
              required
              value={formState.baseCourseId}
            >
              {baseCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Carrera</span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("careerId", event.target.value)}
                required
                value={formState.careerId}
              >
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Termino</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("term", event.target.value)}
                required
                type="text"
                value={formState.term}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
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

            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">Profesor</span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                onChange={(event) => updateField("professorId", event.target.value)}
                value={formState.professorId}
              >
                <option value="">Sin asignar</option>
                {professors.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {errorMessage ? <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{errorMessage}</p> : null}

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
