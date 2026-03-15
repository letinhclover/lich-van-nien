// ============================================================
// src/lib/constants.ts — Lịch Vạn Niên AI
// Hằng số trung tâm: Can Chi, Ngũ Hành, Config, Labels
// ============================================================

import type { NguHanhInfo, SiteConfig } from './types';

// ─── Site Config ──────────────────────────────────────────────
export const SITE: SiteConfig = {
  domain:       'lichvannien.io.vn',
  baseUrl:      'https://lichvannien.io.vn',
  siteName:     'Lịch Vạn Niên AI',
  siteNameFull: 'Lịch Vạn Niên AI — Lịch Âm Dương Việt Nam',
  description:  'Lịch vạn niên, âm lịch 2026, xem ngày tốt xấu, giờ hoàng đạo, can chi tứ trụ, chọn ngày cưới, hỏi thầy AI. Chính xác, miễn phí, dành cho người Việt.',
  ogImage:      'https://lichvannien.io.vn/og-default.jpg',
};

// ─── Timezone ────────────────────────────────────────────────
export const VIETNAM_TZ = 7; // UTC+7

// ─── Thiên Can ───────────────────────────────────────────────
export const THIEN_CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ',   'Canh', 'Tân', 'Nhâm', 'Quý',
] as const;
export type ThienCan = typeof THIEN_CAN[number];

// ─── Địa Chi ─────────────────────────────────────────────────
export const DIA_CHI = [
  'Tý',   'Sửu', 'Dần',  'Mão',
  'Thìn', 'Tỵ',  'Ngọ',  'Mùi',
  'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const;
export type DiaChi = typeof DIA_CHI[number];

// ─── Con Giáp ────────────────────────────────────────────────
export const CON_GIAP = [
  'Chuột', 'Trâu', 'Hổ',  'Mèo',
  'Rồng',  'Rắn',  'Ngựa','Dê',
  'Khỉ',   'Gà',   'Chó', 'Lợn',
] as const;

// ─── Ngũ Hành Can (thiên can → ngũ hành) ─────────────────────
// Giáp/Ất=Mộc, Bính/Đinh=Hỏa, Mậu/Kỷ=Thổ, Canh/Tân=Kim, Nhâm/Quý=Thủy
export const NGU_HANH_CAN: readonly string[] = [
  'Mộc','Mộc','Hỏa','Hỏa','Thổ',
  'Thổ','Kim','Kim','Thủy','Thủy',
];

// ─── Ngũ Hành Chi (địa chi → ngũ hành) ───────────────────────
export const NGU_HANH_CHI: readonly string[] = [
  'Thủy','Thổ','Mộc','Mộc',
  'Thổ','Hỏa','Hỏa','Thổ',
  'Kim','Kim','Thổ','Thủy',
];

// ─── Ngũ Hành Info ────────────────────────────────────────────
export const NGU_HANH_INFO: Record<string, NguHanhInfo> = {
  Kim: {
    name:'Kim', emoji:'🪙', color:'#B8860B',
    luckyColors:['Trắng','Bạc','Vàng'],
    sinh:'Thủy', khac:'Mộc',
  },
  Mộc: {
    name:'Mộc', emoji:'🌿', color:'#16a34a',
    luckyColors:['Xanh lá','Xanh lục'],
    sinh:'Hỏa', khac:'Thổ',
  },
  Thủy: {
    name:'Thủy', emoji:'💧', color:'#1d4ed8',
    luckyColors:['Đen','Xanh dương','Tím'],
    sinh:'Mộc', khac:'Hỏa',
  },
  Hỏa: {
    name:'Hỏa', emoji:'🔥', color:'#dc2626',
    luckyColors:['Đỏ','Cam','Hồng'],
    sinh:'Thổ', khac:'Kim',
  },
  Thổ: {
    name:'Thổ', emoji:'🌏', color:'#ca8a04',
    luckyColors:['Vàng','Nâu','Cam đất'],
    sinh:'Kim', khac:'Thủy',
  },
};

// ─── Nạp Âm 60 Năm ───────────────────────────────────────────
// Key = "Can Chi", Value = [ngũ hành nạp âm, tên mệnh]
export const NAP_AM: Record<string, [string, string]> = {
  'Giáp Tý':    ['Kim',  'Hải Trung Kim — Vàng trong lòng biển'],
  'Ất Sửu':     ['Kim',  'Hải Trung Kim — Vàng trong lòng biển'],
  'Bính Dần':   ['Hỏa',  'Lư Trung Hỏa — Lửa trong lò'],
  'Đinh Mão':   ['Hỏa',  'Lư Trung Hỏa — Lửa trong lò'],
  'Mậu Thìn':   ['Mộc',  'Đại Lâm Mộc — Rừng cây lớn'],
  'Kỷ Tỵ':      ['Mộc',  'Đại Lâm Mộc — Rừng cây lớn'],
  'Canh Ngọ':   ['Thổ',  'Lộ Bàng Thổ — Đất ven đường'],
  'Tân Mùi':    ['Thổ',  'Lộ Bàng Thổ — Đất ven đường'],
  'Nhâm Thân':  ['Kim',  'Kiếm Phong Kim — Vàng mũi kiếm'],
  'Quý Dậu':    ['Kim',  'Kiếm Phong Kim — Vàng mũi kiếm'],
  'Giáp Tuất':  ['Hỏa',  'Sơn Đầu Hỏa — Lửa đỉnh núi'],
  'Ất Hợi':     ['Hỏa',  'Sơn Đầu Hỏa — Lửa đỉnh núi'],
  'Bính Tý':    ['Thủy', 'Giản Hạ Thủy — Nước suối'],
  'Đinh Sửu':   ['Thủy', 'Giản Hạ Thủy — Nước suối'],
  'Mậu Dần':    ['Thổ',  'Thành Đầu Thổ — Đất thành lũy'],
  'Kỷ Mão':     ['Thổ',  'Thành Đầu Thổ — Đất thành lũy'],
  'Canh Thìn':  ['Kim',  'Bạch Lạp Kim — Vàng bạch lạp'],
  'Tân Tỵ':     ['Kim',  'Bạch Lạp Kim — Vàng bạch lạp'],
  'Nhâm Ngọ':   ['Mộc',  'Dương Liễu Mộc — Cây dương liễu'],
  'Quý Mùi':    ['Mộc',  'Dương Liễu Mộc — Cây dương liễu'],
  'Giáp Thân':  ['Thủy', 'Tuyền Trung Thủy — Nước giếng suối'],
  'Ất Dậu':     ['Thủy', 'Tuyền Trung Thủy — Nước giếng suối'],
  'Bính Tuất':  ['Thổ',  'Ốc Thượng Thổ — Đất mái nhà'],
  'Đinh Hợi':   ['Thổ',  'Ốc Thượng Thổ — Đất mái nhà'],
  'Mậu Tý':     ['Hỏa',  'Tịch Lịch Hỏa — Sét lửa'],
  'Kỷ Sửu':     ['Hỏa',  'Tịch Lịch Hỏa — Sét lửa'],
  'Canh Dần':   ['Mộc',  'Tùng Bách Mộc — Thông bách'],
  'Tân Mão':    ['Mộc',  'Tùng Bách Mộc — Thông bách'],
  'Nhâm Thìn':  ['Thủy', 'Trường Lưu Thủy — Nước dài chảy'],
  'Quý Tỵ':     ['Thủy', 'Trường Lưu Thủy — Nước dài chảy'],
  'Giáp Ngọ':   ['Kim',  'Sa Trung Kim — Vàng trong cát'],
  'Ất Mùi':     ['Kim',  'Sa Trung Kim — Vàng trong cát'],
  'Bính Thân':  ['Hỏa',  'Sơn Hạ Hỏa — Lửa dưới núi'],
  'Đinh Dậu':   ['Hỏa',  'Sơn Hạ Hỏa — Lửa dưới núi'],
  'Mậu Tuất':   ['Mộc',  'Bình Địa Mộc — Cây đồng bằng'],
  'Kỷ Hợi':     ['Mộc',  'Bình Địa Mộc — Cây đồng bằng'],
  'Canh Tý':    ['Thổ',  'Bích Thượng Thổ — Đất tường gạch'],
  'Tân Sửu':    ['Thổ',  'Bích Thượng Thổ — Đất tường gạch'],
  'Nhâm Dần':   ['Kim',  'Kim Bạch Kim — Kim loại vàng'],
  'Quý Mão':    ['Kim',  'Kim Bạch Kim — Kim loại vàng'],
  'Giáp Thìn':  ['Hỏa',  'Phúc Đăng Hỏa — Lửa đèn'],
  'Ất Tỵ':      ['Hỏa',  'Phúc Đăng Hỏa — Lửa đèn'],
  'Bính Ngọ':   ['Thủy', 'Thiên Hà Thủy — Nước sông trời'],
  'Đinh Mùi':   ['Thủy', 'Thiên Hà Thủy — Nước sông trời'],
  'Mậu Thân':   ['Thổ',  'Đại Trạch Thổ — Đất đại trạch'],
  'Kỷ Dậu':     ['Thổ',  'Đại Trạch Thổ — Đất đại trạch'],
  'Canh Tuất':  ['Kim',  'Thoa Xuyến Kim — Vàng trang sức'],
  'Tân Hợi':    ['Kim',  'Thoa Xuyến Kim — Vàng trang sức'],
  'Nhâm Tý':    ['Mộc',  'Tang Đố Mộc — Dâu tằm'],
  'Quý Sửu':    ['Mộc',  'Tang Đố Mộc — Dâu tằm'],
  'Giáp Dần':   ['Thủy', 'Đại Khê Thủy — Nước suối lớn'],
  'Ất Mão':     ['Thủy', 'Đại Khê Thủy — Nước suối lớn'],
  'Bính Thìn':  ['Thổ',  'Sa Trung Thổ — Đất trong cát'],
  'Đinh Tỵ':    ['Thổ',  'Sa Trung Thổ — Đất trong cát'],
  'Mậu Ngọ':    ['Hỏa',  'Thiên Thượng Hỏa — Lửa thiên đình'],
  'Kỷ Mùi':     ['Hỏa',  'Thiên Thượng Hỏa — Lửa thiên đình'],
  'Canh Thân':  ['Mộc',  'Thạch Lựu Mộc — Cây lựu đá'],
  'Tân Dậu':    ['Mộc',  'Thạch Lựu Mộc — Cây lựu đá'],
  'Nhâm Tuất':  ['Thủy', 'Đại Hải Thủy — Nước đại dương'],
  'Quý Hợi':    ['Thủy', 'Đại Hải Thủy — Nước đại dương'],
};

// ─── Thứ trong tuần ───────────────────────────────────────────
export const THU_VI = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư',
  'Thứ Năm',  'Thứ Sáu', 'Thứ Bảy',
] as const;

export const THU_SHORT = ['CN','T2','T3','T4','T5','T6','T7'] as const;

// ─── Tên tháng ────────────────────────────────────────────────
export const THANG_VI = [
  '', // index 0 không dùng
  'Tháng Một',   'Tháng Hai',  'Tháng Ba',
  'Tháng Tư',    'Tháng Năm',  'Tháng Sáu',
  'Tháng Bảy',   'Tháng Tám',  'Tháng Chín',
  'Tháng Mười',  'Tháng Mười Một', 'Tháng Mười Hai',
] as const;

// ─── 12 Trực Nhật ─────────────────────────────────────────────
export const TRUC_INFO = [
  { id:0,  ten:'Kiến',  dinhGia:'bình thường', xayDung:0, kinhDoanh:4, cuoiHoi:4, anTang:0 },
  { id:1,  ten:'Trừ',   dinhGia:'bình thường', xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:3 },
  { id:2,  ten:'Mãn',   dinhGia:'tốt',         xayDung:2, kinhDoanh:3, cuoiHoi:2, anTang:0 },
  { id:3,  ten:'Bình',  dinhGia:'tốt',         xayDung:4, kinhDoanh:5, cuoiHoi:4, anTang:4 },
  { id:4,  ten:'Định',  dinhGia:'tốt',         xayDung:4, kinhDoanh:5, cuoiHoi:4, anTang:4 },
  { id:5,  ten:'Chấp',  dinhGia:'bình thường', xayDung:2, kinhDoanh:2, cuoiHoi:2, anTang:0 },
  { id:6,  ten:'Phá',   dinhGia:'xấu',         xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:7,  ten:'Nguy',  dinhGia:'xấu',         xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:8,  ten:'Thành', dinhGia:'tốt',         xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:9,  ten:'Thu',   dinhGia:'tốt',         xayDung:4, kinhDoanh:5, cuoiHoi:4, anTang:0 },
  { id:10, ten:'Khai',  dinhGia:'tốt',         xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:0 },
  { id:11, ten:'Bế',    dinhGia:'xấu',         xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
] as const;

// ─── Giờ Hoàng Đạo theo chi ngày ─────────────────────────────
// Mảng 12 giờ từ Tý→Hợi, true=Hoàng Đạo, false=Hắc Đạo
// Theo bảng: Tý/Ngọ/Tỵ/Hợi | Sửu/Mùi/Thìn/Tuất | Dần/Thân/Mão/Dậu
export const GIO_HOANG_DAO: Record<string, boolean[]> = {
  // chiNgày → [Tý,Sửu,Dần,Mão,Thìn,Tỵ,Ngọ,Mùi,Thân,Dậu,Tuất,Hợi]
  'Tý':   [true, false,true, false,true, false,true, false,true, false,true, false],
  'Ngọ':  [true, false,true, false,true, false,true, false,true, false,true, false],
  'Sửu':  [false,true, false,true, false,true, false,true, false,true, false,true ],
  'Mùi':  [false,true, false,true, false,true, false,true, false,true, false,true ],
  'Dần':  [true, true, false,false,true, true, false,false,true, true, false,false],
  'Thân': [true, true, false,false,true, true, false,false,true, true, false,false],
  'Mão':  [false,false,true, true, false,false,true, true, false,false,true, true ],
  'Dậu':  [false,false,true, true, false,false,true, true, false,false,true, true ],
  'Thìn': [true, false,false,true, true, false,false,true, true, false,false,true ],
  'Tuất': [true, false,false,true, true, false,false,true, true, false,false,true ],
  'Tỵ':   [false,true, true, false,false,true, true, false,false,true, true, false],
  'Hợi':  [false,true, true, false,false,true, true, false,false,true, true, false],
};

// Tên giờ âm lịch
export const TEN_GIO_AM = [
  'Giờ Tý (23-1h)',   'Giờ Sửu (1-3h)',   'Giờ Dần (3-5h)',
  'Giờ Mão (5-7h)',   'Giờ Thìn (7-9h)',  'Giờ Tỵ (9-11h)',
  'Giờ Ngọ (11-13h)', 'Giờ Mùi (13-15h)', 'Giờ Thân (15-17h)',
  'Giờ Dậu (17-19h)', 'Giờ Tuất (19-21h)','Giờ Hợi (21-23h)',
] as const;

// ─── Vãng Vong & Sát Chủ (theo tháng âm lịch) ────────────────
export const VANG_VONG: Record<number, string> = {
  1:'Dần',2:'Tỵ',3:'Thân',4:'Hợi',5:'Mão',6:'Ngọ',
  7:'Dậu',8:'Tý',9:'Thìn',10:'Mùi',11:'Tuất',12:'Sửu',
};
export const SAT_CHU: Record<number, string> = {
  1:'Tỵ',2:'Tý',3:'Mùi',4:'Mão',5:'Thân',6:'Tuất',
  7:'Sửu',8:'Hợi',9:'Ngọ',10:'Dậu',11:'Dần',12:'Thìn',
};
export const DUONG_CONG: Record<number, number[]> = {
  1:[13],2:[11],3:[9],4:[7],5:[5],6:[3],
  7:[8,29],8:[27],9:[25],10:[23],11:[21],12:[19],
};

// ─── Stars range for SSG (5 năm: 2024–2028) ──────────────────
export const SSG_START_YEAR = 2024;
export const SSG_END_YEAR   = 2028;
