import { AppLayout } from "@/components/layout/app-layout";
import { FeedDisplay } from "@/components/feed/feed-display";
import { getPosts, getUsers } from "@/lib/data";
import {
  prioritizeFeed,
  type PrioritizeFeedInput,
  type PrioritizeFeedOutput,
} from "@/ai/flows/intelligent-feed-prioritization";
import type { EnrichedPost } from "@/lib/types";
import { Suspense } from "react";

export default async function Home() {
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
      comments: p.comments.length,
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
    prioritizedFeed = await prioritizeFeed(aiInput);
  } catch (error) {
    console.warn("AI feed prioritization failed. Falling back to chronological order.", error);
  }


  const priorityMap = new Map(
    prioritizedFeed.map((p) => [p.postId, { score: p.priorityScore, reason: p.reason }])
  );

  const sortedPosts: EnrichedPost[] = posts
    .map((post) => {
      const author = userMap.get(post.authorId);
      const priority = priorityMap.get(post.id);
      if (!author) return null;

      return {
        ...post,
        author,
        priorityScore: priority?.score || 0,
        reason: priority?.reason || "Not prioritized",
      };
    })
    .filter((p): p is EnrichedPost => p !== null)
    .sort((a, b) => {
        if (prioritizedFeed.length > 0) {
            return (b.priorityScore || 0) - (a.priorityScore || 0);
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <main>
      <AppLayout>
        <Suspense fallback={<div>Loading feed...</div>}>
          <FeedDisplay posts={sortedPosts} />
        </Suspense>
      </AppLayout>
    </main>
  );
}
