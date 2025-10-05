'use server';

import { revalidatePath } from 'next/cache';
import type { Story } from './types';
import { getPosts, writePostsToFile, getUsers, writeUsersToFile } from './data';

export async function addStory(storyData: {
  content: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
  images?: string[];
}) {
  const stories = await getPosts();

  const newStory: Story = {
    id: `post-${Date.now()}`,
    authorId: storyData.authorId,
    authorName: storyData.authorName,
    authorUsername: storyData.authorUsername,
    content: storyData.content,
    images: storyData.images,
    likes: 0,
    comments: [],
    timestamp: new Date().toISOString(),
  };

  const updatedStories = [newStory, ...stories];
  await writePostsToFile(updatedStories);

  // Revalidate the feed path to show the new story
  revalidatePath('/feed');
  revalidatePath(`/profile/${storyData.authorUsername}`);

  return newStory;
}

export async function likeStory(postId: string) {
    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        posts[postIndex].likes += 1;
        await writePostsToFile(posts);
        revalidatePath('/feed');
    }
}

export async function addComment(formData: FormData) {
    const postId = formData.get('postId') as string;
    const content = formData.get('comment') as string;
    const authorId = formData.get('authorId') as string;
    const authorName = formData.get('authorName') as string;

    if (!postId || !content || !authorId || !authorName) {
        return;
    }

    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        const newComment = {
            id: `comment-${Date.now()}`,
            authorId,
            authorName,
            content,
            timestamp: new Date().toISOString(),
        };
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        posts[postIndex].comments.unshift(newComment);
        await writePostsToFile(posts);
        revalidatePath('/feed');
        revalidatePath(`/profile/${posts[postIndex].authorUsername}`);
    }
}

export async function deleteStory(postId: string) {
    const posts = await getPosts();
    const postToDelete = posts.find(p => p.id === postId);

    if (!postToDelete) {
      throw new Error('Story not found');
    }

    const updatedPosts = posts.filter(p => p.id !== postId);
    
    await writePostsToFile(updatedPosts);
revalidatePath('/feed');
    if (postToDelete.authorUsername) {
        revalidatePath(`/profile/${postToDelete.authorUsername}`);
    }
}

export async function followUser(followerId: string, followingId: string) {
    const users = await getUsers();
    const follower = users.find(u => u.id === followerId);
    const userToFollow = users.find(u => u.id === followingId);

    if (follower && userToFollow) {
        if (!follower.following.includes(followingId)) {
            follower.following.push(followingId);
        }
        if (!userToFollow.followers.includes(followerId)) {
            userToFollow.followers.push(followerId);
        }
        await writeUsersToFile(users);
        revalidatePath(`/profile/${userToFollow.username}`);
        revalidatePath(`/profile/${follower.username}`);
    }
}

export async function unfollowUser(followerId: string, followingId: string) {
    const users = await getUsers();
    const followerIndex = users.findIndex(u => u.id === followerId);
    const userToUnfollowIndex = users.findIndex(u => u.id === followingId);

    if (followerIndex > -1 && userToUnfollowIndex > -1) {
        users[followerIndex].following = users[followerIndex].following.filter(id => id !== followingId);
        users[userToUnfollowIndex].followers = users[userToUnfollowIndex].followers.filter(id => id !== followerId);
        
        await writeUsersToFile(users);
        revalidatePath(`/profile/${users[userToUnfollowIndex].username}`);
        revalidatePath(`/profile/${users[followerIndex].username}`);
    }
}
