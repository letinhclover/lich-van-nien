// src/pages/sitemap.xml.ts
// Dynamic sitemap: trang chủ + 1825 trang ngày + static pages
// Cloudflare Pages sẽ serve file này như /sitemap.xml

import type { APIRoute } from 'astro';
import { SITE, SSG_START_YEAR, SSG_END_YEAR } from '../lib/constants';

const BASE = SITE.baseUrl;

function fmt(d: Date): string {
  return d.toISOString().split('T')[0]!;
}

function url(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod?: string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod ?? today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = () => {
  const entries: string[] = [];
  // Ngày hôm nay theo timezone VN
  const vnStr = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
  const today = vnStr.split(' ')[0] ?? '2026-01-01';
  const weekAgo = fmt(new Date(Date.now() - 7 * 86400000));

  // ── Trang chủ ───────────────────────────────────────────────
  entries.push(url(`${BASE}/`, '1.0', 'daily', today));

  // ── Trang tính năng ─────────────────────────────────────────
  const statics = [
    { path:'/gio-hoang-dao',   p:'0.85', f:'daily'   },
    { path:'/tu-van',          p:'0.80', f:'daily'   },
    { path:'/chon-ngay-cuoi',  p:'0.80', f:'weekly'  },
    { path:'/chuyen-doi-lich', p:'0.75', f:'monthly' },
    { path:'/lich/thang',      p:'0.80', f:'daily'   },
  ];
  for (const s of statics) {
    entries.push(url(`${BASE}${s.path}`, s.p, s.f, today));
  }

  // ── 1825 trang ngày ─────────────────────────────────────────
  const start = new Date(SSG_START_YEAR, 0, 1);
  const end   = new Date(SSG_END_YEAR, 11, 31);

  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const y  = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${mo}-${dy}`;

    const isToday    = dateStr === today;
    const isRecentWk = dateStr >= weekAgo;
    const p = isToday ? '0.95' : isRecentWk ? '0.80' : '0.65';
    const f = isToday ? 'daily' : 'weekly';

    entries.push(url(`${BASE}/lich/${y}/${mo}/${dy}`, p, f, dateStr));
  }

  // ── Trang tháng ─────────────────────────────────────────────
  for (let y = SSG_START_YEAR; y <= SSG_END_YEAR; y++) {
    for (let m = 1; m <= 12; m++) {
      const mo = String(m).padStart(2, '0');
      const isThisMonth = `${y}-${mo}` === today.slice(0, 7);
      entries.push(url(
        `${BASE}/lich/thang/${y}/${mo}`,
        isThisMonth ? '0.90' : '0.70',
        isThisMonth ? 'daily' : 'monthly',
        `${y}-${mo}-01`
      ));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
