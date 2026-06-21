import React, { useState } from 'react';
import { X, Github, Mail, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Login / Register modal. Calls AuthContext.login/register which simulate
 * POST /api/auth/login and POST /api/auth/register. Swap those functions
 * for real fetch calls later — this component doesn't need to change.
 */
export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password});
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    setLoading(true);
    try {
      await login({ provider });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-panel-strong relative w-full max-w-sm rounded-2xl p-6 shadow-glow">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="font-display text-xl font-semibold text-slate-50">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {mode === 'login'
            ? 'Sign in to upload and manage cases.'
            : 'Join the vault to start publishing cases.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === 'register' && (
            <div>
              <label className="label-field">Name</label>
              <input
                required
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sharma Ji"
              />
            </div>
          )}
          <div>
            <label className="label-field">Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              required
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Mail size={16} />
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

   
        <p className="mt-5 text-center text-sm text-slate-400">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-violet-400 hover:text-violet-300"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
