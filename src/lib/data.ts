import { PlaceHolderImages } from "./placeholder-images";
import type { User, Post, Comment } from "./types";
import fs from 'fs';
import path from 'path';

// In-memory "database"
let users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    username: "nafadmin",
    avatar: PlaceHolderImages.find((img) => img.id === "avatar-1")!,
    followers: 1250,
    following: 250,
    isAdmin: true,
  },
  {
    id: "user-2",
    name: "Jane Doe",
    username: "janedoe",
    avatar: PlaceHolderImages.find((img) => img.id === "avatar-2")!,
    followers: 850,
    following: 120,
    isAdmin: false,
  },
  {
    id: "user-3",
    name: "John Smith",
    username: "johnsmith",
    avatar: PlaceHolderImages.find((img) => img.id === "avatar-3")!,
    followers: 430,
    following: 90,
    isAdmin: false,
  },
];

let comments: Comment[] = []

const postsFilePath = path.join(process.cwd(), 'src', 'lib', 'posts.json');

function readPostsFromFile(): Post[] {
  try {
    const data = fs.readFileSync(postsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

function writePostsToFile(posts: Post[]) {
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}


// Functions to interact with the in-memory data

export async function getUsers(): Promise<User[]> {
  return Promise.resolve(users);
}

export async function getPosts(): Promise<Post[]> {
  return Promise.resolve(readPostsFromFile());
}

export async function addPost(postData: { content: string; authorId: string; }): Promise<Post> {
  const posts = readPostsFromFile();
  const postImages = PlaceHolderImages.filter(p => p.id.startsWith('post-'));
  const randomImage = postImages[Math.floor(Math.random() * postImages.length)];

  const newPost: Post = {
    id: `post-${Date.now()}`,
    authorId: postData.authorId,
    content: postData.content,
    image: randomImage,
    likes: 0,
    comments: [],
    timestamp: new Date().toISOString(),
  };
  const updatedPosts = [newPost, ...posts]; // Add to the beginning of the array
  writePostsToFile(updatedPosts);
  return Promise.resolve(newPost);
}


export async function getCommentsForPost(postId: string): Promise<Comment[]> {
    const posts = readPostsFromFile();
    return Promise.resolve(comments.filter(c => posts.find(p => p.id === postId)?.comments?.map(pc => pc.id).includes(c.id)));
}

export async function getCurrentUser(): Promise<User> {
    // In a real app, this would be determined by the authenticated user
    // For now, we can get the user from localStorage
    if (typeof window !== 'undefined') {
        const username = localStorage.getItem('userUsername');
        const user = users.find(u => u.username === username);
        return user || users[0];
    }
    return users[0];
}
