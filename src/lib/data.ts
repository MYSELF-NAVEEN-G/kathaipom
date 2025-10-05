import { PlaceHolderImages } from "./placeholder-images";
import type { User, Story, Comment } from "./types";
import fs from 'fs';
import path from 'path';

// In-memory "database"
let users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    username: "nafadmin",
    avatar: PlaceHolderImages.find((img) => img.id === "avatar-1")!,
    bio: "The chief architect of the Kathaipom platform. Ensuring stories are shared and heard.",
    coverImage: PlaceHolderImages.find((img) => img.id === "cover-1")!,
    followers: ["user-2", "user-3"],
    following: ["user-2", "user-3"],
    isAdmin: true,
  },
  {
    id: "user-2",
    name: "Jane Doe",
    username: "janedoe",
    avatar: PlaceHolderImages.find((img) => img.id === "avatar-2")!,
    bio: "Lover of fiction, coffee, and rainy days. Exploring the world one story at a time.",
    coverImage: PlaceHolderImages.find((img) => img.id === "cover-2")!,
    followers: ["user-1"],
    following: ["user-1", "user-3"],
    isAdmin: false,
  },
  {
    id: "user-3",
    name: "John Smith",
    username: "johnsmith",
    avatar: PlaceHolderImages.find((img) => img.id === "avatar-3")!,
    bio: "Documenting my adventures in technology, travel, and gastronomy. Based in NYC.",
    coverImage: PlaceHolderImages.find((img) => img.id === "cover-3")!,
    followers: ["user-1", "user-2"],
    following: ["user-1"],
    isAdmin: false,
  },
];

let comments: Comment[] = []

const postsFilePath = path.join(process.cwd(), 'src', 'lib', 'posts.json');

function readPostsFromFile(): Story[] {
  try {
    // Check if the file exists before trying to read it
    if (!fs.existsSync(postsFilePath)) {
      // If it doesn't exist, create it with an empty array
      fs.writeFileSync(postsFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    
    const data = fs.readFileSync(postsFilePath, 'utf-8');
    
    // Handle case where file is empty
    if (data.trim() === '') {
        return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing posts.json:", error);
    // If there's an error (e.g., malformed JSON), return an empty array as a fallback
    return [];
  }
}

export function writePostsToFile(posts: Story[]) {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to posts.json:", error);
  }
}


// Functions to interact with the in-memory data

export async function getUsers(): Promise<User[]> {
  return Promise.resolve(users);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const allUsers = await getUsers();
    return Promise.resolve(allUsers.find(u => u.username === username));
}


export async function getPosts(): Promise<Story[]> {
  return Promise.resolve(readPostsFromFile());
}

export async function getPostsByUsername(username: string): Promise<Story[]> {
    const allPosts = await getPosts();
    return Promise.resolve(allPosts.filter(p => p.authorUsername === username));
}


export async function getCommentsForPost(postId: string): Promise<Comment[]> {
    const posts = readPostsFromFile();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.comments) return Promise.resolve([]);
    const postCommentIds = new Set(post.comments.map(c => c.id));
    return Promise.resolve(comments.filter(c => postCommentIds.has(c.id)));
}

export async function getCurrentUser(): Promise<User> {
    if (typeof window !== 'undefined') {
        const username = localStorage.getItem('userUsername');
        const user = users.find(u => u.username === username);
        return user || users[0];
    }
    return users[0];
}
