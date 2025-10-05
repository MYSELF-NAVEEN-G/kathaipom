import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Info } from "lucide-react";
import type { EnrichedPost } from "@/lib/types";
import { PostActions } from "./post-actions";
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export function PostCard({ post }: { post: EnrichedPost }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={post.author.avatar.imageUrl} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">@{post.author.username}</p>
        </div>
        <div className="flex items-center gap-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">{post.reason}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>

      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={post.image.imageUrl}
            alt={post.image.description}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={post.image.imageHint}
          />
        </div>
        <div className="p-4 text-sm">
            <p className="line-clamp-2">{post.content}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-0">
        <PostActions initialLikes={post.likes} commentsCount={post.comments?.length || 0} imageUrl={post.image.imageUrl} />
        <p className="px-4 pb-4 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}