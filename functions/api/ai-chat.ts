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


// ─── Inline lunar helpers (không import từ src/) ─────────────
const CAN_CC = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI_CC = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

function toJDN(d: number, m: number, y: number): number {
  let yy = y, mm = m;
  if (mm <= 2) { yy--; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25*(yy+4716)) + Math.floor(30.6001*(mm+1)) + d + B - 1524;
}
function getCanChiDay(d: number, m: number, y: number): string {
  const jdn = toJDN(d, m, y);
  return `${CAN_CC[(jdn+9)%10]} ${CHI_CC[(jdn+1)%12]}`;
}
function getCanChiYear(y: number): string {
  return `${CAN_CC[(y+6)%10]} ${CHI_CC[(y+8)%12]}`;
}
function getDayLabel(d: number, m: number, y: number): string {
  const jdn    = toJDN(d, m, y);
  const TU_D   = [1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];
  const tu     = TU_D[((jdn-2451549)%28+28)%28] ?? 0;
  const score  = Math.max(1, Math.min(5, 3 + tu));
  return score >= 4 ? 'Ngày Tốt' : score <= 2 ? 'Ngày Xấu' : 'Ngày Bình Thường';
}
function getLunarDay(d: number, m: number, y: number): number {
  const jdn = toJDN(d, m, y);
  return ((jdn - 2415021) % 30 + 30) % 30 + 1;
}

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
  if (!(env.GROQ_API_KEY ?? (env as unknown as Record<string,string>)['VITE_GROQ_API_KEY'] ?? '')) {
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

  // Build context với dữ liệu lịch thật
  const today   = body.date ?? date;
  const history = (body.history ?? []).slice(-6);

  // Tính dữ liệu lịch thật để inject vào system prompt
  // (tránh LLM bịa ngày âm sai)
  const [ty, tm, td] = today.split('-').map(Number) as [number,number,number];
  const jdn      = toJDN(td, tm, ty);
  const canChiD  = getCanChiDay(td, tm, ty);
  const canChiY  = getCanChiYear(ty);
  const labelD   = getDayLabel(td, tm, ty);
  const lunarD   = getLunarDay(td, tm, ty);
  // Estimate lunar month (simplified)
  const lunarM   = tm; // approximate — enough for context
  const thu      = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][new Date(Date.UTC(ty,tm-1,td)).getUTCDay()];

  const systemPrompt =
    `Bạn là trợ lý phong thuỷ của Lịch Vạn Niên AI (lichvannien.io.vn). ` +
    `Chuyên môn: lịch âm Việt Nam, can chi, ngũ hành, giờ hoàng đạo, ngày tốt xấu. ` +
    `\n\nDỮ LIỆU HÔM NAY (ĐÃ TÍNH CHÍNH XÁC - DÙNG SỐ LIỆU NÀY, KHÔNG TỰ TÍNH LẠI): ` +
    `Dương lịch: ${thu} ${td}/${tm}/${ty}. ` +
    `Âm lịch: khoảng ngày ${lunarD} tháng ${lunarM}. ` +
    `Can chi ngày: ${canChiD}. Năm: ${canChiY}. Đánh giá: ${labelD}. ` +
    `\n\nQUY TẮC BẮT BUỘC: ` +
    `(1) CHỈ dùng số liệu ngày âm đã cung cấp ở trên, KHÔNG tự tính lại. ` +
    `(2) Nếu không có dữ liệu cụ thể, nói thẳng "tôi cần thêm thông tin" thay vì bịa. ` +
    `(3) Trả lời tiếng Việt, thân thiện, tối đa 120 từ. ` +
    `(4) Câu trả lời phải CỤ THỂ, không hỏi ngược lại nhiều câu.`;

  // Lọc bỏ messages có content rỗng để tránh Groq từ chối
  const cleanHistory = history.filter(
    m => m.content && m.content.trim().length > 0
  );
  const messages: ChatMessage[] = [
    ...cleanHistory,
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
          'Authorization': `Bearer ${(env.GROQ_API_KEY ?? (env as unknown as Record<string,string>)['VITE_GROQ_API_KEY'] ?? '')}`,
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
        signal: AbortSignal.timeout(20000),
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

    } catch (err) {
      const msg = err instanceof Error && err.name === 'TimeoutError'
        ? 'AI phản hồi chậm. Vui lòng thử lại.'
        : 'Xin lỗi, có lỗi kết nối. Vui lòng thử lại.';
      await writeSSE(msg);
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
