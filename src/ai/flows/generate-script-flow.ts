'use server';
/**
 * @fileOverview A sales script generation AI agent.
 *
 * - generateScript - A function that handles the sales script generation process.
 * - GenerateScriptInput - The input type for the generateScript function.
 * - GenerateScriptOutput - The return type for the generateScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateScriptInputSchema = z.object({
  name: z.string().describe('The name of the potential customer.'),
  phone: z.string().describe('The phone number of the potential customer.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

export const GenerateScriptOutputSchema = z.object({
    script: z.string().describe('The generated sales script.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
  return generateScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {schema: GenerateScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema},
  prompt: `You are a sales assistant. Your task is to generate a short, friendly, and effective sales script for a tele-sales advisor.

The advisor needs to call a potential customer.
Customer Name: {{{name}}}
Customer Phone: {{{phone}}}

Generate a script that includes:
1. A polite opening introducing the advisor and the company (use a placeholder for the company name).
2. A clear purpose for the call.
3. One or two engaging questions to understand the customer's needs.
4. A brief mention of the key benefit of the product/service (use a generic product).
5. A clear call to action (e.g., scheduling a follow-up call).

Keep the script concise and natural-sounding. The output should be just the script text.`,
});

const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
