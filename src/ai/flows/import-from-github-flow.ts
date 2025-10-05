'use server';
/**
 * @fileOverview A flow to import stories from a GitHub repository.
 *
 * - importFromGithub - A function that handles the import process.
 * - ImportFromGithubInput - The input type for the importFromGithub function.
 * - ImportFromGithubOutput - The return type for the importFromGithub function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Octokit } from 'octokit';
import { getPosts, writePostsToFile } from '@/lib/data';
import type { Story } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const ImportFromGithubInputSchema = z.object({
  repoUrl: z.string().url().describe('The URL of the public GitHub repository.'),
  author: z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
  }),
});
export type ImportFromGithubInput = z.infer<typeof ImportFromGithubInputSchema>;

const ImportFromGithubOutputSchema = z.object({
  importedCount: z.number().describe('The number of stories successfully imported.'),
});
export type ImportFromGithubOutput = z.infer<typeof ImportFromGithubOutputSchema>;

export async function importFromGithub(
  input: ImportFromGithubInput
): Promise<ImportFromGithubOutput> {
  return importFromGithubFlow(input);
}

const importFromGithubFlow = ai.defineFlow(
  {
    name: 'importFromGithubFlow',
    inputSchema: ImportFromGithubInputSchema,
    outputSchema: ImportFromGithubOutputSchema,
  },
  async (input) => {
    const { repoUrl, author } = input;
    const urlParts = new URL(repoUrl).pathname.split('/').filter(Boolean);
    if (urlParts.length < 2) {
      throw new Error('Invalid GitHub repository URL.');
    }
    const [owner, repo] = urlParts;

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
    });

    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '',
    });

    if (!Array.isArray(contents)) {
      throw new Error('Could not list repository contents.');
    }

    const markdownFiles = contents.filter(
      (file) => file.type === 'file' && file.name.endsWith('.md')
    );

    const existingStories = await getPosts();
    let importedCount = 0;

    for (const file of markdownFiles) {
      const { data: fileContent } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      if ('content' in fileContent) {
        const content = Buffer.from(fileContent.content, 'base64').toString('utf8');
        
        const newStory: Story = {
            id: `post-${Date.now()}-${Math.random()}`,
            content: [content], // Wrap content in an array for multi-page format
            authorId: author.id,
            authorName: author.name,
            authorUsername: author.username,
            likes: 0,
            comments: [],
            timestamp: new Date().toISOString(),
            images: [],
        };

        existingStories.unshift(newStory);
        importedCount++;
      }
    }
    
    await writePostsToFile(existingStories);

    revalidatePath('/feed');

    return { importedCount };
  }
);
