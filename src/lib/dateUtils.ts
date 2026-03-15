// ============================================================
// src/lib/dateUtils.ts — Lịch Vạn Niên AI
// Múi giờ: Asia/Ho_Chi_Minh (UTC+7) — CỨNG, không thay đổi
//
// QUY TẮC BẮT BUỘC:
//   - KHÔNG dùng new Date() thô ở bất kỳ file nào khác
//   - KHÔNG dùng Date.getFullYear/getMonth/getDate thô ở ngoài file này
//   - Tất cả "ngày hôm nay" phải qua getVietnamNow() hoặc todayVN()
//
// LÝ DO: new Date() trả timezone của server (UTC trên Cloudflare),
// gây sai ngày khi user ở VN nhưng server UTC gọi lúc 17:00-23:59 UTC
// (tức 00:00-06:59 sáng hôm sau ở Việt Nam).
//
// EDGE CASE TEST:
//   Server UTC 23:30 → VN 06:30 sáng hôm sau
//   getVietnamNow() phải trả ngày hôm SAU (đúng ngày VN)
// ============================================================

import { SSG_START_YEAR, SSG_END_YEAR } from './constants';
import type { SolarDate, MonthCalendar } from './types';

// ─── Timezone constant ────────────────────────────────────────
export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh' as const;

// ─── Thứ trong tuần ──────────────────────────────────────────
const THU_FULL = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư',
  'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy',
] as const;

const THU_SHORT_ARR = ['CN','T2','T3','T4','T5','T6','T7'] as const;

const THANG_FULL = [
  '', 'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
  'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
  'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai',
] as const;

// Re-export cho các file khác
export const THU_VI    = THU_FULL;
export const THU_SHORT = THU_SHORT_ARR;
export const THANG_VI  = THANG_FULL;

// ─── Interface ────────────────────────────────────────────────

export interface VietnamDateTime {
  year:        number;   // 2026
  month:       number;   // 1–12
  day:         number;   // 1–31
  hour:        number;   // 0–23
  minute:      number;   // 0–59
  second:      number;   // 0–59
  dayOfWeek:   number;   // 0=CN, 1=T2 ... 6=T7
  /** "14/03/2026" */
  dateString:  string;
  /** "06:30:00" */
  timeString:  string;
  /** "Thứ Sáu" */
  weekdayName: string;
}

// ─── CORE: Lấy ngày giờ Việt Nam ─────────────────────────────

/**
 * Lấy ngày giờ HIỆN TẠI theo múi giờ Việt Nam (UTC+7).
 *
 * Không dùng new Date() thô — dùng Intl.DateTimeFormat để chuyển
 * đúng timezone bất kể server chạy ở đâu (UTC, US, EU...).
 *
 * TEST EDGE CASE: 23:30 UTC = 06:30 VN ngày hôm sau
 * → hàm này trả ngày hôm SAU (đúng theo VN).
 */
export function getVietnamNow(): VietnamDateTime {
  // Dùng sv-SE locale cho format ISO YYYY-MM-DD HH:mm:ss
  const vnStr = new Date().toLocaleString('sv-SE', {
    timeZone: VN_TIMEZONE,
  });
  // vnStr = "2026-03-14 06:30:45"
  const [datePart, timePart] = vnStr.split(' ');
  const [y, mo, d]  = (datePart ?? '2026-01-01').split('-').map(Number);
  const [h, mi, s]  = (timePart ?? '00:00:00').split(':').map(Number);

  const year   = y  ?? 2026;
  const month  = mo ?? 1;
  const day    = d  ?? 1;
  const hour   = h  ?? 0;
  const minute = mi ?? 0;
  const second = s  ?? 0;

  // Tính thứ trong tuần: dùng UTC date với offset cố định
  // new Date(Date.UTC(y,m-1,d)) cho ngày chính xác theo VN
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return {
    year, month, day,
    hour, minute, second,
    dayOfWeek:   dow,
    dateString:  `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`,
    timeString:  `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}`,
    weekdayName: THU_FULL[dow] ?? 'Chủ Nhật',
  };
}

/**
 * Alias ngắn gọn cho getVietnamNow() — chỉ trả {day, month, year}
 * Dùng trong SSG build-time để lấy ngày hôm nay theo VN.
 */
export function todayVN(): { day: number; month: number; year: number } {
  const { day, month, year } = getVietnamNow();
  return { day, month, year };
}

// ─── VALIDATE ────────────────────────────────────────────────

/**
 * Kiểm tra ngày dương lịch hợp lệ (kể cả năm nhuận).
 * TEST: isValidDate(30,2,2026) = false
 * TEST: isValidDate(29,2,2024) = true  (2024 là năm nhuận)
 * TEST: isValidDate(29,2,2025) = false (2025 không nhuận)
 */
export function isValidDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day   < 1 || day   > 31) return false;
  if (year  < 1 || year  > 9999) return false;
  // Dùng UTC để tránh DST shift
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year
      && d.getUTCMonth() + 1 === month
      && d.getUTCDate()  === day;
}

/**
 * Validate params từ URL động [year]/[month]/[day]
 */
export function validateDayParams(
  year:  string | undefined,
  month: string | undefined,
  day:   string | undefined,
): { valid: true; y: number; m: number; d: number } | { valid: false } {
  const y = parseInt(year  ?? '', 10);
  const m = parseInt(month ?? '', 10);
  const d = parseInt(day   ?? '', 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return { valid: false };
  if (y < 1900 || y > 2100)             return { valid: false };
  if (!isValidDate(d, m, y))            return { valid: false };
  return { valid: true, y, m, d };
}

// ─── FORMAT ──────────────────────────────────────────────────

/**
 * Format ngày đầy đủ tiếng Việt có dấu.
 * Ví dụ: "Thứ Sáu, ngày 14 tháng 3 năm 2026"
 */
export function formatDateVN(day: number, month: number, year: number): string {
  const dow  = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const thu  = THU_FULL[dow] ?? 'Chủ Nhật';
  return `${thu}, ngày ${day} tháng ${month} năm ${year}`;
}

/**
 * Format ngày ngắn: "14/03/2026"
 */
export function formatDateShort(day: number, month: number, year: number): string {
  return `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`;
}

/**
 * Format label ngắn cho header: "Thứ Sáu, 14/3/2026"
 */
export function formatDayLabel(day: number, month: number, year: number): string {
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${THU_FULL[dow]}, ${day}/${month}/${year}`;
}

/**
 * Format tháng năm: "Tháng Ba năm 2026"
 */
export function formatMonthLabel(month: number, year: number): string {
  return `${THANG_FULL[month] ?? `Tháng ${month}`} năm ${year}`;
}

/**
 * Tên thứ từ số.
 * 0 = "Chủ Nhật", 1 = "Thứ Hai" ... 6 = "Thứ Bảy"
 */
export function getDayOfWeekName(dow: number): string {
  return THU_FULL[dow % 7] ?? 'Chủ Nhật';
}

/** Tên thứ rút gọn: "CN", "T2" ... "T7" */
export function thuShort(dow: number): string {
  return THU_SHORT_ARR[dow % 7] ?? 'CN';
}

// ─── PATH UTILS ──────────────────────────────────────────────

/**
 * Tạo path /lich/YYYY/MM/DD.
 * TEST: formatPath(14,3,2026) = "2026/03/14"
 */
export function formatPath(day: number, month: number, year: number): string {
  return `${year}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
}

/** Tạo URL path /lich/YYYY/MM/DD */
export function solarToPath(day: number, month: number, year: number): string {
  return `/lich/${formatPath(day, month, year)}`;
}

/**
 * Path ngày hôm nay theo múi giờ VN.
 * TEST: getTodayPath() ở 23:30 UTC → trả ngày hôm SAU theo VN
 */
export function getTodayPath(): string {
  const { day, month, year } = getVietnamNow();
  return solarToPath(day, month, year);
}

/**
 * Path ngày mai theo múi giờ VN.
 */
export function getTomorrowPath(): string {
  const { day, month, year } = getVietnamNow();
  // Dùng UTC math để tránh DST
  const d = new Date(Date.UTC(year, month - 1, day + 1));
  return solarToPath(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
}

/** Path ngày hôm trước */
export function prevDayPath(day: number, month: number, year: number): string {
  const d = new Date(Date.UTC(year, month - 1, day - 1));
  return solarToPath(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
}

/** Path ngày hôm sau */
export function nextDayPath(day: number, month: number, year: number): string {
  const d = new Date(Date.UTC(year, month - 1, day + 1));
  return solarToPath(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
}

// ─── SOLAR DATE OBJECT ────────────────────────────────────────

/**
 * Tạo SolarDate object từ ngày/tháng/năm.
 * Dùng UTC để tính dayOfWeek, tránh timezone shift.
 */
export function buildSolarDate(day: number, month: number, year: number): SolarDate {
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay() as SolarDate['weekday'];
  return {
    day, month, year,
    weekday:      dow,
    weekdayLabel: THU_FULL[dow] ?? 'Chủ Nhật',
    pathStr:      formatPath(day, month, year),
    displayStr:   formatDateShort(day, month, year),
  };
}

// ─── MONTH CALENDAR ──────────────────────────────────────────

/**
 * Build lưới tháng 7 cột × N hàng.
 * Dùng Date.UTC để tính đúng, không bị ảnh hưởng timezone server.
 */
export function buildMonthCalendar(year: number, month: number): MonthCalendar {
  // Ngày đầu tháng và tổng số ngày — tính qua UTC
  const firstDow  = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: (SolarDate | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push(buildSolarDate(d, month, year));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const grid: (SolarDate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    grid.push(cells.slice(i, i + 7) as (SolarDate | null)[]);
  }

  return { year, month, grid, totalDays, firstWeekday: firstDow };
}

// ─── SO SÁNH ─────────────────────────────────────────────────

export function isSameDay(
  a: { day: number; month: number; year: number },
  b: { day: number; month: number; year: number },
): boolean {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}

export function isToday(day: number, month: number, year: number): boolean {
  const t = todayVN();
  return t.day === day && t.month === month && t.year === year;
}

// ─── THÁNG TRƯỚC / SAU ───────────────────────────────────────

export function prevMonth(month: number, year: number): { month: number; year: number } {
  return month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
}

export function nextMonth(month: number, year: number): { month: number; year: number } {
  return month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };
}

// ─── SSG PARAMS ──────────────────────────────────────────────

/** Generate params cho 1825+ trang ngày tĩnh */
export function getAllDayParams(): Array<{
  params: { year: string; month: string; day: string }
}> {
  const paths: Array<{ params: { year: string; month: string; day: string } }> = [];
  // Dùng UTC để loop qua ngày — không bị DST ảnh hưởng
  const startMs = Date.UTC(SSG_START_YEAR, 0, 1);
  const endMs   = Date.UTC(SSG_END_YEAR, 11, 31);
  const dayMs   = 86400000;

  for (let ms = startMs; ms <= endMs; ms += dayMs) {
    const d = new Date(ms);
    paths.push({
      params: {
        year:  String(d.getUTCFullYear()),
        month: String(d.getUTCMonth() + 1).padStart(2, '0'),
        day:   String(d.getUTCDate()).padStart(2, '0'),
      },
    });
  }
  return paths;
}

/** Generate params cho tất cả tháng tĩnh */
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
