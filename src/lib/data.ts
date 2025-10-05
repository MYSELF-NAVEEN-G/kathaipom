import { PlaceHolderImages } from "./placeholder-images";
import type { User, Story } from "./types";
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');
const postsFilePath = path.join(process.cwd(), 'src', 'lib', 'posts.json');


function readUsersFromFile(): User[] {
  try {
    if (!fs.existsSync(usersFilePath)) {
      const initialUsers: User[] = [
        {
          id: "user-1",
          name: "Admin User",
          username: "nafadmin",
          avatar: PlaceHolderImages.find((img) => img.id === "avatar-1")!,
          bio: "The chief architect of the Kathaipom platform. Ensuring stories are shared and heard.",
          coverImage: PlaceHolderImages.find((img) => img.id === "cover-1")!,
          followers: [],
          following: [],
          isAdmin: true,
        },
        {
          id: "user-2",
          name: "Jane Doe",
          username: "janedoe",
          avatar: PlaceHolderImages.find((img) => img.id === "avatar-2")!,
          bio: "Lover of fiction, coffee, and rainy days. Exploring the world one story at a time.",
          coverImage: PlaceHolderImages.find((img) => img.id === "cover-2")!,
          followers: [],
          following: [],
          isAdmin: false,
        },
        {
          id: "user-3",
          name: "John Smith",
          username: "johnsmith",
          avatar: PlaceHolderImages.find((img) => img.id === "avatar-3")!,
          bio: "Documenting my adventures in technology, travel, and gastronomy. Based in NYC.",
          coverImage: PlaceHolderImages.find((img) => img.id === "cover-3")!,
          followers: [],
          following: [],
          isAdmin: false,
        },
      ];
      writeUsersToFile(initialUsers);
      return initialUsers;
    }
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
}

export function writeUsersToFile(users: User[]) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to users.json:", error);
  }
}


function readPostsFromFile(): Story[] {
  try {
    if (!fs.existsSync(postsFilePath)) {
      fs.writeFileSync(postsFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    
    const data = fs.readFileSync(postsFilePath, 'utf-8');
    if (data.trim() === '') return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing posts.json:", error);
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

// Functions to interact with the data

export async function getUsers(): Promise<User[]> {
  return Promise.resolve(readUsersFromFile());
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const allUsers = await getUsers();
    const user = allUsers.find(u => u.username === username);
    if (!user) return undefined;
    
    // Dynamically calculate followers and following based on the entire user list
    const followers = allUsers.filter(u => u.following.includes(user.id)).map(u => u.id);
    const following = user.following; // This is already stored correctly on the user object

    return { ...user, followers, following };
}

export async function getUserById(id: string): Promise<User | undefined> {
    const allUsers = await getUsers();
    return allUsers.find(u => u.id === id);
}


export async function getPosts(): Promise<Story[]> {
  return Promise.resolve(readPostsFromFile());
}

export async function getPostsByUsername(username: string): Promise<Story[]> {
    const allPosts = await getPosts();
    const user = await getUserByUsername(username);
    if (!user) return [];
    return Promise.resolve(allPosts.filter(p => p.authorId === user.id));
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
    const users = await getUsers();
    const newUser: User = {
        ...user,
        id: `user-${Date.now()}`
    };
    const updatedUsers = [...users, newUser];
    writeUsersToFile(updatedUsers);
    return newUser;
}