// ============================================================
// src/components/ShareDayImage.tsx — Share ảnh ngày tốt
// Bước 28 — dùng html-to-image từ CDN unpkg
// ============================================================

import { useState, useRef } from 'react';

interface Props {
  day:     number;
  month:   number;
  year:    number;
  lunar:   string;   // "15 tháng 2 năm Bính Ngọ"
  canChi:  string;   // "Nhâm Tý"
  score:   number;   // 1-5
  label:   string;   // "Ngày Tốt"
  goodFor: string[]; // ["Kết hôn", ...]
  url:     string;   // canonical URL
}

declare const htmlToImage: {
  toPng: (el: HTMLElement) => Promise<string>;
};

export default function ShareDayImage({
  day, month, year, lunar, canChi, score, label, goodFor, url,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isGood    = score >= 4;
  const isBad     = score <= 2;
  const badgeColor = isGood ? '#16a34a' : isBad ? '#dc2626' : '#d97706';
  const shareText  =
    `📅 Ngày ${day}/${month}/${year} là ${label}\n` +
    `🌙 Âm: ${lunar} (${canChi})\n` +
    (goodFor[0] ? `✅ Nên: ${goodFor.slice(0, 2).join(', ')}\n` : '') +
    `🔗 Chi tiết: ${url}`;

  async function handleShare() {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      // Load html-to-image from CDN if not already loaded
      if (typeof htmlToImage === 'undefined') {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load html-to-image'));
          document.head.appendChild(s);
        });
      }

      const dataUrl = await (window as unknown as { htmlToImage: typeof htmlToImage }).htmlToImage.toPng(cardRef.current, { pixelRatio: 2 });

      // Convert to blob
      const res  = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `lich-ngay-${day}-${month}-${year}.png`, { type: 'image/png' });

      // Mobile: Web Share API
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `Lịch âm ${day}/${month}/${year}`, text: shareText });
      } else {
        // Desktop: auto download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = file.name;
        a.click();
      }
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      // Fallback: copy URL
      try {
        await navigator.clipboard.writeText(`${shareText}`);
        alert('Đã copy link vào clipboard!');
      } catch {
        alert('Không thể tạo ảnh. Hãy chụp màn hình thay thế.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hidden image template 1080x1080 — off-screen */}
      <div
        ref={cardRef}
        style={{
          position:        'absolute',
          left:            '-9999px',
          top:             0,
          width:           '540px',
          height:          '540px',
          background:      'linear-gradient(135deg, #8B0000 0%, #C0392B 100%)',
          borderRadius:    '24px',
          padding:         '40px',
          fontFamily:      'sans-serif',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'space-between',
        }}
      >
        {/* Logo + domain */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px 12px', color: 'white', fontWeight: 700, fontSize: '16px' }}>
              🗓 Lịch Vạn Niên AI
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          {/* Thứ */}
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '22px', margin: '0 0 4px' }}>
            {['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][new Date(Date.UTC(year, month-1, day)).getUTCDay()]}
          </p>

          {/* Ngày dương to */}
          <p style={{ color: '#F1C40F', fontSize: '96px', fontWeight: 900, margin: '0', lineHeight: 1 }}>
            {String(day).padStart(2, '0')}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '28px', margin: '4px 0 0' }}>
            tháng {month} năm {year}
          </p>

          {/* Separator */}
          <div style={{ height: '2px', background: 'rgba(241,196,15,0.6)', margin: '20px 0' }} />

          {/* Âm lịch + can chi */}
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', margin: '0 0 8px' }}>
            🌙 {lunar}
          </p>

          {/* Can chi badge */}
          <span style={{ display: 'inline-block', border: '2px solid #F1C40F', borderRadius: '8px', padding: '4px 14px', color: '#F1C40F', fontSize: '18px', fontWeight: 700 }}>
            {canChi}
          </span>

          {/* Score badge */}
          <div style={{ marginTop: '16px' }}>
            <span style={{ display: 'inline-block', background: badgeColor, borderRadius: '8px', padding: '6px 20px', color: 'white', fontSize: '22px', fontWeight: 900 }}>
              {label} · {score}/5 ⭐
            </span>
          </div>

          {/* Good for */}
          {goodFor.length > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', margin: '12px 0 0' }}>
              ✅ Nên: {goodFor.slice(0, 2).join(' · ')}
            </p>
          )}
        </div>

        {/* Footer */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'right' }}>
          lichvannien.io.vn
        </p>
      </div>

      {/* Button */}
      <button
        onClick={handleShare}
        disabled={loading}
        className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? (
          <>⏳ Đang tạo ảnh...</>
        ) : done ? (
          <>✅ Đã chia sẻ!</>
        ) : (
          <>📸 Tạo ảnh chia sẻ</>
        )}
      </button>
    </div>
  );
}
