// ============================================================
// TuviTab.tsx — Tử Vi Trọn Đời + AI Luận Giải đời thường
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHoroscope, getCanChiYear } from "../data/horoscopes";

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

interface Props { birthYear?: number; }

async function askAiTuvi(canChiYear: string, gender: "nam"|"nu", horoContent: string): Promise<string> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY ?? "").trim();
  if (!apiKey) throw new Error("Chưa có API key");

  const genderLabel = gender==="nam" ? "nam" : "nữ";
  const prompt = `Bạn là một thầy tướng số dày dạn kinh nghiệm, nói chuyện thân thiện, dễ hiểu như người Việt Nam bình thường.

Đây là tử vi truyền thống của người sinh năm ${canChiYear}, ${genderLabel} mạng:
"""
${horoContent.slice(0, 1200)}
"""

Hãy luận giải tử vi trọn đời bằng ngôn ngữ đời thường, dễ hiểu, KHÔNG dùng từ Hán Việt phức tạp.
Gọi họ là "bạn". Trình bày theo đúng định dạng sau (mỗi mục PHẢI bắt đầu bằng ký hiệu •):

• Tổng quan: [2-3 câu mô tả tổng thể số mệnh, tính cách chủ đạo]
• Công việc: [2-3 câu về sự nghiệp, thế mạnh, nghề nghiệp phù hợp]
• Tình duyên: [2-3 câu về hôn nhân, tình cảm, gia đình]
• Lời khuyên: [2-3 câu lời khuyên thực tế, tích cực, hành động cụ thể]

Viết ngắn gọn, ấm áp, truyền cảm hứng. Không phán xét, không dùng từ khó.`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},
    body: JSON.stringify({model:GROQ_MODEL, messages:[{role:"user",content:prompt}], temperature:0.75, max_tokens:500}),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Lỗi server (${res.status})`);
  const j = await res.json() as {choices?:{message?:{content?:string}}[]};
  return j?.choices?.[0]?.message?.content?.trim() ?? "";
}

// Parse bullet output into sections
function parseSections(text: string): {label:string;emoji:string;content:string}[] {
  const map: Record<string,{emoji:string;idx:number}> = {
    "Tổng quan":{emoji:"🌟",idx:0}, "Công việc":{emoji:"💼",idx:1},
    "Tình duyên":{emoji:"❤️",idx:2}, "Lời khuyên":{emoji:"💡",idx:3},
  };
  const result: {label:string;emoji:string;content:string;idx:number}[] = [];
  const lines = text.split("\n").map(l=>l.trim()).filter(Boolean);
  for (const line of lines) {
    const clean = line.replace(/^[•\-\*]\s*/,"");
    for (const [label,{emoji,idx}] of Object.entries(map)) {
      if (clean.toLowerCase().startsWith(label.toLowerCase()+":")) {
        result.push({label,emoji,content:clean.slice(label.length+1).trim(),idx});
        break;
      }
    }
  }
  result.sort((a,b)=>a.idx-b.idx);
  if (result.length===0) {
    // Fallback: show raw text
    return [{label:"Luận Giải",emoji:"🔮",content:text}];
  }
  return result;
}

export function TuviTab({ birthYear }: Props) {
  const [year,   setYear]   = useState(birthYear ?? new Date().getFullYear()-30);
  const [gender, setGender] = useState<"nam"|"nu">("nam");
  const [aiText, setAiText] = useState("");
  const [loading,setLoading]= useState(false);
  const [error,  setError]  = useState("");
  const [asked,  setAsked]  = useState(false);

  const horo = getHoroscope(year, gender);
  const cc   = getCanChiYear(year);

  const handleAsk = async () => {
    if (!horo) return;
    setLoading(true); setError(""); setAiText(""); setAsked(true);
    try {
      const text = await askAiTuvi(cc, gender, horo.content);
      setAiText(text);
    } catch(e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const sections = aiText ? parseSections(aiText) : [];

  return (
    <div className="px-4 pb-4 flex flex-col gap-3">
      {/* Controls */}
      <div className="card p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="section-label mb-2">Giới tính</p>
            <div className="flex gap-1 p-0.5 rounded-xl" style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
              {(["nam","nu"] as const).map(g=>(
                <button key={g} onClick={()=>{setGender(g);setAsked(false);setAiText("");}}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{background:gender===g?"var(--gold)":"transparent",color:gender===g?"white":"var(--text-muted)"}}>
                  {g==="nam"?"👨 Nam":"👩 Nữ"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="section-label mb-2">Năm sinh</p>
            <div className="flex items-center gap-1">
              <button onClick={()=>{setYear(y=>y-1);setAsked(false);setAiText("");}}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>
                −
              </button>
              <div className="flex-1 text-center">
                <p className="font-bold" style={{color:"var(--text-primary)"}}>{year}</p>
                <p className="text-xs" style={{color:"var(--gold)"}}>{cc}</p>
              </div>
              <button onClick={()=>{setYear(y=>y+1);setAsked(false);setAiText("");}}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tử vi truyền thống */}
      <AnimatePresence mode="wait">
        {horo ? (
          <motion.div key={`${year}-${gender}`} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            className="card overflow-hidden">
            <div className="p-4 border-b" style={{background:"var(--gold-bg)",borderColor:"var(--gold-border)"}}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{background:"var(--gold-bg)",border:"1px solid var(--gold-border)"}}>
                  {gender==="nam"?"👨":"👩"}
                </div>
                <div>
                  <p className="font-bold font-display text-lg" style={{color:"var(--text-primary)"}}>
                    {gender==="nam"?"Nam Mạng":"Nữ Mạng"} {cc}
                  </p>
                  <p className="text-xs" style={{color:"var(--text-secondary)"}}>
                    Các năm: {horo.years.slice(0,5).join(", ")}...
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm leading-[1.9] prose-sm"
                style={{color:"var(--text-secondary)",lineHeight:"1.9"}}
                dangerouslySetInnerHTML={{__html:horo.content.slice(0,1800)+(horo.content.length>1800?"...":"")}} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="no-data" className="card p-6 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p style={{color:"var(--text-muted)"}}>Chưa có tử vi cho {cc} {gender==="nam"?"Nam":"Nữ"}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Luận Giải Button */}
      {horo && !loading && !aiText && (
        <motion.button whileTap={{scale:0.97}} onClick={handleAsk}
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          style={{background:"linear-gradient(135deg,var(--gold),var(--gold-light))",color:"white",fontSize:"1rem"}}>
          ✨ Để AI Luận Giải Bằng Lời Dễ Hiểu
        </motion.button>
      )}

      {/* Loading */}
      {loading && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card p-6 flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {[0,1,2].map(i=>(
              <motion.div key={i} className="w-2.5 h-2.5 rounded-full"
                style={{background:"var(--gold)"}}
                animate={{opacity:[0.3,1,0.3],scale:[0.8,1.2,0.8]}}
                transition={{duration:0.9,delay:i*0.3,repeat:Infinity}} />
            ))}
          </div>
          <p className="text-sm" style={{color:"var(--text-muted)"}}>AI đang luận giải tử vi của bạn...</p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-4 text-center" style={{borderColor:"rgba(248,113,113,0.3)"}}>
          <p className="text-2xl mb-2">😔</p>
          <p className="text-sm" style={{color:"var(--accent-red)"}}>{error}</p>
          <button onClick={handleAsk} className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{background:"var(--bg-elevated)",color:"var(--text-secondary)"}}>
            Thử lại
          </button>
        </div>
      )}

      {/* AI Result — Bullet sections */}
      {sections.length>0 && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <p className="section-label">✨ AI Luận Giải</p>
            <button onClick={()=>{setAiText("");setAsked(false);}}
              className="text-xs px-2 py-1 rounded-lg"
              style={{color:"var(--text-faint)",background:"var(--bg-elevated)"}}>
              Làm mới
            </button>
          </div>
          {sections.map(({label,emoji,content})=>(
            <div key={label} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{emoji}</span>
                <p className="font-bold text-base" style={{color:"var(--text-primary)"}}>{label}</p>
              </div>
              <p className="leading-[1.9] text-sm" style={{color:"var(--text-secondary)",lineHeight:"1.9"}}>
                {content}
              </p>
            </div>
          ))}
          <button onClick={handleAsk}
            className="w-full py-3 rounded-2xl text-sm font-semibold"
            style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-muted)"}}>
            🔄 Luận Giải Lại
          </button>
        </motion.div>
      )}
    </div>
  );
}
