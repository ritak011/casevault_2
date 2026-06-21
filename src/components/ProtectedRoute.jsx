import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Client-side route guard. Per the spec, viewing slides is public but
 * mutating data (e.g. the Upload page) requires an authenticated session.
 * If there's no mock JWT in AuthContext, we open the login modal and
 * bounce the user back to the gallery.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) openAuthModal();
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
