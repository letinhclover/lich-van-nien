// ============================================================
// src/lib/dateUtils.ts — Lịch Vạn Niên AI
// Múi giờ: Asia/Ho_Chi_Minh (UTC+7) — CỨNG, không thay đổi
// Tất cả date operations phải qua file này
// ============================================================

import { THU_VI, THU_SHORT, THANG_VI, SSG_START_YEAR, SSG_END_YEAR } from './constants';
import type { SolarDate, MonthCalendar } from './types';

const TZ = 'Asia/Ho_Chi_Minh';

// ─── Lấy "hôm nay" theo giờ VN ───────────────────────────────
/**
 * Trả về ngày hôm nay theo múi giờ Việt Nam.
 * Dùng cho build-time (SSG) và runtime.
 */
export function todayVN(): { day: number; month: number; year: number } {
  const now = new Date();
  // Format theo locale VN để lấy đúng ngày giờ VN
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  }).format(now).split('-');

  return {
    year:  parseInt(parts[0] ?? '2026', 10),
    month: parseInt(parts[1] ?? '1',    10),
    day:   parseInt(parts[2] ?? '1',    10),
  };
}

// ─── Build SolarDate object ────────────────────────────────────
export function buildSolarDate(day: number, month: number, year: number): SolarDate {
  const date    = new Date(year, month - 1, day);
  const weekday = date.getDay() as SolarDate['weekday'];
  return {
    day, month, year,
    weekday,
    weekdayLabel: THU_VI[weekday],
    pathStr:      `${year}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`,
    displayStr:   `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`,
  };
}

// ─── Path utils ───────────────────────────────────────────────
export function solarToPath(day: number, month: number, year: number): string {
  return `/lich/${year}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
}

export function prevDayPath(day: number, month: number, year: number): string {
  const d = new Date(year, month - 1, day - 1);
  return solarToPath(d.getDate(), d.getMonth() + 1, d.getFullYear());
}

export function nextDayPath(day: number, month: number, year: number): string {
  const d = new Date(year, month - 1, day + 1);
  return solarToPath(d.getDate(), d.getMonth() + 1, d.getFullYear());
}

// ─── Lịch tháng ───────────────────────────────────────────────
export function buildMonthCalendar(year: number, month: number): MonthCalendar {
  const firstDay   = new Date(year, month - 1, 1);
  const firstWd    = firstDay.getDay(); // 0=CN
  const totalDays  = new Date(year, month, 0).getDate();

  // Grid 6×7
  const cells: (SolarDate | null)[] = Array(firstWd).fill(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push(buildSolarDate(d, month, year));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const grid: (SolarDate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    grid.push(cells.slice(i, i + 7) as (SolarDate | null)[]);
  }

  return { year, month, grid, totalDays, firstWeekday: firstWd };
}

// ─── Format labels ────────────────────────────────────────────
export function formatDayLabel(day: number, month: number, year: number): string {
  const wd = new Date(year, month - 1, day).getDay();
  return `${THU_VI[wd]}, ${day}/${month}/${year}`;
}

export function formatMonthLabel(month: number, year: number): string {
  return `${THANG_VI[month]} năm ${year}`;
}

export function thuShort(weekday: number): string {
  return THU_SHORT[weekday] ?? 'CN';
}

// ─── SSG: tạo tất cả params cho 1825+ trang ngày ─────────────
export function getAllDayParams(): Array<{
  params: { year: string; month: string; day: string }
}> {
  const paths: Array<{ params: { year: string; month: string; day: string } }> = [];
  const start = new Date(SSG_START_YEAR, 0, 1);
  const end   = new Date(SSG_END_YEAR,   11, 31);

  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    paths.push({
      params: {
        year:  String(d.getFullYear()),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        day:   String(d.getDate()).padStart(2, '0'),
      },
    });
  }
  return paths;
}

// ─── SSG: tạo params cho tất cả tháng ────────────────────────
export function getAllMonthParams(): Array<{
  params: { year: string; month: string }
}> {
  const paths: Array<{ params: { year: string; month: string } }> = [];
  for (let y = SSG_START_YEAR; y <= SSG_END_YEAR; y++) {
    for (let m = 1; m <= 12; m++) {
      paths.push({
        params: {
          year:  String(y),
          month: String(m).padStart(2, '0'),
        },
      });
    }
  }
  return paths;
}

// ─── Validate params từ URL ───────────────────────────────────
export function validateDayParams(
  year: string | undefined,
  month: string | undefined,
  day: string | undefined
): { valid: true; y: number; m: number; d: number } | { valid: false } {
  const y = parseInt(year  ?? '', 10);
  const m = parseInt(month ?? '', 10);
  const d = parseInt(day   ?? '', 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) return { valid: false };
  if (m < 1 || m > 12)                  return { valid: false };
  if (d < 1 || d > 31)                  return { valid: false };
  if (y < 1900 || y > 2100)             return { valid: false };

  // Kiểm tra ngày hợp lệ
  const check = new Date(y, m - 1, d);
  if (check.getFullYear() !== y || check.getMonth() + 1 !== m || check.getDate() !== d) {
    return { valid: false };
  }

  return { valid: true, y, m, d };
}

// ─── So sánh ngày ─────────────────────────────────────────────
export function isSameDay(
  d1: { day: number; month: number; year: number },
  d2: { day: number; month: number; year: number }
): boolean {
  return d1.day === d2.day && d1.month === d2.month && d1.year === d2.year;
}

export function isToday(day: number, month: number, year: number): boolean {
  const today = todayVN();
  return today.day === day && today.month === month && today.year === year;
}

// ─── Tháng trước / tháng sau ──────────────────────────────────
export function prevMonth(month: number, year: number): { month: number; year: number } {
  return month === 1
    ? { month: 12, year: year - 1 }
    : { month: month - 1, year };
}

export function nextMonth(month: number, year: number): { month: number; year: number } {
  return month === 12
    ? { month: 1, year: year + 1 }
    : { month: month + 1, year };
}
