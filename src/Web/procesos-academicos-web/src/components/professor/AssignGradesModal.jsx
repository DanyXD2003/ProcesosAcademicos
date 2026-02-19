export default function AssignGradesModal({ classItem, grades, onClose, onGradeChange, open, students }) {
  if (!open || !classItem) {
    return null;
  }

  const readOnly = classItem.gradesPublished || classItem.status === "Cerrado";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-800/60 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-sky-200">Asignar notas</h3>
            <p className="text-xs text-slate-400">
              {classItem.title} ({classItem.code})
            </p>
          </div>
          <button className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="px-6 py-5">
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            {readOnly
              ? "Notas bloqueadas. Este curso ya tiene notas publicadas o esta cerrado."
              : "Ingresa notas de 0 a 100. Con 61 o mas el curso queda aprobado."}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-sky-300">
                  <th className="px-3 py-3">ID</th>
                  <th className="px-3 py-3">Nombre</th>
                  <th className="px-3 py-3">Carrera</th>
                  <th className="px-3 py-3">Nota</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr className="border-b border-slate-800/70 text-sm text-slate-200" key={student.id}>
                    <td className="px-3 py-3 font-semibold text-white">{student.id}</td>
                    <td className="px-3 py-3">{student.name}</td>
                    <td className="px-3 py-3 text-slate-300">{student.career}</td>
                    <td className="px-3 py-3">
                      <input
                        className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 outline-none transition focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={readOnly}
                        max={100}
                        min={0}
                        onChange={(event) => onGradeChange(classItem.id, student.id, event.target.value)}
                        type="number"
                        value={grades?.[student.id] ?? ""}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-800 bg-slate-800/40 px-6 py-4">
          <button
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
