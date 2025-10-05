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
  content: string;
  timestamp: string;
};

export type Post = {
  id: string;
  authorId: string;
  content: string;
  image: ImagePlaceholder;
  likes: number;
  comments?: Comment[];
  timestamp: string;
};

export type EnrichedPost = Post & {
  author: User;
  priorityScore?: number;
  reason?: string;
};