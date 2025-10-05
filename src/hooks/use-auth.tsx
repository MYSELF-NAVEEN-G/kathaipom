'use client';

import React, { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { http, passthrough } from 'msw';
import { setupWorker } from 'msw/browser';
import { getUsers } from '@/lib/data';

declare global {
  interface Window {
    __api_route_setup?: Promise<void>;
  }
}

async function setupApi() {
    if (typeof window !== 'undefined') {
        if (!window.__api_route_setup) {
            const worker = setupWorker(
                http.get('/api/users', async () => {
                    // This is a temporary solution to avoid direct `fs` access on the client.
                    // In a real app, this would be a proper API route file.
                    // We can't directly call `getUsers()` here as it uses `fs`.
                    // So we have to re-implement a client-safe way or have a different data source.
                    // For now, let's assume the build process makes users.json available publicly
                    // This is NOT secure for real data.
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
            window.__api_route_setup = worker.start({
                onUnhandledRequest: 'bypass',
                quiet: true,
            });
        }
        await window.__api_route_setup;
    }
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // The setup is now abstracted and client-safe
      // await setupApi();
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          // In a real app, this fetch might be to a protected endpoint
          const res = await fetch('/users.json');
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
