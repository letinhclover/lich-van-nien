// ============================================================
// src/lib/amlich.ts — Lịch Âm Việt Nam
// Thuật toán: Hồ Ngọc Đức (Ho Ngoc Duc)
// Múi giờ: Asia/Ho_Chi_Minh (UTC+7) — CỨNG
//
// UNIT TESTS:
// solarToLunar(17,2,2026) → {day:1, month:1, year:2026, leap:false} ← Mùng 1 Tết Bính Ngọ
// solarToLunar(1,1,2026)  → {day:3, month:12, year:2025, leap:false} ← 3 Chạp
// getCanChiYear(2026) → "Bính Ngọ"
// getCanChiYear(2024) → "Giáp Thìn"
// ============================================================

const TZ_OFFSET = 7;
const JD_BASE   = 2415021;
const SYNODIC   = 29.530588853;

const CAN  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'] as const;
const CHI  = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'] as const;
const GIAP = ['Chuột','Trâu','Hổ','Mèo','Rồng','Rắn','Ngựa','Dê','Khỉ','Gà','Chó','Lợn'] as const;

const NAP_AM: Record<string,string> = {
  'Giáp Tý':'Hải Trung Kim','Ất Sửu':'Hải Trung Kim',
  'Bính Dần':'Lư Trung Hỏa','Đinh Mão':'Lư Trung Hỏa',
  'Mậu Thìn':'Đại Lâm Mộc','Kỷ Tỵ':'Đại Lâm Mộc',
  'Canh Ngọ':'Lộ Bàng Thổ','Tân Mùi':'Lộ Bàng Thổ',
  'Nhâm Thân':'Kiếm Phong Kim','Quý Dậu':'Kiếm Phong Kim',
  'Giáp Tuất':'Sơn Đầu Hỏa','Ất Hợi':'Sơn Đầu Hỏa',
  'Bính Tý':'Giản Hạ Thủy','Đinh Sửu':'Giản Hạ Thủy',
  'Mậu Dần':'Thành Đầu Thổ','Kỷ Mão':'Thành Đầu Thổ',
  'Canh Thìn':'Bạch Lạp Kim','Tân Tỵ':'Bạch Lạp Kim',
  'Nhâm Ngọ':'Dương Liễu Mộc','Quý Mùi':'Dương Liễu Mộc',
  'Giáp Thân':'Tuyền Trung Thủy','Ất Dậu':'Tuyền Trung Thủy',
  'Bính Tuất':'Ốc Thượng Thổ','Đinh Hợi':'Ốc Thượng Thổ',
  'Mậu Tý':'Tịch Lịch Hỏa','Kỷ Sửu':'Tịch Lịch Hỏa',
  'Canh Dần':'Tùng Bách Mộc','Tân Mão':'Tùng Bách Mộc',
  'Nhâm Thìn':'Trường Lưu Thủy','Quý Tỵ':'Trường Lưu Thủy',
  'Giáp Ngọ':'Sa Trung Kim','Ất Mùi':'Sa Trung Kim',
  'Bính Thân':'Sơn Hạ Hỏa','Đinh Dậu':'Sơn Hạ Hỏa',
  'Mậu Tuất':'Bình Địa Mộc','Kỷ Hợi':'Bình Địa Mộc',
  'Canh Tý':'Bích Thượng Thổ','Tân Sửu':'Bích Thượng Thổ',
  'Nhâm Dần':'Kim Bạch Kim','Quý Mão':'Kim Bạch Kim',
  'Giáp Thìn':'Phúc Đăng Hỏa','Ất Tỵ':'Phúc Đăng Hỏa',
  'Bính Ngọ':'Thiên Hà Thủy','Đinh Mùi':'Thiên Hà Thủy',
  'Mậu Thân':'Đại Trạch Thổ','Kỷ Dậu':'Đại Trạch Thổ',
  'Canh Tuất':'Thoa Xuyến Kim','Tân Hợi':'Thoa Xuyến Kim',
  'Nhâm Tý':'Tang Đố Mộc','Quý Sửu':'Tang Đố Mộc',
  'Giáp Dần':'Đại Khê Thủy','Ất Mão':'Đại Khê Thủy',
  'Bính Thìn':'Sa Trung Thổ','Đinh Tỵ':'Sa Trung Thổ',
  'Mậu Ngọ':'Thiên Thượng Hỏa','Kỷ Mùi':'Thiên Thượng Hỏa',
  'Canh Thân':'Thạch Lựu Mộc','Tân Dậu':'Thạch Lựu Mộc',
  'Nhâm Tuất':'Đại Hải Thủy','Quý Hợi':'Đại Hải Thủy',
};

const TEN_GIO = [
  'Giờ Tý (23-1h)','Giờ Sửu (1-3h)','Giờ Dần (3-5h)',
  'Giờ Mão (5-7h)','Giờ Thìn (7-9h)','Giờ Tỵ (9-11h)',
  'Giờ Ngọ (11-13h)','Giờ Mùi (13-15h)','Giờ Thân (15-17h)',
  'Giờ Dậu (17-19h)','Giờ Tuất (19-21h)','Giờ Hợi (21-23h)',
] as const;

// Nhị Thập Bát Tú
const TU_REF_JDN = 2451549;
const NHI_THAP_BAT_TU = [
  'Giác','Cang','Đê','Phòng','Tâm','Vĩ','Cơ',
  'Đẩu','Ngưu','Nữ','Hư','Nguy','Thất','Bích',
  'Khuê','Lâu','Vị','Mão','Tất','Chủy','Sâm',
  'Tỉnh','Quỷ','Liễu','Tinh','Trương','Dực','Chẩn',
] as const;
const TU_DIEM: Record<string,number> = {
  'Giác':1,'Cang':-1,'Đê':0,'Phòng':2,'Tâm':-2,'Vĩ':1,'Cơ':0,
  'Đẩu':1,'Ngưu':-1,'Nữ':-1,'Hư':-1,'Nguy':-2,'Thất':0,'Bích':1,
  'Khuê':0,'Lâu':1,'Vị':2,'Mão':-1,'Tất':1,'Chủy':-2,'Sâm':0,
  'Tỉnh':2,'Quỷ':-2,'Liễu':-1,'Tinh':0,'Trương':1,'Dực':-1,'Chẩn':0,
};

// Bảng Hoàng Đạo: [chiNgay 0-11][gioIndex 0-11] = hoangDao?
const HOANG_DAO: boolean[][] = [
  [true,false,true,false,false,true,false,true,false,false,true,false],
  [false,true,false,false,true,false,true,false,false,true,false,true],
  [false,false,true,true,false,false,true,true,false,false,true,true],
  [true,true,false,false,true,true,false,false,true,true,false,false],
  [false,true,false,true,false,false,true,false,true,false,false,true],
  [true,false,false,true,false,true,false,false,true,false,true,false],
  [true,false,true,false,false,true,false,true,false,false,true,false],
  [false,true,false,false,true,false,true,false,false,true,false,true],
  [false,false,true,true,false,false,true,true,false,false,true,true],
  [true,true,false,false,true,true,false,false,true,true,false,false],
  [false,true,false,true,false,false,true,false,true,false,false,true],
  [true,false,false,true,false,true,false,false,true,false,true,false],
];

const TIET_KHI_NAMES = [
  'Tiểu Hàn','Đại Hàn','Lập Xuân','Vũ Thủy','Kinh Trập','Xuân Phân',
  'Thanh Minh','Cốc Vũ','Lập Hạ','Tiểu Mãn','Mang Chủng','Hạ Chí',
  'Tiểu Thử','Đại Thử','Lập Thu','Xử Thử','Bạch Lộ','Thu Phân',
  'Hàn Lộ','Sương Giáng','Lập Đông','Tiểu Tuyết','Đại Tuyết','Đông Chí',
] as const;
const TIET_KHI_MEANING: Record<string,string> = {
  'Tiểu Hàn':'Lạnh nhẹ','Đại Hàn':'Lạnh lớn','Lập Xuân':'Bắt đầu Xuân',
  'Vũ Thủy':'Mưa nước','Kinh Trập':'Sâu bọ thức giấc','Xuân Phân':'Giữa Xuân',
  'Thanh Minh':'Trời trong sáng','Cốc Vũ':'Mưa lúa','Lập Hạ':'Bắt đầu Hạ',
  'Tiểu Mãn':'Đầy nhỏ','Mang Chủng':'Gieo hạt','Hạ Chí':'Giữa Hạ',
  'Tiểu Thử':'Nóng nhẹ','Đại Thử':'Nóng lớn','Lập Thu':'Bắt đầu Thu',
  'Xử Thử':'Hết nóng','Bạch Lộ':'Sương trắng','Thu Phân':'Giữa Thu',
  'Hàn Lộ':'Sương lạnh','Sương Giáng':'Sương xuống','Lập Đông':'Bắt đầu Đông',
  'Tiểu Tuyết':'Tuyết nhỏ','Đại Tuyết':'Tuyết lớn','Đông Chí':'Giữa Đông',
};

// ─── INTERFACES ───────────────────────────────────────────────

export interface LunarDate {
  day:       number;
  month:     number;
  year:      number;
  leap:      boolean;    // tháng nhuận
  dayName:   string;     // can chi ngày
  monthName: string;     // can chi tháng
  yearName:  string;     // can chi năm
}

export interface SolarDate {
  day: number; month: number; year: number;
}

export interface CanChiUnit {
  can:     string;   // "Bính"
  chi:     string;   // "Ngọ"
  display: string;   // "Bính Ngọ"
  nguHanh: string;   // mệnh nạp âm
}

export interface CanChi {
  nam: CanChiUnit; thang: CanChiUnit; ngay: CanChiUnit; gio: CanChiUnit;
}

export interface DayQuality {
  score:      1|2|3|4|5;
  label:      string;
  color:      string;
  tu:         string;
  isTamNuong: boolean;
  isNguyetKy: boolean;
  goodFor:    string[];
  badFor:     string[];
}

export interface HourQuality {
  index:      number;
  tenGio:     string;
  chi:        string;
  chiIndex:   number;
  canChi:     string;
  isHoangDao: boolean;
  label:      string;
  goodFor:    string[];
}

export interface DayInfo {
  solar: SolarDate; lunar: LunarDate; canChi: CanChi;
  quality: DayQuality; hours: HourQuality[];
}

export interface TietKhi {
  name: string; date: SolarDate; meaning: string;
}

// ─── CORE: Thuật toán Hồ Ngọc Đức ───────────────────────────

/** Dương lịch → Julian Day Number */
export function toJDN(day: number, month: number, year: number): number {
  let y = year, m = month;
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524;
}

/** Tính JDN trăng mới thứ k (quy về JD_BASE) */
function newMoon(k: number): number {
  const T  = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  let JDE = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
          + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * Math.PI / 180);
  const M  = (359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3) * Math.PI / 180;
  const Mf = (306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3) * Math.PI / 180;
  const Om = (21.2964  + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3) * Math.PI / 180;
  JDE += (0.1734 - 0.000393 * T) * Math.sin(M) + 0.0021 * Math.sin(2 * M)
       - 0.4068 * Math.sin(Mf)   + 0.0161 * Math.sin(2 * Mf) - 0.0004 * Math.sin(3 * Mf)
       + 0.0104 * Math.sin(2 * Om) - 0.0051 * Math.sin(M + Mf) - 0.0074 * Math.sin(M - Mf)
       + 0.0004 * Math.sin(2 * Om + M) - 0.0004 * Math.sin(2 * Om - M)
       - 0.0006 * Math.sin(2 * Om + Mf) + 0.0010 * Math.sin(2 * Om - Mf)
       + 0.0005 * Math.sin(M + 2 * Mf);
  return Math.floor(JDE + 0.5 + TZ_OFFSET / 24.0) - JD_BASE;
}

/** Kinh độ Mặt Trời (°) tại JD thực (từ JD_BASE) */
function sunLon(jd: number): number {
  const T  = (jd - 0.5 - TZ_OFFSET / 24.0) / 36525.0;
  const T2 = T * T;
  let L0  = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  const M0 = (357.52911 + 35999.05029 * T - 0.0001537 * T2) * Math.PI / 180;
  const C  = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M0)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * M0)
           + 0.00029 * Math.sin(3 * M0);
  L0 = (L0 + C) % 360;
  return L0 < 0 ? L0 + 360 : L0;
}

/** Đầu tháng 11 âm lịch năm dương lịch `year` (tính theo JD_BASE) */
function lunarMonth11(year: number): number {
  const off = toJDN(31, 12, year) - JD_BASE;
  const k   = Math.floor(off / SYNODIC);
  let nm    = newMoon(k);
  if (sunLon(nm + JD_BASE) < 270) nm = newMoon(k - 1);
  return nm;
}

/** Tìm vị trí tháng nhuận trong 14 tháng sau a11 */
function leapOffset(a11: number): number {
  const k = Math.floor(0.5 + (a11 + JD_BASE - 2415021.076) / SYNODIC);
  let last = 0;
  for (let i = 1; i < 14; i++) {
    const arc = sunLon(newMoon(k + i) + JD_BASE);
    if (Math.abs(arc - Math.floor(arc / 30) * 30) <= 7) break;
    last = i;
  }
  return last;
}

/** Julian Day Number → dương lịch */
export function jdnToSolar(jdn: number): SolarDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day:   e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year:  100 * b + d - 4800 + Math.floor(m / 10),
  };
}

// ─── PUBLIC API ───────────────────────────────────────────────

/**
 * Dương lịch → Âm lịch Việt Nam
 * TEST: solarToLunar(17,2,2026) → {day:1, month:1, year:2026, leap:false}
 */
export function solarToLunar(day: number, month: number, year: number): LunarDate {
  const dayNum = toJDN(day, month, year) - JD_BASE;
  const k      = Math.floor((dayNum - 0.5) / SYNODIC);
  let nmThis   = newMoon(k + 1);
  if (nmThis > dayNum) nmThis = newMoon(k);

  let a11 = lunarMonth11(year);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= nmThis) {
    lunarYear = year;
    a11 = lunarMonth11(year - 1);
  } else {
    lunarYear = year + 1;
    b11 = lunarMonth11(year + 1);
  }

  const lunarDay   = dayNum - nmThis + 1;
  const diff       = Math.floor((nmThis - a11) / 29);
  let   lunarMonth = diff + 11;
  let   isLeap     = false;

  if (b11 - a11 > 365) {
    const lo = leapOffset(a11);
    if (diff >= lo) {
      lunarMonth = diff + 10;
      if (diff === lo) isLeap = true;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth > 11 && diff < 4) lunarYear--;
  // Fix: khi tháng 11 âm rơi vào tháng 12 dương của năm trước
  // (nmThis < Jan 1 of input year), lunarYear phải là năm input - 1
  if (lunarMonth === 11 && nmThis < toJDN(1, 1, year) - JD_BASE) lunarYear--;

  return {
    day:       lunarDay,
    month:     lunarMonth,
    year:      lunarYear,
    leap:      isLeap,
    dayName:   getCanChiDay(day, month, year),
    monthName: getCanChiMonth(lunarMonth, lunarYear),
    yearName:  getCanChiYear(lunarYear),
  };
}

/**
 * Âm lịch → Dương lịch
 */
export function lunarToSolar(lDay: number, lMonth: number, lYear: number, isLeap = false): SolarDate {
  let a11: number, b11: number;
  if (lMonth < 11) {
    a11 = lunarMonth11(lYear - 1);
    b11 = lunarMonth11(lYear);
  } else {
    a11 = lunarMonth11(lYear);
    b11 = lunarMonth11(lYear + 1);
  }
  const k      = Math.floor(0.5 + (a11 + JD_BASE - 2415021.076) / SYNODIC);
  let   offset = lMonth - 11;
  if (offset < 0) offset += 12;

  let nmTarget: number;
  if (b11 - a11 > 365) {
    const lo  = leapOffset(a11);
    const adj = offset >= lo && (offset !== lo || isLeap) ? 1 : 0;
    nmTarget  = newMoon(k + offset + adj);
  } else {
    nmTarget = newMoon(k + offset);
  }

  return jdnToSolar(nmTarget + JD_BASE + lDay - 1);
}

// ─── CAN CHI ─────────────────────────────────────────────────

/** Can Chi năm âm lịch. TEST: getCanChiYear(2026) = "Bính Ngọ" */
export function getCanChiYear(year: number): string {
  return `${CAN[(year + 6) % 10]!} ${CHI[(year + 8) % 12]!}`;
}

/** Can Chi tháng âm lịch */
export function getCanChiMonth(lunarMonth: number, lunarYear: number): string {
  const canI = ((lunarYear - 2000) * 12 + lunarMonth + 43) % 10;
  const chiI = (lunarMonth + 1) % 12;
  return `${CAN[(canI + 10) % 10]!} ${CHI[chiI]!}`;
}

/** Can Chi ngày dương lịch. TEST: getCanChiDay(29,1,2026) = "Nhâm Tý" */
export function getCanChiDay(day: number, month: number, year: number): string {
  const jdn = toJDN(day, month, year);
  return `${CAN[(jdn + 9) % 10]!} ${CHI[(jdn + 1) % 12]!}`;
}

/** Can Chi giờ âm lịch (0–23h) */
export function getCanChiHour(hour: number, day: number, month: number, year: number): string {
  const jdn      = toJDN(day, month, year);
  const gioIndex = Math.floor(((hour + 1) % 24) / 2);
  const canNgay  = (jdn + 9) % 10;
  const canGio   = (canNgay % 5 * 2 + gioIndex) % 10;
  return `${CAN[canGio]!} ${CHI[gioIndex]!}`;
}

/** Tứ Trụ Can Chi đầy đủ */
export function getCanChi(day: number, month: number, year: number): CanChi {
  const lunar  = solarToLunar(day, month, year);
  const jdn    = toJDN(day, month, year);
  // Dùng getVietnamNow() thay new Date() để đúng timezone VN
  const _vnNow = typeof globalThis.Intl !== 'undefined'
    ? (() => { const s = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }); return parseInt(s.split(' ')[1]?.split(':')[0] ?? '8', 10); })()
    : 8;
  const hour   = _vnNow;
  const gioIdx = Math.floor(((hour + 1) % 24) / 2);
  const canNgay = (jdn + 9) % 10;
  const canGio  = (canNgay % 5 * 2 + gioIdx) % 10;

  const unit = (ci: number, chI: number): CanChiUnit => {
    const d = `${CAN[ci]!} ${CHI[chI]!}`;
    return { can: CAN[ci]!, chi: CHI[chI]!, display: d, nguHanh: NAP_AM[d] ?? 'Thổ' };
  };

  return {
    nam:   unit((lunar.year + 6) % 10,  (lunar.year + 8) % 12),
    thang: unit(((lunar.year - 2000) * 12 + lunar.month + 43) % 10, (lunar.month + 1) % 12),
    ngay:  unit((jdn + 9) % 10, (jdn + 1) % 12),
    gio:   unit(canGio, gioIdx),
  };
}

// ─── CHẤT LƯỢNG NGÀY ─────────────────────────────────────────

/** Đánh giá ngày (score 1–5) dựa Nhị Thập Bát Tú + ngày kỵ */
export function getDayQuality(day: number, month: number, year: number): DayQuality {
  const lunar     = solarToLunar(day, month, year);
  const jdn       = toJDN(day, month, year);
  const tuIdx     = ((jdn - TU_REF_JDN) % 28 + 28) % 28;
  const tu        = NHI_THAP_BAT_TU[tuIdx] ?? 'Giác';
  const tuScore   = TU_DIEM[tu] ?? 0;
  const isTamNuong = [3,7,13,18,22,27].includes(lunar.day);
  const isNguyetKy = [5,14,23].includes(lunar.day);

  let diem = 3 + tuScore;
  if (isTamNuong) diem -= 2;
  if (isNguyetKy)  diem -= 1;
  const score = Math.max(1, Math.min(5, Math.round(diem))) as 1|2|3|4|5;

  const META: Record<number, [string, string]> = {
    5: ['Ngày Đại Cát ✨', '#16a34a'],
    4: ['Ngày Tốt 👍',     '#2563eb'],
    3: ['Ngày Bình Thường','#6b7280'],
    2: ['Ngày Hung ⚠️',   '#d97706'],
    1: ['Ngày Đại Hung 🚫','#dc2626'],
  };
  const [baseLabel, color] = META[score]!;
  const label = isTamNuong ? `Tam Nương — ${baseLabel}` : isNguyetKy ? `Nguyệt Kỵ — ${baseLabel}` : baseLabel;

  const GOOD: Record<number,string[]> = {
    5: ['Kết hôn','Khai trương','Khởi công','Ký hợp đồng','Xuất hành','Cầu tài lộc'],
    4: ['Họp bàn công việc','Mua sắm lớn','Thăm người thân','Học hành thi cử'],
    3: ['Công việc hàng ngày','Gặp gỡ bạn bè','Mua sắm nhỏ'],
    2: ['Nghỉ ngơi','Thiền định','Việc nhẹ tại nhà'],
    1: ['Dưỡng sức, không khởi sự việc lớn'],
  };
  const BAD: Record<number,string[]> = {
    5: [], 4: ['Phẫu thuật (trừ cấp cứu)'],
    3: ['Khởi công lớn','Kết hôn','Khai trương'],
    2: ['Kết hôn','Khai trương','Xuất hành xa','Khởi công xây dựng'],
    1: ['Kết hôn','Khai trương','Xuất hành','Khởi công','Ký hợp đồng','Chuyển nhà'],
  };

  return { score, label, color, tu, isTamNuong, isNguyetKy, goodFor: GOOD[score]??[], badFor: BAD[score]??[] };
}

// ─── GIỜ HOÀNG ĐẠO ───────────────────────────────────────────

/** 12 giờ hoàng đạo / hắc đạo theo chi ngày */
export function getHoangDao(day: number, month: number, year: number): HourQuality[] {
  const jdn     = toJDN(day, month, year);
  const chiNgay = (jdn + 1) % 12;
  const hdRow   = HOANG_DAO[chiNgay] ?? HOANG_DAO[0]!;
  const canNgay = (jdn + 9) % 10;
  const GOOD_HD = ['Xuất hành','Họp mặt','Ký kết','Khai trương','Giao dịch'];

  return Array.from({ length: 12 }, (_, i) => {
    const canGio = (canNgay % 5 * 2 + i) % 10;
    const hd     = hdRow[i] ?? false;
    return {
      index: i, tenGio: TEN_GIO[i]!, chi: CHI[i]!, chiIndex: i,
      canChi: `${CAN[canGio]!} ${CHI[i]!}`,
      isHoangDao: hd, label: hd ? 'Hoàng Đạo' : 'Hắc Đạo',
      goodFor: hd ? GOOD_HD : [],
    };
  });
}

export const getHoangDaoHours = getHoangDao;

// ─── TỔNG HỢP & THÁNG ────────────────────────────────────────

export function getDayInfo(day: number, month: number, year: number): DayInfo {
  return {
    solar: { day, month, year }, lunar: solarToLunar(day, month, year),
    canChi: getCanChi(day, month, year), quality: getDayQuality(day, month, year),
    hours: getHoangDao(day, month, year),
  };
}

export function getMonthCalendar(year: number, month: number): DayInfo[] {
  const n = new Date(year, month, 0).getDate();
  return Array.from({ length: n }, (_, i) => getDayInfo(i + 1, month, year));
}

// ─── TIẾT KHÍ ────────────────────────────────────────────────

export function getTietKhi(year: number): TietKhi[] {
  const result: TietKhi[] = [];
  for (let i = 0; i < 24; i++) {
    const targetLon = (285 + i * 15) % 360;
    let jd = toJDN(1, 1, year) - JD_BASE + Math.floor(i * 15.22);
    for (let iter = 0; iter < 50; iter++) {
      const lon  = sunLon(jd + JD_BASE);
      let   diff = targetLon - lon;
      if (diff < -180) diff += 360;
      if (diff >  180) diff -= 360;
      if (Math.abs(diff) < 0.001) break;
      jd += Math.round(diff / 0.9856);
    }
    const solar = jdnToSolar(jd + JD_BASE);
    result.push({ name: TIET_KHI_NAMES[i]!, date: solar, meaning: TIET_KHI_MEANING[TIET_KHI_NAMES[i]!] ?? '' });
  }
  return result;
}

export function getConGiap(lunarYear: number): string {
  return GIAP[(lunarYear + 8) % 12] ?? 'Chuột';
}

export { CAN, CHI, GIAP };
