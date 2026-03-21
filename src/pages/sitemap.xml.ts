// ============================================================
// src/pages/sitemap.xml.ts
// Sitemap đầy đủ: trang chủ + 5 trang tính năng + 1825 ngày + tháng
// ⚠️ Đây là sitemap FINAL (đã bao gồm cả bước 16)
// ============================================================

import type { APIRoute } from 'astro';
import { SITE, SSG_START_YEAR, SSG_END_YEAR } from '../lib/constants';

const BASE = SITE.baseUrl;

/** Helper tạo <url> entry — nhận `todayStr` để không dùng biến ngoài scope */
function makeUrl(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod: string,
): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: APIRoute = () => {
  // Ngày hôm nay theo timezone VN (UTC+7) — không dùng new Date() thô
  const vnStr  = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
  const today  = vnStr.split(' ')[0] ?? '2026-01-01';                 // "2026-03-15"
  const week7  = new Date(Date.now() - 7 * 86400000)
                   .toISOString().split('T')[0] ?? '2026-03-08';       // 7 ngày trước

  const entries: string[] = [];

  // ── Trang chủ ─────────────────────────────────────────────
  entries.push(makeUrl(`${BASE}/`, '1.0', 'daily', today));

  // ── Trang tính năng ───────────────────────────────────────
  const statics: { path: string; p: string; f: string }[] = [
    { path: '/gio-hoang-dao',   p: '0.85', f: 'daily'   },
    { path: '/tu-van',          p: '0.80', f: 'daily'   },
    { path: '/chon-ngay-cuoi',  p: '0.80', f: 'weekly'  },
    { path: '/chuyen-doi-lich', p: '0.75', f: 'monthly' },
    { path: '/lich/thang',      p: '0.80', f: 'daily'   },
  ];
  for (const s of statics) {
    entries.push(makeUrl(`${BASE}${s.path}`, s.p, s.f, today));
  }

  // ── 1825+ trang ngày /lich/YYYY/MM/DD ────────────────────
  // Dùng UTC loop để tránh DST shift gây skip/duplicate ngày
  const startMs = Date.UTC(SSG_START_YEAR, 0, 1);
  const endMs   = Date.UTC(SSG_END_YEAR, 11, 31);

  for (let ms = startMs; ms <= endMs; ms += 86400000) {
    const d   = new Date(ms);
    const y   = d.getUTCFullYear();
    const mo  = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dy  = String(d.getUTCDate()).padStart(2, '0');
    const ds  = `${y}-${mo}-${dy}`;

    const p = ds === today ? '0.95' : ds >= week7 ? '0.80' : '0.65';
    const f = ds === today ? 'daily' : 'weekly';

    entries.push(makeUrl(`${BASE}/lich/${y}/${mo}/${dy}`, p, f, ds));
  }

  // ── Trang lịch tháng /lich/thang/YYYY/MM ─────────────────
  for (let y = SSG_START_YEAR; y <= SSG_END_YEAR; y++) {
    for (let m = 1; m <= 12; m++) {
      const mo         = String(m).padStart(2, '0');
      const ds         = `${y}-${mo}-01`;
      const isThisMo   = today.startsWith(`${y}-${mo}`);
      entries.push(makeUrl(
        `${BASE}/lich/thang/${y}/${mo}`,
        isThisMo ? '0.90' : '0.70',
        isThisMo ? 'daily' : 'monthly',
        ds,
      ));
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 ` +
    `http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n` +
    entries.join('\n') +
    `\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
