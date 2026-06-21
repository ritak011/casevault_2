import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import UploadPage from './pages/UploadPage.jsx';

export default function App() {
  // Search lives here (rather than inside HomePage) because Navbar —
  // a sibling, not a child of HomePage — needs to control it.
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen">
      <Navbar search={search} onSearchChange={setSearch} />

      <Routes>
        <Route path="/" element={<HomePage search={search} />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <AuthModal />
    </div>
  );
}
