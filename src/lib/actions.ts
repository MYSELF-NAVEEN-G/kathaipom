'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Story, Comment, User } from './types';
import { auth } from './auth';

export async function addStory(storyData: {
  content: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
  images?: string[];
}) {
  const supabase = createClient();
  const { data: story, error } = await supabase
    .from('stories')
    .insert([
      {
        author_id: storyData.authorId,
        content: storyData.content,
        images: storyData.images,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding story:', error);
    throw new Error('Failed to publish story.');
  }

  revalidatePath('/feed');
  revalidatePath(`/profile/${storyData.authorUsername}`);

  return story;
}

export async function likeStory(postId: string) {
  const { user } = await auth();
  if (!user) return;

  const supabase = createClient();

  // This is a simplified like action. A real implementation
  // would use a separate 'likes' table to avoid race conditions.
  const { data: post, error: fetchError } = await supabase
    .from('stories')
    .select('likes, liked_by')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    console.error('Error fetching post for like:', fetchError);
    return;
  }

  const likedBy = post.liked_by || [];
  if (likedBy.includes(user.id)) {
    return; // User already liked this post
  }

  const newLikes = (post.likes || 0) + 1;
  const newLikedBy = [...likedBy, user.id];

  const { error } = await supabase
    .from('stories')
    .update({ likes: newLikes, liked_by: newLikedBy })
    .eq('id', postId);

  if (error) {
    console.error('Error liking story:', error);
  } else {
    revalidatePath('/feed');
    // Also revalidate profile pages if needed
  }
}

export async function addComment(formData: FormData) {
  const postId = formData.get('postId') as string;
  const content = formData.get('comment') as string;
  
  const { user } = await auth();
  if (!user || !postId || !content) {
    return;
  }

  const supabase = createClient();

  const newComment = {
    story_id: postId,
    user_id: user.id,
    content: content,
  };

  const { error } = await supabase.from('comments').insert([newComment]);

  if (error) {
    console.error('Error adding comment:', error);
  } else {
    revalidatePath('/feed');
    // Consider revalidating post detail page if it exists
  }
}

export async function deleteStory(
  postId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const { user } = await auth();
    const supabase = createClient();
    if (!user) {
      throw new Error('You must be logged in to delete a story.');
    }
    
    // Check if the user is the author or an admin
    const { data: story, error: fetchError } = await supabase
        .from('stories')
        .select('author_id')
        .eq('id', postId)
        .single();
    
    if (fetchError || !story) {
         throw new Error('Story not found.');
    }
    
    // In a real app, you'd also check for an 'admin' role.
    if (story.author_id !== user.id) {
        throw new Error('You do not have permission to delete this story.');
    }
    
    const { error } = await supabase.from('stories').delete().eq('id', postId);
    
    if (error) throw error;

    revalidatePath('/feed');
    revalidatePath(`/profile/${user.user_metadata.username}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function followUser(followingId: string) {
    const { user: follower } = await auth();
    if (!follower) return;

    const supabase = createClient();

    // Prevent following self
    if (follower.id === followingId) return;

    const { error } = await supabase.from('followers').insert([
        { follower_id: follower.id, following_id: followingId },
    ]);
     if (error && error.code !== '23505') { // 23505 is unique_violation, ignore if already following
        console.error('Error following user:', error);
        return;
    }

    const { data: followingUser } = await supabase.from('users').select('username').eq('id', followingId).single();

    if(followingUser?.username) revalidatePath(`/profile/${followingUser.username}`);
    if(follower.user_metadata.username) revalidatePath(`/profile/${follower.user_metadata.username}`);
}

export async function unfollowUser(followingId: string) {
    const { user: follower } = await auth();
    if (!follower) return;

    const supabase = createClient();
    const { error } = await supabase.from('followers').delete()
        .eq('follower_id', follower.id)
        .eq('following_id', followingId);

    if (error) {
        console.error('Error unfollowing user:', error);
        return;
    }

    const { data: followingUser } = await supabase.from('users').select('username').eq('id', followingId).single();

    if(followingUser?.username) revalidatePath(`/profile/${followingUser.username}`);
    if(follower.user_metadata.username) revalidatePath(`/profile/${follower.user_metadata.username}`);
}


// addUser is now handled by Supabase Auth signUp.
// updateUser needs to be rewritten to update user profiles.
export async function updateUser(
  data: Partial<Pick<User, 'name' | 'bio' | 'avatar' | 'coverImage'>>
) {
  const { user } = await auth();
  if (!user) {
    throw new Error('Permission denied');
  }
  const supabase = createClient();
  
  const updateData: { [key: string]: any } = {
      name: data.name,
      bio: data.bio
  };
  
  if (data.avatar) updateData.avatar_url = data.avatar.imageUrl;
  if (data.coverImage) updateData.cover_image_url = data.coverImage.imageUrl;

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id);

  if (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not save your profile.');
  }

  revalidatePath(`/profile/${user.user_metadata.username}`);
  revalidatePath('/feed');
}

// deleteUserAndPosts is a more complex operation involving admin rights
// and cascading deletes, which is better handled with database policies
// or a dedicated admin interface. For now, we'll simplify or remove it.
export async function deleteUserAndPosts(userId: string) {
    // This requires admin privileges, which need to be properly implemented
    // with Row Level Security in Supabase.
    console.warn("deleteUserAndPosts requires admin privileges and RLS setup in Supabase.");
    return;
}
