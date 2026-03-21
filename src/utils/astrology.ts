// ============================================================
// astrology.ts — Bridge to amlich.ts (Ho Ngoc Duc algorithm)
// Keeps the same interface as before, uses correct algorithm
// ============================================================

import {
  solarToLunar as amlichSolarToLunar,
  lunarToSolar as amlichLunarToSolar,
  getCanChi,
  getDayQuality,
  getHoangDao,
  getCanChiYear,
  getCanChiMonth as amlichGetCanChiMonth,
  toJDN,
} from './amlich';

export type { LunarDate, DayQuality, HourQuality } from './amlich';

// ── Re-export core functions ──────────────────────────────────
export { toJDN, getCanChiYear };

// LunarDate interface compatible with old app
export interface LunarDateOld {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  yearElement?: string;
  yearElementName?: string;
}

// ── solarToLunar — use Ho Ngoc Duc algorithm ─────────────────
export function solarToLunar(day: number, month: number, year: number): LunarDateOld {
  const lunar = amlichSolarToLunar(day, month, year);
  const cc    = getCanChi(day, month, year);

  return {
    day:          lunar.day,
    month:        lunar.month,
    year:         lunar.year,
    isLeapMonth:  lunar.leap,
    canChiDay:    cc.ngay.display,
    canChiMonth:  cc.thang.display,
    canChiYear:   cc.nam.display,
    yearElement:  cc.nam.nguHanh,
    yearElementName: cc.nam.nguHanh,
  };
}

// ── lunarToSolar ──────────────────────────────────────────────
export function lunarToSolar(
  lunarDay: number, lunarMonth: number, lunarYear: number,
  isLeapMonth = false
): { day: number; month: number; year: number } | null {
  const result = amlichLunarToSolar(lunarDay, lunarMonth, lunarYear, isLeapMonth);
  if (!result || result.day === 0) return null;
  return { day: result.day, month: result.month, year: result.year };
}

// ── Day quality ───────────────────────────────────────────────
export { getDayQuality, getHoangDao, getCanChi };

// ── Can Chi helpers ───────────────────────────────────────────
export function getCanChiDay(jdn: number): string {
  const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  return `${CAN[(jdn + 9) % 10]} ${CHI[(jdn + 1) % 12]}`;
}

export function getCanChiMonth(month: number, year: number): string {
  return amlichGetCanChiMonth(month, year);
}

export function getChiIndex(year: number): number { return (year + 8) % 12; }
export function getCanIndex(year: number): number  { return (year + 6) % 10; }

// ── UserProfile (Bản Mệnh) ────────────────────────────────────
export interface ShopeeProduct {
  name: string; description: string; url: string; emoji: string;
}

export interface UserProfile {
  birthYear:    number;
  canChiYear:   string;
  element:      string;
  elementName:  string;
  destinyName:  string;
  shopeeProduct: ShopeeProduct;
}

const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];

const DESTINY_TABLE: Record<string, { element: string; elementName: string; destinyName: string }> = {
  'Giáp Tý':  {element:'kim', elementName:'Kim',  destinyName:'Hải Trung Kim — Vàng trong biển'},
  'Ất Sửu':   {element:'kim', elementName:'Kim',  destinyName:'Hải Trung Kim — Vàng trong biển'},
  'Bính Dần': {element:'hoa', elementName:'Hỏa',  destinyName:'Lư Trung Hỏa — Lửa trong lò'},
  'Đinh Mão': {element:'hoa', elementName:'Hỏa',  destinyName:'Lư Trung Hỏa — Lửa trong lò'},
  'Mậu Thìn': {element:'moc', elementName:'Mộc',  destinyName:'Đại Lâm Mộc — Rừng cây lớn'},
  'Kỷ Tỵ':   {element:'moc', elementName:'Mộc',  destinyName:'Đại Lâm Mộc — Rừng cây lớn'},
  'Canh Ngọ': {element:'tho', elementName:'Thổ',  destinyName:'Lộ Bàng Thổ — Đất ven đường'},
  'Tân Mùi':  {element:'tho', elementName:'Thổ',  destinyName:'Lộ Bàng Thổ — Đất ven đường'},
  'Nhâm Thân':{element:'kim', elementName:'Kim',  destinyName:'Kiếm Phong Kim — Vàng mũi kiếm'},
  'Quý Dậu':  {element:'kim', elementName:'Kim',  destinyName:'Kiếm Phong Kim — Vàng mũi kiếm'},
  'Giáp Tuất':{element:'hoa', elementName:'Hỏa',  destinyName:'Sơn Đầu Hỏa — Lửa đỉnh núi'},
  'Ất Hợi':   {element:'hoa', elementName:'Hỏa',  destinyName:'Sơn Đầu Hỏa — Lửa đỉnh núi'},
  'Bính Tý':  {element:'thuy',elementName:'Thủy', destinyName:'Giản Hạ Thủy — Nước suối nhỏ'},
  'Đinh Sửu': {element:'thuy',elementName:'Thủy', destinyName:'Giản Hạ Thủy — Nước suối nhỏ'},
  'Mậu Dần':  {element:'tho', elementName:'Thổ',  destinyName:'Thành Đầu Thổ — Đất đầu thành'},
  'Kỷ Mão':   {element:'tho', elementName:'Thổ',  destinyName:'Thành Đầu Thổ — Đất đầu thành'},
  'Canh Thìn':{element:'kim', elementName:'Kim',  destinyName:'Bạch Lạp Kim — Vàng cây nến'},
  'Tân Tỵ':   {element:'kim', elementName:'Kim',  destinyName:'Bạch Lạp Kim — Vàng cây nến'},
  'Nhâm Ngọ': {element:'moc', elementName:'Mộc',  destinyName:'Dương Liễu Mộc — Cây liễu'},
  'Quý Mùi':  {element:'moc', elementName:'Mộc',  destinyName:'Dương Liễu Mộc — Cây liễu'},
  'Giáp Thân':{element:'thuy',elementName:'Thủy', destinyName:'Tuyền Trung Thủy — Nước trong suối'},
  'Ất Dậu':   {element:'thuy',elementName:'Thủy', destinyName:'Tuyền Trung Thủy — Nước trong suối'},
  'Bính Tuất':{element:'tho', elementName:'Thổ',  destinyName:'Ốc Thượng Thổ — Đất trên mái'},
  'Đinh Hợi': {element:'tho', elementName:'Thổ',  destinyName:'Ốc Thượng Thổ — Đất trên mái'},
  'Mậu Tý':   {element:'hoa', elementName:'Hỏa',  destinyName:'Tích Lịch Hỏa — Sấm sét'},
  'Kỷ Sửu':   {element:'hoa', elementName:'Hỏa',  destinyName:'Tích Lịch Hỏa — Sấm sét'},
  'Canh Dần': {element:'moc', elementName:'Mộc',  destinyName:'Tùng Bách Mộc — Cây tùng bách'},
  'Tân Mão':  {element:'moc', elementName:'Mộc',  destinyName:'Tùng Bách Mộc — Cây tùng bách'},
  'Nhâm Thìn':{element:'thuy',elementName:'Thủy', destinyName:'Trường Lưu Thủy — Nước sông dài'},
  'Quý Tỵ':  {element:'thuy',elementName:'Thủy', destinyName:'Trường Lưu Thủy — Nước sông dài'},
  'Giáp Ngọ':{element:'kim', elementName:'Kim',  destinyName:'Sa Trung Kim — Vàng trong cát'},
  'Ất Mùi':  {element:'kim', elementName:'Kim',  destinyName:'Sa Trung Kim — Vàng trong cát'},
  'Bính Thân':{element:'hoa', elementName:'Hỏa',  destinyName:'Sơn Hạ Hỏa — Lửa dưới núi'},
  'Đinh Dậu': {element:'hoa', elementName:'Hỏa',  destinyName:'Sơn Hạ Hỏa — Lửa dưới núi'},
  'Mậu Tuất': {element:'moc', elementName:'Mộc',  destinyName:'Bình Địa Mộc — Cây đất bằng'},
  'Kỷ Hợi':   {element:'moc', elementName:'Mộc',  destinyName:'Bình Địa Mộc — Cây đất bằng'},
  'Canh Tý':  {element:'tho', elementName:'Thổ',  destinyName:'Bích Thượng Thổ — Đất trên vách'},
  'Tân Sửu':  {element:'tho', elementName:'Thổ',  destinyName:'Bích Thượng Thổ — Đất trên vách'},
  'Nhâm Dần': {element:'kim', elementName:'Kim',  destinyName:'Kim Bạch Kim — Vàng ròng'},
  'Quý Mão':  {element:'kim', elementName:'Kim',  destinyName:'Kim Bạch Kim — Vàng ròng'},
  'Giáp Thìn':{element:'hoa', elementName:'Hỏa',  destinyName:'Phúc Đăng Hỏa — Lửa ngọn đèn'},
  'Ất Tỵ':    {element:'hoa', elementName:'Hỏa',  destinyName:'Phúc Đăng Hỏa — Lửa ngọn đèn'},
  'Bính Ngọ': {element:'thuy',elementName:'Thủy', destinyName:'Thiên Hà Thủy — Nước sông ngân'},
  'Đinh Mùi': {element:'thuy',elementName:'Thủy', destinyName:'Thiên Hà Thủy — Nước sông ngân'},
  'Mậu Thân': {element:'tho', elementName:'Thổ',  destinyName:'Đại Dịch Thổ — Đất bờ rộng'},
  'Kỷ Dậu':   {element:'tho', elementName:'Thổ',  destinyName:'Đại Dịch Thổ — Đất bờ rộng'},
  'Canh Tuất':{element:'kim', elementName:'Kim',  destinyName:'Xuyến Xoa Kim — Vàng vòng hoa'},
  'Tân Hợi':  {element:'kim', elementName:'Kim',  destinyName:'Xuyến Xoa Kim — Vàng vòng hoa'},
  'Nhâm Tý':  {element:'moc', elementName:'Mộc',  destinyName:'Tang Chá Mộc — Cây dâu gốc'},
  'Quý Sửu':  {element:'moc', elementName:'Mộc',  destinyName:'Tang Chá Mộc — Cây dâu gốc'},
  'Giáp Dần': {element:'thuy',elementName:'Thủy', destinyName:'Đại Khê Thủy — Nước khe lớn'},
  'Ất Mão':   {element:'thuy',elementName:'Thủy', destinyName:'Đại Khê Thủy — Nước khe lớn'},
  'Bính Thìn':{element:'tho', elementName:'Thổ',  destinyName:'Sa Trung Thổ — Đất trong cát'},
  'Đinh Tỵ':  {element:'tho', elementName:'Thổ',  destinyName:'Sa Trung Thổ — Đất trong cát'},
  'Mậu Ngọ':  {element:'hoa', elementName:'Hỏa',  destinyName:'Thiên Thượng Hỏa — Lửa trên trời'},
  'Kỷ Mùi':   {element:'hoa', elementName:'Hỏa',  destinyName:'Thiên Thượng Hỏa — Lửa trên trời'},
  'Canh Thân':{element:'moc', elementName:'Mộc',  destinyName:'Thạch Lựu Mộc — Cây lựu đá'},
  'Tân Dậu':  {element:'moc', elementName:'Mộc',  destinyName:'Thạch Lựu Mộc — Cây lựu đá'},
  'Nhâm Tuất':{element:'thuy',elementName:'Thủy', destinyName:'Đại Hải Thủy — Nước biển lớn'},
  'Quý Hợi':  {element:'thuy',elementName:'Thủy', destinyName:'Đại Hải Thủy — Nước biển lớn'},
};

const SHOPEE_BY_ELEMENT: Record<string, ShopeeProduct> = {
  kim:  {name:'Vòng bạc phong thủy Kim',   description:'Hợp mệnh Kim, thu hút tài lộc', url:'https://shopee.vn', emoji:'💍'},
  moc:  {name:'Cây phong thủy mệnh Mộc',   description:'Mang năng lượng tươi mát, bình an', url:'https://shopee.vn', emoji:'🌿'},
  thuy: {name:'Đá phong thủy mệnh Thủy',   description:'Hợp mệnh Thủy, thanh lọc không gian', url:'https://shopee.vn', emoji:'💎'},
  hoa:  {name:'Đèn phong thủy mệnh Hỏa',   description:'Kích hoạt năng lượng, sáng suốt', url:'https://shopee.vn', emoji:'🕯️'},
  tho:  {name:'Tượng đất phong thủy mệnh Thổ', description:'Ổn định, vững chắc, sum vầy', url:'https://shopee.vn', emoji:'🏺'},
};

export function buildUserProfile(birthYear: number): UserProfile {
  const canChi = `${CAN[(birthYear+6)%10]} ${CHI[(birthYear+8)%12]}`;
  const destiny = DESTINY_TABLE[canChi] ?? {element:'tho',elementName:'Thổ',destinyName:'Bình Địa Mộc'};
  return {
    birthYear,
    canChiYear:   canChi,
    element:      destiny.element,
    elementName:  destiny.elementName,
    destinyName:  destiny.destinyName,
    shopeeProduct: SHOPEE_BY_ELEMENT[destiny.element] ?? SHOPEE_BY_ELEMENT['tho']!,
  };
}
