// ============================================================
// src/components/InstallPrompt.tsx — Smart PWA Install Prompt
// Android: Bottom sheet dùng beforeinstallprompt
// iOS: Modal 3 bước hướng dẫn thủ công
// ============================================================

import { useState, useEffect } from 'react';

type Platform = 'android' | 'ios' | 'none';

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'none';
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isStandalone = ('standalone' in navigator) && (navigator as unknown as { standalone: boolean }).standalone;
  if (isIOS && !isStandalone) return 'ios';
  return 'none'; // android handled via event
}

const STORAGE = {
  VISITS:   'pwa_visits',
  DISMISSED:'pwa_dismiss_count',
  INSTALLED:'pwa_installed',
  LAST_DIS: 'pwa_last_dismiss',
};

export default function InstallPrompt() {
  const [show,     setShow]     = useState(false);
  const [platform, setPlatform] = useState<Platform>('none');
  const [toast,    setToast]    = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferred, setDeferred] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Nếu đã install thì không hiện nữa
    if (localStorage.getItem(STORAGE.INSTALLED)) return;

    // Track visits
    const visits = parseInt(localStorage.getItem(STORAGE.VISITS) ?? '0') + 1;
    localStorage.setItem(STORAGE.VISITS, String(visits));

    // Dismiss count
    const dismissed = parseInt(localStorage.getItem(STORAGE.DISMISSED) ?? '0');
    if (dismissed >= 2) return;

    // Last dismiss — không show trong 7 ngày nếu đã từ chối
    const lastDismiss = parseInt(localStorage.getItem(STORAGE.LAST_DIS) ?? '0');
    if (lastDismiss && Date.now() - lastDismiss < 7 * 24 * 3600 * 1000) return;

    // Chỉ show sau 3 lần visit
    if (visits < 3) return;

    const plat = detectPlatform();

    // iOS — show ngay
    if (plat === 'ios') {
      setTimeout(() => { setPlatform('ios'); setShow(true); }, 3000);
    }

    // Android — chờ beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      setPlatform('android');
      setTimeout(() => setShow(true), 2000);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // appinstalled event
    window.addEventListener('appinstalled', () => {
      setShow(false);
      localStorage.setItem(STORAGE.INSTALLED, '1');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function handleInstall() {
    if (platform === 'android' && deferred) {
      deferred.prompt();
      deferred.userChoice.then((choice: { outcome: string }) => {
        if (choice.outcome === 'accepted') {
          localStorage.setItem(STORAGE.INSTALLED, '1');
        }
        setShow(false);
      });
    } else {
      setShow(false);
    }
  }

  function handleDismiss() {
    const cnt = parseInt(localStorage.getItem(STORAGE.DISMISSED) ?? '0') + 1;
    localStorage.setItem(STORAGE.DISMISSED, String(cnt));
    localStorage.setItem(STORAGE.LAST_DIS, String(Date.now()));
    setShow(false);
  }

  if (!show && !toast) return null;

  return (
    <>
      {/* Toast khi cài xong */}
      {toast && (
        <div style={{
          position:'fixed', bottom:'5rem', left:'50%', transform:'translateX(-50%)',
          background:'var(--green)', color:'white', padding:'0.75rem 1.25rem',
          borderRadius:'999px', fontSize:'0.875rem', fontWeight:700,
          zIndex:9999, whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
        }}>
          ✅ Đã cài Lịch Vạn Niên AI thành công!
        </div>
      )}

      {/* Android Bottom Sheet */}
      {show && platform === 'android' && (
        <div style={{
          position:'fixed', inset:0, zIndex:9998,
          background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-end',
        }} onClick={handleDismiss}>
          <div
            style={{
              width:'100%', background:'var(--bg-card)', borderRadius:'1.25rem 1.25rem 0 0',
              padding:'1.5rem 1.25rem 2rem', boxShadow:'0 -4px 24px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width:'36px', height:'4px', background:'var(--border)', borderRadius:'2px', margin:'0 auto 1.25rem' }} />
            <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1rem' }}>
              <img src="/pwa-192x192.png" alt="icon" style={{ width:'52px', height:'52px', borderRadius:'12px' }} />
              <div>
                <p style={{ fontWeight:700, fontSize:'1rem', color:'var(--text-1)' }}>Lịch Vạn Niên AI</p>
                <p style={{ fontSize:'0.8rem', color:'var(--text-3)' }}>Cài về màn hình chính — Dùng offline, nhanh hơn browser</p>
              </div>
            </div>
            <button
              onClick={handleInstall}
              style={{
                width:'100%', background:'var(--red)', color:'white',
                fontWeight:700, fontSize:'0.875rem', padding:'0.875rem',
                borderRadius:'0.875rem', border:'none', cursor:'pointer', marginBottom:'0.625rem',
              }}
            >
              📲 Cài ngay
            </button>
            <button
              onClick={handleDismiss}
              style={{
                width:'100%', background:'transparent', color:'var(--text-3)',
                fontSize:'0.875rem', padding:'0.625rem', border:'none', cursor:'pointer',
              }}
            >
              Để sau
            </button>
          </div>
        </div>
      )}

      {/* iOS Modal */}
      {show && platform === 'ios' && (
        <div style={{
          position:'fixed', inset:0, zIndex:9998,
          background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.25rem',
        }} onClick={handleDismiss}>
          <div
            style={{
              width:'100%', maxWidth:'340px', background:'var(--bg-card)',
              borderRadius:'1.25rem', padding:'1.5rem', boxShadow:'0 8px 32px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--text-1)', textAlign:'center', marginBottom:'1.25rem' }}>
              📲 Cài Lịch Vạn Niên AI
            </p>
            {[
              { icon: '⬆️', step: '1', text: 'Nhấn nút Chia sẻ ở thanh Safari bên dưới' },
              { icon: '➕', step: '2', text: 'Chọn "Thêm vào Màn hình chính"' },
              { icon: '✅', step: '3', text: 'Nhấn "Thêm" ở góc trên phải' },
            ].map(({ icon, step, text }) => (
              <div key={step} style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1rem' }}>
                <div style={{
                  width:'36px', height:'36px', borderRadius:'50%', flexShrink:0,
                  background:'var(--red)', color:'white', fontWeight:700, fontSize:'0.875rem',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {step}
                </div>
                <p style={{ fontSize:'0.875rem', color:'var(--text-1)', lineHeight:1.5 }}>
                  <span style={{ marginRight:'0.25rem' }}>{icon}</span>{text}
                </p>
              </div>
            ))}
            <button
              onClick={handleDismiss}
              style={{
                width:'100%', background:'var(--bg-surface)', color:'var(--text-1)',
                fontWeight:700, fontSize:'0.875rem', padding:'0.75rem',
                borderRadius:'0.75rem', border:'1px solid var(--border)', cursor:'pointer', marginTop:'0.5rem',
              }}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
