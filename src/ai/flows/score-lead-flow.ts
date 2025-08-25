'use server';
/**
 * @fileOverview An AI agent for scoring leads.
 *
 * - scoreLead - A function that handles the lead scoring process.
 * - ScoreLeadInput - The input type for the scoreLead function.
 * - ScoreLeadOutput - The return type for the scoreLead function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreLeadInputSchema = z.object({
  name: z.string().describe('The name of the lead.'),
  status: z.string().describe('The current status of the lead (e.g., To Do, Contacted, Converted).'),
  notes: z.string().describe('Any notes associated with the lead.'),
});
export type ScoreLeadInput = z.infer<typeof ScoreLeadInputSchema>;

const ScoreLeadOutputSchema = z.object({
    score: z.enum(['Hot', 'Warm', 'Cold']).describe('The calculated score for the lead.'),
    reason: z.string().describe('A brief explanation for the assigned score.'),
});
export type ScoreLeadOutput = z.infer<typeof ScoreLeadOutputSchema>;

export async function scoreLead(input: ScoreLeadInput): Promise<ScoreLeadOutput> {
  return scoreLeadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreLeadPrompt',
  input: {schema: ScoreLeadInputSchema},
  output: {schema: ScoreLeadOutputSchema},
  prompt: `You are an expert sales analyst. Your task is to score a sales lead based on the provided information. The score should be one of 'Hot', 'Warm', or 'Cold'.

- 'Hot' leads are those who are highly interested, have a clear need, and are likely to convert soon.
- 'Warm' leads have shown some interest but may need more nurturing.
- 'Cold' leads have shown little to no interest or are not a good fit.

Analyze the lead's status and notes to determine the score. Provide a short reason for your decision.

Lead Information:
- Name: {{{name}}}
- Status: {{{status}}}
- Notes: 
{{{notes}}}

Based on this, determine if the lead is Hot, Warm, or Cold and provide your reasoning.`,
});

const scoreLeadFlow = ai.defineFlow(
  {
    name: 'scoreLeadFlow',
    inputSchema: ScoreLeadInputSchema,
    outputSchema: ScoreLeadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
