import { createDeepSeek } from '@ai-sdk/deepseek';
import { convertToModelMessages, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { AI_SYSTEM_PROMPT } from '@/lib/ai-knowledge';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const deepseek = createDeepSeek({
  apiKey: process.env.DEEP_SEEK_API_KEY,
});

export const maxDuration = 30;

// Límite agresivo: 30 mensajes/min por IP. Cubre uso humano normal con margen
// y corta cualquier script automático que intente vaciar la cuota DeepSeek.
const CHAT_MAX_PER_MIN = 30;
const CHAT_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit(`chat:ip:${ip}`, CHAT_MAX_PER_MIN, CHAT_WINDOW_MS);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: 'Demasiadas peticiones. Espera un momento e inténtalo de nuevo.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rl.retryAfterSeconds),
        },
      }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await streamText({
    model: deepseek('deepseek-v4-flash'),
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
