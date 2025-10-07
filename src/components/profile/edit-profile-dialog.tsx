'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/lib/types';
import { updateUser } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';


const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().max(160, { message: 'Bio cannot be more than 160 characters.' }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type EditProfileDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio,
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setter(reader.result as string);
          }
          reader.readAsDataURL(file);
      }
  }

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const updateData: Parameters<typeof updateUser>[0] = { 
            name: data.name,
            bio: data.bio
        };
        if (avatarPreview) {
            updateData.avatar = { ...user.avatar, imageUrl: avatarPreview };
        }
        if (coverPreview) {
            updateData.coverImage = { ...user.coverImage, imageUrl: coverPreview };
        }

        await updateUser(updateData);
        toast({
          title: 'Profile updated',
          description: 'Your profile information has been saved.',
        });
        onOpenChange(false);
        // Reset previews after successful submission
        setAvatarPreview(null);
        setCoverPreview(null);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: error.message || 'Could not save your profile. Please try again.',
        });
      }
    });
  };
  
  const onDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        // Reset form and previews when dialog is closed
        form.reset({ name: user.name, bio: user.bio });
        setAvatarPreview(null);
        setCoverPreview(null);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
                <FormLabel>Cover Image</FormLabel>
                <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden group">
                     <Image src={coverPreview || user.coverImage.imageUrl} alt="Cover image preview" fill className="object-cover" />
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
                             <Upload className="mr-2 h-4 w-4" /> Change
                         </Button>
                         <Input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={(e) => handleFileChange(e, setCoverPreview)} />
                     </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <FormLabel>Profile Photo</FormLabel>
                 <div className="relative w-24 h-24 rounded-full overflow-hidden group">
                     <Image src={avatarPreview || user.avatar.imageUrl} alt="Avatar preview" fill className="object-cover" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => avatarInputRef.current?.click()}>
                             <Upload className="h-4 w-4" />
                         </Button>
                         <Input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleFileChange(e, setAvatarPreview)} />
                     </div>
                </div>
            </div>
          
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                <Input placeholder="Your username" value={user.username} disabled />
                </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save changes'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
