import { type ImagePlaceholder } from "./placeholder-images";

export type User = {
  id: string;
  name: string;
  username: string;
  avatar: ImagePlaceholder;
  bio: string;
  coverImage: ImagePlaceholder;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  isAdmin: boolean;
};

export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
};

export type Story = {
  id:string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  content: string[];
  images?: string[]; // Array of data URIs
  likes: number;
  likedBy: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  timestamp: string;
};

export type EnrichedStory = Omit<Story, 'authorId'> & {
  author: User;
  priorityScore?: number;
  reason?: string;
};
