'use server';
/**
 * @fileOverview A feed prioritization AI agent.
 *
 * - prioritizeFeed - A function that handles the feed prioritization process.
 * - PrioritizeFeedInput - The input type for the prioritizeFeed function.
 * - PrioritizeFeedOutput - The return type for the prioritizeFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeFeedInputSchema = z.object({
  posts: z.array(
    z.object({
      postId: z.string().describe('The unique identifier of the post.'),
      content: z.string().describe('The text content of the post.'),
      authorId: z.string().describe('The unique identifier of the post author.'),
      likes: z.number().describe('The number of likes the post has.'),
      comments: z.number().describe('The number of comments the post has.'),
      // Add other relevant post features here
    })
  ).describe('An array of posts to be prioritized.'),
  userInterests: z.array(z.string()).describe('The user expressed interests, such as specific topics or authors.'),
  userInteractionHistory: z.array(
    z.object({
      postId: z.string().describe('The ID of the interacted post.'),
      interactionType: z.enum(['like', 'comment', 'follow']).describe('The type of interaction (like, comment, or follow).'),
      timestamp: z.string().describe('The timestamp of the interaction.'),
    })
  ).describe('The user past interactions with posts, containing post IDs, interaction types, and timestamps.'),
});
export type PrioritizeFeedInput = z.infer<typeof PrioritizeFeedInputSchema>;

const PrioritizeFeedOutputSchema = z.array(
  z.object({
    postId: z.string().describe('The unique identifier of the post.'),
    priorityScore: z.number().describe('A score indicating the relevance and engagement potential of the post for the user.'),
    reason: z.string().describe('The reason for the assigned priority score'),
  })
).describe('An array of posts with associated priority scores.');
export type PrioritizeFeedOutput = z.infer<typeof PrioritizeFeedOutputSchema>;

export async function prioritizeFeed(input: PrioritizeFeedInput): Promise<PrioritizeFeedOutput> {
  return prioritizeFeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeFeedPrompt',
  input: {schema: PrioritizeFeedInputSchema},
  output: {schema: PrioritizeFeedOutputSchema},
  prompt: `You are an AI assistant designed to prioritize content in a social media feed for individual users.

  Given a list of posts, user interests, and the user's interaction history, your goal is to assign a priority score to each post.
  Posts should be scored higher if they align with the user's interests and if the user has a history of interacting with similar content.
  The output should be an array of posts, each with its original postId, a priorityScore (higher is better), and a brief reason for the score.

  User Interests: {{userInterests}}

  User Interaction History: {{userInteractionHistory}}

  Posts: {{posts}}

  Consider the following:
  - Match user interests with post content.
  - Prioritize posts from authors the user follows or has interacted with previously.
  - Boost posts with high engagement (likes, comments), but adjust based on user preferences.

  Output should be a JSON array, where each object contains the postId, priorityScore, and a short reason:
  [{{#each posts}}
    {
      "postId": "{{this.postId}}",
      "priorityScore": (calculated score),
      "reason": "(explanation of the score)"
    }
  {{/each}}]
  `,
});

const prioritizeFeedFlow = ai.defineFlow(
  {
    name: 'prioritizeFeedFlow',
    inputSchema: PrioritizeFeedInputSchema,
    outputSchema: PrioritizeFeedOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
