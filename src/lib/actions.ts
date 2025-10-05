'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { PlaceHolderImages } from './placeholder-images';
import type { Post } from './types';
import { getPosts, writePostsToFile } from './data';

export async function addPost(postData: {
  content: string;
  authorId: string;
}) {
  const posts = await getPosts();
  const postImages = PlaceHolderImages.filter((p) =>
    p.id.startsWith('post-')
  );
  const randomImage =
    postImages[Math.floor(Math.random() * postImages.length)];

  const newPost: Post = {
    id: `post-${Date.now()}`,
    authorId: postData.authorId,
    content: postData.content,
    image: randomImage,
    likes: 0,
    comments: [],
    timestamp: new Date().toISOString(),
  };

  const updatedPosts = [newPost, ...posts];
  writePostsToFile(updatedPosts);

  // Revalidate the feed path to show the new post
  revalidatePath('/feed');

  return newPost;
}
