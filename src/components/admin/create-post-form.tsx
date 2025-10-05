"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Send } from "lucide-react";
import React from "react";
import { addStory } from "@/lib/actions";
import { useRouter } from "next/navigation";


type UserInfo = {
    id: string;
    name: string;
    username: string;
}

export function CreatePostForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [canPost, setCanPost] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [content, setContent] = React.useState('');


  React.useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const username = localStorage.getItem('userUsername');
    const isWriterOrAdmin = role === 'writer' || role === 'super-admin';
    setCanPost(isWriterOrAdmin);
    
    if (isWriterOrAdmin && name && username) {
        // In a real app, ID would come from the database
        const userId = username; 
        setUserInfo({ id: userId, name, username });
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    if (!canPost || !userInfo) {
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
        });
        toast({
          title: "Story Published!",
          description: "Your new story is now live.",
        });
        setContent('');
        
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
    <form action={handleSubmit}>
      <fieldset disabled={!canPost}>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4">
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
              <div className="grid gap-2">
                <Label htmlFor="post-image">Add a Cover Image (Coming Soon)</Label>
                 <p className="text-sm text-muted-foreground">Image upload functionality is not yet available.</p>
                <div className="flex items-center gap-2">
                    <Input id="post-image" type="file" className="w-full" disabled />
                    <Button variant="outline" size="icon" asChild>
                        <Label htmlFor="post-image" className="cursor-pointer">
                            <ImagePlus />
                        </Label>
                    </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-6 pt-0">
            <Button type="submit">
              <Send className="mr-2" />
              Publish Story
            </Button>
          </CardFooter>
        </Card>
      </fieldset>
      {!canPost && (
        <p className="text-sm text-destructive mt-2">
            You must be a writer or admin to create a story.
        </p>
      )}
    </form>
  );
}
