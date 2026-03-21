// ============================================================
// functions/api/ai-chat.ts — AI Chatbot (SSE streaming)
// POST /api/ai-chat
// Rate limit: TẮT (mở cho testing, bật lại sau)
// ============================================================

interface Env {
  AI_CACHE?:    KVNamespace;
  GROQ_API_KEY: string;
}
interface ChatMessage { role: 'user'|'assistant'; content: string; }
interface RequestBody { message: string; history?: ChatMessage[]; date?: string; }

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Inline helpers ───────────────────────────────────────────
const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const THU = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];

function toJDN(d:number,m:number,y:number):number{
  let yy=y,mm=m; if(mm<=2){yy--;mm+=12;}
  const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+d+B-1524;
}
function canChiDay(d:number,m:number,y:number):string{
  const j=toJDN(d,m,y); return `${CAN[(j+9)%10]} ${CHI[(j+1)%12]}`;
}
function canChiYear(y:number):string{
  return `${CAN[(y+6)%10]} ${CHI[(y+8)%12]}`;
}
function getVNDate():string{
  return new Date().toLocaleString('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'}).split(' ')[0]??'2026-01-01';
}

export async function onRequestPost({request,env}:{request:Request;env:Env}) {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({error:'API key not configured'},{status:503,headers:CORS});
  }

  let body: RequestBody;
  try { body = await request.json() as RequestBody; }
  catch { return Response.json({error:'Invalid JSON'},{status:400,headers:CORS}); }

  const message = (body.message??'').trim().slice(0,500);
  if (!message) return Response.json({error:'message required'},{status:400,headers:CORS});

  // Lịch hôm nay
  const today = body.date ?? getVNDate();
  const [ty,tm,td] = today.split('-').map(Number) as [number,number,number];
  const thu   = THU[new Date(Date.UTC(ty,tm-1,td)).getUTCDay()]??'';
  const ccDay = canChiDay(td,tm,ty);
  const ccNam = canChiYear(ty);

  const systemPrompt =
    `Bạn là trợ lý phong thuỷ Lịch Vạn Niên AI. ` +
    `Hôm nay: ${thu} ${td}/${tm}/${ty}, can chi ngày ${ccDay}, năm ${ccNam}. ` +
    `Dùng đúng thông tin ngày này, KHÔNG tự tính lại. ` +
    `Trả lời tiếng Việt, thân thiện, TỐI ĐA 60 từ, NGẮN GỌN và CỤ THỂ. Không giải thích vòng vo.`;

  // Lọc history — bỏ message rỗng
  const history = (body.history??[])
    .filter(m => m.content && m.content.trim())
    .slice(-6);

  // SSE stream
  const {readable,writable} = new TransformStream();
  const writer  = writable.getWriter();
  const encoder = new TextEncoder();

  const send = async (text:string) =>
    writer.write(encoder.encode(`data: ${JSON.stringify({text})}\n\n`));
  const done = async () => {
    writer.write(encoder.encode(`data: ${JSON.stringify({done:true})}\n\n`));
    writer.close();
  };

  (async()=>{
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
        body: JSON.stringify({
          model:'llama-3.1-8b-instant',
          max_tokens:180,
          temperature:0.5,
          stream:true,
          messages:[
            {role:'system', content:systemPrompt},
            ...history,
            {role:'user', content:message},
          ],
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        const errText = await res.text().catch(()=>'');
        if (res.status === 429 || res.status === 403) {
          await send('Groq AI đang bận (quá nhiều yêu cầu). Vui lòng chờ 1 phút rồi thử lại.');
        } else {
          await send(`Lỗi kết nối AI (${res.status}). Thử lại sau.`);
        }
        await done(); return;
      }
      if (!res.body) { await send('Không nhận được phản hồi.'); await done(); return; }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buf     = '';

      while(true){
        const {done:streamDone, value} = await reader.read();
        if(streamDone) break;
        buf += decoder.decode(value,{stream:true});
        const lines = buf.split('\n');
        buf = lines.pop()??'';
        for(const line of lines){
          if(!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if(raw==='[DONE]') continue;
          try {
            const chunk = JSON.parse(raw) as {choices:{delta:{content?:string}}[]};
            const tok   = chunk.choices?.[0]?.delta?.content??'';
            if(tok) await send(tok);
          } catch{ /* skip */ }
        }
      }
      await done();

    } catch(err){
      const isTimeout = err instanceof Error && err.name==='TimeoutError';
      await send(isTimeout ? 'AI phản hồi chậm, thử lại nhé.' : 'Có lỗi kết nối. Thử lại sau.');
      await done();
    }
  })();

  return new Response(readable,{
    headers:{...CORS,'Content-Type':'text/event-stream','Cache-Control':'no-cache'},
  });
}

export async function onRequestOptions(){
  return new Response(null,{status:204,headers:CORS});
}
