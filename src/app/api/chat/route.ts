import { createClient } from '@/utils/supabase/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 60;

// ── In-Memory Response Cache ──────────────────────────────────────────────────
// Keyed by a normalised symptom fingerprint. Survives for 10 minutes per entry.
// On Vercel serverless this lives for the function's lifetime; good enough for
// demo and single-instance production use.  For multi-instance, swap to Redis.
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const responseCache = new Map<string, { content: string; ts: number }>();

function getCacheKey(messages: any[]): string {
  // Only cache based on the last user message (normalised lowercase)
  const last = messages.findLast((m: any) => m.role === 'user');
  if (!last) return '';
  return last.content.toLowerCase().trim().substring(0, 300);
}

function getCached(key: string): string | null {
  const hit = responseCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL_MS) { responseCache.delete(key); return null; }
  console.log('[Cache] HIT for key:', key.substring(0, 60));
  return hit.content;
}

function setCache(key: string, content: string) {
  // Cap cache size at 100 entries (simple LRU eviction)
  if (responseCache.size >= 100) {
    const oldest = [...responseCache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    if (oldest) responseCache.delete(oldest[0]);
  }
  responseCache.set(key, { content, ts: Date.now() });
}

// ── Groq client via OpenAI-compatible adapter ────────────────────────────────
// Falls back to Groq LPU if the primary FastAPI orchestrator is unreachable.
const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

// ── MedVoice Clinical Engine v2.0 System Prompt ───────────────────────────────
// Concise & Accurate template:
//  • Max 3–5 iterations enforced by explicit token budget comment
//  • Zero generality rules baked-in
//  • Structured JSON output mandatory
const SYSTEM_PROMPT = `You are the AI MED-VOICE Senior Diagnostic Specialist. You MUST respond with a single, valid JSON object.
No conversational filler. No markdown outside the JSON. No backticks. Output ONLY the JSON.
Token budget: Be concise. Each field should be precise and clinically dense, NOT verbose. Max 3 sentences per sub-key.

REQUIRED JSON STRUCTURE (all fields are MANDATORY):
{
  "specialty": "The single most relevant medical specialty (e.g. 'Neurologist', 'Cardiologist', 'General Physician').",
  "diagnosis": "A concise 1-2 sentence primary clinical impression.",
  "pathophysiology": "2-3 sentences: underlying biological mechanism. Reference named pathways/receptors. Be precise.",
  "differential_considerations": "3 plausible conditions, one sentence each. FORMAT: '1. [Condition]: [Rationale]. 2. ...' End with: DISCLAIMER: This AI output is for educational purposes only and does NOT constitute a medical diagnosis.",
  "urgency_triage": "Start with exactly ROUTINE, URGENT, or EMERGENCY. Then 2-3 sentences reasoning, including one red-flag escalation trigger.",
  "pharmacist_notes": "2-3 sentences: drug classes, key OTC option, one critical interaction warning. No specific dosages.",
  "home_remedies": [
    { "title": "Remedy Name", "description": "Step-by-step.", "clinical_logic": "Evidence source." },
    { "title": "Remedy Name", "description": "Step-by-step.", "clinical_logic": "Evidence source." },
    { "title": "Remedy Name", "description": "Step-by-step.", "clinical_logic": "Evidence source." }
  ],
  "medical_treatments": [
    { "title": "Treatment", "description": "How used.", "clinical_logic": "Mechanism + evidence grade." },
    { "title": "Treatment", "description": "How used.", "clinical_logic": "Mechanism + evidence grade." },
    { "title": "Treatment", "description": "How used.", "clinical_logic": "Mechanism + evidence grade." }
  ],
  "doctor_list": [],
  "chat_response": "Direct, compassionate 1-sentence patient-facing summary."
}

CRITICAL RULES:
- All keys MUST be fully populated at the top level.
- urgency_triage MUST start with ROUTINE, URGENT, or EMERGENCY.
- Return EXACTLY 3 home_remedies and EXACTLY 3 medical_treatments. No more, no less.
- If input is unclear, infer and note uncertainty in diagnosis.`;

export async function POST(req: Request) {
  console.log('--- Chat API Route (Streaming + Cache) ---');
  try {
    const { messages, conversationId } = await req.json();

    // ── Auth ─────────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const cacheKey = getCacheKey(messages);

    // ── Parallel: Try backend + Cache check simultaneously ───────────────────
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // ── Cache check first (zero-latency for repeat queries) ──────────────────
    const cachedContent = cacheKey ? getCached(cacheKey) : null;
    if (cachedContent) {
      // Return cached response as a real SSE stream (same format as live)
      const encoder = new TextEncoder();
      let resolved = false;
      const stream = new ReadableStream({
        async start(controller) {
          // Stream the cached content in chunks to keep UI streaming behaviour
          const chunkSize = 30;
          for (let i = 0; i < cachedContent.length; i += chunkSize) {
            if (resolved) break;
            controller.enqueue(encoder.encode(cachedContent.slice(i, i + chunkSize)));
            await new Promise(r => setTimeout(r, 5)); // 5ms per chunk = fast
          }
          resolved = true;
          controller.close();
        },
        cancel() { resolved = true; }
      });

      // Persist in background (don't await — don't block the response)
      persistMessages(supabase, user.id, conversationId, messages, cachedContent).catch(console.error);

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Cache': 'HIT',
          'x-conversation-id': conversationId || crypto.randomUUID(),
        }
      });
    }

    // ── Try live backend (FastAPI) first, fall back to direct Groq ───────────
    let assistantContent: string | null = null;

    try {
      const backendResp = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, conversation_id: conversationId, user_id: user.id }),
        signal: AbortSignal.timeout(8000), // 8s max — fall through to Groq if slow
      });

      if (backendResp.ok) {
        const data = await backendResp.json();
        assistantContent = data?.data?.messages?.at(-1)?.content
          ?? data?.messages?.at(-1)?.content
          ?? null;
      }
    } catch (backendErr) {
      console.warn('[Route] Backend unavailable, falling through to direct Groq:', backendErr);
    }

    // ── Direct Groq streaming (if backend unavailable) ────────────────────────
    if (!assistantContent) {
      // Build message array with injected system prompt
      const groqMessages = messages.map((m: any) => ({ role: m.role, content: m.content }));

      // Inject system instruction into last user message (same as before)
      if (groqMessages.length > 0 && groqMessages.at(-1).role === 'user') {
        groqMessages[groqMessages.length - 1].content += `\n\n${SYSTEM_PROMPT}`;
      }

      // True token-by-token SSE streaming via Vercel AI SDK
      const result = streamText({
        model: groq('llama-3.3-70b-versatile') as any,
        messages: groqMessages,
        // @ts-ignore
        maxTokens: 1200,   // Token efficiency: cap prevents rambling
        temperature: 0,    // Deterministic structured JSON output
        onFinish: async ({ text }) => {
          // Cache the completed response
          if (cacheKey) setCache(cacheKey, text);
          // Persist to Supabase in background
          persistMessages(supabase, user.id, conversationId, messages, text).catch(console.error);
        },
      });

      return result.toTextStreamResponse({
        headers: {
          'X-Cache': 'MISS',
          'x-conversation-id': conversationId || crypto.randomUUID(),
        }
      });
    }

    // ── Backend returned content — cache and stream it ────────────────────────
    if (cacheKey) setCache(cacheKey, assistantContent);
    persistMessages(supabase, user.id, conversationId, messages, assistantContent).catch(console.error);

    const encoder = new TextEncoder();
    let resolved2 = false;
    const streamFromBackend = new ReadableStream({
      async start(controller) {
        const chunkSize = 40;
        for (let i = 0; i < assistantContent!.length; i += chunkSize) {
          if (resolved2) break;
          controller.enqueue(encoder.encode(assistantContent!.slice(i, i + chunkSize)));
          await new Promise(r => setTimeout(r, 4));
        }
        resolved2 = true;
        controller.close();
      },
      cancel() { resolved2 = true; }
    });

    return new Response(streamFromBackend, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Cache': 'MISS',
        'x-conversation-id': conversationId || crypto.randomUUID(),
      }
    });

  } catch (error: any) {
    console.error('Chat API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function persistMessages(
  supabase: any,
  userId: string,
  conversationId: string | null,
  messages: any[],
  assistantContent: string
) {
  let convId = conversationId;
  if (!convId) {
    convId = crypto.randomUUID();
    const title = messages.at(-1)?.content?.substring(0, 50) + '...';
    await supabase.from('conversations').insert({ id: convId, user_id: userId, title }).catch(() => {});
  }
  const lastUser = messages.at(-1);
  await supabase.from('messages').insert({ conversation_id: convId, role: 'user', content: lastUser?.content, user_id: userId }).catch(() => {});
  await supabase.from('messages').insert({ conversation_id: convId, role: 'assistant', content: assistantContent, user_id: userId }).catch(() => {});
}
