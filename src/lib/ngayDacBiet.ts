// src/lib/ngayDacBiet.ts — Ngày lễ, Rằm, Mùng Một, Ngày Vía

export interface NgayDacBiet {
  ten:      string;
  icon:     string;
  type:     'quocgia' | 'truyen-thong' | 'phat-giao' | 'ram-mung';
  isLunar:  boolean;
  lunarDay?:   number;
  lunarMonth?: number;
  solarDay?:   number;
  solarMonth?: number;
  desc:    string;
}

export const NGAY_VIA: NgayDacBiet[] = [
  { ten:'Vía Đức Phật Di Lặc',          icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:1,  lunarMonth:1,  desc:'Ngày vía Phật Di Lặc, dân gian còn gọi là ngày Tết Phật.' },
  { ten:'Vía Phật Thích Ca xuất gia',    icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:8,  lunarMonth:2,  desc:'Kỷ niệm ngày Đức Phật Thích Ca rời bỏ cung điện xuất gia.' },
  { ten:'Vía Quan Thế Âm Bồ Tát',       icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:19, lunarMonth:2,  desc:'Ngày vía Quan Thế Âm lần 1, nhiều người đi lễ chùa cầu bình an.' },
  { ten:'Vía Đức Phật Thích Ca',         icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:15, lunarMonth:4,  desc:'Phật Đản — ngày sinh của Đức Phật Thích Ca Mâu Ni.' },
  { ten:'Vía Quan Thế Âm Bồ Tát (hè)',  icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:19, lunarMonth:6,  desc:'Ngày vía Quan Thế Âm lần 2, lễ hội Phật giáo quan trọng.' },
  { ten:'Vía Quan Thế Âm Bồ Tát (thu)', icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:19, lunarMonth:9,  desc:'Ngày vía Quan Thế Âm lần 3 trong năm.' },
  { ten:'Vía Phật Thích Ca thành đạo',   icon:'🙏', type:'phat-giao', isLunar:true, lunarDay:8,  lunarMonth:12, desc:'Kỷ niệm ngày Đức Phật đạt giác ngộ dưới cây Bồ Đề.' },
  { ten:'Vía Ông Công Ông Táo',          icon:'🏠', type:'truyen-thong', isLunar:true, lunarDay:23, lunarMonth:12, desc:'Ngày cúng ông Táo về trời báo cáo việc nhà với Ngọc Hoàng.' },
];

export const HOLIDAYS: NgayDacBiet[] = [
  // Dương lịch
  { ten:'Tết Dương Lịch',                icon:'🎉', type:'quocgia',     isLunar:false, solarDay:1,  solarMonth:1,  desc:'Ngày đầu năm dương lịch, ngày nghỉ lễ toàn quốc.' },
  { ten:'Ngày Giải Phóng Miền Nam',      icon:'🇻🇳', type:'quocgia',     isLunar:false, solarDay:30, solarMonth:4,  desc:'Kỷ niệm ngày thống nhất đất nước 30/4/1975.' },
  { ten:'Ngày Quốc Tế Lao Động',         icon:'✊', type:'quocgia',     isLunar:false, solarDay:1,  solarMonth:5,  desc:'Ngày Lao Động Quốc Tế, ngày nghỉ lễ toàn quốc.' },
  { ten:'Ngày Quốc Khánh',               icon:'🇻🇳', type:'quocgia',     isLunar:false, solarDay:2,  solarMonth:9,  desc:'Kỷ niệm ngày Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập 1945.' },

  // Âm lịch
  { ten:'Tết Nguyên Đán',                icon:'🧧', type:'truyen-thong', isLunar:true, lunarDay:1,  lunarMonth:1,  desc:'Tết cổ truyền lớn nhất Việt Nam, gia đình sum họp đầu năm mới.' },
  { ten:'Rằm tháng Giêng',               icon:'🌕', type:'ram-mung',    isLunar:true, lunarDay:15, lunarMonth:1,  desc:'Rằm tháng Giêng — Tết Nguyên Tiêu, ngày lễ Phật giáo quan trọng.' },
  { ten:'Giỗ Tổ Hùng Vương',             icon:'👑', type:'quocgia',     isLunar:true, lunarDay:10, lunarMonth:3,  desc:'Ngày giỗ các Vua Hùng, ngày nghỉ lễ quốc gia từ 2007.' },
  { ten:'Tết Đoan Ngọ',                  icon:'🍑', type:'truyen-thong', isLunar:true, lunarDay:5,  lunarMonth:5,  desc:'Mùng 5 tháng 5 — Tết diệt sâu bọ, ăn hoa quả và rượu nếp.' },
  { ten:'Rằm tháng Bảy',                 icon:'🌕', type:'phat-giao',   isLunar:true, lunarDay:15, lunarMonth:7,  desc:'Lễ Vu Lan báo hiếu, cúng thí thực cô hồn.' },
  { ten:'Tết Trung Thu',                 icon:'🥮', type:'truyen-thong', isLunar:true, lunarDay:15, lunarMonth:8,  desc:'Tết thiếu nhi — rước đèn, phá cỗ, ngắm trăng rằm tháng 8.' },
  { ten:'Tết Ông Táo',                   icon:'🔥', type:'truyen-thong', isLunar:true, lunarDay:23, lunarMonth:12, desc:'23 tháng Chạp — đưa ông Táo về trời, cúng cá chép.' },
  { ten:'Tất Niên',                      icon:'🍽️', type:'truyen-thong', isLunar:true, lunarDay:30, lunarMonth:12, desc:'Bữa cơm cuối năm, gia đình sum họp trước giao thừa.' },
];

/**
 * Lấy ngày đặc biệt theo ngày âm lịch
 */
export function getDacBietByLunar(lunarDay: number, lunarMonth: number): NgayDacBiet[] {
  return [...HOLIDAYS, ...NGAY_VIA].filter(n =>
    n.isLunar && n.lunarDay === lunarDay && n.lunarMonth === lunarMonth
  );
}

/**
 * Lấy ngày đặc biệt theo ngày dương lịch
 */
export function getDacBietBySolar(solarDay: number, solarMonth: number): NgayDacBiet[] {
  return HOLIDAYS.filter(n =>
    !n.isLunar && n.solarDay === solarDay && n.solarMonth === solarMonth
  );
}

/**
 * Badge cho Rằm / Mùng Một
 */
export function getRamMungBadge(lunarDay: number): string | null {
  if (lunarDay === 15) return '🌕 Ngày Rằm';
  if (lunarDay === 1)  return '🌑 Mùng Một';
  return null;
}
