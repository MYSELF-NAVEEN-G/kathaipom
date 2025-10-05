'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { getUsers } from '@/lib/data';

async function fetchUsers(): Promise<User[]> {
    try {
        const res = await fetch('/api/get-users-from-file');
        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        // In case of network error, fallback to reading from data file directly
        // This part is tricky because of client/server boundaries, 
        // but for a mock setup, an API route is the cleaner way.
        // If the API fails, we return an empty array.
        return [];
    }
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      try {
        const allUsers = await fetchUsers();
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
    
    const handleLogin = () => initializeAuth();
    window.addEventListener('login', handleLogin);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('login', handleLogin);
    };
  }, [initializeAuth]);

  return { user, isLoading };
}
