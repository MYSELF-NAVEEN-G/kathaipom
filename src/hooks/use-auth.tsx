'use client';

import React, { useState, useEffect } from 'react';
import type { User } from '@/lib/types';

declare global {
  interface Window {
    __api_route_setup?: boolean;
  }
}

async function setupApi() {
    if (typeof window !== 'undefined' && window.__api_route_setup) {
        return;
    }

    const { setupWorker, http } = await import('msw/browser');
    const { getUsers } = await import('@/lib/data');

    const worker = setupWorker(
        http.get('/api/users', async () => {
            const users = await getUsers();
            return new Response(JSON.stringify(users), {
                headers: { 'Content-Type': 'application/json' }
            })
        })
    );

    await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
    });
    
    if (typeof window !== 'undefined') {
        window.__api_route_setup = true;
    }
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await setupApi();
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const res = await fetch('/api/users');
          if (!res.ok) throw new Error('Failed to fetch');
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
    };
    
    initializeAuth();

    const handleStorageChange = () => {
        initializeAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  return { user, isLoading };
}
