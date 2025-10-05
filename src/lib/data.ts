import { PlaceHolderImages } from "./placeholder-images";
import type { User, Post, Comment } from "./types";

const users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    username: "admin",
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

const comments: Comment[] = []

const posts: Post[] = [];

export async function getUsers(): Promise<User[]> {
  // In a real app, this would fetch from Firebase.
  return Promise.resolve(users);
}

export async function getPosts(): Promise<Post[]> {
  // In a real app, this would fetch from Firebase.
  return Promise.resolve(posts);
}

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
    return Promise.resolve(comments.filter(c => posts.find(p => p.id === postId)?.comments.map(pc => pc.id).includes(c.id)));
}

export async function getCurrentUser(): Promise<User> {
    return Promise.resolve(users[0]);
}
