'use server';
/**
 * @fileOverview An AI chatbot for customer interaction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  leadId: z.string().describe('The ID of the lead the user is asking about.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
    reply: z.string().describe('The chatbot\'s reply to the user.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chat(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a friendly and helpful customer service chatbot for a company. Your goal is to answer customer questions politely and accurately.

You are currently talking to a customer associated with Lead ID: {{{leadId}}}.

Here is the customer's message:
"{{{message}}}"

Please provide a helpful and concise response. If you don't know the answer, politely say that you will have a human agent get back to them shortly. Do not make up information.
Example: If a user asks about pricing, and you don't have that info, say "I don't have the pricing information right now, but I can have one of our sales advisors contact you with the details. Would you like that?"
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    // In a real app, you would use the leadId to fetch customer history
    // and provide it to the prompt for more context.
    const {output} = await prompt(input);
    return output!;
  }
);
