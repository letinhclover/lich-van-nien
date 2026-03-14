// ============================================================
// astro.config.mjs — Lịch Vạn Niên AI
// Stack: Astro 4.x SSG + React islands + Tailwind
// Deploy: Cloudflare Pages (static output)
// ============================================================

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lichvannien.io.vn',

  // Static Site Generation — Cloudflare Pages không cần adapter cho SSG
  output: 'static',

  integrations: [
    react(),
    tailwind({
      // Dùng index.css của mình, không dùng base styles của Astro
      applyBaseStyles: false,
    }),
  ],

  // Không tự động inject viewTransitions
  prefetch: false,
});
