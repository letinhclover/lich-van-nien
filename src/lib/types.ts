// ============================================================
// src/lib/types.ts — Lịch Vạn Niên AI
// TypeScript interfaces trung tâm — toàn bộ project import từ đây
// ============================================================

// ─── Lịch Dương ─────────────────────────────────────────────
export interface SolarDate {
  day:   number;    // 1–31
  month: number;    // 1–12
  year:  number;    // e.g. 2026
  /** Thứ trong tuần: 0=CN, 1=T2, ... 6=T7 */
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Label tiếng Việt: "Thứ Hai", "Chủ Nhật", ... */
  weekdayLabel: string;
  /** Chuỗi path: "2026/03/14" */
  pathStr: string;
  /** Chuỗi hiển thị: "14/03/2026" */
  displayStr: string;
}

// ─── Lịch Âm ─────────────────────────────────────────────────
export interface LunarDate {
  day:          number;    // 1–30
  month:        number;    // 1–12
  year:         number;    // năm âm lịch
  isLeapMonth:  boolean;   // tháng nhuận
  /** Giờ JDN dương lịch tương ứng */
  jdn:          number;
}

// ─── Can Chi ─────────────────────────────────────────────────
export interface CanChi {
  /** Can Chi đầy đủ: "Giáp Tý" */
  full:     string;
  /** Thiên can: "Giáp" */
  can:      string;
  /** Địa chi: "Tý" */
  chi:      string;
  /** Index thiên can 0–9 */
  canIndex: number;
  /** Index địa chi 0–11 */
  chiIndex: number;
  /** Con giáp: "Chuột" */
  zodiac:   string;
  /** Ngũ hành nạp âm: "Kim", "Mộc", "Thủy", "Hỏa", "Thổ" */
  element:  NguHanh;
  /** Tên mệnh đầy đủ: "Hải Trung Kim" */
  elementDesc: string;
}

// ─── Ngũ Hành ─────────────────────────────────────────────────
export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface NguHanhInfo {
  name:     NguHanh;
  emoji:    string;
  color:    string;         // hex
  /** Màu hợp mệnh */
  luckyColors: string[];
  /** Mệnh tương sinh */
  sinh:     NguHanh;
  /** Mệnh tương khắc */
  khac:     NguHanh;
}

// ─── Trực (12 Trực nhật) ─────────────────────────────────────
export type TrucName =
  | 'Kiến' | 'Trừ' | 'Mãn' | 'Bình' | 'Định' | 'Chấp'
  | 'Phá'  | 'Nguy' | 'Thành' | 'Thu' | 'Khai' | 'Bế';

export type TrucRating = 'tốt' | 'bình thường' | 'xấu';

export interface TrucInfo {
  id:         number;
  ten:        TrucName;
  dinhGia:    TrucRating;
  /** Điểm 0–5 cho từng mục đích */
  xayDung:    number;
  kinhDoanh:  number;
  cuoiHoi:    number;
  anTang:     number;
}

// ─── Sao (114 Sao Cát Hung) ──────────────────────────────────
export interface SaoInfo {
  id:         number;
  name:       string;
  info:       string | null;
  /** Can hoặc Chi ngày có sao này, theo từng tháng âm T1-T12 */
  byMonth:    (string | null)[];
  xayDung:    number;
  kinhDoanh:  number;
  cuoiHoi:    number;
  anTang:     number;
}

// ─── Giờ Hoàng Đạo / Hắc Đạo ─────────────────────────────────
export type HourQualityType = 'hoang-dao' | 'hac-dao' | 'trung-binh';

export interface HourQuality {
  /** Giờ dương: 0–23 */
  hour:       number;
  /** Tên giờ âm: "Giờ Tý (23-1h)", "Giờ Sửu (1-3h)", ... */
  tenGio:     string;
  /** Can chi của giờ */
  canChi:     string;
  quality:    HourQualityType;
  /** Tên hoàng đạo/hắc đạo nếu có */
  tenSao:     string | null;
  /** Phù hợp cho: */
  goodFor:    string[];
}

// ─── Chất lượng ngày ─────────────────────────────────────────
export type DayRating = 1 | 2 | 3 | 4 | 5;

export interface DayQuality {
  xayDung:    DayRating;
  kinhDoanh:  DayRating;
  cuoiHoi:    DayRating;
  anTang:     DayRating;
  overall:    DayRating;
  isTot:      boolean;
  summary:    string;
}

// ─── Ngày Xấu ─────────────────────────────────────────────────
export type NgayXauType =
  | 'Nguyệt Kỵ'
  | 'Tam Nương'
  | 'Dương Công Kỵ'
  | 'Vãng Vong'
  | 'Sát Chủ'
  | 'Thọ Tử';

// ─── DayInfo — tổng hợp toàn bộ thông tin 1 ngày ─────────────
export interface DayInfo {
  /** Ngày dương lịch */
  solar:       SolarDate;
  /** Ngày âm lịch */
  lunar:       LunarDate;
  /** Can chi ngày */
  canChiDay:   CanChi;
  /** Can chi tháng âm */
  canChiMonth: CanChi;
  /** Can chi năm âm */
  canChiYear:  CanChi;
  /** Trực nhật */
  truc:        TrucInfo;
  /** Sao tốt trong ngày */
  saoTot:      SaoInfo[];
  /** Sao xấu trong ngày */
  saoXau:      SaoInfo[];
  /** Sao trong 28 sao */
  saoBatTu:    {
    sao:     string;
    info:    string | null;
    xayDung: number;
    kinhDoanh: number;
    cuoiHoi: number;
    anTang:  number;
  };
  /** Danh sách ngày xấu đặc biệt */
  ngayXauList: NgayXauType[];
  /** Đánh giá tổng hợp */
  quality:     DayQuality;
  /** Giờ hoàng đạo / hắc đạo */
  hours:       HourQuality[];
}

// ─── Xem tuổi hợp ─────────────────────────────────────────────
export interface AgeAnalysis {
  birthYear:    number;
  tuoi:         number;             // tuổi âm tính từ currentYear
  canChiYear:   CanChi;
  kimLau:       boolean;
  hoangOc:      boolean;
  tamTai:       boolean;
  ketHon:       { good: boolean; reason: string };
  xayNha:       { good: boolean; reason: string };
  overall:      'tốt' | 'trung bình' | 'cần cúng giải' | 'nên tránh';
  overallColor: string;
  tips:         string[];
}

// ─── Lịch tháng ───────────────────────────────────────────────
export interface MonthCalendar {
  year:         number;
  month:        number;
  /** Ma trận 6×7: null = ô trống, Date = ngày thực */
  grid:         (SolarDate | null)[][];
  /** Tổng ngày trong tháng */
  totalDays:    number;
  /** Thứ đầu tiên của tháng (0=CN) */
  firstWeekday: number;
}

// ─── SEO Meta ─────────────────────────────────────────────────
export interface SeoMeta {
  title:        string;    // max 60 ký tự
  description:  string;   // max 160 ký tự
  canonical:    string;   // full URL
  ogImage?:     string;   // full URL
  noindex?:     boolean;
}

// ─── Site Config ──────────────────────────────────────────────
export interface SiteConfig {
  domain:       string;
  baseUrl:      string;
  siteName:     string;
  siteNameFull: string;
  description:  string;
  ogImage:      string;
}
