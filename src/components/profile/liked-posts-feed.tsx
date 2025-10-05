
"use client";

import type { EnrichedStory } from "@/lib/types";
import { PostCard } from "@/components/feed/post-card";
import { Heart } from "lucide-react";

export function LikedPostsFeed({ stories }: { stories: EnrichedStory[] }) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
         <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                 <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
        </div>
        <h3 className="text-xl font-semibold">You haven't liked any stories yet</h3>
        <p className="text-muted-foreground mt-2">When you like a story, it will appear here.</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-2xl font-headline font-bold mb-6">Liked Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {stories.map((story) => (
            <PostCard key={story.id} post={story} />
        ))}
        </div>
    </div>
  );
}

