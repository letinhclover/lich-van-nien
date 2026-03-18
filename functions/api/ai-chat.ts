// ============================================================
// functions/api/ai-chat.ts — AI Chatbot (SSE streaming)
// POST /api/ai-chat
// Rate limit: 3 câu/ngày qua KV
// Stream: text/event-stream (SSE)
// ============================================================

interface Env {
  AI_CACHE?:    KVNamespace;
  GROQ_API_KEY: string;
}

interface ChatMessage {
  role:    'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message:  string;
  history?: ChatMessage[];
  date?:    string;
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_PER_DAY = 3;

// ─── Rate limit helpers ───────────────────────────────────────
function getRLKey(ip: string, date: string): string {
  return `rl:${ip}:${date}`;
}

function getVNDate(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' })
    .split(' ')[0] ?? new Date().toISOString().split('T')[0]!;
}

async function checkRateLimit(
  kv: KVNamespace | undefined,
  ip: string,
  date: string,
): Promise<{ allowed: boolean; remaining: number; count: number }> {
  if (!kv) return { allowed: true, remaining: MAX_PER_DAY, count: 0 };

  const key = getRLKey(ip, date);
  try {
    const raw   = await kv.get(key);
    const count = raw ? parseInt(raw, 10) : 0;
    if (count >= MAX_PER_DAY) {
      return { allowed: false, remaining: 0, count };
    }
    // Increment (TTL đến hết ngày)
    const now       = new Date();
    const endOfDay  = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const ttl       = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);
    await kv.put(key, String(count + 1), { expirationTtl: Math.max(ttl, 60) });
    return { allowed: true, remaining: MAX_PER_DAY - count - 1, count: count + 1 };
  } catch {
    return { allowed: true, remaining: MAX_PER_DAY, count: 0 };
  }
}

// ─── Main handler ─────────────────────────────────────────────
export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  // Validate API key
  if (!env.GROQ_API_KEY) {
    return Response.json({ error: 'AI service not configured' }, { status: 503, headers: CORS });
  }

  // Parse body
  let body: RequestBody;
  try {
    body = await request.json() as RequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS });
  }

  const message = (body.message ?? '').trim().slice(0, 500);
  if (!message) {
    return Response.json({ error: 'message is required' }, { status: 400, headers: CORS });
  }

  // Rate limit
  const ip   = request.headers.get('CF-Connecting-IP') ?? request.headers.get('X-Forwarded-For') ?? 'unknown';
  const date = getVNDate();
  const rl   = await checkRateLimit(env.AI_CACHE, ip, date);

  if (!rl.allowed) {
    return Response.json(
      { error: 'rate_limit', remaining: 0, message: 'Hết lượt hỏi miễn phí hôm nay. Quay lại vào ngày mai!' },
      { status: 429, headers: { ...CORS, 'X-Rate-Limit-Remaining': '0', 'X-Rate-Limit-Reset': '86400' } }
    );
  }

  // Build context
  const today   = body.date ?? date;
  const history = (body.history ?? []).slice(-6); // max 6 messages history

  const systemPrompt =
    `Bạn là trợ lý phong thuỷ của Lịch Vạn Niên AI (lichvannien.io.vn). ` +
    `Kiến thức: lịch âm Việt Nam, can chi, ngũ hành, giờ hoàng đạo, ngày tốt xấu. ` +
    `Hôm nay: ${today}. ` +
    `Trả lời tiếng Việt, thân thiện, tối đa 150 từ. Không bịa thông tin. ` +
    `Nếu câu hỏi ngoài chuyên môn, lịch sự từ chối và hướng về lịch pháp.`;

  const messages: ChatMessage[] = [
    ...history,
    { role: 'user', content: message },
  ];

  // ── SSE Streaming ──────────────────────────────────────────
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const writeSSE = async (data: string) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ text: data })}\n\n`));
  };
  const writeDone = async (extra?: object) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true, ...extra })}\n\n`));
    await writer.close();
  };

  // Run in background
  (async () => {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:       'llama-3.1-8b-instant',
          max_tokens:  300,
          temperature: 0.6,
          stream:      true,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok || !res.body) {
        await writeSSE('Xin lỗi, tôi đang bận. Vui lòng thử lại sau.');
        await writeDone({ remaining: rl.remaining });
        return;
      }

      // Parse SSE stream from Groq
      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let   buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const chunk = JSON.parse(raw) as { choices: { delta: { content?: string } }[] };
            const token = chunk.choices?.[0]?.delta?.content ?? '';
            if (token) await writeSSE(token);
          } catch { /* skip malformed */ }
        }
      }

      await writeDone({ remaining: rl.remaining });

    } catch {
      await writeSSE('Xin lỗi, có lỗi kết nối. Vui lòng thử lại.');
      await writeDone({ remaining: rl.remaining });
    }
  })();

  return new Response(readable, {
    headers: {
      ...CORS,
      'Content-Type':           'text/event-stream',
      'Cache-Control':          'no-cache',
      'Connection':             'keep-alive',
      'X-Rate-Limit-Remaining': String(rl.remaining),
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
