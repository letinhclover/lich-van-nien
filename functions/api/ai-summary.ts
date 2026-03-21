// ============================================================
// functions/api/ai-summary.ts — AI Daily Summary
// Cloudflare Pages Function: GET /api/ai-summary?date=YYYY-MM-DD
//
// Flow: KV cache → Groq API → cache 30 ngày → response
// Graceful fallback nếu KV chưa setup hoặc API lỗi
// ============================================================

interface Env {
  AI_CACHE?:    KVNamespace;  // optional — graceful nếu chưa setup
  GROQ_API_KEY: string;
}

// ─── Inline lunar calc (Worker không import từ src/) ──────────
const CAN  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI  = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

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

const THU_VI = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];

// ─── Đánh giá ngày đơn giản ───────────────────────────────────
function getDayLabel(d: number, m: number, y: number): string {
  const jdn      = toJDN(d, m, y);
  const TU_DIEM  = [1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];
  const tuIdx    = ((jdn - 2451549) % 28 + 28) % 28;
  const tuScore  = TU_DIEM[tuIdx] ?? 0;
  const lunar_d  = getLunarDay(d, m, y);
  const isTam    = [3,7,13,18,22,27].includes(lunar_d);
  const isNguyet = [5,14,23].includes(lunar_d);
  let score = 3 + tuScore;
  if (isTam)    score -= 2;
  if (isNguyet) score -= 1;
  score = Math.max(1, Math.min(5, Math.round(score)));
  if (score >= 4) return 'Ngày Tốt';
  if (score <= 2) return 'Ngày Xấu';
  return 'Ngày Bình Thường';
}

function getLunarDay(d: number, m: number, y: number): number {
  // Simplified — approximate lunar day
  const jdn = toJDN(d, m, y);
  const k   = Math.floor((jdn - 2415021 - 0.5) / 29.530588853);
  // New moon approximation
  const nm  = Math.round(2415021 + 29.530588853 * k);
  const jdn2 = jdn;
  return ((jdn2 - nm) % 30) + 1;
}

// ─── CORS headers ─────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Main handler ─────────────────────────────────────────────
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  // Validate date param
  const url  = new URL(request.url);
  const date = url.searchParams.get('date') ?? '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { error: 'Invalid date. Dùng format YYYY-MM-DD', cached: false },
      { status: 400, headers: CORS }
    );
  }

  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const cacheKey  = `ai-summary:v1:${date}`;

  // ── 1. Check KV cache ──────────────────────────────────────
  if (env.AI_CACHE) {
    try {
      const cached = await env.AI_CACHE.get(cacheKey);
      if (cached) {
        return Response.json(
          { summary: cached, date, cached: true },
          { headers: { ...CORS, 'Cache-Control': 'public, max-age=3600' } }
        );
      }
    } catch {
      // KV lỗi → bỏ qua, tiếp tục gọi API
    }
  }

  // ── 2. Kiểm tra API key ────────────────────────────────────
  if (!(env.GROQ_API_KEY ?? (env as unknown as Record<string,string>)['VITE_GROQ_API_KEY'] ?? '')) {
    // Debug: trả lỗi rõ ràng thay vì fallback im lặng
    return Response.json(
      { error: 'GROQ_API_KEY not configured', summary: fallbackSummary(d, m, y), date, cached: false, fallback: true },
      { status: 503, headers: CORS }
    );
  }

  // ── 3. Gọi Groq API ────────────────────────────────────────
  const canChi  = getCanChiDay(d, m, y);
  const canNam  = getCanChiYear(y);
  const label   = getDayLabel(d, m, y);
  const score   = getDayScore(d, m, y);
  const thu     = THU_VI[new Date(Date.UTC(y, m-1, d)).getUTCDay()] ?? 'Thứ Hai';

  // Danh sách nên làm / nên tránh theo score (nhất quán với UI)
  const GOOD: Record<number,string> = {
    5: 'Kết hôn, khai trương, khởi công, ký hợp đồng, xuất hành',
    4: 'Họp bàn công việc, mua sắm lớn, thăm người thân, học hành thi cử',
    3: 'Công việc hàng ngày, gặp gỡ bạn bè, mua sắm nhỏ',
    2: 'Nghỉ ngơi, thiền định, việc nhẹ tại nhà',
    1: 'Dưỡng sức, không khởi sự việc lớn',
  };
  const BAD: Record<number,string> = {
    5: 'Không có việc cần tránh đặc biệt',
    4: 'Hạn chế phẫu thuật nếu không cần thiết',
    3: 'Tránh khởi công lớn, kết hôn, khai trương',
    2: 'Tránh kết hôn, khai trương, xuất hành xa, khởi công',
    1: 'Tránh kết hôn, khai trương, xuất hành, ký hợp đồng, chuyển nhà',
  };
  const goodFor = GOOD[score] ?? GOOD[3]!;
  const badFor  = BAD[score]  ?? BAD[3]!;

  const userPrompt =
    `Ngày ${d}/${m}/${y} (${thu}), can chi ${canChi}, năm ${canNam}. ` +
    `KẾT QUẢ TÍNH TOÁN (BẮT BUỘC DÙNG, KHÔNG TỰ TÍNH LẠI): Đây là ${label} (${score}/5 điểm). ` +
    `Nên làm: ${goodFor}. Nên tránh: ${badFor}. ` +
    `Viết ĐÚNG 3 câu (tối đa 70 chữ): ` +
    `(1) xác nhận đây là ${label} và lý do ngắn gọn, ` +
    `(2) việc nên làm hôm nay, ` +
    `(3) việc nên tránh. ` +
    `Tiếng Việt thân thiện, không dùng markdown, KHÔNG mâu thuẫn với đánh giá ${label} đã cho.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${(env.GROQ_API_KEY ?? (env as unknown as Record<string,string>)['VITE_GROQ_API_KEY'] ?? '')}`,
      },
      body: JSON.stringify({
        model:       'llama-3.1-8b-instant',
        max_tokens:  200,
        temperature: 0.4,
        messages: [
          {
            role:    'system',
            content: 'Bạn là chuyên gia phong thuỷ Việt Nam. QUAN TRỌNG: Luôn dùng đúng đánh giá ngày (tốt/xấu) đã được cung cấp, KHÔNG tự đánh giá lại. Viết ngắn gọn, thân thiện.',
          },
          { role: 'user', content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Groq ${res.status}`);

    const data = await res.json() as { choices: { message: { content: string } }[] };
    const summary = data.choices?.[0]?.message?.content?.trim() ?? fallbackSummary(d, m, y);

    // ── 4. Cache 30 ngày ──────────────────────────────────────
    if (env.AI_CACHE) {
      try {
        await env.AI_CACHE.put(cacheKey, summary, { expirationTtl: 2592000 });
      } catch { /* silent */ }
    }

    return Response.json(
      { summary, date, cached: false },
      { headers: { ...CORS, 'Cache-Control': 'public, max-age=300' } }
    );

  } catch(err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return Response.json(
      { summary: fallbackSummary(d, m, y), date, cached: false, fallback: true, debug: errMsg },
      { headers: CORS }
    );
  }
}

function fallbackSummary(d: number, m: number, y: number): string {
  const label = getDayLabel(d, m, y);
  const canChi = getCanChiDay(d, m, y);
  return `Ngày ${d}/${m}/${y} (${canChi}) — ${label}. Xem chi tiết giờ hoàng đạo và ngày tốt xấu bên dưới để chọn thời điểm làm việc quan trọng.`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
