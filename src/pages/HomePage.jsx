import React, { useEffect, useState } from 'react';
import { fetchSlides } from '../api/slidesApi.js';
import FilterBar from '../components/FilterBar.jsx';
import SlideCard from '../components/SlideCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { LayoutGrid } from 'lucide-react';

const PAGE_LIMIT = 6;

/**
 * Home Page — "The Gallery"
 * Owns all gallery state (page, category, search, sort) and re-fetches
 * from slidesApi whenever any of it changes, mirroring how this would
 * work against the real GET /api/slides?page=&limit=&category=&search=&sort=
 */
export default function HomePage({ search }) {
  const [slides, setSlides] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset to page 1 whenever filters/search change
  useEffect(() => {
    setPage(1);
  }, [category, sort, search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchSlides({ page, limit: PAGE_LIMIT, category, search, sort }).then((res) => {
      if (!active) return;
      setSlides(res.data);
      setPagination(res.pagination);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [page, category, search, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero / page intro */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <LayoutGrid size={14} />
          The Gallery
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Curated case work,{' '}
          <span className="text-violet-400">indexed for signal.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Browse competition decks across strategy, finance, marketing, and social
          impact — filtered, searched, and sorted in real time.
        </p>
      </div>

      <div className="mb-6">
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton />
      ) : slides.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => (
            <SlideCard key={slide.id} slide={slide} />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </main>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-panel h-72 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-xl py-20 text-center">
      <p className="font-display text-lg text-slate-200">No cases match that search</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Try a different keyword or clear the category filter — or be the first to
        publish one.
      </p>
    </div>
  );
}
