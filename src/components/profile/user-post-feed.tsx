"use client";

import type { Story } from "@/lib/types";
import { PostCard } from "@/components/feed/post-card";

export function UserPostFeed({ stories }: { stories: Story[] }) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold">No Stories Yet</h3>
        <p className="text-muted-foreground mt-2">This user hasn't published any stories.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {stories.map((story) => (
        <PostCard key={story.id} post={story} />
      ))}
    </div>
  );
}
