'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak_count: number;
  currency: string;
  monthly_income: number;
  monthly_budget_target: number;
  main_financial_goal?: string;
  financial_experience: string;
  is_admin: boolean;
  is_onboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (currentToken?: string) => {
    try {
      const activeToken = currentToken || localStorage.getItem('finquest_token');
      if (!activeToken) return;
      const userData = await fetchAPI('/auth/me', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      setUser(userData);
    } catch (err) {
      console.warn('[AuthContext] Failed to fetch current user profile:', err);
      localStorage.removeItem('finquest_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('finquest_token') : null;
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.access_token) {
        localStorage.setItem('finquest_token', res.access_token);
        setToken(res.access_token);
        await fetchCurrentUser(res.access_token);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('finquest_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
