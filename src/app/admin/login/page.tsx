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
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/types';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSignIn = async () => {
    try {
       const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, isAdmin: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user: User = data.user;
      login(user.id);
      router.push('/admin/dashboard');
      router.refresh();

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message || "Invalid username or password for a writer account.",
        });
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
                placeholder="writer_username"
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
            Don't have an account?{' '}
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
