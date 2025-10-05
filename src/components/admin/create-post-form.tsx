"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Send } from "lucide-react";
import React from "react";
import { addPost } from "@/lib/data";
import { useRouter } from "next/navigation";


export function CreatePostForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [authorId, setAuthorId] = React.useState<string | null>(null);
  const [content, setContent] = React.useState('');


  React.useEffect(() => {
    const role = localStorage.getItem('userRole');
    const username = localStorage.getItem('userUsername');
    setIsAdmin(role === 'admin');
    if (role === 'admin' && username) {
        // In a real app, you'd get the ID from the authenticated user object
        // For this prototype, we'll map the username to an ID.
        if (username === 'nafadmin') setAuthorId('user-1');
        else if (username === 'jed') setAuthorId('user-1'); // Or another admin ID
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin || !authorId) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "Only admins can create posts.",
        });
        return;
    }

    try {
        await addPost({ content, authorId });
        toast({
          title: "Post Created!",
          description: "Your new post has been successfully published.",
        });
        (event.target as HTMLFormElement).reset();
        setContent('');
        // Refresh the page to show the new post
        router.refresh();
        router.push('/feed');

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create the post.",
        });
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={!isAdmin}>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="post-content">Post Content</Label>
                <Textarea
                  id="post-content"
                  placeholder="What's on your mind?"
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="post-image">Upload Image (Optional)</Label>
                 <p className="text-sm text-muted-foreground">A random image will be added for this prototype.</p>
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
              Publish Post
            </Button>
          </CardFooter>
        </Card>
      </fieldset>
      {!isAdmin && (
        <p className="text-sm text-destructive mt-2">
            You must be an admin to create a post.
        </p>
      )}
    </form>
  );
}