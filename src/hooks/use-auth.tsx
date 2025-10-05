'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users in auth hook');
        }
        const allUsers: User[] = await res.json();
        const currentUser = allUsers.find((u: User) => u.id === userId);
        setUser(currentUser || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'userId') {
            initializeAuth();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event that can be dispatched from login/signup
    const handleLogin = () => initializeAuth();
    window.addEventListener('login', handleLogin);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('login', handleLogin);
    };

  }, [initializeAuth]);

  return { user, isLoading };
}
