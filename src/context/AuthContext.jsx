import React, { createContext, useContext, useEffect, useState } from 'react';

/*
  AuthContext — Production Ready JWT Authentication Context.
  Connects directly to the Express backend API routes.
  Persists the token and user object in localStorage to survive page refreshes.
*/

const AuthContext = createContext(null);
const STORAGE_KEY = 'casevault.auth';
const API_BASE_URL = 'http://localhost:5000/api/auth';

function loadStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadStoredSession);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  /**
   * POST /api/auth/login
   * Sends user credentials to the backend and stores the returned JWT.
   */
  async function login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Invalid credentials');
    }

    // Extract the token and user nested inside the backend's standard data wrapper
    const { token, user } = result.data;
    setSession({ token, user });
    setIsAuthModalOpen(false);
    return { token, user };
  }

  /**
   * POST /api/auth/register
   * Registers a new account on the backend database and logs them in immediately.
   */
  async function register({ name, email, password }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    // Extract the token and user nested inside the backend's standard data wrapper
    const { token, user } = result.data;
    setSession({ token, user });
    setIsAuthModalOpen(false);
    return { token, user };
  }

  function logout() {
    setSession(null);
  }

  const value = {
    isAuthenticated: Boolean(session?.token),
    token: session?.token ?? null,
    user: session?.user ?? null,
    login,
    register,
    logout,
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}