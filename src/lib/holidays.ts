// src/lib/holidays.ts — Ngày lễ Việt Nam 2025-2028

export interface Holiday {
  name:        string;
  slug:        string;
  type:        'quocgia' | 'truyen-thong' | 'phat-giao';
  isLunar:     boolean;
  lunarDay?:   number;
  lunarMonth?: number;
  solarDay?:   number;
  solarMonth?: number;
  icon:        string;
  description: string;
  traditions:  string[];
  searchVolume:'very-high' | 'high' | 'medium';
}

export const HOLIDAYS_VN: Holiday[] = [
  // ── QUỐC GIA (Dương lịch) ─────────────────────────────────
  {
    name:'Tết Dương Lịch', slug:'tet-duong-lich',
    type:'quocgia', isLunar:false, solarDay:1, solarMonth:1,
    icon:'🎉', searchVolume:'high',
    description:'Tết Dương Lịch ngày 1/1 là ngày đầu năm dương lịch, ngày nghỉ lễ toàn quốc 1 ngày. Người Việt thường chào đón năm mới với countdown, pháo hoa và sum họp gia đình.',
    traditions:['Xem pháo hoa đêm giao thừa','Họp mặt gia đình','Đi chơi đầu năm'],
  },
  {
    name:'Ngày Giải Phóng Miền Nam', slug:'ngay-30-4',
    type:'quocgia', isLunar:false, solarDay:30, solarMonth:4,
    icon:'🇻🇳', searchVolume:'high',
    description:'Ngày 30/4 kỷ niệm sự kiện giải phóng miền Nam thống nhất đất nước năm 1975. Ngày nghỉ lễ quốc gia, thường được nghỉ kết hợp với 1/5 tạo kỳ nghỉ dài.',
    traditions:['Tham dự lễ kỷ niệm','Du lịch trong nước','Sum họp gia đình'],
  },
  {
    name:'Ngày Quốc Tế Lao Động', slug:'ngay-1-5',
    type:'quocgia', isLunar:false, solarDay:1, solarMonth:5,
    icon:'✊', searchVolume:'medium',
    description:'Ngày Lao Động Quốc Tế 1/5 là ngày nghỉ lễ toàn quốc, vinh danh người lao động. Thường được nghỉ chung với 30/4 tạo kỳ nghỉ 4-5 ngày.',
    traditions:['Nghỉ lễ','Du lịch','Các hoạt động văn hóa'],
  },
  {
    name:'Ngày Quốc Khánh', slug:'ngay-quoc-khanh-2-9',
    type:'quocgia', isLunar:false, solarDay:2, solarMonth:9,
    icon:'🇻🇳', searchVolume:'high',
    description:'Ngày Quốc Khánh 2/9 kỷ niệm Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập năm 1945 tại Quảng trường Ba Đình. Ngày nghỉ lễ quốc gia 1 ngày.',
    traditions:['Lễ mít tinh','Bắn pháo hoa','Xem diễu hành'],
  },

  // ── TRUYỀN THỐNG (Âm lịch) ────────────────────────────────
  {
    name:'Tết Nguyên Đán', slug:'tet-nguyen-dan',
    type:'truyen-thong', isLunar:true, lunarDay:1, lunarMonth:1,
    icon:'🧧', searchVolume:'very-high',
    description:'Tết Nguyên Đán là lễ hội lớn nhất trong năm của người Việt, đánh dấu ngày đầu năm mới âm lịch. Cả gia đình sum họp, cúng ông bà tổ tiên, chúc Tết và lì xì trẻ em.',
    traditions:['Gói bánh chưng','Cúng giao thừa','Chúc Tết','Lì xì','Đi lễ chùa đầu năm','Hái lộc'],
  },
  {
    name:'Giỗ Tổ Hùng Vương', slug:'gio-to-hung-vuong',
    type:'quocgia', isLunar:true, lunarDay:10, lunarMonth:3,
    icon:'👑', searchVolume:'high',
    description:'Giỗ Tổ Hùng Vương ngày 10/3 âm lịch là ngày nghỉ lễ quốc gia từ năm 2007, tưởng nhớ các Vua Hùng đã có công dựng nước. Trung tâm lễ hội là đền Hùng tại Phú Thọ.',
    traditions:['Dâng hương tại đền Hùng','Lễ hội đền Hùng','Rước kiệu'],
  },
  {
    name:'Tết Đoan Ngọ', slug:'tet-doan-ngo-5-5',
    type:'truyen-thong', isLunar:true, lunarDay:5, lunarMonth:5,
    icon:'🍑', searchVolume:'high',
    description:'Tết Đoan Ngọ ngày 5/5 âm lịch còn gọi là Tết diệt sâu bọ. Người Việt ăn hoa quả, rượu nếp, bánh tro và thực hiện các nghi lễ để xua đuổi sâu bệnh, bảo vệ mùa màng.',
    traditions:['Ăn rượu nếp','Ăn hoa quả','Uống nước ngải cứu','Tắm lá mùi'],
  },
  {
    name:'Tết Trung Thu', slug:'tet-trung-thu',
    type:'truyen-thong', isLunar:true, lunarDay:15, lunarMonth:8,
    icon:'🥮', searchVolume:'very-high',
    description:'Tết Trung Thu ngày 15/8 âm lịch là tết thiếu nhi, diễn ra vào đêm trăng tròn lớn nhất năm. Trẻ em rước đèn lồng, phá cỗ trông trăng và ăn bánh Trung Thu.',
    traditions:['Rước đèn lồng','Phá cỗ trông trăng','Ăn bánh Trung Thu','Múa lân','Tặng quà trẻ em'],
  },
  {
    name:'Tết Ông Táo', slug:'tet-ong-tao',
    type:'truyen-thong', isLunar:true, lunarDay:23, lunarMonth:12,
    icon:'🔥', searchVolume:'high',
    description:'Ngày 23 tháng Chạp âm lịch là ngày cúng tiễn ông Công ông Táo về trời báo cáo việc trong nhà với Ngọc Hoàng. Người Việt cúng cá chép và thả cá xuống sông sau lễ.',
    traditions:['Cúng ông Táo','Thả cá chép','Dọn dẹp nhà cửa','Chuẩn bị Tết'],
  },

  // ── PHẬT GIÁO (Âm lịch) ──────────────────────────────────
  {
    name:'Lễ Phật Đản', slug:'le-phat-dan',
    type:'phat-giao', isLunar:true, lunarDay:15, lunarMonth:4,
    icon:'🙏', searchVolume:'medium',
    description:'Lễ Phật Đản ngày 15/4 âm lịch kỷ niệm ngày sinh của Đức Phật Thích Ca Mâu Ni. Phật tử đi lễ chùa, thả hoa đăng, nghe giảng đạo và phóng sinh.',
    traditions:['Đi lễ chùa','Thả hoa đăng','Phóng sinh','Nghe giảng đạo'],
  },
  {
    name:'Lễ Vu Lan Báo Hiếu', slug:'le-vu-lan',
    type:'phat-giao', isLunar:true, lunarDay:15, lunarMonth:7,
    icon:'💐', searchVolume:'high',
    description:'Lễ Vu Lan ngày 15/7 âm lịch là ngày báo hiếu cha mẹ theo truyền thống Phật giáo. Con cái cài hoa hồng lên ngực — đỏ khi cha mẹ còn sống, trắng khi đã mất.',
    traditions:['Cài hoa hồng báo hiếu','Đi lễ chùa','Cúng thí thực cô hồn','Phóng sinh'],
  },
  {
    name:'Rằm tháng Giêng', slug:'ram-thang-gieng',
    type:'phat-giao', isLunar:true, lunarDay:15, lunarMonth:1,
    icon:'🌕', searchVolume:'high',
    description:'Rằm tháng Giêng (15/1 âm lịch) hay Tết Nguyên Tiêu là ngày trăng tròn đầu tiên của năm mới, ngày lễ Phật giáo quan trọng. Nhiều người đi chùa cầu bình an năm mới.',
    traditions:['Đi lễ chùa','Cúng rằm','Ăn đồ chay','Thả hoa đăng'],
  },
];

/**
 * Lấy holiday theo ngày dương lịch
 */
export function getHolidayBySolar(day: number, month: number): Holiday[] {
  return HOLIDAYS_VN.filter(h => !h.isLunar && h.solarDay === day && h.solarMonth === month);
}

/**
 * Lấy holiday theo ngày âm lịch
 */
export function getHolidayByLunar(lunarDay: number, lunarMonth: number): Holiday[] {
  return HOLIDAYS_VN.filter(h => h.isLunar && h.lunarDay === lunarDay && h.lunarMonth === lunarMonth);
}
