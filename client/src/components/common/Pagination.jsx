// client/src/components/common/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:border-lime-400 disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
            p === page
              ? 'bg-lime-400 text-zinc-950 shadow-[0_0_20px_-4px_rgba(163,230,53,0.6)]'
              : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:border-lime-400 disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
