"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { likeStory, deleteStory } from "@/lib/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function PostActions({
  postId,
  initialLikes,
  commentsCount,
}: {
  postId: string;
  initialLikes: number;
  commentsCount: number;
  imageUrl?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleLike = () => {
    if (isLiked) return; 

    setIsLiked(true);
    setLikes((prev) => prev + 1);
    startTransition(() => {
      likeStory(postId);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteStory(postId);
        toast({
          title: "Story Deleted",
          description: "The story has been successfully removed.",
        });
        setIsDeleted(true); // Optimistically update the UI
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to delete the story.",
        });
      }
    });
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-start ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          disabled={isLiked || isPending}
          aria-label={isLiked ? "Unlike story" : "Like story"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isLiked ? "text-destructive fill-destructive" : "text-foreground/70"
            )}
          />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Comment on story">
          <MessageCircle className="h-5 w-5 text-foreground/70" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Share story">
          <Share2 className="h-5 w-5 text-foreground/70" />
        </Button>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5 text-foreground/70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {(userRole === 'super-admin' || userRole === 'writer') && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Story</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
