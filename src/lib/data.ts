import { createClient } from './supabase/server';
import type { User, Story, EnrichedStory, Comment } from './types';

// These functions now fetch data from Supabase
const supabase = createClient();

export async function getUsers(): Promise<User[]> {
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return users || [];
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('*, followers:followers!follower_id(count), following:followers!following_id(count)')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
  
  if (!user) return null;

  // The query above gives counts, we need the actual arrays of IDs.
  // This is simplified. A real app might do this differently or with RPC.
  const { data: followersData } = await supabase.from('followers').select('follower_id').eq('following_id', user.id);
  const { data: followingData } = await supabase.from('followers').select('following_id').eq('follower_id', user.id);


  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: { id: 'avatar-1', imageUrl: user.avatar_url, description: '', imageHint: ''},
    bio: user.bio,
    coverImage: { id: 'cover-1', imageUrl: user.cover_image_url, description: '', imageHint: ''},
    followers: followersData?.map(f => f.follower_id) || [],
    following: followingData?.map(f => f.following_id) || [],
    isAdmin: user.is_admin || false,
  };
}


export async function getUserById(id: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !user) {
    console.error('Error fetching user by id:', error);
    return null;
  }
  
  // This is a simplified representation.
  // You would need to fetch followers/following counts/arrays separately if needed.
   return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: { id: 'avatar-1', imageUrl: user.avatar_url, description: '', imageHint: ''},
    bio: user.bio,
    coverImage: { id: 'cover-1', imageUrl: user.cover_image_url, description: '', imageHint: ''},
    followers: [],
    following: [],
    isAdmin: user.is_admin || false,
  };
}

export async function getPosts(): Promise<EnrichedStory[]> {
  const { data: stories, error } = await supabase
    .from('stories')
    .select(
      `
      *,
      author:users (*),
      comments (
        *,
        author:users(id, name, username)
      )
    `
    )
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return stories.map((story) => ({
    ...story,
    authorId: story.author.id,
    authorName: story.author.name,
    authorUsername: story.author.username,
    comments: story.comments.map((comment: any) => ({
        ...comment,
        authorName: comment.author.name
    }))
  })) as EnrichedStory[];
}

export async function getPostsByUsername(
  username: string
): Promise<EnrichedStory[]> {
  const user = await getUserByUsername(username);
  if (!user) return [];

  const { data: stories, error } = await supabase
    .from('stories')
    .select(
       `
      *,
      author:users (*),
      comments (
        *,
        author:users(id, name, username)
      )
    `
    )
    .eq('author_id', user.id)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching posts by username:', error);
    return [];
  }
  
   return stories.map((story) => ({
    ...story,
    authorId: story.author.id,
    authorName: story.author.name,
    authorUsername: story.author.username,
    comments: story.comments.map((comment: any) => ({
        ...comment,
        authorName: comment.author.name
    }))
  })) as EnrichedStory[];
}

export async function getLikedPostsByUserId(
  userId: string
): Promise<EnrichedStory[]> {
  const { data: stories, error } = await supabase
    .from('stories')
    .select(
      `
      *,
      author:users (*),
      comments (
        *,
        author:users(id, name, username)
      )
    `
    )
    .contains('liked_by', [userId])
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching liked posts:', error);
    return [];
  }
  
  return stories.map((story) => ({
    ...story,
    authorId: story.author.id,
    authorName: story.author.name,
    authorUsername: story.author.username,
    comments: story.comments.map((comment: any) => ({
        ...comment,
        authorName: comment.author.name
    }))
  })) as EnrichedStory[];
}
