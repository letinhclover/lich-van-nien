// ============================================================
// public/sw.js — Service Worker Lịch Vạn Niên AI
// Workbox CDN 7.0.0: CacheFirst, NetworkFirst, StaleWhileRevalidate
// ============================================================

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ debug: false });

  const { registerRoute }        = workbox.routing;
  const { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } = workbox.strategies;
  const { ExpirationPlugin }     = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // ── 1. Astro build assets (hash tên file → immutable) ────
  registerRoute(
    ({ request, url }) => url.pathname.startsWith('/_astro/'),
    new CacheFirst({
      cacheName: 'astro-assets',
      plugins: [
        new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60 }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // ── 2. Trang ngày lịch /lich/ → StaleWhileRevalidate ────
  registerRoute(
    ({ url }) => url.pathname.startsWith('/lich/'),
    new StaleWhileRevalidate({
      cacheName: 'lich-pages',
      plugins: [
        new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 }),
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    })
  );

  // ── 3. API AI → NetworkOnly (luôn cần fresh) ─────────────
  registerRoute(
    ({ url }) => url.pathname.startsWith('/api/ai'),
    new NetworkOnly()
  );

  // ── 4. Images → CacheFirst 60 ngày ──────────────────────
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images',
      plugins: [
        new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 24 * 60 * 60 }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // ── 5. Navigate requests → NetworkFirst với offline fallback
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 5,
      plugins: [
        new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    })
  );

  // ── Offline fallback ─────────────────────────────────────
  self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/offline.html'))
      );
    }
  });

  // ── Install: precache 30 ngày tới ───────────────────────
  self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil((async () => {
      const cache = await caches.open('lich-precache');
      const today = new Date();
      const urls  = [];
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const y  = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const dy = String(d.getDate()).padStart(2, '0');
        urls.push(`/lich/${y}/${mo}/${dy}`);
      }
      // Cache trang chủ và các trang quan trọng
      urls.push('/', '/gio-hoang-dao', '/chuyen-doi-lich', '/offline.html');
      try { await cache.addAll(urls); } catch { /* không fail nếu 1 URL lỗi */ }
    })());
  });

  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });

  // ── Push Notification handler (bước 35) ─────────────────
  self.addEventListener('push', event => {
    if (!event.data) return;
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title ?? 'Lịch Vạn Niên AI', {
        body:    data.body ?? 'Xem lịch âm hôm nay',
        icon:    '/pwa-192x192.png',
        badge:   '/pwa-192x192.png',
        data:    { url: data.url ?? '/' },
        actions: [
          { action: 'view',   title: 'Xem chi tiết' },
          { action: 'close',  title: 'Bỏ qua' },
        ],
        tag:     'lvn-daily',
        renotify: true,
      })
    );
  });

  self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'close') return;
    const url = event.notification.data?.url ?? '/';
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        const existing = clients.find(c => c.url.includes(url));
        if (existing) return existing.focus();
        return self.clients.openWindow(url);
      })
    );
  });

} else {
  console.warn('Workbox không tải được');
}
