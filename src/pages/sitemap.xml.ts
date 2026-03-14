// src/pages/sitemap.xml.ts
// Tự động generate sitemap với 1825+ URLs
// Thay thế public/sitemap.xml tĩnh

import type { APIRoute } from 'astro';
import { SITE_CONFIG } from '../lib/config';

const BASE = SITE_CONFIG.baseUrl;

function fmtDate(d: Date): string {
  return d.toISOString().split('T')[0]!;
}

function urlEntry(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod?: string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod ?? fmtDate(new Date())}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = () => {
  const entries: string[] = [];

  // Trang chủ
  entries.push(urlEntry(BASE + '/', '1.0', 'daily'));

  // Static pages
  const staticPages = [
    { path: '/thang',       priority: '0.8', freq: 'daily'   },
    { path: '/chuyen-doi',  priority: '0.7', freq: 'monthly' },
    { path: '/ai',          priority: '0.8', freq: 'daily'   },
    { path: '/cai-dat',     priority: '0.4', freq: 'monthly' },
  ];
  for (const p of staticPages) {
    entries.push(urlEntry(BASE + p.path, p.priority, p.freq));
  }

  // 1825 trang ngày: 2024-01-01 đến 2028-12-31
  const start = new Date(2024, 0, 1);
  const end   = new Date(2028, 11, 31);
  const today = fmtDate(new Date());

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const y  = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const isToday    = fmtDate(d) === today;
    const isPastWeek = d >= new Date(Date.now() - 7*24*60*60*1000);
    const priority   = isToday ? '0.9' : isPastWeek ? '0.7' : '0.6';
    const freq       = isToday ? 'daily' : 'weekly';
    entries.push(urlEntry(`${BASE}/lich/${y}/${mo}/${dy}`, priority, freq, fmtDate(d)));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
