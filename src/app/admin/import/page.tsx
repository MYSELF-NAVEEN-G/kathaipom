'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { importFromGithub } from '@/ai/flows/import-from-github-flow';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function ImportPage() {
  const [repoUrl, setRepoUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!currentUser) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not identify admin user. Please log in again.',
        });
        setIsLoading(false);
        return;
    }


    try {
      const result = await importFromGithub({
        repoUrl,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
        }
      });
      toast({
        title: 'Import Successful',
        description: `Successfully imported ${result.importedCount} stories.`,
      });
      // Redirect to the feed to see the new stories
      router.push('/feed');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description:
          'Could not import from GitHub. Please check the URL and ensure the repository is public.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <AppLayout>
        <div className="p-4 md:p-6">
          <h2 className="text-3xl font-headline font-bold mb-6">Import from GitHub</h2>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Import Stories</CardTitle>
              <CardDescription>
                Enter the URL of a public GitHub repository to import all `.md` files as stories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="repoUrl">Repository URL</Label>
                    <Input
                      id="repoUrl"
                      placeholder="https://github.com/username/repository-name"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading || !currentUser}>
                    {isLoading ? 'Importing...' : <> <Github className="mr-2"/> Import Stories</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </main>
  );
}
