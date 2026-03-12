// ============================================================
// CalendarBoard.tsx — Tờ Lịch + Lịch Tháng Picker
// - Bộ chọn ngày lịch tháng (Month Grid)
// - Đổi Dương ↔ Âm lịch
// - Tờ lịch số to, thông tin Can Chi
// ============================================================

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar, lunarToSolar } from "../utils/astrology";
import { DayDetailPanel } from "./DayDetailPanel";

interface CalendarBoardProps {
  currentDate: Date;
  onDateChange: (d: Date) => void;
}

const WEEKDAYS_SHORT = ["CN","T2","T3","T4","T5","T6","T7"];
const WEEKDAYS_LONG  = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
const MONTHS_VI = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
                   "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

function today0(): Date { const d=new Date(); d.setHours(0,0,0,0); return d; }
function addDays(d: Date, n: number): Date { const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function sameDay(a: Date, b: Date): boolean {
  return a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();
}
function clamp(d: Date): Date { const t=today0(); return d>t?t:d; }

// ─── Month Grid ───────────────────────────────────────────────
function buildMonthGrid(year: number, month: number): (Date|null)[][] {
  const firstDay = new Date(year, month-1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (Date|null)[] = Array(firstDay).fill(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month-1, d));
  while (cells.length%7!==0) cells.push(null);
  const rows: (Date|null)[][] = [];
  for (let i=0; i<cells.length; i+=7) rows.push(cells.slice(i,i+7));
  return rows;
}

// ─── Main Component ───────────────────────────────────────────
export function CalendarBoard({ currentDate, onDateChange }: CalendarBoardProps) {
  const [direction,   setDirection]   = useState(1);
  const [showPicker,  setShowPicker]  = useState(false);
  const [pickerMode,  setPickerMode]  = useState<"solar"|"lunar">("solar");
  const prevRef = useRef(currentDate);

  useEffect(() => {
    if (!sameDay(currentDate, prevRef.current)) {
      setDirection(currentDate > prevRef.current ? 1 : -1);
      prevRef.current = currentDate;
    }
  }, [currentDate]);

  const lunar    = solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());
  const weekday  = WEEKDAYS_LONG[currentDate.getDay()];
  const isWeekend= currentDate.getDay()===0 || currentDate.getDay()===6;
  const isToday  = sameDay(currentDate, today0());

  const go = (n: number) => onDateChange(clamp(addDays(currentDate, n)));
  const goToday = () => onDateChange(today0());

  return (
    <div className="px-4 pt-4 flex flex-col gap-3">

      {/* ── Tờ Lịch ── */}
      <AnimatePresence mode="wait">
        <motion.div key={currentDate.toDateString()}
          initial={{ opacity:0, y: direction>0?24:-24 }}
          animate={{ opacity:1, y:0, transition:{type:"spring",damping:26,stiffness:260} }}
          exit={{ opacity:0, y: direction>0?-24:24, transition:{duration:0.11} }}>

          <div className="card overflow-hidden" style={{boxShadow:"var(--shadow-float)"}}>
            <div className="h-1.5 w-full" style={{background:"linear-gradient(90deg,var(--gold),var(--gold-light))"}} />

            <div className="flex items-start justify-between px-5 pt-4 pb-1">
              <div>
                <p className="font-bold text-base" style={{color:"var(--text-secondary)"}}>{weekday}</p>
                <p className="text-sm mt-0.5" style={{color:"var(--text-muted)"}}>
                  {MONTHS_VI[currentDate.getMonth()]} · {currentDate.getFullYear()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color:"var(--text-muted)"}}>Âm Lịch</span>
                <span className="text-base font-bold" style={{color:"var(--text-secondary)"}}>
                  {lunar.isLeapMonth?"Nhuận ":""}{lunar.day}/{lunar.month}
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-3">
              <motion.span className="font-display font-bold select-none"
                style={{ fontSize:"8.5rem", lineHeight:1,
                  color: isWeekend?"var(--gold)":"var(--text-primary)" }}
                initial={{scale:0.90}} animate={{scale:1}} transition={{type:"spring",damping:14}}>
                {String(currentDate.getDate()).padStart(2,"0")}
              </motion.span>
              {isToday && (
                <span className="absolute top-3 right-5 text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
                  Hôm nay
                </span>
              )}
            </div>

            {/* Can Chi */}
            <div className="flex items-center px-4 pb-4 pt-2 border-t" style={{borderColor:"var(--border-subtle)"}}>
              {[
                {label:"Ngày",  val:lunar.canChiDay,   accent:true },
                {label:"Tháng", val:lunar.canChiMonth, accent:false},
                {label:"Năm",   val:lunar.canChiYear,  accent:false},
              ].map(({label,val,accent},i,arr)=>(
                <div key={label}
                  className={`flex-1 flex flex-col items-center py-2.5 ${i<arr.length-1?"border-r":""}`}
                  style={{borderColor:"var(--border-subtle)"}}>
                  <span className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{color:"var(--text-muted)"}}>{label}</span>
                  <span className="text-base font-bold"
                    style={{color:accent?"var(--gold)":"var(--text-primary)"}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Nút điều hướng nhanh ── */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button whileTap={{scale:0.95}} onClick={()=>go(-1)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold"
          style={{background:"var(--bg-elevated)",border:"2px solid var(--border-medium)",color:"var(--text-primary)"}}>
          <span style={{fontSize:"1.4rem"}}>‹</span><span>Hôm qua</span>
        </motion.button>
        <motion.button whileTap={{scale:0.95}} onClick={()=>go(1)} disabled={isToday}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-opacity"
          style={{background:isToday?"var(--bg-elevated)":"var(--gold)",
            border:isToday?"2px solid var(--border-subtle)":"2px solid var(--gold)",
            color:isToday?"var(--text-faint)":"white", opacity:isToday?0.5:1}}>
          <span>Ngày sau</span><span style={{fontSize:"1.4rem"}}>›</span>
        </motion.button>
      </div>

      {/* ── Nút mở lịch tháng ── */}
      <motion.button whileTap={{scale:0.97}}
        onClick={()=>setShowPicker(v=>!v)}
        className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold"
        style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}>
        <span>📅 Chọn ngày từ lịch</span>
        <motion.span animate={{rotate:showPicker?180:0}} style={{display:"inline-block"}}>▾</motion.span>
      </motion.button>

      {/* ── Date Picker Panel ── */}
      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}} style={{overflow:"hidden"}}>
            <DatePickerPanel
              currentDate={currentDate}
              onSelect={d=>{ onDateChange(d); setShowPicker(false); }}
              pickerMode={pickerMode}
              onModeChange={setPickerMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chi tiết ngày ── */}
      <DayDetailPanel date={currentDate} />
    </div>
  );
}

// ─── Date Picker Panel ────────────────────────────────────────
function DatePickerPanel({ currentDate, onSelect, pickerMode, onModeChange }: {
  currentDate: Date;
  onSelect: (d:Date)=>void;
  pickerMode: "solar"|"lunar";
  onModeChange: (m:"solar"|"lunar")=>void;
}) {
  const [viewYear,  setViewYear]  = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth()+1);

  // Lunar picker state
  const [lunarDay,   setLunarDay]   = useState(1);
  const [lunarMonth, setLunarMonth] = useState(1);
  const [lunarYear,  setLunarYear]  = useState(currentDate.getFullYear());
  const [lunarResult,setLunarResult]= useState<{day:number;month:number;year:number}|null>(null);
  const [lunarErr,   setLunarErr]   = useState(false);

  // Sync lunar inputs with currentDate when switching to lunar mode
  useEffect(() => {
    if (pickerMode === "lunar") {
      const l = solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());
      setLunarDay(l.day); setLunarMonth(l.month); setLunarYear(l.year);
    } else {
      setViewYear(currentDate.getFullYear());
      setViewMonth(currentDate.getMonth()+1);
    }
  }, [pickerMode]);

  const rows = useMemo(()=>buildMonthGrid(viewYear, viewMonth),[viewYear,viewMonth]);
  const today = today0();

  const prevMonth = () => {
    if (viewMonth===1){setViewMonth(12);setViewYear(y=>y-1);}
    else setViewMonth(m=>m-1);
  };
  const nextMonth = () => {
    const nextDate=new Date(viewYear, viewMonth, 1);
    if (nextDate>today) return;
    if (viewMonth===12){setViewMonth(1);setViewYear(y=>y+1);}
    else setViewMonth(m=>m+1);
  };

  const handleLunarConvert = () => {
    const result = lunarToSolar(lunarDay, lunarMonth, lunarYear);
    if (result) { setLunarResult(result); setLunarErr(false); }
    else { setLunarResult(null); setLunarErr(true); }
  };

  return (
    <div className="card overflow-hidden">
      {/* Mode tabs */}
      <div className="flex gap-0 border-b" style={{borderColor:"var(--border-subtle)"}}>
        {([{id:"solar",label:"☀️ Dương Lịch"},{id:"lunar",label:"🌙 Âm Lịch"}] as const).map(t=>(
          <button key={t.id} onClick={()=>onModeChange(t.id)}
            className="flex-1 py-3 text-sm font-bold transition-all"
            style={{
              background:pickerMode===t.id?"var(--gold-bg)":"transparent",
              color:pickerMode===t.id?"var(--gold)":"var(--text-muted)",
              borderBottom:pickerMode===t.id?"2px solid var(--gold)":"2px solid transparent",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {pickerMode==="solar" ? (
        <div className="p-3">
          {/* Month/Year navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <motion.button whileTap={{scale:0.9}} onClick={prevMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{background:"var(--bg-elevated)",color:"var(--text-primary)"}}>
              ‹
            </motion.button>
            <div className="text-center">
              <p className="font-bold text-base" style={{color:"var(--text-primary)"}}>
                {MONTHS_VI[viewMonth-1]} {viewYear}
              </p>
              <p className="text-xs" style={{color:"var(--text-muted)"}}>
                {solarToLunar(1,viewMonth,viewYear).month === solarToLunar(28,viewMonth,viewYear).month
                  ? `Tháng ${solarToLunar(1,viewMonth,viewYear).month} AL`
                  : `Tháng ${solarToLunar(1,viewMonth,viewYear).month}-${solarToLunar(28,viewMonth,viewYear).month} AL`}
              </p>
            </div>
            <motion.button whileTap={{scale:0.9}} onClick={nextMonth}
              disabled={viewYear===today.getFullYear()&&viewMonth===today.getMonth()+1}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{background:"var(--bg-elevated)",color:"var(--text-primary)",
                opacity:viewYear===today.getFullYear()&&viewMonth===today.getMonth()+1?0.3:1}}>
              ›
            </motion.button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS_SHORT.map((w,i)=>(
              <div key={w} className="text-center py-1 text-xs font-bold"
                style={{color:i===0||i===6?"var(--gold)":"var(--text-muted)"}}>
                {w}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {rows.map((row,ri)=>(
            <div key={ri} className="grid grid-cols-7">
              {row.map((cell,ci)=>{
                if (!cell) return <div key={ci}/>;
                const isSelected = sameDay(cell, currentDate);
                const isTd = sameDay(cell, today);
                const isFuture = cell > today;
                const isWeekend = ci===0||ci===6;
                const lunar = solarToLunar(cell.getDate(),cell.getMonth()+1,cell.getFullYear());

                return (
                  <motion.button key={ci} whileTap={{scale:0.85}}
                    disabled={isFuture}
                    onClick={()=>onSelect(cell)}
                    className="relative flex flex-col items-center py-1 rounded-lg mx-0.5 my-0.5"
                    style={{
                      background:isSelected?"var(--gold)":isTd?"var(--gold-bg)":"transparent",
                      border:isTd&&!isSelected?"1px solid var(--gold-border)":"1px solid transparent",
                      opacity:isFuture?0.25:1,
                    }}>
                    <span className="text-sm font-bold leading-tight"
                      style={{color:isSelected?"white":isWeekend?"var(--gold)":"var(--text-primary)"}}>
                      {cell.getDate()}
                    </span>
                    <span className="text-[9px] leading-tight"
                      style={{color:isSelected?"rgba(255,255,255,0.7)":"var(--text-faint)"}}>
                      {lunar.day}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ))}

          {/* Today shortcut */}
          {!sameDay(currentDate, today) && (
            <motion.button whileTap={{scale:0.97}} onClick={()=>onSelect(today)}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold"
              style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
              Về hôm nay
            </motion.button>
          )}
        </div>
      ) : (
        /* Lunar mode */
        <div className="p-4 flex flex-col gap-4">
          <p className="text-sm" style={{color:"var(--text-muted)"}}>
            Nhập ngày âm lịch — chúng tôi sẽ tính ra ngày dương lịch tương ứng
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              {label:"Ngày AL",val:lunarDay,  set:setLunarDay,  min:1,max:30},
              {label:"Tháng AL",val:lunarMonth,set:setLunarMonth,min:1,max:12},
              {label:"Năm",     val:lunarYear, set:setLunarYear, min:1900,max:2100},
            ].map(({label,val,set,min,max})=>(
              <div key={label} className="flex flex-col items-center gap-1.5">
                <p className="text-xs font-bold" style={{color:"var(--text-muted)"}}>{label}</p>
                <div className="flex items-center gap-1 w-full">
                  <button onClick={()=>set((v:number)=>Math.max(min,v-1))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>
                    −
                  </button>
                  <span className="flex-1 text-center font-bold text-base"
                    style={{color:"var(--text-primary)"}}>{val}</span>
                  <button onClick={()=>set((v:number)=>Math.min(max,v+1))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <motion.button whileTap={{scale:0.97}} onClick={handleLunarConvert}
            className="w-full py-3 rounded-2xl font-bold text-sm"
            style={{background:"var(--gold)",color:"white"}}>
            🔄 Đổi sang Dương Lịch
          </motion.button>

          {lunarErr && (
            <p className="text-sm text-center" style={{color:"var(--accent-red)"}}>
              ⚠️ Không tìm được ngày dương lịch tương ứng. Kiểm tra lại ngày âm lịch.
            </p>
          )}

          {lunarResult && !lunarErr && (
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
              className="rounded-2xl p-4 text-center"
              style={{background:"var(--gold-bg)",border:"1px solid var(--gold-border)"}}>
              <p className="text-xs mb-1 font-bold uppercase tracking-widest" style={{color:"var(--text-muted)"}}>Ngày Dương Lịch</p>
              <p className="text-3xl font-bold font-display mb-1" style={{color:"var(--gold)"}}>
                {String(lunarResult.day).padStart(2,"0")}/{String(lunarResult.month).padStart(2,"0")}/{lunarResult.year}
              </p>
              <p className="text-sm" style={{color:"var(--text-secondary)"}}>
                {WEEKDAYS_LONG[new Date(lunarResult.year,lunarResult.month-1,lunarResult.day).getDay()]}
              </p>
              <motion.button whileTap={{scale:0.97}}
                onClick={()=>onSelect(new Date(lunarResult.year,lunarResult.month-1,lunarResult.day))}
                className="mt-3 px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{background:"var(--gold)",color:"white"}}>
                Chọn ngày này
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
