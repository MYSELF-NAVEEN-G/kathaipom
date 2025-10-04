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

const comments: Comment[] = [
    { id: 'comment-1', authorId: 'user-2', content: 'Amazing shot!', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'comment-2', authorId: 'user-3', content: 'Love this place.', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 'comment-3', authorId: 'user-2', content: 'Great perspective!', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
]

const posts: Post[] = [
  {
    id: "post-1",
    authorId: "user-1",
    content: "Exploring the clean lines and beautiful simplicity of modern architecture. It's amazing how design can shape our environment.",
    image: PlaceHolderImages.find((img) => img.id === "post-1")!,
    likes: 132,
    comments: [comments[0]],
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "post-2",
    authorId: "user-1",
    content: "A moment of peace by the lake. The water was like glass this morning. #nature #serenity",
    image: PlaceHolderImages.find((img) => img.id === "post-2")!,
    likes: 458,
    comments: [comments[1], comments[2]],
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "post-3",
    authorId: "user-1",
    content: "The city comes alive at night. The vibrant energy is just contagious. #citylife #nightphotography",
    image: PlaceHolderImages.find((img) => img.id === "post-3")!,
    likes: 210,
    comments: [],
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "post-4",
    authorId: "user-1",
    content: "Good food is good mood. Trying out this new Italian place downtown. Highly recommended!",
    image: PlaceHolderImages.find((img) => img.id === "post-4")!,
    likes: 350,
    comments: [comments[0], comments[1]],
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "post-5",
    authorId: "user-1",
    content: "There's nothing quite like reaching the summit. The view is always worth the climb. #hiking #adventure",
    image: PlaceHolderImages.find((img) => img.id === "post-5")!,
    likes: 670,
    comments: [],
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "post-6",
    authorId: "user-1",
    content: "Lost in the colors and shapes of abstract art. Every piece tells a different story. #art #abstract",
    image: PlaceHolderImages.find((img) => img.id === "post-6")!,
    likes: 180,
    comments: [],
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "post-7",
    authorId: "user-1",
    content: "Just a lazy Sunday with my furry friend. Cats make everything better. #catsofinstagram",
    image: PlaceHolderImages.find((img) => img.id === "post-7")!,
    likes: 980,
    comments: [comments[2]],
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "post-8",
    authorId: "user-1",
    content: "Salt in the air, sand in my hair. A perfect day at the beach to unwind and recharge. #beachlife #travel",
    image: PlaceHolderImages.find((img) => img.id === "post-8")!,
    likes: 540,
    comments: [],
    timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "post-9",
    authorId: "user-1",
    content: "Finding inspiration in the quiet corner of a cozy coffee shop. The perfect place to think and create.",
    image: PlaceHolderImages.find((img) => img.id === "post-9")!,
    likes: 290,
    comments: [],
    timestamp: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: "post-10",
    authorId: "user-1",
    content: "The energy of live music is something else. Incredible performance last night! #livemusic #concert",
    image: PlaceHolderImages.find((img) => img.id === "post-10")!,
    likes: 410,
    comments: [comments[0]],
    timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

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
