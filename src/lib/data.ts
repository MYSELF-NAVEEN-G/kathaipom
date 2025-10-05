import { PlaceHolderImages } from "./placeholder-images";
import type { User, Post, Comment } from "./types";

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

let posts: Post[] = [];

// Functions to interact with the in-memory data

export async function getUsers(): Promise<User[]> {
  return Promise.resolve(users);
}

export async function getPosts(): Promise<Post[]> {
  return Promise.resolve(posts);
}

export async function addPost(postData: { content: string; authorId: string; }): Promise<Post> {
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
  posts = [newPost, ...posts]; // Add to the beginning of the array
  return Promise.resolve(newPost);
}


export async function getCommentsForPost(postId: string): Promise<Comment[]> {
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