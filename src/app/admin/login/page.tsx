'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async () => {
     try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error("Failed to fetch users");
        const users: User[] = await res.json();

        // Super Admin check
        if (username.toLowerCase() === 'nafadmin' && password === 'nafstud') {
            const adminUser = users.find(u => u.username === 'nafadmin');
            if (adminUser) {
                document.cookie = `userId=${adminUser.id}; path=/; max-age=604800`;
                localStorage.setItem('userId', adminUser.id);
                localStorage.setItem('userRole', 'super-admin');
                localStorage.setItem('userName', adminUser.name);
                localStorage.setItem('userUsername', adminUser.username);
                window.dispatchEvent(new Event('login'));
                router.push('/feed');
                return;
            }
        }

        const user = users.find(u => u.username === username);
        if (user && user.isAdmin) {
            document.cookie = `userId=${user.id}; path=/; max-age=604800`;
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userRole', 'writer');
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userUsername', user.username);
            window.dispatchEvent(new Event('login'));
            router.push('/feed');
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid username or password for a writer account.",
            });
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Login Error",
            description: "Could not retrieve user data. Please try again.",
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
          <CardTitle className="text-2xl font-headline">
            Writer Sign In
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the writer dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="writer-username">Username</Label>
              <Input
                id="writer-username"
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="button" className="w-full" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/admin/signup" className="underline">
              Create account
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            Not a writer?{' '}
            <Link href="/login" className="underline">
              Sign in as a reader
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
