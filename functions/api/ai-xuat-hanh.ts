// ============================================================
// functions/api/ai-xuat-hanh.ts
// POST /api/ai-xuat-hanh
// Gợi ý 3 ngày tốt nhất để xuất hành trong tháng theo tuổi
// ============================================================

interface Env {
  AI_CACHE?:    KVNamespace;
  GROQ_API_KEY: string;
}

interface RequestBody {
  birthYear: number;
  month:     number;
  year:      number;
  purpose:   string;  // "Đi xa" | "Ký hợp đồng" | "Gặp đối tác" | "Du lịch"
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

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

function getCanChiYear(y: number): string {
  return `${CAN[(y+6)%10]} ${CHI[(y+8)%12]}`;
}

function getDayScore(d: number, m: number, y: number): number {
  const jdn    = toJDN(d, m, y);
  const TU_D   = [1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];
  const tu     = TU_D[((jdn-2451549)%28+28)%28] ?? 0;
  // Estimate lunar day from JDN
  const lunarD = ((jdn - 2451549) % 30 + 30) % 30 + 1;
  const isTam  = [3,7,13,18,22,27].includes(lunarD);
  const isNg   = [5,14,23].includes(lunarD);
  let score = 3 + tu;
  if (isTam) score -= 2;
  if (isNg)  score -= 1;
  return Math.max(1, Math.min(5, Math.round(score)));
}

const THU = ['CN','T2','T3','T4','T5','T6','T7'];

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  if (!(env.GROQ_API_KEY ?? (env as unknown as Record<string,string>)['VITE_GROQ_API_KEY'] ?? '')) {
    return Response.json({ error: 'AI service not configured' }, { status: 503, headers: CORS });
  }

  let body: RequestBody;
  try { body = await request.json() as RequestBody; }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS }); }

  const { birthYear, month, year, purpose } = body;
  if (!birthYear || !month || !year) {
    return Response.json({ error: 'Missing required fields' }, { status: 400, headers: CORS });
  }

  const cacheKey = `ai-xuat-hanh:v1:${birthYear}:${year}:${month}:${purpose}`;
  if (env.AI_CACHE) {
    try {
      const cached = await env.AI_CACHE.get(cacheKey);
      if (cached) return Response.json(JSON.parse(cached), { headers: CORS });
    } catch { /* continue */ }
  }

  // Find top 5 good days in month
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const goodDays: { d: number; score: number; canChi: string; thu: string }[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const score = getDayScore(d, month, year);
    if (score >= 4) {
      const dow = new Date(Date.UTC(year, month - 1, d)).getUTCDay();
      goodDays.push({ d, score, canChi: getCanChiDay(d, month, year), thu: THU[dow] ?? 'T2' });
    }
  }

  goodDays.sort((a, b) => b.score - a.score);
  const top5 = goodDays.slice(0, 5);

  if (top5.length === 0) {
    return Response.json({
      days: [],
      advice: `Tháng ${month}/${year} không có ngày đặc biệt tốt để ${purpose}. Hãy chọn ngày điểm 3 và xem giờ hoàng đạo để chọn giờ đẹp.`,
      cached: false,
    }, { headers: CORS });
  }

  const canChiYear   = getCanChiYear(birthYear);
  const daysStr      = top5.map(x => `${x.thu} ${x.d}/${month} (${x.canChi}, điểm ${x.score}/5)`).join(', ');

  const prompt =
    `Người sinh năm ${birthYear} (${canChiYear}) muốn xuất hành để ${purpose} trong tháng ${month}/${year}. ` +
    `5 ngày tốt nhất: ${daysStr}. ` +
    `Hãy giải thích ngắn lý do tại sao 3 ngày đầu phù hợp với tuổi này. ` +
    `Tối đa 100 chữ, tiếng Việt thân thiện.`;

  let advice = '';
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${(env.GROQ_API_KEY ?? (env as unknown as Record<string,string>)['VITE_GROQ_API_KEY'] ?? '')}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', max_tokens: 200, temperature: 0.4,
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia phong thuỷ Việt Nam. Tư vấn ngắn gọn, thực tế.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json() as { choices: { message: { content: string } }[] };
      advice = data.choices?.[0]?.message?.content?.trim() ?? '';
    }
  } catch { /* fallback */ }

  if (!advice) {
    advice = `${top5.slice(0,3).map(x=>`${x.thu} ${x.d}/${month} (${x.canChi})`).join(', ')} là những ngày tốt cho mục đích ${purpose} của bạn.`;
  }

  const result = { days: top5.slice(0, 3), advice, cached: false };

  if (env.AI_CACHE) {
    try { await env.AI_CACHE.put(cacheKey, JSON.stringify({ ...result, cached: true }), { expirationTtl: 2592000 }); } catch { /* ok */ }
  }

  return Response.json(result, { headers: CORS });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
