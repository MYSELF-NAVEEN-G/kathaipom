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
import { UserCog } from 'lucide-react';

export default function AdminLoginPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    // Super Admin check
    if (username.toLowerCase() === 'nafadmin' && password === 'nafstud') {
      localStorage.setItem('userRole', 'super-admin');
      localStorage.setItem('userName', 'Super Admin');
      localStorage.setItem('userUsername', 'nafadmin');
      router.push('/admin/dashboard');
      return;
    }

    // For this prototype, any other login on this page is treated as a writer.
    // In a real app, you'd validate writer credentials against a database.
    localStorage.setItem('userRole', 'writer');
    localStorage.setItem('userName', name);
    localStorage.setItem('userUsername', username);
    router.push('/admin/dashboard');
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
              <Label htmlFor="writer-name">Name</Label>
              <Input
                id="writer-name"
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <Button type="submit" className="w-full" onClick={handleSignIn}>
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
