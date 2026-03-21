import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Lịch Vạn Niên AI',
        short_name: 'Lịch VN',
        description: 'Lịch Âm Dương Việt Nam + AI Tư Vấn',
        theme_color: '#B8720A',
        background_color: '#F5EDD8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src:'pwa-192x192.png', sizes:'192x192', type:'image/png' },
          { src:'pwa-512x512.png', sizes:'512x512', type:'image/png', purpose:'any maskable' },
        ],
        shortcuts: [
          { name:'Hôm nay', url:'/', icons:[{src:'pwa-192x192.png',sizes:'192x192'}] },
          { name:'Hỏi AI', url:'/?tab=thay', icons:[{src:'pwa-192x192.png',sizes:'192x192'}] },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60*60*24*365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-static', expiration: { maxEntries: 10, maxAgeSeconds: 60*60*24*365 } },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react','react-dom'],
          motion: ['framer-motion'],
          amlich: ['./src/utils/amlich'],
        },
      },
    },
  },
});
