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

export default function AdminLoginPage() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    const adminId = id.toLowerCase();
    if (
      (adminId === 'nafadmin' && password === 'naveen') ||
      (adminId === 'jed' && password === 'admins123')
    ) {
      // Set role in localStorage for admin
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', name);
      localStorage.setItem('userUsername', adminId);
      router.push('/admin/dashboard');
    } else {
      // On failure, clear role and redirect to user login
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userUsername');
      router.push('/login');
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
              <Label htmlFor="admin-name">Name</Label>
              <Input
                id="admin-name"
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-id">ID</Label>
              <Input
                id="admin-id"
                type="text"
                placeholder="Enter your ID"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
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
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
