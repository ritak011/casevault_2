import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Simple numbered pagination. Mirrors the ?page=&limit= query params
 * that GET /api/slides will eventually accept.
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-ghost h-9 w-9 p-0 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-9 w-9 rounded-lg text-sm font-mono transition-colors ${
            p === page
              ? 'bg-violet-600 text-white shadow-glow'
              : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="btn-ghost h-9 w-9 p-0 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
