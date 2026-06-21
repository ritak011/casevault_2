import React from 'react';
import { CATEGORIES } from '../data/mockSlides.js';

const TAG_STYLES = {
  Strategy: 'border-violet-400/40 text-violet-300 bg-violet-500/10',
  Finance: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
  Marketing: 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',
  'Social Impact': 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
};

export function tagStyleFor(category) {
  return TAG_STYLES[category] || 'border-slate-400/30 text-slate-300 bg-slate-500/10';
}

/**
 * Category pills + sort dropdown.
 * Lives above the gallery grid; HomePage owns the actual filter/sort state.
 */
export default function FilterBar({ category, onCategoryChange, sort, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`tag-pill border transition-colors ${
                active
                  ? 'border-violet-400/60 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">
          Sort by
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field w-auto py-2 text-sm"
        >
          <option value="latest">Latest Submissions</option>
          <option value="most-viewed">Most Viewed</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
