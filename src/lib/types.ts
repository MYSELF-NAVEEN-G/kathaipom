import { type ImagePlaceholder } from "./placeholder-images";

// This is the shape of our 'users' table in Supabase
export type User = {
  id: string;
  name: string;
  username: string;
  avatar: ImagePlaceholder;
  bio: string;
  coverImage: ImagePlaceholder;
  followers: string[];
  following: string[];
  isAdmin: boolean;
};

// This is the shape of our 'comments' table in Supabase
export type Comment = {
  id: string;
  authorId: string; // user_id from Supabase
  authorName: string; // fetched via join
  content: string;
  timestamp: string; // created_at from Supabase
};


// This is the shape of our 'stories' table in Supabase
export type Story = {
  id:string;
  authorId: string; // author_id from Supabase
  authorName: string; // This will be joined from the users table
  authorUsername: string; // This will be joined from the users table
  content: string[];
  images?: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  timestamp: string; // created_at from Supabase
};


// This type is for client-side component hydration, joining Story with User
export type EnrichedStory = Story & {
  author: User;
  priorityScore?: number;
  reason?: string;
};
