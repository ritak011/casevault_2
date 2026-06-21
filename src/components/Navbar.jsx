import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UploadCloud, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Top navigation bar.
 * - Logo on the left
 * - Category links (purely visual quick-filters; HomePage owns real filter state)
 * - Centered search input (controlled by parent via props, kept here for layout)
 * - Upload button on the top right — triggers auth modal if not logged in
 */
export default function Navbar({ search, onSearchChange }) {
  const { isAuthenticated, user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  function handleUploadClick() {
    if (isAuthenticated) {
      navigate('/upload');
    } else {
      openAuthModal();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-noir-900/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/40">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-50">
            Case<span className="text-violet-400">Vault</span>
          </span>
        </Link>

        {/* Search — centered on desktop */}
        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search presentations..."
            className="input-field pl-9"
          />
        </div>

        {/* Right side: auth state + upload */}
        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated && (
            <span className="hidden text-sm text-slate-400 sm:inline">
              {user?.name}
            </span>
          )}
          <button onClick={handleUploadClick} className="btn-primary">
            <UploadCloud size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>
          {isAuthenticated && (
            <button
              onClick={logout}
              title="Log out"
              className="btn-ghost px-2.5"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-white/5 px-4 py-2 md:hidden">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search presentations..."
            className="input-field pl-9"
          />
        </div>
      </div>
    </header>
  );
}
