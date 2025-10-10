import Image from "next/image";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info, Send } from "lucide-react";
import type { EnrichedStory, Story, User } from "@/lib/types";
import { PostActions } from "./post-actions";
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";
import { addComment } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";


function CommentForm({ postId }: { postId: string }) {
    const { user: currentUser } = useAuth();
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleCommentSubmit = async (formData: FormData) => {
        if (!currentUser) return;

        formData.append('authorId', currentUser.id);
        formData.append('authorName', currentUser.name);

        await addComment(formData);
        formRef.current?.reset();
    }

    if (!currentUser) return null; // Don't render the form if there's no user

    return (
        <form ref={formRef} action={handleCommentSubmit} className="flex items-center gap-2 px-4 pb-2 pt-2 w-full">
            <Input type="hidden" name="postId" value={postId} />
            <Input name="comment" placeholder="Add a comment..." className="h-9" required />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}

export function PostCard({ post: story }: { post: EnrichedStory & { reason?: string } }) {
  const authorName = story.authorName || 'Unknown Author';
  const authorUsername = story.authorUsername || 'unknown';
  
  const [author, setAuthor] = React.useState<User | null>(null);
  
  React.useEffect(() => {
      const fetchAuthor = async () => {
        // This simulates fetching the author details. In a real app this would be an API call.
        // For the prototype, we can assume the enriched story object from getPosts already has what we need
        // but we'll leave this here to mimic a real-world scenario where you might fetch extra details.
        if (story.author) {
            setAuthor(story.author as User);
        }
      }
      fetchAuthor();
  }, [story.author]);


  const firstPageContent = Array.isArray(story.content) ? story.content[0] : story.content;
  const firstImage = (story.images && story.images.length > 0) ? story.images[0] : null;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ease-in-out flex flex-col">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${authorUsername}`} className="flex-1 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={author?.avatar.imageUrl} alt={authorName} />
            <AvatarFallback>{authorName?.charAt(0) || "-"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{authorName}</p>
            <p className="text-xs text-muted-foreground">@{authorUsername}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
            {story.reason && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{story.reason}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
           <PostActions postId={story.id} initialLikes={story.likes} commentsCount={story.comments?.length || 0} />
        </div>

      </CardHeader>
      <CardContent className="p-0 flex-1">
        {firstImage && (
            <div className="relative aspect-[4/5] w-full">
            <Image
                src={firstImage}
                alt={"Story image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            </div>
        )}
        <div className="p-4 text-sm">
            <p className="line-clamp-3">{firstPageContent}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-0 mt-auto">
         <div className="w-full flex justify-between items-center text-xs text-muted-foreground px-4 pb-2 pt-1">
            <span>{formatDistanceToNow(new Date(story.timestamp), { addSuffix: true })}</span>
             <div className="flex items-center gap-1">
                <span className="font-medium">{story.likes.toLocaleString()} likes</span>
                <span className="mx-1">·</span>
                <span>{story.comments?.length || 0} comments</span>
            </div>
        </div>

        {story.comments && story.comments.length > 0 && (
            <div className="w-full px-4 pb-2 text-sm">
                <Separator className="my-2" />
                <div className="space-y-2 max-h-24 overflow-y-auto">
                {story.comments.map(comment => (
                    <div key={comment.id}>
                        <span className="font-semibold">{comment.authorName}</span>
                        <p className="text-muted-foreground d-inline ml-2">{comment.content}</p>
                    </div>
                ))}
                </div>
            </div>
        )}
        <Separator />
        <CommentForm postId={story.id} />
      </CardFooter>
    </Card>
  );
}
