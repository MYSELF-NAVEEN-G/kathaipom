import { promises as fs } from 'fs';
import path from 'path';
import { users as mockUsers } from './users';
import type { User, Story, EnrichedStory } from './types';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');
const postsFilePath = path.join(process.cwd(), 'src', 'lib', 'posts.json');

async function readUsersFromFile(): Promise<User[]> {
  try {
    await fs.access(usersFilePath);
    const data = await fs.readFile(usersFilePath, 'utf-8');
    if (data.trim() === '') return mockUsers; // If file is empty, use mock
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with mock data
    await writeUsersToFile(mockUsers);
    return mockUsers;
  }
}

export async function writeUsersToFile(users: User[]): Promise<void> {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to users.json:", error);
  }
}

async function readPostsFromFile(): Promise<Story[]> {
  try {
    await fs.access(postsFilePath);
    const data = await fs.readFile(postsFilePath, 'utf-8');
    if (data.trim() === '') return [];
    return JSON.parse(data);
  } catch (error) {
     // If the file doesn't exist, create it with an empty array
    await writePostsToFile([]);
    return [];
  }
}

export async function writePostsToFile(posts: Story[]): Promise<void> {
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to posts.json:", error);
  }
}

// -- Data Access Functions --

export async function getUsers(): Promise<User[]> {
  return await readUsersFromFile();
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const allUsers = await getUsers();
    const user = allUsers.find(u => u.username === username);
    if (!user) return undefined;
    
    // Dynamically calculate followers based on the entire user list
    const followers = allUsers.filter(u => u.following.includes(user.id)).map(u => u.id);
    
    return { ...user, followers, following: user.following || [] };
}

export async function getUserById(id: string): Promise<User | undefined> {
    const allUsers = await getUsers();
    return allUsers.find(u => u.id === id);
}


export async function getPosts(): Promise<EnrichedStory[]> {
    const posts = await readPostsFromFile();
    const users = await getUsers();
    
    return posts.map(post => {
        const author = users.find(u => u.id === post.authorId);
        return {
            ...post,
            // Return a fallback author if not found to prevent crashes
            author: author || {
                id: 'unknown',
                name: 'Unknown Author',
                username: 'unknown',
                avatar: { id: 'avatar-1', imageUrl: '', description: '', imageHint: '' },
                bio: '',
                coverImage: { id: 'cover-1', imageUrl: '', description: '', imageHint: '' },
                followers: [],
                following: [],
                isAdmin: false,
            }
        };
    });
}

export async function getPostsByUsername(username: string): Promise<EnrichedStory[]> {
    const allPosts = await getPosts();
    const user = await getUserByUsername(username);
    if (!user) return [];
    return allPosts.filter(p => p.authorId === user.id);
}

export async function getLikedPostsByUserId(userId: string): Promise<EnrichedStory[]> {
    const allPosts = await getPosts();
    return allPosts.filter(p => p.likedBy && p.likedBy.includes(userId));
}
