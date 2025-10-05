'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

async function fetchUserById(userId: string): Promise<User | null> {
    try {
        const res = await fetch('/api/users');
        if (!res.ok) {
            console.error('Failed to fetch users');
            return null;
        }
        const users: User[] = await res.json();
        const currentUser = users.find((u: User) => u.id === userId);
        return currentUser || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        const currentUser = await fetchUserById(userId);
        setUser(currentUser);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();

    const handleAuthChange = () => {
        initializeAuth();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('login', handleAuthChange);

    return () => {
        window.removeEventListener('storage', handleAuthChange);
        window.removeEventListener('login', handleAuthChange);
    };
  }, [initializeAuth]);

  return { user, isLoading };
}
