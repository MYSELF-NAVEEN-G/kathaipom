"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Send } from "lucide-react";

export function CreatePostForm() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle the form submission,
    // upload the image, and save the post data.
    toast({
      title: "Post Created!",
      description: "Your new post has been successfully created.",
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit}>
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-image">Upload Image</Label>
              <div className="flex items-center gap-2">
                  <Input id="post-image" type="file" className="w-full" required />
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
    </form>
  );
}
