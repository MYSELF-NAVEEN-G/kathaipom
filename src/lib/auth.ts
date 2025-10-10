'use server';
import { createClient } from './supabase/server';
import type { User as AppUser } from './types';

export async function auth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null };
  }

  // The user object from Supabase Auth has the user's data.
  // We can map it to our app's User type.
  const appUser: AppUser = {
    id: user.id,
    name: user.user_metadata.name,
    username: user.user_metadata.username,
    // You might want to fetch avatar, bio etc. from a 'profiles' table
    // For now, we use metadata or fallbacks.
    avatar: {
      id: 'avatar-1',
      imageUrl:
        user.user_metadata.avatar_url ||
        'https://pPICSUM.photos/seed/1/200/200',
      description: '',
      imageHint: '',
    },
    bio: user.user_metadata.bio || '',
    coverImage: {
      id: 'cover-1',
      imageUrl:
        user.user_metadata.cover_image_url ||
        'https://pPICSUM.photos/seed/1/800/200',
      description: '',
      imageHint: '',
    },
    followers: [], // This would require another query
    following: [], // This would require another query
    isAdmin: user.user_metadata.is_admin || false,
  };

  return { user: appUser };
}
