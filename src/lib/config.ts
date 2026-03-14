// ============================================================
// config.ts — Cấu hình tập trung toàn dự án
// Tất cả domain/URL phải import từ đây, không hardcode
// ============================================================

export const SITE_CONFIG = {
  domain:      'lichvannien.io.vn',
  baseUrl:     'https://lichvannien.io.vn',
  siteName:    'Lịch Vạn Niên AI',
  siteNameFull:'Lịch Vạn Niên AI — Lịch Âm Dương Việt Nam',
  description: 'Lịch vạn niên 2026, lịch âm, xem ngày tốt xấu, hỏi thầy AI, la bàn phong thủy, văn khấn 25 bài. Miễn phí, chính xác.',
  twitterHandle: '@lichvannienai',
  defaultOgImage: 'https://lichvannien.io.vn/og-image.svg',
  themeColor:  '#080C18',
} as const;
