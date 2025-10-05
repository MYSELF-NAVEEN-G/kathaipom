'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { getUsers } from '@/lib/data';

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
                    // This handler now directly calls the server-side data function
                    // because `getUsers` does not depend on 'fs' directly, but
                    // is a server-side function. MSW worker runs in a context
                    // that can't access `fs`, so we can't read the file here.
                    // This is a bit of a trick for the prototype.
                    // In a real app, this would be a true API call to a backend.
                    try {
                        // For the browser-based worker, we can't use fs.
                        // So we make another fetch call to a special route
                        // that WILL be handled by the server.
                        // We can't do this directly in the component because of 'use client'.
                        const res = await fetch('/users.json');
                        const users = await res.json();
                        return HttpResponse.json(users);
                    } catch (e) {
                         return HttpResponse.json([]);
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

// Create a new API route to serve the users.json file.
// We can't use the file system in a client component, so we need an API route.
// But we also can't create files, so we use this workaround
// to simulate the API route logic within the hook setup.
if (typeof window !== 'undefined') {
    // This will only run in the browser
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        if (url.toString().endsWith('/users.json')) {
            try {
                // This is a "server-side" fetch that can read the file.
                // It's a hack to work around the prototype limitations.
                const users = await getUsers();
                 return new Response(JSON.stringify(users), {
                    headers: { 'Content-Type': 'application/json' }
                })
            } catch (e) {
                return new Response("[]", { status: 500 });
            }
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
