export default function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginacion" className="flex items-center justify-between gap-4">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-sky-400 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        {pages.map((item) => (
          <button
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
              item === page
                ? "border-sky-400 bg-sky-500/20 text-sky-100"
                : "border-slate-700 text-slate-300 hover:border-sky-400 hover:text-sky-100"
            }`}
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-sky-400 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </nav>
  );
}
