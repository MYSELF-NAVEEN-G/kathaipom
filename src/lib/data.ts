import fs from 'fs/promises';
import path from 'path';
import type { User, Story, EnrichedStory, Comment } from './types';
import { users as mockUsers } from './users';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'users.json');
const postsFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'posts.json');

// Helper to ensure data files exist
async function ensureFile(filePath: string, defaultData: any[]) {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    }
}

export async function readUsersFromFile(): Promise<User[]> {
    await ensureFile(usersFilePath, mockUsers);
    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

export async function writeUsersToFile(users: User[]): Promise<void> {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

export async function readPostsFromFile(): Promise<Story[]> {
    await ensureFile(postsFilePath, []);
    const fileContent = await fs.readFile(postsFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

export async function writePostsToFile(posts: Story[]): Promise<void> {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}

export async function getUsers(): Promise<User[]> {
  return await readUsersFromFile();
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const users = await readUsersFromFile();
  const user = users.find(u => u.username === username);
  return user || null;
}


export async function getUserById(id: string): Promise<User | null> {
  const users = await readUsersFromFile();
  const user = users.find(u => u.id === id);
  return user || null;
}

export async function getPosts(): Promise<EnrichedStory[]> {
    const posts = await readPostsFromFile();
    const users = await readUsersFromFile();

    return posts.map(post => {
        const author = users.find(u => u.id === post.authorId);
        return {
            ...post,
            author: author!,
            authorName: author!.name,
            authorUsername: author!.username,
            // Enrich comments with author name
            comments: post.comments.map(comment => {
                const commentAuthor = users.find(u => u.id === comment.authorId);
                return {
                    ...comment,
                    authorName: commentAuthor?.name || 'Unknown',
                };
            }),
        }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getPostsByUsername(
  username: string
): Promise<EnrichedStory[]> {
  const user = await getUserByUsername(username);
  if (!user) return [];

  const allPosts = await getPosts();
  return allPosts.filter(p => p.authorId === user.id);
}

export async function getLikedPostsByUserId(
  userId: string
): Promise<EnrichedStory[]> {
  const allPosts = await getPosts();
  return allPosts.filter(p => p.likedBy.includes(userId));
}
