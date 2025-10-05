"use client";

import type { Story } from "@/lib/types";
import { PostCard } from "./post-card";

export function FeedDisplay({ stories }: { stories: (Story & { reason?: string })[] }) {
  return (
    <div className="p-4 md:p-6 h-full">
      <h2 className="text-3xl font-headline font-bold mb-6 hidden md:block">Story Feed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {stories.map((story) => (
          <PostCard key={story.id} post={story} />
        ))}
      </div>
    </div>
  );
}
