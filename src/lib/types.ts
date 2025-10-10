import { type ImagePlaceholder } from "./placeholder-images";

// This is the shape of our 'users.json' file
export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string; // Should be hashed in a real app
  avatar: ImagePlaceholder;
  bio: string;
  coverImage: ImagePlaceholder;
  followers: string[];
  following: string[];
  isAdmin: boolean;
};

// This is the shape of comments within 'posts.json'
export type Comment = {
  id: string;
  authorId: string; // user.id
  authorName: string; // denormalized for convenience
  content: string;
  timestamp: string;
};


// This is the shape of our 'posts.json' file
export type Story = {
  id:string;
  authorId: string;
  authorName: string; 
  authorUsername: string;
  content: string[];
  images?: string[];
  likes: number;
  likedBy: string[]; // array of user.id
  comments: Comment[];
  timestamp: string;
};


// This type is for client-side component hydration, joining Story with User
export type EnrichedStory = Story & {
  author: User;
  priorityScore?: number;
  reason?: string;
};
