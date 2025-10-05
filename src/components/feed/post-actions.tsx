"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { likePost } from "@/lib/actions";

export function PostActions({
  postId,
  initialLikes,
  commentsCount,
  imageUrl,
}: {
  postId: string;
  initialLikes: number;
  commentsCount: number;
  imageUrl?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) return; // Prevent multiple likes for now

    setIsLiked(true);
    setLikes((prev) => prev + 1);
    startTransition(() => {
      likePost(postId);
    });
  };

  const handleDownload = () => {
    if (!imageUrl) return;
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
          disabled={isLiked || isPending}
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
