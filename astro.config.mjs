import { defineConfig } from 'astro/config';
import react    from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site:   'https://lichvannien.io.vn',
  output: 'static',

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
      configFile: './tailwind.config.mjs',
    }),
  ],

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            amlich: ['./src/lib/amlich.ts'],
          },
        },
      },
    },
  },
});
