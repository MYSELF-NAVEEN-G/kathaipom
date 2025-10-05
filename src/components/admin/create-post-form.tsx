"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Send, CheckCircle } from "lucide-react";
import { addStory } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type UserInfo = {
    id: string;
    name: string;
    username: string;
}

function ImageSelector({ selectedImageId, onSelect }: { selectedImageId: string | null, onSelect: (id: string) => void }) {
  const postImages = PlaceHolderImages.filter(img => img.id.startsWith('post-'));

  return (
    <div className="grid gap-2">
      <Label>Select a Cover Image</Label>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 pb-4">
          {postImages.map((image) => (
            <div
              key={image.id}
              className={cn(
                "relative flex-shrink-0 w-40 h-40 rounded-md overflow-hidden cursor-pointer group border-4",
                selectedImageId === image.id ? "border-primary" : "border-transparent"
              )}
              onClick={() => onSelect(image.id)}
            >
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
               <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              {selectedImageId === image.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}


export function CreatePostForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isWriter, setIsWriter] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [content, setContent] = React.useState('');
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);


  React.useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const username = localStorage.getItem('userUsername');
    const isAllowed = role === 'writer' || role === 'super-admin';
    setIsWriter(isAllowed);
    
    if (isAllowed && name && username) {
        // Special case for super-admin to ensure correct ID is used
        const userId = username === 'nafadmin' ? 'user-1' : username;
        setUserInfo({ id: userId, name, username });
    }
  }, []);

  const handleFormAction = async (formData: FormData) => {
    if (!isWriter || !userInfo) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to create stories.",
        });
        return;
    }
    
    const content = formData.get('content') as string;
    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Story is empty',
        description: 'Please write something before publishing.',
      });
      return;
    }

    try {
        await addStory({
            content,
            authorId: userInfo.id,
            authorName: userInfo.name,
            authorUsername: userInfo.username,
            imageId: selectedImageId ?? undefined
        });

        toast({
          title: "Story Published!",
          description: "Your new story is now live.",
        });

        // Reset form
        setContent('');
        setSelectedImageId(null);
        formRef.current?.reset();
        
        // Redirect to the feed to see the new story
        router.push('/feed');

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to publish the story.",
        });
    }
  };

  return (
    <form ref={formRef} action={handleFormAction}>
      <fieldset disabled={!isWriter}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="post-content">Your Story</Label>
              <Textarea
                id="post-content"
                name="content"
                placeholder="Once upon a time..."
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <ImageSelector selectedImageId={selectedImageId} onSelect={setSelectedImageId} />
          </CardContent>
          <CardFooter className="flex justify-end p-6 pt-0">
            <Button type="submit">
              <Send className="mr-2" />
              Publish Story
            </Button>
          </CardFooter>
        </Card>
      </fieldset>
      {!isWriter && (
        <p className="text-sm text-destructive mt-2">
            You must be a writer or admin to create a story.
        </p>
      )}
    </form>
  );
}
