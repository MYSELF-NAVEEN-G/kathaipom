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
import { useRouter } from 'next/navigation';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { addUser } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';

export default function WriterSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignUp = async () => {
    if (!name || !username || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill out all fields.',
      });
      return;
    }

    try {
        const newUser = await addUser({
            name,
            username,
            email,
            password,
            isAdmin: true,
        });

        toast({
            title: 'Success!',
            description: 'Your writer account has been created.',
        });
        login(newUser.id);
        router.push('/admin/dashboard');
        router.refresh();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Sign-up failed',
            description: error.message,
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
            Create a Writer Account
          </CardTitle>
          <CardDescription>
            Enter your information to start publishing your stories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your_username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="writer@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button type="button" className="w-full" onClick={handleSignUp}>
              Sign Up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/admin/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
