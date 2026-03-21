// CalendarBoard.tsx — Redesigned v4: Compact hero + inline month grid

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar, lunarToSolar } from "../utils/astrology";
import { DayDetailPanel } from "./DayDetailPanel";
import { StreakBadge } from "./StreakBadge";
import { playTick } from "../utils/sounds";

interface Props { currentDate: Date; onDateChange: (d: Date) => void; }

const WD_SHORT = ["CN","T2","T3","T4","T5","T6","T7"];
const WD_LONG  = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
const MONTHS   = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
                   "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

function today0()                      { const d=new Date();d.setHours(0,0,0,0);return d; }
function addDays(d:Date,n:number):Date { const r=new Date(d);r.setDate(r.getDate()+n);return r; }
function sameDay(a:Date,b:Date)        { return a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear(); }
function buildGrid(y:number,m:number):(Date|null)[][] {
  const first=new Date(y,m-1,1).getDay(),total=new Date(y,m,0).getDate();
  const cells:(Date|null)[]=Array(first).fill(null);
  for(let d=1;d<=total;d++) cells.push(new Date(y,m-1,d));
  while(cells.length%7) cells.push(null);
  const rows:(Date|null)[][]=[];
  for(let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));
  return rows;
}

export function CalendarBoard({ currentDate, onDateChange }: Props) {
  const [dir, setDir] = useState(1);
  const prevRef = useRef(currentDate);
  const today   = today0();
  const isToday = sameDay(currentDate, today);

  useEffect(() => {
    if(!sameDay(currentDate,prevRef.current)){
      setDir(currentDate>prevRef.current?1:-1);
      prevRef.current=currentDate;
    }
  },[currentDate]);

  const lunar    = solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());
  const isSun    = currentDate.getDay()===0;
  const isSat    = currentDate.getDay()===6;
  const dayColor = isSun?"#dc2626":isSat?"var(--gold)":"var(--text-primary)";

  const go = (n:number) => { playTick(); onDateChange(addDays(currentDate,n)); };

  return (
    <div className="flex flex-col">

      {/* ── HERO CARD ── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={currentDate.toDateString()}
          custom={dir}
          initial={(d:number)=>({opacity:0, x: d>0?30:-30})}
          animate={{opacity:1, x:0, transition:{type:"spring",damping:28,stiffness:280}}}
          exit={(d:number)=>({opacity:0, x: d>0?-30:30, transition:{duration:0.12}})}>

          <div className="mx-4" style={{
            background:"var(--bg-surface)",
            borderRadius:"20px",
            border:"1px solid var(--border-subtle)",
            boxShadow:"var(--shadow-float)",
            overflow:"hidden",
          }}>
            {/* Gold top bar */}
            <div style={{height:3,background:"linear-gradient(90deg,var(--gold),var(--gold-light))"}}/>

            {/* Header row */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <div>
                <p className="font-bold text-base" style={{color:"var(--text-secondary)"}}>
                  {WD_LONG[currentDate.getDay()]}
                </p>
                <p className="text-sm" style={{color:"var(--text-muted)"}}>
                  {MONTHS[currentDate.getMonth()]} · {currentDate.getFullYear()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{color:"var(--text-muted)"}}>Âm Lịch</span>
                <span className="font-bold text-lg leading-tight" style={{color:"var(--gold-dark,var(--gold))"}}>
                  {lunar.isLeapMonth?"Nhuận ":""}{lunar.day}/{lunar.month}
                </span>
                <span className="text-[10px]" style={{color:"var(--text-muted)"}}>{lunar.canChiYear}</span>
              </div>
            </div>

            {/* Big date number */}
            <div className="flex items-end justify-between px-5 pb-1">
              <motion.div
                initial={{scale:0.85}} animate={{scale:1}}
                transition={{type:"spring",damping:12,stiffness:200}}>
                <span className="font-display font-black select-none leading-none"
                  style={{fontSize:"clamp(5.5rem,22vw,7.5rem)", color:dayColor, display:"block"}}>
                  {String(currentDate.getDate()).padStart(2,"0")}
                </span>
              </motion.div>
              <div className="pb-3 flex flex-col items-end gap-1.5">
                {isToday && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
                    Hôm nay
                  </span>
                )}
                <StreakBadge />
              </div>
            </div>

            {/* Can chi 3 col */}
            <div className="flex border-t mx-0 px-0" style={{borderColor:"var(--border-subtle)"}}>
              {[
                {label:"NGÀY",  val:lunar.canChiDay,   gold:true },
                {label:"THÁNG", val:lunar.canChiMonth,  gold:false},
                {label:"NĂM",   val:lunar.canChiYear,   gold:false},
              ].map(({label,val,gold},i,a)=>(
                <div key={label}
                  className={`flex-1 flex flex-col items-center py-3 ${i<a.length-1?"border-r":""}`}
                  style={{borderColor:"var(--border-subtle)"}}>
                  <span className="text-[9px] font-bold uppercase tracking-widest mb-0.5"
                    style={{color:"var(--text-muted)"}}>{label}</span>
                  <span className="font-bold text-base"
                    style={{color:gold?"var(--gold)":"var(--text-primary)"}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── NAV BUTTONS ── */}
      <div className="flex items-center gap-2 mx-4 mt-3">
        <motion.button whileTap={{scale:0.88}} onClick={()=>go(-1)}
          className="flex-1 flex items-center justify-center py-2.5 rounded-2xl font-semibold text-sm"
          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-secondary)"}}>
          ‹ Hôm qua
        </motion.button>
        <AnimatePresence>
          {!isToday && (
            <motion.button whileTap={{scale:0.88}}
              initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0}}
              onClick={()=>{playTick();onDateChange(today);}}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold shrink-0"
              style={{background:"var(--gold)",color:"white",boxShadow:"0 2px 12px rgba(184,114,10,0.35)"}}>
              Hôm nay
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button whileTap={{scale:0.88}} onClick={()=>go(1)}
          className="flex-1 flex items-center justify-center py-2.5 rounded-2xl font-semibold text-sm"
          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-secondary)"}}>
          Ngày sau ›
        </motion.button>
      </div>

      {/* ── MONTH GRID + LUNAR CONVERTER ── */}
      <div className="mx-4 mt-3">
        <MonthGrid currentDate={currentDate} onSelect={onDateChange} />
      </div>

      {/* ── DAY DETAIL ── */}
      <div className="mx-4 mt-3">
        <DayDetailPanel date={currentDate} />
      </div>

    </div>
  );
}

// ─── Month Grid ───────────────────────────────────────────────
function MonthGrid({currentDate,onSelect}:{currentDate:Date;onSelect:(d:Date)=>void}) {
  const [viewY, setViewY] = useState(currentDate.getFullYear());
  const [viewM, setViewM] = useState(currentDate.getMonth()+1);
  const [showConverter, setShowConverter] = useState(false);
  const today = today0();
  const rows  = useMemo(()=>buildGrid(viewY,viewM),[viewY,viewM]);

  const navM = (dir:1|-1) => {
    setViewM(m=>{ let nm=m+dir,ny=viewY;
      if(nm<1){nm=12;ny--;} if(nm>12){nm=1;ny++;}
      setViewY(ny); return nm; });
  };

  // Sync view when currentDate changes month
  useEffect(()=>{
    setViewM(currentDate.getMonth()+1);
    setViewY(currentDate.getFullYear());
  },[currentDate]);

  return (
    <div style={{background:"var(--bg-surface)",borderRadius:16,border:"1px solid var(--border-subtle)",overflow:"hidden"}}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:"var(--border-subtle)"}}>
        <motion.button whileTap={{scale:0.85}} onClick={()=>navM(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
          style={{background:"var(--bg-elevated)",color:"var(--text-primary)"}}>‹</motion.button>
        <p className="font-bold text-base" style={{color:"var(--text-primary)"}}>
          {MONTHS[viewM-1]} {viewY}
        </p>
        <motion.button whileTap={{scale:0.85}} onClick={()=>navM(1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
          style={{background:"var(--bg-elevated)",color:"var(--text-primary)"}}>›</motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {WD_SHORT.map((w,i)=>(
          <div key={w} className="text-center py-1 text-xs font-bold"
            style={{color:i===0?"#dc2626":i===6?"var(--gold)":"var(--text-muted)"}}>
            {w}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="px-2 pb-2">
        {rows.map((row,ri)=>(
          <div key={ri} className="grid grid-cols-7">
            {row.map((cell,ci)=>{
              if(!cell) return <div key={ci} className="aspect-square"/>;
              const sel = sameDay(cell,currentDate);
              const isTd= sameDay(cell,today);
              const isSun=ci===0, isSat=ci===6;
              const lun = solarToLunar(cell.getDate(),cell.getMonth()+1,cell.getFullYear());
              return (
                <motion.button key={ci} whileTap={{scale:0.78}}
                  onClick={()=>{playTick();onSelect(cell);}}
                  className="flex flex-col items-center justify-center py-1 rounded-xl mx-0.5 my-0.5"
                  style={{
                    background:sel?"var(--gold)":isTd?"var(--gold-bg)":"transparent",
                    border:isTd&&!sel?"1px solid var(--gold-border)":"1px solid transparent",
                    minHeight:44,
                  }}>
                  <span className="text-sm font-bold leading-tight"
                    style={{color:sel?"white":isSun?"#dc2626":isSat?"var(--gold)":"var(--text-primary)"}}>
                    {cell.getDate()}
                  </span>
                  <span className="text-[9px] leading-none"
                    style={{color:sel?"rgba(255,255,255,0.65)":"var(--text-faint)"}}>
                    {lun.day===1?`M.${lun.month}`:lun.day}
                  </span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Converter toggle */}
      <div className="px-3 pb-3">
        <button onClick={()=>setShowConverter(v=>!v)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold"
          style={{background:"var(--bg-elevated)",color:"var(--text-muted)",border:"1px solid var(--border-subtle)"}}>
          {showConverter?"▲ Ẩn":"🔄 Quy đổi Âm ↔ Dương lịch"}
        </button>
        <AnimatePresence>
          {showConverter && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>
              <LunarConverter onSelect={onSelect}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Lunar Converter ─────────────────────────────────────────
function LunarConverter({onSelect}:{onSelect:(d:Date)=>void}) {
  const [lDay,  setLD] = useState(1);
  const [lMonth,setLM] = useState(1);
  const [lYear, setLY] = useState(new Date().getFullYear());
  const [result,setResult] = useState<{day:number;month:number;year:number}|null>(null);
  const [err,   setErr]    = useState(false);

  const convert = () => {
    const r = lunarToSolar(lDay,lMonth,lYear);
    if(r){ setResult(r); setErr(false); }
    else { setResult(null); setErr(true); }
  };

  return (
    <div className="pt-3 flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          {label:"Ngày ÂL",  val:lDay,  set:setLD, min:1, max:30},
          {label:"Tháng ÂL", val:lMonth,set:setLM, min:1, max:12},
          {label:"Năm",      val:lYear, set:setLY, min:1900, max:2100},
        ].map(({label,val,set,min,max})=>(
          <div key={label} className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--text-muted)"}}>{label}</p>
            <div className="flex items-center gap-0.5">
              <button onClick={()=>set((v:number)=>Math.max(min,v-1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>−</button>
              <span className="w-10 text-center font-bold text-sm" style={{color:"var(--text-primary)"}}>{val}</span>
              <button onClick={()=>set((v:number)=>Math.min(max,v+1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>+</button>
            </div>
          </div>
        ))}
      </div>

      <motion.button whileTap={{scale:0.97}} onClick={convert}
        className="w-full py-3 rounded-xl font-bold text-sm"
        style={{background:"var(--gold)",color:"white"}}>
        🔄 Quy đổi → Dương lịch
      </motion.button>

      {err && <p className="text-sm text-center" style={{color:"var(--accent-red)"}}>⚠️ Không tìm được ngày tương ứng</p>}
      {result && !err && (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
          className="rounded-xl p-4 text-center"
          style={{background:"var(--gold-bg)",border:"1px solid var(--gold-border)"}}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:"var(--text-muted)"}}>Dương Lịch</p>
          <p className="text-3xl font-bold font-display" style={{color:"var(--gold)"}}>
            {String(result.day).padStart(2,"0")}/{String(result.month).padStart(2,"0")}/{result.year}
          </p>
          <p className="text-sm mb-3" style={{color:"var(--text-secondary)"}}>
            {WD_LONG[new Date(result.year,result.month-1,result.day).getDay()]}
          </p>
          <motion.button whileTap={{scale:0.97}}
            onClick={()=>onSelect(new Date(result.year,result.month-1,result.day))}
            className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{background:"var(--gold)",color:"white"}}>
            Xem ngày này →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
