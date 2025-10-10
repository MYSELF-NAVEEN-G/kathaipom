'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User as AppUser } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    user: AppUser | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

async function fetchAppUser(user: User | null): Promise<AppUser | null> {
  if (!user) return null;
  const supabase = createClient();
  
  // Fetch the full user profile from your 'users' table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    console.error('Error fetching app user profile:', error);
    // Fallback to user_metadata if profile doesn't exist
    return {
      id: user.id,
      name: user.user_metadata.name || 'New User',
      username: user.user_metadata.username || 'newuser',
      avatar: {
        id: 'avatar-1',
        imageUrl: user.user_metadata.avatar_url || `https://picsum.photos/seed/${user.id}/200`,
        description: 'user avatar',
        imageHint: 'person portrait'
      },
      bio: user.user_metadata.bio || '',
      coverImage: {
        id: 'cover-1',
        imageUrl: user.user_metadata.cover_image_url || `https://picsum.photos/seed/cover-${user.id}/800/200`,
        description: 'cover image',
        imageHint: 'abstract background'
      },
      followers: [],
      following: [],
      isAdmin: user.user_metadata.is_admin || false,
    };
  }

  // Map the Supabase row to your AppUser type
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    avatar: { 
      id: 'avatar-1', 
      imageUrl: data.avatar_url || `https://picsum.photos/seed/${data.id}/200`, 
      description: 'user avatar',
      imageHint: 'person portrait'
    },
    bio: data.bio || '',
    coverImage: { 
      id: 'cover-1', 
      imageUrl: data.cover_image_url || `https://picsum.photos/seed/cover-${data.id}/800/200`,
      description: 'cover image',
      imageHint: 'abstract background'
    },
    followers: [], // In a real app, this would be another query
    following: [],
    isAdmin: data.is_admin || false,
  };
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setIsLoading(true);
        const authUser = session?.user ?? null;
        const appUser = await fetchAppUser(authUser);
        setUser(appUser);
        setIsLoading(false);
      }
    );

    // Initial check in case the auth state change event was missed
    const checkUser = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const appUser = await fetchAppUser(authUser);
        setUser(appUser);
        setIsLoading(false);
    }
    checkUser();


    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const value = { user, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
