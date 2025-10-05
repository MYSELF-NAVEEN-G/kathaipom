'use client';

import React, { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { http } from 'msw';
import { setupWorker } from 'msw/browser';

declare global {
  interface Window {
    __msw_worker_started?: Promise<void>;
  }
}

// Set up the MSW worker once.
async function startWorker() {
    if (typeof window !== 'undefined') {
        if (!window.__msw_worker_started) {
            const worker = setupWorker(
                http.get('/api/users', async () => {
                    // This is a temporary solution to avoid direct `fs` access on the client.
                    // This endpoint simply fetches the static `users.json` that gets
                    // updated by server actions.
                    try {
                        const res = await fetch('/users.json');
                        const users = await res.json();
                         return new Response(JSON.stringify(users), {
                            headers: { 'Content-Type': 'application/json' }
                        })
                    } catch (e) {
                         return new Response(JSON.stringify([]), {
                            headers: { 'Content-Type': 'application/json' }
                        })
                    }
                })
            );
            window.__msw_worker_started = worker.start({
                onUnhandledRequest: 'bypass',
                quiet: true,
            });
        }
        await window.__msw_worker_started;
    }
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Ensure the worker is running before we try to fetch.
      await startWorker();
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          // Fetch from the mock API route now, not the static file
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

    // Listen for changes in localStorage from other tabs/windows
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
