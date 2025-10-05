'use server';

import { revalidatePath } from 'next/cache';
import type { Story } from './types';
import { getPosts, writePostsToFile } from './data';

export async function addStory(storyData: {
  content: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
}) {
  const stories = await getPosts();

  const newStory: Story = {
    id: `post-${Date.now()}`,
    authorId: storyData.authorId,
    authorName: storyData.authorName,
    authorUsername: storyData.authorUsername,
    content: storyData.content,
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
