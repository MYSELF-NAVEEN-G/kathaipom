import { AppLayout } from "@/components/layout/app-layout";
import { FeedDisplay } from "@/components/feed/feed-display";
import { getPosts, getUsers } from "@/lib/data";
import {
  prioritizeFeed,
  type PrioritizeFeedInput,
  type PrioritizeFeedOutput,
} from "@/ai/flows/intelligent-feed-prioritization";
import type { Post } from "@/lib/types";
import { Suspense } from "react";

export default async function FeedPage() {
  const postsData = getPosts();
  const usersData = getUsers();

  const [posts, users] = await Promise.all([postsData, usersData]);

  // Create a map for quick user lookup
  const userMap = new Map(users.map((u) => [u.id, u]));

  const aiInput: PrioritizeFeedInput = {
    posts: posts.map((p) => ({
      postId: p.id,
      content: p.content,
      authorId: p.authorId,
      likes: p.likes,
      comments: p.comments?.length || 0,
    })),
    userInterests: [
      "modern art",
      "minimalist photography",
      "architecture",
      "travel",
      "design",
    ],
    userInteractionHistory: [
      {
        postId: "post-2",
        interactionType: "like",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        postId: "post-5",
        interactionType: "comment",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        postId: "post-8",
        interactionType: "follow",
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
  };

  let prioritizedFeed: PrioritizeFeedOutput = [];
  try {
    if (posts.length > 0) {
      prioritizedFeed = await prioritizeFeed(aiInput);
    }
  } catch (error) {
    console.warn(
      "AI feed prioritization failed. Falling back to chronological order.",
      error
    );
    // If AI fails, we'll just use the default empty array, and the sort below will be chronological.
  }

  const priorityMap = new Map(
    prioritizedFeed.map((p) => [
      p.postId,
      { score: p.priorityScore, reason: p.reason },
    ])
  );

  type PostWithReason = Post & { reason?: string, priorityScore?: number };

  const sortedPosts: PostWithReason[] = posts
    .map((post) => {
      const priority = priorityMap.get(post.id);
      return {
        ...post,
        priorityScore: priority?.score || 0,
        reason: priority?.reason || "Not prioritized",
      };
    })
    .sort((a, b) => {
      if (prioritizedFeed.length > 0) {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <main>
      <AppLayout>
        <Suspense fallback={<div className="p-6">Loading feed...</div>}>
          {sortedPosts.length > 0 ? (
            <FeedDisplay posts={sortedPosts} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-6">
              <h2 className="text-2xl font-headline font-bold mb-2">
                Your Feed is Empty
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                It looks like there are no posts to show right now. Admins can
                start by creating a new post.
              </p>
            </div>
          )}
        </Suspense>
      </AppLayout>
    </main>
  );
}