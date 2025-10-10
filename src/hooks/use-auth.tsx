'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User as AppUser } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

async function fetchAppUser(user: User): Promise<AppUser | null> {
  if (!user) return null;
  // Here you could fetch more profile details from a 'users' table if needed
  // For now, we'll construct it from the auth user metadata
  return {
    id: user.id,
    name: user.user_metadata.name,
    username: user.user_metadata.username,
    avatar: {
      id: 'avatar-1',
      imageUrl: user.user_metadata.avatar_url || `https://picsum.photos/seed/${user.id}/200`,
      description: 'user avatar',
      imageHint: 'person portrait'
    },
    bio: user.user_metadata.bio,
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

export function useAuth() {
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
        if (authUser) {
          const appUser = await fetchAppUser(authUser);
          setUser(appUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Initial check
    const checkUser = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const appUser = await fetchAppUser(authUser);
            setUser(appUser);
        }
        setIsLoading(false);
    }
    checkUser();


    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, isLoading };
}
