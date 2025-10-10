'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User } from '@/lib/types';
import { getUserById } from '@/lib/data';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (userId: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A new function to fetch user from API route
async function fetchUserFromApi(userId: string): Promise<User | null> {
    try {
        const res = await fetch('/api/users');
        if (!res.ok) return null;
        const users: User[] = await res.json();
        return users.find(u => u.id === userId) || null;
    } catch {
        return null;
    }
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // On the server, we can still use getUserById, but on the client, we need an API.
      // For simplicity and consistency, let's just use a client-side fetch.
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error("Failed to fetch users");
      const users: User[] = await res.json();
      const foundUser = users.find(u => u.id === userId) || null;
      setUser(foundUser);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUser(userId);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);
  
  // Listen to custom login/logout events to sync across tabs
  useEffect(() => {
    const handleLogin = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetchUser(userId);
      }
    };

    const handleLogout = () => {
        setUser(null);
    };

    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    return () => {
        window.removeEventListener('login', handleLogin);
        window.removeEventListener('logout', handleLogout);
    };
  }, [fetchUser]);

  const login = (userId: string) => {
    localStorage.setItem('userId', userId);
    window.dispatchEvent(new Event('login'));
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    window.dispatchEvent(new Event('logout'));
  };

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
