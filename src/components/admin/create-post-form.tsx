"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
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
  const [isWriter, setIsWriter] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [pages, setPages] = useState<string[]>(['']);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const username = localStorage.getItem('userUsername');
    const isAllowed = role === 'writer' || role === 'super-admin';
    setIsWriter(isAllowed);
    
    if (isAllowed && id && name && username) {
        setUserInfo({ id, name, username });
    }
  }, []);

  const handlePageContentChange = (index: number, value: string) => {
    const newPages = [...pages];
    newPages[index] = value;
    setPages(newPages);
  };

  const addPage = () => {
    setPages([...pages, '']);
  };

  const removePage = (index: number) => {
    if (pages.length <= 1) {
        toast({
            variant: "destructive",
            title: "Cannot remove last page",
            description: "A story must have at least one page.",
        });
        return;
    }
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
  };
  
  const movePage = (index: number, direction: 'up' | 'down') => {
      const newPages = [...pages];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newPages.length) return;
      
      const temp = newPages[index];
      newPages[index] = newPages[targetIndex];
      newPages[targetIndex] = temp;
      setPages(newPages);
  }

  const handleFormAction = async () => {
    if (!isWriter || !userInfo) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to create stories.",
        });
        return;
    }
    
    const storyContent = pages.map(p => p.trim()).filter(p => p.length > 0);

    if (storyContent.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Story is empty',
        description: 'Please write something before publishing.',
      });
      return;
    }

    try {
        await addStory({
            content: storyContent,
            authorId: userInfo.id,
            authorName: userInfo.name,
            authorUsername: userInfo.username,
        });

        toast({
          title: "Story Published!",
          description: "Your new story is now live.",
        });

        // Reset form
        setPages(['']);
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
             <div className="grid gap-4">
                 <Label>Your Story Pages</Label>
                 <div className="space-y-4">
                 {pages.map((pageContent, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 rounded-lg border bg-background relative group">
                        <div className="flex flex-col gap-1 items-center pt-1">
                             <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                             <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                        </div>
                        <Textarea
                            id={`page-${index}`}
                            name={`page-${index}`}
                            placeholder={`Page ${index + 1}...`}
                            required
                            rows={5}
                            value={pageContent}
                            onChange={(e) => handlePageContentChange(index, e.target.value)}
                            className="flex-1"
                        />
                        <div className="flex flex-col gap-1">
                             <Button type="button" size="icon" variant="ghost" onClick={() => movePage(index, 'up')} disabled={index === 0} className="h-7 w-7">
                                <ArrowUp className="h-4 w-4" />
                             </Button>
                             <Button type="button" size="icon" variant="ghost" onClick={() => movePage(index, 'down')} disabled={index === pages.length - 1} className="h-7 w-7">
                                <ArrowDown className="h-4 w-4" />
                             </Button>
                             <Button type="button" size="icon" variant="destructive" onClick={() => removePage(index)} className="h-7 w-7">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                 ))}
                 </div>

                 <Button type="button" variant="outline" onClick={addPage}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Page
                </Button>
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
      {!isWriter && (
        <p className="text-sm text-destructive mt-2">
            You must be a writer or admin to create a story.
        </p>
      )}
    </form>
  );
}
