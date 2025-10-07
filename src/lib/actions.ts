'use server';

import { revalidatePath } from 'next/cache';
import type { Story, Comment, User, ImagePlaceholder, EnrichedStory } from './types';
import { getPosts, writePostsToFile, getUsers, writeUsersToFile, getUserById } from './data';
import { auth } from './auth';

export async function addStory(storyData: {
  content: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
  images?: string[];
}) {
  const stories = await getPosts();
  const author = await getUserById(storyData.authorId);
  if (!author) {
    throw new Error('Author not found');
  }

  const newStory: EnrichedStory = {
    id: `post-${Date.now()}`,
    author,
    authorId: storyData.authorId,
    authorName: storyData.authorName,
    authorUsername: storyData.authorUsername,
    content: storyData.content,
    images: storyData.images,
    likes: 0,
    likedBy: [],
    comments: [],
    timestamp: new Date().toISOString(),
  };

  const updatedStories = [newStory, ...stories];
  await writePostsToFile(updatedStories);

  revalidatePath('/feed');
  revalidatePath(`/profile/${storyData.authorUsername}`);

  return newStory;
}

export async function likeStory(postId: string) {
    const { user } = await auth();
    if (!user) return; // Or throw an error

    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        const post = posts[postIndex];
        // Prevent multiple likes from the same user
        if (!post.likedBy) {
            post.likedBy = [];
        }
        if (!post.likedBy.includes(user.id)) {
            post.likes += 1;
            post.likedBy.push(user.id);
            await writePostsToFile(posts);
            revalidatePath('/feed');
            if (post.authorUsername) {
                revalidatePath(`/profile/${post.authorUsername}`);
            }
             revalidatePath(`/profile/${user.username}`);
        }
    }
}

export async function addComment(formData: FormData) {
    const postId = formData.get('postId') as string;
    const content = formData.get('comment') as string;
    
    const { user } = await auth();
    if (!user || !postId || !content) {
        return;
    }

    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            authorId: user.id,
            authorName: user.name,
            content,
            timestamp: new Date().toISOString(),
        };
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        posts[postIndex].comments.unshift(newComment);
        await writePostsToFile(posts);
        revalidatePath('/feed');
        revalidatePath(`/profile/${posts[postIndex].authorUsername}`);
    }
}

export async function deleteStory(postId: string) {
    const { user: authUser } = await auth();
    if (!authUser) {
      throw new Error('You must be logged in to delete a story.');
    }

    const currentUser = await getUserById(authUser.id);
    if (!currentUser || !currentUser.isAdmin) {
         throw new Error('Permission denied. You do not have admin privileges.');
    }

    const posts = await getPosts();
    const postToDelete = posts.find(p => p.id === postId);

    if (!postToDelete) {
      throw new Error('Story not found');
    }
    
    const updatedPosts = posts.filter(p => p.id !== postId);
    await writePostsToFile(updatedPosts);

    revalidatePath('/feed');
    if (postToDelete.authorUsername) {
        revalidatePath(`/profile/${postToDelete.authorUsername}`);
    }
}

export async function followUser(followingId: string) {
    const { user: follower } = await auth();
    if (!follower) return;

    const users = await getUsers();
    
    const followerIndex = users.findIndex(u => u.id === follower.id);
    const userToFollowIndex = users.findIndex(u => u.id === followingId);

    if (followerIndex !== -1 && userToFollowIndex !== -1) {
        const followerUser = users[followerIndex];
        const userToFollow = users[userToFollowIndex];

        if (!followerUser.following.includes(followingId)) {
            followerUser.following.push(followingId);
        }
        if (!userToFollow.followers.includes(followerUser.id)) {
            userToFollow.followers.push(followerUser.id);
        }
        await writeUsersToFile(users);
        revalidatePath(`/profile/${userToFollow.username}`);
        revalidatePath(`/profile/${followerUser.username}`);
    }
}

export async function unfollowUser(followingId: string) {
    const { user: follower } = await auth();
    if (!follower) return;

    const users = await getUsers();
    const followerIndex = users.findIndex(u => u.id === follower.id);
    const userToUnfollowIndex = users.findIndex(u => u.id === followingId);

    if (followerIndex > -1 && userToUnfollowIndex > -1) {
        users[followerIndex].following = users[followerIndex].following.filter(id => id !== followingId);
        users[userToUnfollowIndex].followers = users[userToUnfollowIndex].followers.filter(id => id !== follower.id);
        
        await writeUsersToFile(users);
        revalidatePath(`/profile/${users[userToUnfollowIndex].username}`);
        revalidatePath(`/profile/${users[followerIndex].username}`);
    }
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
    const users = await getUsers();
    if (user.username) {
        const existingUser = users.find(u => u.username.toLowerCase() === user.username.toLowerCase());
        if (existingUser) {
            throw new Error('Username is already taken.');
        }
    }
    const newUser: User = {
        ...user,
        id: `user-${Date.now()}`
    };
    const updatedUsers = [...users, newUser];
    await writeUsersToFile(updatedUsers);
    return newUser;
}

export async function updateUser(data: Partial<Pick<User, 'name' | 'bio' | 'username'> & { avatar?: ImagePlaceholder, coverImage?: ImagePlaceholder }>) {
    const { user } = await auth();
    if (!user) {
        throw new Error('Permission denied');
    }

    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex === -1) {
        throw new Error('User not found');
    }

    if (data.username && data.username !== users[userIndex].username) {
        const existingUser = users.find(u => u.username.toLowerCase() === data.username?.toLowerCase());
        if (existingUser) {
            throw new Error('Username is already taken.');
        }
    }

    const updatedUser = {
        ...users[userIndex],
        ...data,
    };
    users[userIndex] = updatedUser;

    await writeUsersToFile(users);

    if (data.name || data.avatar) {
        const posts = await getPosts();
        const updatedPosts = posts.map(post => {
            if (post.authorId === user.id) {
                return {
                    ...post,
                    authorName: updatedUser.name,
                    author: {
                        ...(post.author as User),
                        name: updatedUser.name,
                        avatar: updatedUser.avatar,
                    }
                };
            }
            return post;
        });
        await writePostsToFile(updatedPosts);
    }

    revalidatePath(`/profile/${user.username}`);
    if (data.username && data.username !== user.username) {
         revalidatePath(`/profile/${data.username}`);
    }
    revalidatePath('/feed'); 
}


export async function deleteUserAndPosts(userId: string) {
    const { user: authUser } = await auth();
    if (!authUser || !authUser.isAdmin) {
        throw new Error("Permission denied. You must be an admin to delete a user.");
    }
    if (authUser.id === userId) {
        throw new Error("Admins cannot delete their own accounts.");
    }

    // Remove user
    const users = await getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    if (users.length === updatedUsers.length) {
        throw new Error("User not found.");
    }
    await writeUsersToFile(updatedUsers);

    // Remove user's posts
    const posts = await getPosts();
    const updatedPosts = posts.filter(p => p.authorId !== userId);
    await writePostsToFile(updatedPosts);

    revalidatePath('/admin/users');
    revalidatePath('/feed');
}

