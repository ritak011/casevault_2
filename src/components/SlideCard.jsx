import React from 'react';
import { Eye, Building2, Presentation } from 'lucide-react';
import { tagStyleFor } from './FilterBar.jsx';

/**
 * A single case-study card for the gallery grid.
 * Displays: category tag, preview thumbnail, title, description,
 * institution/competition name, and year — fully matching recruitment spec.
 */
export default function SlideCard({ slide }) {
  // Map backend array tags or fallback to category string safely
  const currentCategory = slide.category || (slide.tags && slide.tags[0]) || 'Strategy';
  const displayCompetition = slide.competition || slide.competitionName;

  return (
    <article
      className="glass-panel group relative flex flex-col overflow-hidden rounded-xl
        transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glow"
    >
      {/* Preview Thumbnail Container */}
      <div className="relative h-40 w-full overflow-hidden bg-noir-950 flex items-center justify-center border-b border-white/5">
        {slide.previewImageUrl ? (
          <img
            src={slide.previewImageUrl}
            alt={slide.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback if image path breaks
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback geometric panel if image is missing or breaks */}
        <div 
          className={`hidden absolute inset-0 bg-gradient-to-br ${slide.previewColor || 'from-violet-600/30 to-noir-800'} flex-col items-center justify-center gap-2`}
          style={!slide.previewImageUrl ? { display: 'flex' } : {}}
        >
          <Presentation size={24} className="text-white/20" />
        </div>

        {/* Category Pill Tag */}
        <span className={`tag-pill absolute left-3 top-3 z-10 border ${tagStyleFor(currentCategory)}`}>
          {currentCategory}
        </span>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      {/* Body Metadata Section */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-slate-50 group-hover:text-violet-300 transition-colors line-clamp-1">
          {slide.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-400">{slide.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-mono truncate max-w-[150px]">
            <Building2 size={13} className="shrink-0" />
            {displayCompetition}
          </span>
          <span className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {slide.views || 0}
            </span>
            <span className="font-mono text-cyan-400">{slide.year}</span>
          </span>
        </div>
      </div>
    </article>
  );
}