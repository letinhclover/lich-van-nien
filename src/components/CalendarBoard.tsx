// ============================================================
// CalendarBoard.tsx — Tờ Lịch + Bộ Điều Hướng Ngày
// Người lớn tuổi: số to, nút to, nhập tay DD/MM/YYYY
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar } from "../utils/astrology";
import { DayDetailPanel } from "./DayDetailPanel";

interface CalendarBoardProps {
  currentDate: Date;
  onDateChange: (d: Date) => void;
}

const WEEKDAYS  = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
const MONTHS_VI = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu",
                   "Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];

function clampDate(d: Date): Date {
  const today = new Date(); today.setHours(23,59,59,999);
  return d > today ? today : d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

function formatInput(d: Date): string {
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function parseInput(s: string): Date | null {
  const parts = s.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yy] = parts.map(Number);
  if (!dd||!mm||!yy||yy<1900||yy>2100||mm<1||mm>12||dd<1||dd>31) return null;
  const d = new Date(yy, mm-1, dd);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function CalendarBoard({ currentDate, onDateChange }: CalendarBoardProps) {
  const [direction, setDirection] = useState(1);
  const [inputVal,  setInputVal]  = useState(formatInput(currentDate));
  const [inputErr,  setInputErr]  = useState(false);
  const prevRef = useRef(currentDate);

  // Sync input when parent changes date
  useEffect(() => {
    if (currentDate.toDateString() !== prevRef.current.toDateString()) {
      setDirection(currentDate > prevRef.current ? 1 : -1);
      prevRef.current = currentDate;
      setInputVal(formatInput(currentDate));
      setInputErr(false);
    }
  }, [currentDate]);

  const go = (n: number) => {
    const next = clampDate(addDays(currentDate, n));
    onDateChange(next);
  };

  const goToday = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    onDateChange(today);
  };

  const handleInputChange = (val: string) => {
    setInputVal(val);
    const parsed = parseInput(val);
    if (parsed) {
      setInputErr(false);
      onDateChange(clampDate(parsed));
    } else {
      setInputErr(true);
    }
  };

  const lunar    = solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());
  const weekday  = WEEKDAYS[currentDate.getDay()];
  const monthName = MONTHS_VI[currentDate.getMonth()];
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  const isToday   = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="px-4 pt-4 flex flex-col gap-3">

      {/* ── Tờ Lịch Chính ── */}
      <AnimatePresence mode="wait">
        <motion.div key={currentDate.toDateString()}
          initial={{ opacity:0, y: direction>0?24:-24 }}
          animate={{ opacity:1, y:0, transition:{ type:"spring", damping:26, stiffness:260 } }}
          exit={{ opacity:0, y: direction>0?-24:24, transition:{ duration:0.11 } }}>

          <div className="card overflow-hidden" style={{ boxShadow:"var(--shadow-float)" }}>
            {/* Gold accent top */}
            <div className="h-1.5 w-full" style={{ background:"linear-gradient(90deg,var(--gold),var(--gold-light))" }} />

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-4 pb-1">
              <div>
                <p className="font-bold text-base" style={{ color:"var(--text-secondary)" }}>{weekday}</p>
                <p className="text-sm mt-0.5" style={{ color:"var(--text-muted)" }}>
                  {monthName} · {currentDate.getFullYear()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"var(--text-muted)" }}>Âm Lịch</span>
                <span className="text-base font-bold" style={{ color:"var(--text-secondary)" }}>
                  {lunar.isLeapMonth?"Nhuận ":""}{lunar.day}/{lunar.month}
                </span>
              </div>
            </div>

            {/* Số ngày to */}
            <div className="relative flex items-center justify-center py-3">
              <motion.span
                className="font-display font-bold select-none leading-none"
                style={{
                  fontSize:"8.5rem",
                  color: isWeekend ? "var(--gold)" : "var(--text-primary)",
                  lineHeight:1,
                }}
                initial={{ scale:0.90 }} animate={{ scale:1 }} transition={{ type:"spring", damping:14 }}>
                {String(currentDate.getDate()).padStart(2,"0")}
              </motion.span>
              {isToday && (
                <span className="absolute top-3 right-5 text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
                  Hôm nay
                </span>
              )}
            </div>

            {/* Can Chi */}
            <div className="flex items-center px-4 pb-4 pt-2 gap-0 border-t"
              style={{ borderColor:"var(--border-subtle)" }}>
              {[
                { label:"Ngày",  val:lunar.canChiDay,   accent:true  },
                { label:"Tháng", val:lunar.canChiMonth, accent:false },
                { label:"Năm",   val:lunar.canChiYear,  accent:false },
              ].map(({ label, val, accent }, i, arr) => (
                <div key={label}
                  className={`flex-1 flex flex-col items-center py-2.5 ${i<arr.length-1?"border-r":""}`}
                  style={{ borderColor:"var(--border-subtle)" }}>
                  <span className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color:"var(--text-muted)" }}>{label}</span>
                  <span className="text-base font-bold"
                    style={{ color: accent?"var(--gold)":"var(--text-primary)" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bộ Điều Hướng Ngày ── */}
      <div className="card p-4">
        <p className="text-sm font-bold mb-3" style={{ color:"var(--text-secondary)" }}>
          📅 Chọn Ngày
        </p>

        {/* Input nhập tay */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputVal}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              className="w-full px-4 py-3 rounded-2xl text-base font-bold outline-none text-center"
              style={{
                background: "var(--bg-elevated)",
                border: `2px solid ${inputErr ? "var(--accent-red)" : "var(--border-medium)"}`,
                color: inputErr ? "var(--accent-red)" : "var(--text-primary)",
                fontSize:"1rem",
              }}
            />
            {inputErr && (
              <p className="text-xs mt-1 text-center" style={{ color:"var(--accent-red)" }}>
                Định dạng: 16/12/1986
              </p>
            )}
          </div>
          {!isToday && (
            <motion.button whileTap={{ scale:0.93 }} onClick={goToday}
              className="px-3 py-3 rounded-2xl text-sm font-bold whitespace-nowrap"
              style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
              Hôm nay
            </motion.button>
          )}
        </div>

        {/* Nút tiến/lùi ngày — to, dễ bấm */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button whileTap={{ scale:0.95 }} onClick={() => go(-1)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg"
            style={{
              background:"var(--bg-elevated)",
              border:"2px solid var(--border-medium)",
              color:"var(--text-primary)",
            }}>
            <span style={{ fontSize:"1.5rem" }}>‹</span>
            <span className="text-base">Hôm qua</span>
          </motion.button>
          <motion.button whileTap={{ scale:0.95 }} onClick={() => go(1)}
            disabled={isToday}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-opacity"
            style={{
              background: isToday ? "var(--bg-elevated)" : "var(--gold)",
              border: isToday ? "2px solid var(--border-subtle)" : "2px solid var(--gold)",
              color: isToday ? "var(--text-faint)" : "white",
              opacity: isToday ? 0.5 : 1,
            }}>
            <span className="text-base">Ngày sau</span>
            <span style={{ fontSize:"1.5rem" }}>›</span>
          </motion.button>
        </div>

        {/* Nút lùi/tiến nhanh theo tuần */}
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {[
            { label:"-7 ngày", n:-7 },
            { label:"-3 ngày", n:-3 },
            { label:"+3 ngày", n:3  },
            { label:"+7 ngày", n:7  },
          ].map(({ label, n }) => (
            <motion.button key={label} whileTap={{ scale:0.93 }}
              onClick={() => go(n)}
              className="py-2 rounded-xl text-xs font-semibold"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-muted)" }}>
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Chi Tiết Ngày ── */}
      <DayDetailPanel date={currentDate} />
    </div>
  );
}
