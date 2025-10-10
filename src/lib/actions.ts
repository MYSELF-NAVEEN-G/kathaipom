'use server';

import { revalidatePath } from 'next/cache';
import type { Story, Comment, User } from './types';
import { auth } from './auth';
import { readUsersFromFile, writeUsersToFile, readPostsFromFile, writePostsToFile } from './data';
import { PlaceHolderImages } from './placeholder-images';

export async function addStory(storyData: {
  content: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
  images?: string[];
}) {
  const posts = await readPostsFromFile();

  const newStory: Story = {
    id: `post-${Date.now()}`,
    content: storyData.content,
    authorId: storyData.authorId,
    authorName: storyData.authorName,
    authorUsername: storyData.authorUsername,
    images: storyData.images || [],
    likes: 0,
    likedBy: [],
    comments: [],
    timestamp: new Date().toISOString(),
  };

  posts.unshift(newStory);
  await writePostsToFile(posts);

  revalidatePath('/feed');
  revalidatePath(`/profile/${storyData.authorUsername}`);

  return newStory;
}

export async function likeStory(postId: string) {
  const { user } = await auth();
  if (!user) return;

  const posts = await readPostsFromFile();
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    throw new Error('Post not found.');
  }

  const post = posts[postIndex];
  if (!post.likedBy.includes(user.id)) {
    post.likes++;
    post.likedBy.push(user.id);
  }

  await writePostsToFile(posts);
  revalidatePath('/feed');
}

export async function addComment(formData: FormData) {
  const postId = formData.get('postId') as string;
  const content = formData.get('comment') as string;
  
  const { user } = await auth();
  if (!user || !postId || !content) {
    return;
  }

  const posts = await readPostsFromFile();
  const post = posts.find(p => p.id === postId);

  if (!post) {
    throw new Error('Post not found');
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    authorId: user.id,
    authorName: user.name, // We can get this from the session
    content,
    timestamp: new Date().toISOString(),
  };

  post.comments.push(newComment);
  await writePostsToFile(posts);

  revalidatePath('/feed');
}

export async function deleteStory(
  postId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const { user } = await auth();
    if (!user) {
      throw new Error('You must be logged in to delete a story.');
    }
    
    const posts = await readPostsFromFile();
    const story = posts.find(p => p.id === postId);
    
    if (!story) {
         throw new Error('Story not found.');
    }
    
    if (story.authorId !== user.id && !user.isAdmin) {
        throw new Error('You do not have permission to delete this story.');
    }
    
    const updatedPosts = posts.filter(p => p.id !== postId);
    await writePostsToFile(updatedPosts);

    revalidatePath('/feed');
    revalidatePath(`/profile/${user.username}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function followUser(followingId: string) {
    const { user: follower } = await auth();
    if (!follower) return;

    const users = await readUsersFromFile();

    const followerUser = users.find(u => u.id === follower.id);
    const followingUser = users.find(u => u.id === followingId);

    if (!followerUser || !followingUser) {
        throw new Error('User not found.');
    }
    
    if (!followerUser.following.includes(followingId)) {
        followerUser.following.push(followingId);
    }
    if (!followingUser.followers.includes(follower.id)) {
        followingUser.followers.push(follower.id);
    }
    
    await writeUsersToFile(users);

    revalidatePath(`/profile/${followingUser.username}`);
    revalidatePath(`/profile/${follower.username}`);
}

export async function unfollowUser(followingId: string) {
    const { user: follower } = await auth();
    if (!follower) return;

    const users = await readUsersFromFile();
    const followerUser = users.find(u => u.id === follower.id);
    const followingUser = users.find(u => u.id === followingId);

    if (!followerUser || !followingUser) {
        throw new Error('User not found.');
    }

    followerUser.following = followerUser.following.filter(id => id !== followingId);
    followingUser.followers = followingUser.followers.filter(id => id !== follower.id);
    
    await writeUsersToFile(users);
    
    revalidatePath(`/profile/${followingUser.username}`);
    revalidatePath(`/profile/${follower.username}`);
}


export async function addUser(userData: Omit<User, 'id' | 'avatar' | 'bio' | 'coverImage' | 'followers' | 'following'> & { password?: string }) {
    const users = await readUsersFromFile();

    if (users.some(u => u.username === userData.username)) {
        throw new Error('Username already exists.');
    }
    if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists.');
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password, // In a real app, this would be hashed
        isAdmin: userData.isAdmin,
        avatar: PlaceHolderImages[Math.floor(Math.random() * 5)],
        bio: 'A new member of the Kathaipom community!',
        coverImage: PlaceHolderImages[Math.floor(Math.random() * 3) + 5],
        followers: [],
        following: [],
    };

    users.push(newUser);
    await writeUsersToFile(users);
    
    return newUser;
}


export async function updateUser(
  data: Partial<Pick<User, 'name' | 'bio' | 'avatar' | 'coverImage'>>
) {
  const { user } = await auth();
  if (!user) {
    throw new Error('Permission denied');
  }
  
  const users = await readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === user.id);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = { ...users[userIndex], ...data };
  users[userIndex] = updatedUser;

  await writeUsersToFile(users);

  revalidatePath(`/profile/${user.username}`);
  revalidatePath('/feed');
}

export async function deleteUserAndPosts(userId: string) {
    const { user: adminUser } = await auth();
    if (!adminUser || !adminUser.isAdmin) {
      throw new Error('Permission denied. Admins only.');
    }

    let users = await readUsersFromFile();
    let posts = await readPostsFromFile();

    // Remove user and their posts
    users = users.filter(u => u.id !== userId);
    posts = posts.filter(p => p.authorId !== userId);

    // Remove user from follower/following lists
    users.forEach(u => {
        u.followers = u.followers.filter(id => id !== userId);
        u.following = u.following.filter(id => id !== userId);
    });
    
    // Remove comments by the user
    posts.forEach(p => {
        p.comments = p.comments.filter(c => c.authorId !== userId);
    });

    await writeUsersToFile(users);
    await writePostsToFile(posts);

    revalidatePath('/admin/users');
    revalidatePath('/feed');
}
