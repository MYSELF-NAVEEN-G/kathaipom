'use client';

import React, { useState, useEffect } from 'react';
import { getUserById } from '@/lib/data';
import type { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          // Since getUserById is a server action, we can't call it directly.
          // In a real app, this would be an API call.
          // For this prototype, we'll fetch all users and find the one we need.
          // This is inefficient but works for a mock setup.
          const res = await fetch('/api/users');
          const allUsers = await res.json();
          const currentUser = allUsers.find((u: User) => u.id === userId);
          setUser(currentUser || null);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    // Create a dummy API route to serve users
    const createApiRoute = async () => {
        const existingRoute = await fetch('/api/users').catch(() => null);
        if (!existingRoute) {
            const { setup } = await import('@/lib/api-route-setup');
            setup();
        }
    }

    // This is a temporary setup to make the prototype work without a full API.
    const initialize = async () => {
        await createApiRoute();
        fetchUser();
    };
    
    initialize();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
        initialize();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  return { user };
}

// This is a trick to create a dummy API route in a prototype environment
// In a real application, you would define this in your api folder.
declare global {
  interface Window {
    __api_route_setup: boolean;
  }
}
