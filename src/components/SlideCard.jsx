import React from 'react';
import { Eye, Building2, Presentation, Trash2 } from 'lucide-react';
import { tagStyleFor } from './FilterBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SlideCard({ slide, onDeleteSuccess }) {
  const { user, token } = useAuth();
  console.log("DEBUG IDs -> Logged In User:", user, "Slide Owner:", slide.uploadedBy);


  
  const currentCategory = slide.category || (slide.tags && slide.tags[0]) || 'Strategy';
  const displayCompetition = slide.competition || slide.competitionName;
  const targetUrl = slide.fileUrl || slide.url || slide.pdfUrl;

  // Check if the current logged-in user is the owner of this slide
  // Handles both populated object schemas or raw string IDs from MongoDB
 const isOwner = user && slide.uploadedBy && (
  String(user.id) === String(slide.uploadedBy) || 
  String(user._id) === String(slide.uploadedBy) ||
  (slide.uploadedBy._id && String(user.id) === String(slide.uploadedBy._id))
);
  async function handleDelete(e) {
    // Prevent clicking the delete button from opening the slide URL link
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete "${slide.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`https://casevault-1.vercel.app/api/slides/${slide._id || slide.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.ok ? await response.json() : null;
      if (response.ok) {
        alert("Case deleted successfully.");
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || "Failed to delete the case study.");
      }
    } catch (err) {
      console.error("Error deleting slide:", err);
      alert("Network error: Could not complete deletion.");
    }
  }

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel group relative flex flex-col overflow-hidden rounded-xl cursor-pointer
        transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glow block text-left"
    >
      {/* Preview Thumbnail Container */}
      <div className="relative h-40 w-full overflow-hidden bg-noir-950 flex items-center justify-center border-b border-white/5">
        {slide.previewImageUrl ? (
          <img
            src={slide.previewImageUrl}
            alt={slide.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div 
          className={`hidden absolute inset-0 bg-gradient-to-br ${slide.previewColor || 'from-violet-600/30 to-noir-800'} flex-col items-center justify-center gap-2`}
          style={!slide.previewImageUrl ? { display: 'flex' } : {}}
        >
          <Presentation size={24} className="text-white/20" />
        </div>

        <span className={`tag-pill absolute left-3 top-3 z-10 border ${tagStyleFor(currentCategory)}`}>
          {currentCategory}
        </span>

        {/* PROTECTED ACTION: Only render delete button if authorized owner */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="absolute right-3 top-3 z-20 p-2 bg-red-950/80 hover:bg-red-900 border border-red-500/30 rounded-lg text-red-400 hover:text-red-200 transition-all shadow-md"
            title="Delete Case Study"
          >
            <Trash2 size={14} />
          </button>
        )}
        
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
    </a>
  );
}