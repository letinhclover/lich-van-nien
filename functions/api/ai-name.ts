// ============================================================
// functions/api/ai-name.ts
// POST /api/ai-name
// AI gợi ý tên con theo tuổi cha mẹ và năm sinh dự kiến
// ============================================================

interface Env {
  AI_CACHE?:    KVNamespace;
  GROQ_API_KEY: string;
}

interface RequestBody {
  fatherYear: number;
  motherYear: number;
  childYear:  number;
  gender:     'trai' | 'gai' | 'chua_biet';
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const NGU_HANH_CAN = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];
const CON_GIAP = ['Chuột','Trâu','Hổ','Mèo','Rồng','Rắn','Ngựa','Dê','Khỉ','Gà','Chó','Lợn'];

function getCanChiYear(y: number) {
  const canIdx = (y + 6) % 10;
  const chiIdx = (y + 8) % 12;
  return {
    canChi:    `${CAN[canIdx]} ${CHI[chiIdx]}`,
    can:       CAN[canIdx] ?? '',
    chi:       CHI[chiIdx] ?? '',
    nguHanh:   NGU_HANH_CAN[canIdx] ?? 'Thổ',
    conGiap:   CON_GIAP[chiIdx] ?? 'Chuột',
  };
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
  try { body = await request.json() as RequestBody; }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS }); }

  const { fatherYear, motherYear, childYear, gender } = body;
  if (!fatherYear || !motherYear || !childYear) {
    return Response.json({ error: 'Missing required fields' }, { status: 400, headers: CORS });
  }

  const cacheKey = `ai-name:v1:${fatherYear}:${motherYear}:${childYear}:${gender}`;
  if (env.AI_CACHE) {
    try {
      const cached = await env.AI_CACHE.get(cacheKey);
      if (cached) return Response.json(JSON.parse(cached), { headers: CORS });
    } catch { /* continue */ }
  }

  const father = getCanChiYear(fatherYear);
  const mother = getCanChiYear(motherYear);
  const child  = getCanChiYear(childYear);

  const genderStr = gender === 'trai' ? 'con trai' : gender === 'gai' ? 'con gái' : 'chưa biết giới tính';
  const genderSuggest = gender === 'trai' ? 'Gợi ý 3 tên con trai đẹp' : gender === 'gai' ? 'Gợi ý 3 tên con gái đẹp' : 'Gợi ý 3 tên phù hợp cả trai lẫn gái';

  const prompt =
    `Xem tuổi đặt tên con theo phong thuỷ Việt Nam.\n` +
    `Cha sinh năm ${fatherYear} (${father.canChi}, ngũ hành ${father.nguHanh}).\n` +
    `Mẹ sinh năm ${motherYear} (${mother.canChi}, ngũ hành ${mother.nguHanh}).\n` +
    `Con sinh năm ${childYear} (${child.canChi}, con ${child.conGiap}, ngũ hành ${child.nguHanh}), ${genderStr}.\n\n` +
    `Hãy cung cấp:\n` +
    `1. Ngũ hành của năm sinh con và ý nghĩa\n` +
    `2. Bộ chữ / chữ cái nên dùng trong tên (theo ngũ hành tương sinh)\n` +
    `3. Chữ nên tránh (theo ngũ hành tương khắc)\n` +
    `4. ${genderSuggest} (mỗi tên 1-2 chữ, kèm ý nghĩa ngắn)\n` +
    `5. Giờ đẹp để đặt tên / làm lễ đầy tháng\n\n` +
    `Trả lời tiếng Việt, thân thiện, tối đa 200 chữ. Không dùng markdown.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', max_tokens: 400, temperature: 0.5,
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia phong thuỷ Việt Nam, giỏi xem tuổi và gợi ý tên đẹp theo lịch pháp.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json() as { choices: { message: { content: string } }[] };
    const advice = data.choices?.[0]?.message?.content?.trim() ?? '';

    const result = {
      advice,
      childCanChi:  child.canChi,
      childNguHanh: child.nguHanh,
      childConGiap: child.conGiap,
      cached:       false,
    };

    if (env.AI_CACHE && advice) {
      try { await env.AI_CACHE.put(cacheKey, JSON.stringify({ ...result, cached: true }), { expirationTtl: 2592000 }); } catch { /* ok */ }
    }

    return Response.json(result, { headers: CORS });
  } catch {
    return Response.json({
      advice: `Con sinh năm ${childYear} mệnh ${child.nguHanh} (${child.conGiap}). Bộ chữ hợp ngũ hành ${child.nguHanh}. Xem tư vấn đầy đủ tại trang /tu-van.`,
      childCanChi: child.canChi, childNguHanh: child.nguHanh, childConGiap: child.conGiap, cached: false, fallback: true,
    }, { headers: CORS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
