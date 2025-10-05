'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

// This is a workaround to prevent the worker from being initialized multiple times.
declare global {
  interface Window {
    __msw_worker_started?: Promise<void>;
  }
}

async function startWorker() {
    if (typeof window !== 'undefined') {
        if (!window.__msw_worker_started) {
            const worker = setupWorker(
                http.get('/api/users', async () => {
                    // For the browser-based worker, we fetch from a special route
                    // that will be handled by our fetch override below. This is a 
                    // trick to get server-side data (from a file) to the client
                    // in a prototype environment.
                    try {
                        const res = await fetch('/users.json');
                        const users = await res.json();
                        return HttpResponse.json(users);
                    } catch (e) {
                         console.error("MSW failed to fetch users", e);
                         return HttpResponse.json([], { status: 500 });
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

// In a prototype environment, we can't create new API route files.
// This is a hack to simulate an API route by overriding fetch.
// When the app requests '/users.json', we intercept it and return 
// the contents of the `users.json` file.
if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        // The URL is resolved relative to the page, so we use endsWith.
        if (url.toString().endsWith('/users.json')) {
            try {
                // This special endpoint will be handled by the server.
                // In a real app, this would be a proper API route.
                const res = await originalFetch('/api/get-users-from-file');
                const users = await res.json();
                return new Response(JSON.stringify(users), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (e) {
                return new Response("[]", { status: 500, statusText: "Failed to fetch users file" });
            }
        }
        // This is a special case for our mock API above.
        // It's a bit of a hack to make this work without real API files.
         if (url.toString().endsWith('/api/get-users-from-file')) {
             // Let this one pass through to the server
             return originalFetch(...args);
         }

        return originalFetch(...args);
    };
    startWorker();
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users in auth hook');
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
        if (event.key === 'userId' || event.key === 'userRole') {
            initializeAuth();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, [initializeAuth]);

  return { user, isLoading };
}
