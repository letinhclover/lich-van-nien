// ============================================================
// functions/api/ai-wedding-advice.ts
// POST /api/ai-wedding-advice
// Phân tích ngày cưới theo tuổi cô dâu và chú rể
// ============================================================

interface Env {
  AI_CACHE?:    KVNamespace;
  GROQ_API_KEY: string;
}

interface RequestBody {
  date:            string;  // "2026-10-15"
  groomBirthYear?: number;
  brideBirthYear?: number;
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

function getCanChiYear(y: number): string {
  return `${CAN[(y + 6) % 10]} ${CHI[(y + 8) % 12]}`;
}

function toJDN(d: number, m: number, y: number): number {
  let yy = y, mm = m;
  if (mm <= 2) { yy--; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25*(yy+4716)) + Math.floor(30.6001*(mm+1)) + d + B - 1524;
}

function getCanChiDay(d: number, m: number, y: number): string {
  const jdn = toJDN(d, m, y);
  return `${CAN[(jdn+9)%10]} ${CHI[(jdn+1)%12]}`;
}

function getDayLabel(d: number, m: number, y: number): string {
  const jdn     = toJDN(d, m, y);
  const TU_D    = [1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];
  const score   = Math.max(1, Math.min(5, 3 + (TU_D[((jdn-2451549)%28+28)%28] ?? 0)));
  return score >= 4 ? 'Ngày Tốt' : score <= 2 ? 'Ngày Xấu' : 'Bình Thường';
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  if (!env.GROQ_API_KEY) {
    return Response.json({ error: 'AI service not configured' }, { status: 503, headers: CORS });
  }

  let body: RequestBody;
  try {
    body = await request.json() as RequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS });
  }

  const { date, groomBirthYear, brideBirthYear } = body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
    return Response.json({ error: 'Invalid date' }, { status: 400, headers: CORS });
  }

  // Cache key
  const cacheKey = `ai-wedding:v1:${date}:${groomBirthYear ?? 0}:${brideBirthYear ?? 0}`;
  if (env.AI_CACHE) {
    try {
      const cached = await env.AI_CACHE.get(cacheKey);
      if (cached) return Response.json({ advice: cached, cached: true }, { headers: CORS });
    } catch { /* continue */ }
  }

  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const canChiDay  = getCanChiDay(d, m, y);
  const quality    = getDayLabel(d, m, y);
  const groomCC    = groomBirthYear ? getCanChiYear(groomBirthYear) : '';
  const brideCC    = brideBirthYear ? getCanChiYear(brideBirthYear) : '';

  const prompt =
    `Phân tích ngày cưới ${d}/${m}/${y} (can chi ngày: ${canChiDay}, đánh giá: ${quality}).` +
    (groomBirthYear ? ` Chú rể sinh năm ${groomBirthYear} tuổi ${groomCC}.` : '') +
    (brideBirthYear ? ` Cô dâu sinh năm ${brideBirthYear} tuổi ${brideCC}.` : '') +
    ` Trả lời 3 điểm ngắn: (1) Ngày có hợp không? (2) Giờ đẹp nhất làm lễ? (3) Cần lưu ý gì?` +
    ` Tối đa 120 chữ, tiếng Việt thân thiện. Không dùng markdown.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       'llama-3.1-8b-instant',
        max_tokens:  250,
        temperature: 0.4,
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia phong thuỷ Việt Nam chuyên tư vấn ngày cưới theo lịch pháp.' },
          { role: 'user',   content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json() as { choices: { message: { content: string } }[] };
    const advice = data.choices?.[0]?.message?.content?.trim() ?? 'Ngày này phù hợp cho tổ chức lễ cưới. Xem chi tiết trang ngày để biết giờ hoàng đạo.';

    if (env.AI_CACHE) {
      try { await env.AI_CACHE.put(cacheKey, advice, { expirationTtl: 2592000 }); } catch { /* ok */ }
    }

    return Response.json({ advice, cached: false }, { headers: CORS });
  } catch {
    return Response.json(
      { advice: `Ngày ${d}/${m}/${y} (${canChiDay}) — ${quality}. Xem chi tiết giờ hoàng đạo tại trang ngày.`, cached: false, fallback: true },
      { headers: CORS }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
