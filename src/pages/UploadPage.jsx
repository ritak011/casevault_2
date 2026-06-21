import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, FileCheck2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { createSlide } from '../api/slidesApi.js';
import { CATEGORIES } from '../data/mockSlides.js';

const YEARS = [2026, 2025, 2024, 2023];

/**
 * Upload Page — "Curate Your Work"
 * Protected by <ProtectedRoute> in App.jsx. On submit, calls
 * POST /api/slides (via createSlide) with the mock JWT attached.
 */
export default function UploadPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    competition: '',
    year: YEARS[0],
    category: CATEGORIES[0],
    description: '',
  });

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  async function handleSubmit(e, status) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSlide(
        {
          title: form.title,
          competition: form.competition,
          year: Number(form.year),
          category: form.category,
          description: form.description,
          status, // 'draft' | 'published' — not in original spec but useful client-side
          fileName: file?.name ?? null,
          thumbnailName: thumbnail?.name ?? null,
        },
        token
      );
      navigate('/');
    } catch (err) {
      console.error('Failed to create slide:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
          <UploadCloud size={14} />
          Protected · Authenticated session required
        </div>
        <h1 className="text-3xl font-bold">Curate your work</h1>
        <p className="mt-2 text-sm text-slate-400">
          Submit your case to the vault. Materials should meet a high bar for
          clarity and rigor.
        </p>
      </div>

      <form className="glass-panel-strong rounded-2xl p-6 space-y-5">
        {/* Drag and drop area */}
        <div>
          <label className="label-field">Case materials</label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              isDragging
                ? 'border-violet-400 bg-violet-500/10'
                : 'border-white/15 bg-white/[0.02] hover:border-white/25'
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.pptx,.key"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <FileCheck2 size={18} />
                {file.name}
              </div>
            ) : (
              <>
                <UploadCloud size={28} className="mb-2 text-violet-400" />
                <p className="font-display text-sm font-medium text-slate-200">
                  Drag and drop slides here
                </p>
                <label
                  htmlFor="file-input"
                  className="mt-1 cursor-pointer text-xs text-violet-400 hover:text-violet-300"
                >
                  or click to browse (.pdf, .pptx, .key)
                </label>
              </>
            )}
          </div>
        </div>

        {/* Preview thumbnail */}
        <div>
          <label className="label-field">Preview thumbnail</label>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-white/10 bg-noir-950/60 text-slate-600">
              <ImageIcon size={20} />
            </div>
            <div>
              <input
                id="thumb-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
              <label htmlFor="thumb-input" className="btn-ghost cursor-pointer text-xs">
                Choose file
              </label>
              <p className="mt-1 text-xs text-slate-500">
                {thumbnail ? thumbnail.name : 'Optimal ratio 16:9. Max size 5MB.'}
              </p>
            </div>
          </div>
        </div>

        {/* Case title */}
        <div>
          <label className="label-field">Case title</label>
          <input
            className="input-field"
            placeholder="Enter a prestigious title..."
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>

        {/* Competition + Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Competition name</label>
            <input
              className="input-field"
              placeholder="e.g., Global Strategy Case 2026"
              value={form.competition}
              onChange={(e) => updateField('competition', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Year</label>
            <select
              className="input-field"
              value={form.year}
              onChange={(e) => updateField('year', e.target.value)}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="label-field">Category</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Executive summary */}
        <div>
          <label className="label-field">Executive summary</label>
          <textarea
            rows={4}
            className="input-field resize-none"
            placeholder="Provide a concise summary of the case problem and your strategic solution..."
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmit(e, 'draft')}
            className="btn-ghost"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={submitting || !form.title}
            onClick={(e) => handleSubmit(e, 'published')}
            className="btn-emerald"
          >
            {submitting ? 'Publishing…' : 'Publish to vault'}
          </button>
        </div>
      </form>
    </main>
  );
}
