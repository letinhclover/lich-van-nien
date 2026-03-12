// ============================================================
// EventsTab.tsx — Sự Kiện: Lễ Việt Nam + Sự kiện cá nhân
// Retention: hiển thị "Còn X ngày" cho mỗi sự kiện
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar, lunarToSolar } from "../utils/astrology";

// ─── Types ───────────────────────────────────────────────────
interface PersonalEvent {
  id: string;
  name: string;
  type: "lunar" | "solar";
  day: number;
  month: number;
  year?: number; // optional fixed year for one-time events
}

// ─── Hardcoded Vietnamese Holidays ───────────────────────────
const HOLIDAYS: { name:string; emoji:string; type:"lunar"|"solar"; day:number; month:number; desc:string }[] = [
  { name:"Tết Nguyên Đán",    emoji:"🎆", type:"lunar", day:1,  month:1,  desc:"Mùng 1 Tết - Năm mới Âm lịch" },
  { name:"Mùng 2 Tết",        emoji:"🧧", type:"lunar", day:2,  month:1,  desc:"Lì xì và thăm gia đình" },
  { name:"Mùng 3 Tết",        emoji:"🧧", type:"lunar", day:3,  month:1,  desc:"Về nhà nội / ngoại" },
  { name:"Giỗ Tổ Hùng Vương", emoji:"🏯", type:"lunar", day:10, month:3,  desc:"10/3 Âm lịch - Ngày Quốc tổ" },
  { name:"Rằm Tháng Giêng",   emoji:"🌕", type:"lunar", day:15, month:1,  desc:"Lễ cúng Rằm đầu năm" },
  { name:"Tết Đoan Ngọ",      emoji:"🍑", type:"lunar", day:5,  month:5,  desc:"Mùng 5/5 Âm - diệt sâu bọ" },
  { name:"Rằm Tháng 7",       emoji:"🕯️", type:"lunar", day:15, month:7,  desc:"Lễ Vu Lan - báo hiếu cha mẹ" },
  { name:"Tết Trung Thu",     emoji:"🥮", type:"lunar", day:15, month:8,  desc:"15/8 Âm - Tết thiếu nhi" },
  { name:"Táo Quân",          emoji:"🐟", type:"lunar", day:23, month:12, desc:"23 tháng Chạp - cúng ông Táo" },
  { name:"Tất Niên",          emoji:"🎊", type:"lunar", day:30, month:12, desc:"Cuối năm Âm lịch" },
  { name:"Quốc tế Phụ nữ",   emoji:"💐", type:"solar", day:8,  month:3,  desc:"8/3 Dương lịch" },
  { name:"Ngày Giải Phóng",   emoji:"🇻🇳", type:"solar", day:30, month:4,  desc:"30/4 - Thống nhất đất nước" },
  { name:"Ngày Quốc Tế LĐ",  emoji:"⚒️", type:"solar", day:1,  month:5,  desc:"1/5 - Quốc tế Lao động" },
  { name:"Quốc Khánh",        emoji:"🎌", type:"solar", day:2,  month:9,  desc:"2/9 - Độc lập nước CHXHCNVN" },
  { name:"Ngày Phụ nữ VN",    emoji:"🌺", type:"solar", day:20, month:10, desc:"20/10 - Ngày Phụ nữ Việt Nam" },
  { name:"Ngày Nhà giáo",     emoji:"🎓", type:"solar", day:20, month:11, desc:"20/11 - Tôn vinh thầy cô" },
  { name:"Giáng Sinh",        emoji:"🎄", type:"solar", day:25, month:12, desc:"25/12 - Noel" },
  { name:"Tết Dương Lịch",    emoji:"🎉", type:"solar", day:1,  month:1,  desc:"1/1 Tết Tây - Năm mới" },
];

const STORAGE_KEY = "hcc_personal_events";

function loadEvents(): PersonalEvent[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)??"[]") ?? []; } catch { return []; }
}
function saveEvents(events: PersonalEvent[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch {}
}

// Tính ngày sự kiện tiếp theo
function nextOccurrence(ev: PersonalEvent | typeof HOLIDAYS[0], today: Date): Date | null {
  const yr = today.getFullYear();
  if (ev.type === "solar") {
    // Check this year and next
    for (let y = yr; y <= yr+1; y++) {
      const d = new Date(y, ev.month-1, ev.day);
      if (d >= today) return d;
    }
  } else {
    // Lunar — find in this year and next
    for (let y = yr; y <= yr+1; y++) {
      const result = lunarToSolar(ev.day, ev.month, y);
      if (result) {
        const d = new Date(result.year, result.month-1, result.day);
        if (d >= today) return d;
      }
    }
  }
  return null;
}

function daysUntil(d: Date, today: Date): number {
  const ms = d.getTime() - today.getTime();
  return Math.ceil(ms / 86400000);
}

function formatNextDate(d: Date): string {
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

// ─── Main Component ───────────────────────────────────────────
export function EventsTab() {
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>(loadEvents);
  const [showAdd,   setShowAdd]   = useState(false);
  const [newName,   setNewName]   = useState("");
  const [newType,   setNewType]   = useState<"lunar"|"solar">("solar");
  const [newDay,    setNewDay]    = useState(1);
  const [newMonth,  setNewMonth]  = useState(1);

  const today = useMemo(() => { const d=new Date(); d.setHours(0,0,0,0); return d; }, []);

  // Enrich holidays with countdown
  const holidayItems = useMemo(() =>
    HOLIDAYS.map(h => {
      const next = nextOccurrence(h, today);
      return { ...h, next, days: next ? daysUntil(next, today) : null };
    }).sort((a,b) => (a.days??9999) - (b.days??9999)),
  [today]);

  // Enrich personal events
  const personalItems = useMemo(() =>
    personalEvents.map(ev => {
      const next = nextOccurrence(ev, today);
      return { ...ev, next, days: next ? daysUntil(next, today) : null };
    }).sort((a,b) => (a.days??9999) - (b.days??9999)),
  [personalEvents, today]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const ev: PersonalEvent = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: newType,
      day: newDay,
      month: newMonth,
    };
    const updated = [...personalEvents, ev];
    setPersonalEvents(updated);
    saveEvents(updated);
    setNewName(""); setNewDay(1); setNewMonth(1);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    const updated = personalEvents.filter(e => e.id !== id);
    setPersonalEvents(updated);
    saveEvents(updated);
  };

  // Upcoming (next 30 days) from all sources
  const upcoming = useMemo(() =>
    [...holidayItems, ...personalItems.map(p=>({...p,emoji:"⭐"}))]
      .filter(e => e.days !== null && e.days! >= 0 && e.days! <= 30)
      .sort((a,b) => (a.days??9999) - (b.days??9999))
      .slice(0, 5),
  [holidayItems, personalItems]);

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">

      {/* Sắp tới trong 30 ngày */}
      {upcoming.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center gap-2"
            style={{background:"var(--gold-bg)",borderColor:"var(--gold-border)"}}>
            <span className="text-lg">⏰</span>
            <p className="font-bold" style={{color:"var(--gold)"}}>Sắp Diễn Ra (30 ngày tới)</p>
          </div>
          {upcoming.map((ev,i) => (
            <div key={i} className={`px-4 py-3 flex items-center gap-3 ${i<upcoming.length-1?"border-b":""}`}
              style={{borderColor:"var(--border-subtle)"}}>
              <span className="text-2xl w-8 text-center flex-shrink-0">{(ev as {emoji:string}).emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{color:"var(--text-primary)"}}>{ev.name}</p>
                <p className="text-xs" style={{color:"var(--text-muted)"}}>
                  {ev.next ? formatNextDate(ev.next) : ""}
                  {ev.type==="lunar" ? " (Âm lịch)" : ""}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                {ev.days===0
                  ? <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{background:"rgba(245,166,35,0.15)",color:"var(--gold)"}}>Hôm nay!</span>
                  : ev.days===1
                  ? <span className="text-sm font-bold" style={{color:"var(--accent-red)"}}>Ngày mai</span>
                  : <span className="text-sm font-bold" style={{color:"var(--text-secondary)"}}>còn {ev.days} ngày</span>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sự kiện của tôi */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="section-label">⭐ Sự Kiện Của Tôi</p>
          <motion.button whileTap={{scale:0.93}} onClick={()=>setShowAdd(v=>!v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
            style={{background:"var(--gold)",color:"white"}}>
            {showAdd?"✕ Đóng":"+ Thêm mới"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
              exit={{opacity:0,height:0}} style={{overflow:"hidden"}} className="mb-3">
              <div className="card p-4 flex flex-col gap-3">
                <input type="text" value={newName} onChange={e=>setNewName(e.target.value)}
                  placeholder="Tên sự kiện (vd: Giỗ Ba, Sinh nhật Mẹ...)"
                  className="w-full px-4 py-3 rounded-xl outline-none font-medium"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>

                <div className="flex gap-1 p-0.5 rounded-xl" style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
                  {([{id:"solar",label:"☀️ Sinh nhật DL"},{id:"lunar",label:"🌙 Giỗ / Ngày ÂL"}] as const).map(t=>(
                    <button key={t.id} onClick={()=>setNewType(t.id)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                      style={{background:newType===t.id?"var(--gold)":"transparent",color:newType===t.id?"white":"var(--text-muted)"}}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[{label:"Ngày",val:newDay,set:setNewDay,min:1,max:31},{label:`Tháng ${newType==="lunar"?"(Âm)":"(DL)"}`,val:newMonth,set:setNewMonth,min:1,max:12}].map(({label,val,set,min,max})=>(
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <p className="text-xs font-bold" style={{color:"var(--text-muted)"}}>{label}</p>
                      <div className="flex items-center gap-2 w-full justify-center">
                        <button onClick={()=>set((v:number)=>Math.max(min,v-1))}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
                          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>−</button>
                        <span className="text-lg font-bold min-w-8 text-center" style={{color:"var(--text-primary)"}}>{val}</span>
                        <button onClick={()=>set((v:number)=>Math.min(max,v+1))}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
                          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button whileTap={{scale:0.97}} onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="w-full py-3 rounded-2xl font-bold text-sm"
                  style={{background:newName.trim()?"var(--gold)":"var(--bg-elevated)",
                    color:newName.trim()?"white":"var(--text-faint)",
                    opacity:newName.trim()?1:0.6}}>
                  💾 Lưu Sự Kiện
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {personalItems.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="font-medium mb-1" style={{color:"var(--text-primary)"}}>Chưa có sự kiện nào</p>
            <p className="text-sm" style={{color:"var(--text-muted)"}}>
              Thêm giỗ, sinh nhật, kỷ niệm... để nhận thông báo đếm ngược
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {personalItems.map((ev,i) => (
              <div key={ev.id} className={`px-4 py-3.5 flex items-center gap-3 ${i<personalItems.length-1?"border-b":""}`}
                style={{borderColor:"var(--border-subtle)"}}>
                <span className="text-2xl flex-shrink-0">{ev.type==="lunar"?"🕯️":"⭐"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{color:"var(--text-primary)"}}>{ev.name}</p>
                  <p className="text-xs" style={{color:"var(--text-muted)"}}>
                    {ev.day}/{ev.month} {ev.type==="lunar"?"Âm lịch":"Dương lịch"}
                    {ev.next ? ` · ${formatNextDate(ev.next)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {ev.days !== null && (
                    ev.days===0
                      ? <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{background:"rgba(245,166,35,0.15)",color:"var(--gold)"}}>Hôm nay!</span>
                      : ev.days===1
                      ? <span className="text-sm font-bold" style={{color:"var(--accent-red)"}}>Ngày mai</span>
                      : <span className="text-xs font-bold" style={{color:"var(--text-muted)"}}>còn {ev.days}d</span>
                  )}
                  <button onClick={()=>handleDelete(ev.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{background:"rgba(248,113,113,0.08)",color:"var(--accent-red)"}}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lịch Lễ Việt Nam */}
      <div>
        <p className="section-label mb-2.5 px-1">🇻🇳 Lịch Lễ Việt Nam</p>
        <div className="card overflow-hidden">
          {holidayItems.map((h,i)=>(
            <div key={h.name} className={`px-4 py-3 flex items-center gap-3 ${i<holidayItems.length-1?"border-b":""}`}
              style={{borderColor:"var(--border-subtle)"}}>
              <span className="text-xl w-8 text-center flex-shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold" style={{color:"var(--text-primary)"}}>{h.name}</p>
                <p className="text-xs" style={{color:"var(--text-muted)"}}>
                  {h.desc}
                  {h.type==="lunar" ? " · Âm lịch" : ""}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                {h.next && <p className="text-xs" style={{color:"var(--text-faint)"}}>{formatNextDate(h.next)}</p>}
                {h.days !== null && (
                  h.days===0
                    ? <p className="text-xs font-bold" style={{color:"var(--gold)"}}>Hôm nay!</p>
                    : <p className="text-xs font-bold" style={{color:"var(--text-secondary)"}}>còn {h.days}d</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
