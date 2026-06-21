import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { createSlide } from '../api/slidesApi.js';
import { CATEGORIES } from '../data/mockSlides.js';

const YEARS = [2026, 2025, 2024, 2023];

export default function UploadPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    competition: '',
    year: YEARS[0],
    category: CATEGORIES[0],
    description: '',
    slideUrl: '',          // Added state field
    previewImageUrl: '',    // Added state field
  });

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e, status) {
    e.preventDefault();
    setSubmitting(true);
    
    // Safety check for backend requirements
    if (!form.slideUrl || !form.previewImageUrl) {
      alert("Please provide both a Slide Deck URL and a Preview Thumbnail URL.");
      setSubmitting(false);
      return;
    }

    try {
      await createSlide(
        {
          title: form.title,
          competition: form.competition,
          year: Number(form.year),
          category: form.category,
          description: form.description,
          status,
          slideUrl: form.slideUrl,              // Sent direct path
          previewImageUrl: form.previewImageUrl // Sent direct path
        },
        token
      );
      navigate('/');
    } catch (err) {
      console.error('Failed to create slide:', err);
      alert(err.message || 'Submission failed.');
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
          Submit your case to the vault. Materials should meet a high bar for clarity and rigor.
        </p>
      </div>

      <form className="glass-panel-strong rounded-2xl p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        {/* Case Title */}
        <div>
          <label className="label-field">Case title</label>
          <input
            className="input-field"
            placeholder="Enter a prestigious title..."
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>

        {/* Slide Deck Resource Link */}
        <div>
          <label className="label-field">Case Materials Link (PDF / Presentation URL)</label>
          <div className="relative">
            <Link2 size={16} className="absolute left-3 top-3.5 text-slate-500" />
            <input
              className="input-field pl-9"
              placeholder="https://example.com/your-deck.pdf"
              value={form.slideUrl}
              onChange={(e) => updateField('slideUrl', e.target.value)}
            />
          </div>
        </div>

        {/* Thumbnail Image URL Resource Link */}
        <div>
          <label className="label-field">Preview Thumbnail Image URL</label>
          <div className="relative">
            <ImageIcon size={16} className="absolute left-3 top-3.5 text-slate-500" />
            <input
              className="input-field pl-9"
              placeholder="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
              value={form.previewImageUrl}
              onChange={(e) => updateField('previewImageUrl', e.target.value)}
            />
          </div>
        </div>

        {/* Competition + Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Competition name</label>
            <input
              className="input-field"
              placeholder="e.g., Global Strategy Case"
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

        {/* Executive Summary */}
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

        {/* Form Actions */}
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