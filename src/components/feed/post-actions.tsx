'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { likeStory, deleteStory } from '@/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function PostActions({
  postId,
  authorId,
  initialLikes,
}: {
  postId: string;
  authorId: string;
  initialLikes: number;
}) {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { toast } = useToast();

  const isAuthor = user?.id === authorId;
  const isAdmin = user?.isAdmin || false;

  const handleLike = () => {
    if (isLiked || !user) return;

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
          title: 'Story Deleted',
          description: 'The story has been successfully removed.',
        });
        setIsDeleted(true); // Optimistically update the UI
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to delete the story.',
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
        disabled={isLiked || isPending || !user}
        aria-label={isLiked ? 'Unlike story' : 'Like story'}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-colors',
            isLiked ? 'text-destructive fill-destructive' : 'text-foreground/70'
          )}
        />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Comment on story">
        <MessageCircle className="h-5 w-5 text-foreground/70" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Share story">
        <Share2 className="h-5 w-5 text-foreground/70" />
      </Button>
      {(isAuthor || isAdmin) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5 text-foreground/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Story</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
