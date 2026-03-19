// functions/api/van-trinh.ts — AI vận trình 2027
// POST /api/van-trinh { birthYear }

interface Env { AI_CACHE?: KVNamespace; GROQ_API_KEY: string; }

const CAN  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI  = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const NH   = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];
const NH_THANG: Record<string,string[]> = {
  'Mộc':['2','3','8','9'],'Hỏa':['3','4','9','10'],
  'Thổ':['1','4','7','10'],'Kim':['5','6','11','12'],'Thủy':['6','7','12','1'],
};
const NH_MAU: Record<string,string[]> = {
  'Mộc':['Xanh lá','Xanh lam','Đen'],'Hỏa':['Đỏ','Cam','Tím'],
  'Thổ':['Vàng','Nâu','Cam'],'Kim':['Trắng','Bạc','Xám'],'Thủy':['Đen','Xanh đậm','Trắng'],
};

const CORS = {
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type',
};

export async function onRequestPost({request, env}:{request:Request;env:Env}) {
  if (!env.GROQ_API_KEY) return Response.json({error:'Not configured'},{status:503,headers:CORS});

  const {birthYear} = await request.json() as {birthYear:number};
  if (!birthYear || birthYear < 1924 || birthYear > 2010)
    return Response.json({error:'Invalid birthYear'},{status:400,headers:CORS});

  const cacheKey = `van-trinh:2027:v1:${birthYear}`;
  if (env.AI_CACHE) {
    try {
      const cached = await env.AI_CACHE.get(cacheKey);
      if (cached) return Response.json(JSON.parse(cached), {headers:CORS});
    } catch {}
  }

  const canChi  = `${CAN[(birthYear+6)%10]} ${CHI[(birthYear+8)%12]}`;
  const nguHanh = NH[(birthYear+6)%10]!;
  const thangTot = NH_THANG[nguHanh] ?? ['3','6','9','12'];
  const mauHop   = NH_MAU[nguHanh] ?? ['Trắng','Xám'];

  const prompt =
    `Viết báo cáo vận trình năm 2027 (năm Đinh Mùi) cho người sinh năm ${birthYear}, tuổi ${canChi}, mệnh ${nguHanh}.\n` +
    `Trả về JSON hợp lệ (không markdown, không ``` ) với các trường sau, mỗi trường 60-80 chữ tiếng Việt thân thiện:\n` +
    `{\n` +
    `  "tongQuan": "...",\n` +
    `  "taiLoc": "...",\n` +
    `  "suNghiep": "...",\n` +
    `  "tinhDuyen": "...",\n` +
    `  "sucKhoe": "...",\n` +
    `  "loiKhuyen": "..."\n` +
    `}\n` +
    `Dựa trên ngũ hành ${nguHanh} trong năm Đinh Mùi (Thổ). Không bịa thông tin.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${env.GROQ_API_KEY}`},
      body: JSON.stringify({
        model:'llama-3.1-8b-instant', max_tokens:800, temperature:0.5,
        messages:[
          {role:'system', content:'Bạn là chuyên gia phong thuỷ Việt Nam. Trả về JSON hợp lệ, không markdown.'},
          {role:'user', content:prompt},
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json() as {choices:{message:{content:string}}[]};
    const raw  = data.choices?.[0]?.message?.content?.trim() ?? '';

    // Parse JSON safely
    const clean = raw.replace(/```json?/g,'').replace(/```/g,'').trim();
    let parsed: Record<string,string>;
    try { parsed = JSON.parse(clean); }
    catch {
      // Fallback nếu JSON invalid
      parsed = {
        tongQuan:  `Năm 2027 vận trình tuổi ${canChi} ở mức trung bình khá. Mệnh ${nguHanh} trong năm Đinh Mùi cần chú trọng sức khoẻ và các mối quan hệ.`,
        taiLoc:    `Tài lộc ổn định, tránh đầu tư mạo hiểm trong nửa đầu năm. Tháng ${thangTot[0]} và ${thangTot[1]} âm là thời điểm tài vận tốt nhất.`,
        suNghiep:  `Sự nghiệp có bước tiến đáng kể. Nên tận dụng cơ hội trong tháng ${thangTot[0]} và ${thangTot[2]} âm lịch.`,
        tinhDuyen: `Tình duyên có biến động nhẹ. Người độc thân có cơ hội gặp duyên nửa cuối năm. Gia đình cần tăng cường giao tiếp.`,
        sucKhoe:   `Chú trọng sức khoẻ hệ tiêu hoá và hô hấp. Tập thể dục đều đặn, nghỉ ngơi hợp lý, tránh thức khuya.`,
        loiKhuyen: `Kiên nhẫn và chăm chỉ là chìa khoá. Tận dụng tháng ${thangTot[0]}, ${thangTot[1]} âm để khởi sự việc quan trọng.`,
      };
    }

    const result = {
      ...parsed,
      thangTot, mauHop, canChi, nguHanh, birthYear,
    };

    if (env.AI_CACHE) {
      try { await env.AI_CACHE.put(cacheKey, JSON.stringify(result), {expirationTtl:365*24*3600}); }
      catch {}
    }

    return Response.json(result, {headers:CORS});
  } catch(err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown';
    return Response.json({error:'AI error', detail:errMsg},{status:500,headers:CORS});
  }
}

export async function onRequestOptions() {
  return new Response(null,{status:204,headers:CORS});
}
