import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config({
  path: '.env',
});

export const ai = genkit({
  plugins: [googleAI({
    apiVersion: ['v1', 'v1beta'],
  })],
  model: 'googleai/gemini-1.5-flash',
  enableTracingAndMetrics: true,
  logLevel: 'debug'
});
