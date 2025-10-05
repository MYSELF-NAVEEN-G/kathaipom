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
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/users"; // Import mock data safely

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignIn = () => {
    // In a real app, you'd have actual auth logic here.
    // For now, we find a user by username from mock data.
    const user = users.find(u => u.username === username);

    if (user && !user.isAdmin) {
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userUsername', user.username);
      router.push('/feed');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username, password, or you might be a writer.",
      })
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo size="large" />
            </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your personalized story feed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="janedoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="button" className="w-full" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
           <div className="mt-4 text-center text-sm text-muted-foreground">
             Are you a writer?{" "}
            <Link href="/admin/login" className="underline font-semibold text-foreground">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
