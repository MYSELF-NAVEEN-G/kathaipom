'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import React from "react";
import { addUser } from "@/lib/actions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";


export default function WriterSignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');

    const handleSignUp = async () => {
        if (!name || !username) {
            toast({
                variant: 'destructive',
                title: 'Missing information',
                description: 'Please provide a name and username.',
            });
            return;
        }

        try {
            const newUser = await addUser({
                name,
                username,
                avatar: PlaceHolderImages.find(img => img.id === 'avatar-4')!,
                bio: `A new writer on Kathaipom.`,
                coverImage: PlaceHolderImages.find(img => img.id === 'cover-2')!,
                followers: [],
                following: [],
                isAdmin: true, // Writers are considered admins in this context
            });

            document.cookie = `userId=${newUser.id}; path=/; max-age=604800`;
            localStorage.setItem('userId', newUser.id);
            localStorage.setItem('userRole', 'writer');
            localStorage.setItem('userName', newUser.name);
            localStorage.setItem('userUsername', newUser.username);
            window.dispatchEvent(new Event('login'));
            router.push('/feed');
        } catch(error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign-up failed',
                description: error.message || 'Could not create your account. Please try again.',
            });
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo size="large" />
            </div>
          <CardTitle className="text-2xl font-headline">Create a Writer Account</CardTitle>
          <CardDescription>
            Enter your information to start publishing your stories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>              <Input id="username" placeholder="your_username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="button" className="w-full" onClick={handleSignUp}>
              Sign Up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/admin/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
