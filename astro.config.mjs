import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site:   'https://lichvannien.io.vn',
  output: 'static',

  integrations: [
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
