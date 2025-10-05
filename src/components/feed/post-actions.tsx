"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostActions({
  initialLikes,
  commentsCount,
  imageUrl,
}: {
  initialLikes: number;
  commentsCount: number;
  imageUrl?: string;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    // In a real app, you would call a server action here to persist the like
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    // This is a simple download trigger.
    // In a real app, you might need a more robust solution depending on browser support and image origins.
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `kathaipom-post-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex w-full items-center justify-between px-4 pt-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isLiked ? "text-destructive fill-destructive" : "text-foreground/70"
            )}
          />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Comment on post">
          <MessageCircle className="h-5 w-5 text-foreground/70" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Share post">
          <Share2 className="h-5 w-5 text-foreground/70" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        {imageUrl && (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                aria-label="Download post image"
            >
                <Download className="h-5 w-5 text-foreground/70" />
            </Button>
        )}
        <div className="text-sm text-muted-foreground hidden sm:block">
          <span className="font-medium">{likes.toLocaleString()} likes</span>
          <span className="mx-2">·</span>
          <span>{commentsCount.toLocaleString()} comments</span>
        </div>
      </div>
    </div>
  );
}
