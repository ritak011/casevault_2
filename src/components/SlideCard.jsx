import React, { useState } from 'react';
import { Eye, Building2, Presentation, Trash2, Edit2, Check, X } from 'lucide-react';
import { tagStyleFor } from './FilterBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SlideCard({ slide, onDeleteSuccess }) {
  const { user, token } = useAuth();
  
  // Local state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: slide.title,
    description: slide.description,
    competitionName: slide.competition || slide.competitionName || '',
    year: slide.year
  });

  const currentCategory = slide.category || (slide.tags && slide.tags[0]) || 'Strategy';
  const displayCompetition = editForm.competitionName;
  const targetUrl = slide.fileUrl || slide.url || slide.pdfUrl || slide.slideUrl;

  // Strict ownership string verification
  const isOwner = user && slide.uploadedBy && (
    String(user.id) === String(slide.uploadedBy) || 
    String(user._id) === String(slide.uploadedBy) ||
    (slide.uploadedBy._id && String(user.id) === String(slide.uploadedBy._id))
  );

  // HANDLE DELETE SUBMISSION
  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete "${slide.title}"?`)) return;

    try {
      const response = await fetch(`https://casevault-1.vercel.app/api/slides/${slide._id || slide.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Case deleted successfully.");
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || "Failed to delete the case study.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not complete deletion.");
    }
  }

  // HANDLE UPDATE SUBMISSION (PUT Request)
  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`https://casevault-1.vercel.app/api/slides/${slide._id || slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        alert("Case study updated successfully!");
        setIsEditing(false);
        // Sync original slide details to avoid jarring layouts
        slide.title = editForm.title;
        slide.description = editForm.description;
        slide.competitionName = editForm.competitionName;
        slide.year = editForm.year;
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || "Failed to update slide metadata.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not update slide.");
    }
  }

  // Stop propagation when editing fields so it doesn't open the anchor link
  const stopProp = (e) => e.stopPropagation();

  return (
    <a
      href={isEditing ? undefined : targetUrl}
      target={isEditing ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`glass-panel group relative flex flex-col overflow-hidden rounded-xl block text-left ${
        isEditing ? 'cursor-default' : 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glow'
      }`}
    >
      {/* Top Banner Asset Block */}
      <div className="relative h-40 w-full overflow-hidden bg-noir-950 flex items-center justify-center border-b border-white/5">
        {slide.previewImageUrl ? (
          <img
            src={slide.previewImageUrl}
            alt={slide.title}
            className="h-full w-full object-cover"
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

        {/* OWNER CONTROLS PANEL */}
        {isOwner && (
          <div className="absolute right-3 top-3 z-20 flex gap-1.5" onClick={stopProp}>
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="p-2 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/30 rounded-lg text-emerald-400 update-btn animate-pulse"
                  title="Save Changes"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-lg text-slate-400"
                  title="Cancel Edit"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-violet-950/80 hover:bg-violet-900 border border-violet-500/30 rounded-lg text-violet-400 hover:text-violet-200"
                  title="Edit Details"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-950/80 hover:bg-red-900 border border-red-500/30 rounded-lg text-red-400 hover:text-red-200"
                  title="Delete Case Study"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      {/* Main Metadata Text Section / In-line Forms */}
      <div className="flex flex-1 flex-col gap-2 p-4" onClick={isEditing ? stopProp : undefined}>
        {isEditing ? (
          <div className="space-y-2 w-full text-xs">
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-50 font-semibold text-sm"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Case Title"
            />
            <textarea
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300 text-xs resize-none"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Case Summary Description"
            />
          </div>
        ) : (
          <>
            <h3 className="font-display text-base font-semibold leading-snug text-slate-50 group-hover:text-violet-300 transition-colors line-clamp-1">
              {slide.title}
            </h3>
            <p className="line-clamp-2 text-sm text-slate-400">{slide.description}</p>
          </>
        )}

        {/* Footer Metrics Panel */}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-mono truncate max-w-[150px]">
            <Building2 size={13} className="shrink-0" />
            {isEditing ? (
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded px-1 text-slate-300 text-[11px]"
                value={editForm.competitionName}
                onChange={(e) => setEditForm({ ...editForm, competitionName: e.target.value })}
              />
            ) : (
              displayCompetition
            )}
          </span>
          
          <span className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {slide.views || 0}
            </span>
            {isEditing ? (
              <input
                type="number"
                className="w-14 bg-white/5 border border-white/10 rounded px-1 text-cyan-400 font-mono text-[11px]"
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
              />
            ) : (
              <span className="font-mono text-cyan-400">{slide.year}</span>
            )}
          </span>
        </div>
      </div>
    </a>
  );
}