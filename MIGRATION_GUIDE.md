# Hướng dẫn Migration: React/Vite → Astro SSG

## Tại sao migrate?
- **Hiện tại (CSR)**: Google không đọc được nội dung → không rank được
- **Sau migration (SSG)**: 1825 trang tĩnh, Google index đầy đủ → rank được

---

## Bước 1: Upload các file MỚI này vào repo

### Files cần THÊM MỚI (chưa có trong repo):
```
astro.config.mjs               ← thêm mới vào root
src/layouts/SpaLayout.astro    ← thêm mới
src/pages/index.astro          ← thêm mới
src/pages/lich/[year]/[month]/[day].astro  ← thêm mới (tạo folder)
src/pages/sitemap.xml.ts       ← thêm mới
```

### Files cần GHI ĐÈ (đã có, cần thay):
```
package.json                   ← đổi từ vite sang astro
tsconfig.json                  ← đổi sang astro strict
tailwind.config.js             ← thêm .astro vào content
src/layouts/BaseLayout.astro   ← cập nhật
```

### Files cần XÓA khỏi repo:
```
vite.config.ts                 ← xóa (Astro dùng astro.config.mjs)
src/main.tsx                   ← xóa (Astro tự handle entry point)
src/vite-env.d.ts              ← xóa (không cần)
public/sitemap.xml             ← xóa (thay bằng src/pages/sitemap.xml.ts)
```

### Files GIỮ NGUYÊN (không đụng vào):
```
src/App.tsx                    ← giữ nguyên
src/components/**              ← giữ nguyên
src/tabs/**                    ← giữ nguyên
src/data/**                    ← giữ nguyên
src/utils/**                   ← giữ nguyên
src/lib/amlich.ts              ← giữ nguyên
src/lib/config.ts              ← giữ nguyên
src/index.css                  ← giữ nguyên
public/**                      ← giữ nguyên (trừ sitemap.xml)
postcss.config.js              ← giữ nguyên
```

---

## Bước 2: Cập nhật Cloudflare Pages settings

Trong Cloudflare Pages → Settings → Build & deployments:
- **Build command**: `npm run build`  ← KHÔNG ĐỔI
- **Build output directory**: `dist`  ← ĐỔI từ `dist` (đã đúng cho Astro)
- **Node.js version**: `18.x` hoặc cao hơn

---

## Bước 3: Kết quả sau khi deploy

- `/` → Vẫn là React SPA đầy đủ (Lịch, Hỏi Thầy, Tiện Ích...)
- `/lich/2026/03/14` → Trang tĩnh với full SEO content
- `/sitemap.xml` → Sitemap động với 1825+ URLs
- Google có thể đọc và index toàn bộ 1825 trang ngày

---

## Lưu ý quan trọng

1. **Lần đầu build sẽ lâu hơn** (~2-5 phút) vì Astro generate 1825 trang
2. **Env var**: `VITE_GROQ_API_KEY` vẫn dùng được trong React components
3. **PWA**: Manifest + Service Worker vẫn hoạt động (trong `public/`)
4. **Dark mode**: Vẫn hoạt động, dùng `lvn_theme` localStorage key

---

## Cấu trúc sau migration

```
/                    → React SPA (App.tsx) — PWA đầy đủ
/lich/2026/03/14    → Static page — SEO tốt, Google index được
/sitemap.xml        → Dynamic, 1825+ URLs
/robots.txt         → Trỏ đúng sitemap
```
