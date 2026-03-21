// ============================================================
// src/components/AISummary.tsx — AI Daily Summary React Island
// Props: { date: string }  format: "YYYY-MM-DD"
// Fetch /api/ai-summary → skeleton → fade-in
// IntersectionObserver: chỉ fetch khi vào viewport
// ============================================================

import { useState, useEffect, useRef } from 'react';

interface Props {
  date: string;  // "2026-03-14"
}

interface SummaryData {
  summary: string;
  cached:  boolean;
  fallback?: boolean;
}

const PURPLE_BORDER = '#534AB7';
const PURPLE_BG     = '#EEEDFE';
const PURPLE_DARK   = 'rgba(83,74,183,0.15)';

export default function AISummary({ date }: Props) {
  const [data,    setData]    = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);  // fade-in
  const ref = useRef<HTMLDivElement>(null);
  const fetched = useRef(false);

  // IntersectionObserver — chỉ fetch khi card vào viewport
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !fetched.current) {
          fetched.current = true;
          fetchSummary();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [date]);

  async function fetchSummary() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai-summary?date=${date}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json() as SummaryData;
      setData(json);
      // Trigger fade-in sau 50ms
      setTimeout(() => setVisible(true), 50);
    } catch {
      setData({
        summary: 'Xem chi tiết giờ hoàng đạo và ngày tốt xấu bên dưới để chọn thời điểm làm việc.',
        cached:  false,
        fallback: true,
      });
      setTimeout(() => setVisible(true), 50);
    } finally {
      setLoading(false);
    }
  }

  // Prefetch ngày mai
  useEffect(() => {
    const d    = new Date(date + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + 1);
    const tomorrow = d.toISOString().split('T')[0];
    const link  = document.createElement('link');
    link.rel    = 'prefetch';
    link.href   = `/api/ai-summary?date=${tomorrow}`;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, [date]);

  return (
    <div ref={ref}>
      {/* Skeleton */}
      {loading && (
        <div
          style={{
            borderLeft:    `3px solid ${PURPLE_BORDER}`,
            background:    PURPLE_BG,
            borderRadius:  '0.75rem',
            padding:       '1rem',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
            <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#d1d5db', animation:'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height:'12px', width:'100px', background:'#d1d5db', borderRadius:'4px', animation:'pulse 1.5s ease-in-out infinite' }} />
          </div>
          {[100, 83, 92].map((w, i) => (
            <div key={i} style={{
              height:'10px', width:`${w}%`, background:'#d1d5db', borderRadius:'4px',
              marginBottom:'8px', animation:'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
      )}

      {/* Content */}
      {!loading && data && (
        <div
          style={{
            borderLeft:   `3px solid ${PURPLE_BORDER}`,
            background:   typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
              ? PURPLE_DARK : PURPLE_BG,
            borderRadius: '0.75rem',
            padding:      '1rem',
            opacity:      visible ? 1 : 0,
            transform:    visible ? 'translateY(0)' : 'translateY(6px)',
            transition:   'opacity 0.35s ease, transform 0.35s ease',
          }}
        >
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <span style={{ fontSize:'0.9rem' }}>🤖</span>
              <span style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'#6b7280' }}>
                Phân tích AI
              </span>
            </div>
            {data.cached && (
              <span style={{ fontSize:'0.6rem', color:'#9ca3af', padding:'1px 6px', border:'1px solid #e5e7eb', borderRadius:'4px' }}>
                cached
              </span>
            )}
          </div>

          {/* Summary text */}
          <p style={{
            fontSize:'0.875rem', lineHeight:1.8, color:'var(--text-1)',
            margin: 0, marginBottom: '0.75rem',
          }}>
            {data.summary}
          </p>

          {/* Footer */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:'0.65rem', color:'#9ca3af' }}>
              Bởi Groq AI · Tham khảo theo phong tục
            </span>
            <a
              href="/tu-van"
              style={{
                fontSize:'0.7rem', fontWeight:600, color:PURPLE_BORDER,
                textDecoration:'none', padding:'3px 10px',
                border:`1px solid ${PURPLE_BORDER}`, borderRadius:'8px',
              }}
            >
              Hỏi thêm →
            </a>
          </div>
        </div>
      )}

      {/* No-JS fallback */}
      {!loading && !data && !fetched.current && (
        <noscript>
          <div style={{ padding:'0.75rem', background:PURPLE_BG, borderRadius:'0.75rem', fontSize:'0.875rem', color:'var(--text-2)' }}>
            Bật JavaScript để xem luận giải AI cho ngày này.
          </div>
        </noscript>
      )}
    </div>
  );
}
