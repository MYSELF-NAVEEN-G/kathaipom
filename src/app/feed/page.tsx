
import { AppLayout } from "@/components/layout/app-layout";
import { FeedDisplay } from "@/components/feed/feed-display";
import { getPosts } from "@/lib/data";
import {
  prioritizeFeed,
  type PrioritizeFeedInput,
  type PrioritizeFeedOutput,
} from "@/ai/flows/intelligent-feed-prioritization";
import type { Story } from "@/lib/types";
import { Suspense } from "react";

export default async function FeedPage() {
  const posts = await getPosts();

  // For performance, we are disabling the AI prioritization on every page load.
  // We can re-enable this behind a user control later.
  const prioritizedFeed: PrioritizeFeedOutput = [];

  const priorityMap = new Map(
    prioritizedFeed.map((p) => [
      p.postId,
      { score: p.priorityScore, reason: p.reason },
    ])
  );

  type StoryWithReason = Story & { reason?: string, priorityScore?: number };

  const sortedStories: StoryWithReason[] = posts
    .map((post) => {
      const priority = priorityMap.get(post.id);
      return {
        ...post,
        priorityScore: priority?.score || 0,
        reason: priority?.reason || "Not prioritized",
      };
    })
    .sort((a, b) => {
      // If the AI has run and returned results, sort by score.
      if (prioritizedFeed.length > 0) {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      }
      // Otherwise, sort by timestamp (newest first).
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <main>
      <AppLayout>
        <Suspense fallback={<div className="p-6">Loading stories...</div>}>
          {sortedStories.length > 0 ? (
            <FeedDisplay stories={sortedStories} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-6">
              <h2 className="text-2xl font-headline font-bold mb-2">
                Your Feed is Empty
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                It looks like there are no stories to show right now. Admins can
                start by creating a new story.
              </p>
            </div>
          )}
        </Suspense>
      </AppLayout>
    </main>
  );
}
