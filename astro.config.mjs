// ============================================================
// astro.config.mjs — Lịch Vạn Niên AI
// Deploy: Cloudflare Pages (static)
// ============================================================

import { defineConfig } from 'astro/config';
import sitemap         from '@astrojs/sitemap';
import tailwind        from '@astrojs/tailwind';

export default defineConfig({
  site:   'https://lichvannien.io.vn',
  output: 'static',
  // Không cần adapter cho SSG — Cloudflare Pages serve static files trực tiếp

  integrations: [
    tailwind({
      applyBaseStyles: false,           // dùng global.css của mình
      configFile: './tailwind.config.mjs',
    }),

    sitemap({
      // Sitemap tự động từ tất cả pages
      // Những route dynamic (lich) sẽ được thêm qua customPages
      changefreq:  'daily',
      priority:     0.7,
      lastmod:      new Date(),
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('404'),
      serialize(item) {
        // Trang chủ và trang ngày hôm nay ưu tiên cao nhất
        if (item.url === 'https://lichvannien.io.vn/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        if (item.url.includes('/lich/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }
        return item;
      },
    }),
  ],

  vite: {
    build: {
      rollupOptions: {
        output: {
          // Code split hợp lý
          manualChunks: {
            amlich: ['./src/lib/amlich.ts'],
          },
        },
      },
    },
  },
});
