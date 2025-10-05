'use server';

import { revalidatePath } from 'next/cache';
import type { Post } from './types';
import { getPosts, writePostsToFile } from './data';
import { PlaceHolderImages } from './placeholder-images';

export async function addPost(postData: {
  content: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
}) {
  const posts = await getPosts();

  const newPost: Post = {
    id: `post-${Date.now()}`,
    authorId: postData.authorId,
    authorName: postData.authorName,
    authorUsername: postData.authorUsername,
    content: postData.content,
    likes: 0,
    comments: [],
    timestamp: new Date().toISOString(),
  };

  const updatedPosts = [newPost, ...posts];
  await writePostsToFile(updatedPosts);

  // Revalidate the feed path to show the new post
  revalidatePath('/feed');

  return newPost;
}

export async function likePost(postId: string) {
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
    }
}