import { type ImagePlaceholder } from "./placeholder-images";

export type User = {
  id: string;
  name: string;
  username: string;
  avatar: ImagePlaceholder;
  followers: number;
  following: number;
  isAdmin: boolean;
};

export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
};

export type Post = {
  id:string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  content: string;
  image?: ImagePlaceholder;
  likes: number;
  comments: Comment[];
  timestamp: string;
};

export type EnrichedPost = Omit<Post, 'authorId'> & {
  author: User;
  priorityScore?: number;
  reason?: string;
};