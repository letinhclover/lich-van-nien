// ============================================================
// src/lib/schema.ts — JSON-LD Schema utilities
// Tạo structured data chuẩn Schema.org cho SEO
// Test tại: search.google.com/test/rich-results
// ============================================================

import { SITE, THU_VI } from './constants';

import type { DayInfo } from './amlich';

// ─── WebSite Schema ──────────────────────────────────────────

/**
 * WebSite schema với SearchAction — hiện Search Box trên Google
 */
export function createWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      `${SITE.baseUrl}/#website`,
    name:       SITE.siteNameFull,
    url:        SITE.baseUrl,
    description: SITE.description,
    inLanguage: 'vi',
    potentialAction: {
      '@type':       'SearchAction',
      target:        `${SITE.baseUrl}/lich/{year}/{month}/{day}`,
      'query-input': 'required name=year,month,day',
    },
  };
}

// ─── FAQPage Schema ──────────────────────────────────────────

/**
 * FAQPage schema — hiện rich results câu hỏi/trả lời trên Google
 */
export function createFAQSchema(
  faqs: { q: string; a: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name:    q,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    a,
      },
    })),
  };
}

// ─── BreadcrumbList Schema ────────────────────────────────────

/**
 * BreadcrumbList schema — hiện breadcrumb trên SERP
 * @param items - mảng { name, url? } — item cuối không cần url
 */
export function createBreadcrumbSchema(
  items: { name: string; url?: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

// ─── Day Page Schema ──────────────────────────────────────────

/**
 * Schema đầy đủ cho trang ngày /lich/YYYY/MM/DD
 * Kết hợp: BreadcrumbList + FAQPage (4 câu hỏi dynamic)
 * @returns JSON string (dùng set:html={} trực tiếp)
 */
export function createDayPageSchema(
  info: DayInfo,
  canonicalUrl: string,
): object[] {
  const { solar, lunar, canChi, quality, hours } = info;
  const { day: d, month: m, year: y } = solar;
  // SolarDate từ amlich không có weekdayLabel → tính thủ công
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const weekdayLabel = THU_VI[dow] ?? 'Chủ Nhật';
  const lunarFull = `${lunar.leap ? 'Nhuận ' : ''}${lunar.day} tháng ${lunar.month} năm ${canChi.nam.display}`;
  const goodHours = hours.filter(h => h.isHoangDao).map(h => h.tenGio).join(', ');
  const goodFor   = quality.goodFor.slice(0, 3).join(', ');

  const breadcrumb = createBreadcrumbSchema([
    { name: 'Trang chủ',           url: SITE.baseUrl },
    { name: `Tháng ${m}/${y}`,     url: `${SITE.baseUrl}/lich/thang/${y}/${String(m).padStart(2,'0')}` },
    { name: `${d}/${m}/${y}`,      url: canonicalUrl },
  ]);

  const faq = createFAQSchema([
    {
      q: `Ngày ${d}/${m}/${y} âm lịch là ngày mấy?`,
      a: `Ngày ${d}/${m}/${y} (${weekdayLabel}) âm lịch là ${lunarFull}. Can chi ngày: ${canChi.ngay.display}, tháng: ${canChi.thang.display}, năm: ${canChi.nam.display}.`,
    },
    {
      q: `Ngày ${d}/${m}/${y} là tốt hay xấu?`,
      a: `Ngày ${d}/${m}/${y}: ${quality.label} (${quality.score}/5 điểm). ${goodFor ? `Nên làm: ${goodFor}.` : ''} ${quality.badFor.length > 0 ? `Nên tránh: ${quality.badFor.slice(0,2).join(', ')}.` : ''}`,
    },
    {
      q: `Giờ hoàng đạo ngày ${d}/${m}/${y} là giờ nào?`,
      a: `Giờ hoàng đạo ngày ${d}/${m}/${y}: ${goodHours || 'không có giờ hoàng đạo đặc biệt'}.`,
    },
    {
      q: `Ngày ${d}/${m}/${y} thứ mấy?`,
      a: `Ngày ${d}/${m}/${y} là ${weekdayLabel}. Âm lịch: ${lunarFull}.`,
    },
  ]);

  return [breadcrumb, faq];
}

// ─── Article Schema ───────────────────────────────────────────

interface ArticleParams {
  title:       string;
  description: string;
  url:         string;
  datePublished: string;   // ISO string
  dateModified?: string;
  author?:     string;
  image?:      string;
}

/**
 * Article schema cho blog posts / bài viết
 */
export function createArticleSchema(params: ArticleParams): object {
  return {
    '@context':     'https://schema.org',
    '@type':        'Article',
    headline:       params.title.slice(0, 110),
    description:    params.description.slice(0, 250),
    url:            params.url,
    datePublished:  params.datePublished,
    dateModified:   params.dateModified ?? params.datePublished,
    inLanguage:     'vi',
    author: {
      '@type': 'Organization',
      name:    params.author ?? SITE.siteName,
      url:     SITE.baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name:    SITE.siteName,
      url:     SITE.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url:     `${SITE.baseUrl}/favicon.svg`,
      },
    },
    ...(params.image ? {
      image: {
        '@type': 'ImageObject',
        url:     params.image,
        width:   1200,
        height:  630,
      },
    } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   params.url,
    },
  };
}

// ─── Convenience: serialize to JSON string ────────────────────

/**
 * Serialize schema object thành JSON string an toàn
 * Dùng với set:html={} trong Astro
 */
export function toJsonLd(schema: object | object[]): string {
  return JSON.stringify(schema);
}
