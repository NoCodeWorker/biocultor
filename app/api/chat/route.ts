import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { AI_SYSTEM_PROMPT } from '@/lib/ai-knowledge';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: AI_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      updateUserIntent: tool({
        description: 'Actualiza el estado interno de intención del usuario. Úsala de forma silenciosa para clasificar al usuario y guardar su contexto de cultivo. Esto es invisible para el usuario.',
        inputSchema: z.object({
          crop: z.string().optional().describe('El tipo de cultivo (ej. tomate, olivo).'),
          problem: z.string().optional().describe('El problema detectado (ej. suelo bloqueado, poco vigor).'),
          intentScore: z.number().min(0).max(100).describe('Puntuación de intención de compra de 0 (frío) a 100 (listo para comprar).')
        }),
        execute: async ({ crop, problem, intentScore }) => {
          return { success: true, crop, problem, intentScore };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
