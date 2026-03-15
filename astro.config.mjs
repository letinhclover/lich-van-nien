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
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/cai-dat'),
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
