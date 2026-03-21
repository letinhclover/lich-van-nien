// src/components/PWAInstallPrompt.tsx — Smart PWA install + widget guide
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [prompt,    setPrompt]    = useState<BeforeInstallPromptEvent | null>(null);
  const [show,      setShow]      = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS,     setIsIOS]     = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true); return;
    }
    const dismissed = sessionStorage.getItem('pwa_dismissed');
    if (dismissed) return;

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS guide after 30 seconds
      const t = setTimeout(() => setShow(true), 30000);
      return () => clearTimeout(t);
    }

    // Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      const visits = parseInt(localStorage.getItem('pwa_visits') ?? '0', 10) + 1;
      localStorage.setItem('pwa_visits', String(visits));
      if (visits >= 2) setTimeout(() => setShow(true), 5000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setShow(false);
    sessionStorage.setItem('pwa_dismissed', '1');
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
  }

  if (installed || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0, y:80 }}
        animate={{ opacity:1, y:0 }}
        exit={{ opacity:0, y:80 }}
        className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl overflow-hidden"
        style={{ boxShadow:'0 8px 40px rgba(0,0,0,0.35)' }}>

        <div className="p-4" style={{ background:'var(--bg-surface)', border:'1px solid var(--border-subtle)' }}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
              style={{ background:'linear-gradient(135deg,var(--gold),var(--gold-light))' }}>
              📱
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base" style={{ color:'var(--text-primary)' }}>
                Thêm vào màn hình chính
              </p>
              <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>
                Dùng như app thật · Offline · Không có quảng cáo
              </p>
            </div>
            <button onClick={dismiss} className="text-xl" style={{ color:'var(--text-faint)', lineHeight:1 }}>×</button>
          </div>

          {isIOS ? (
            <div className="mt-3">
              {!showIOSGuide ? (
                <button onClick={() => setShowIOSGuide(true)}
                  className="w-full py-2.5 rounded-xl font-bold text-sm"
                  style={{ background:'var(--gold)', color:'white' }}>
                  Xem hướng dẫn cài
                </button>
              ) : (
                <div className="text-xs space-y-1.5 mt-2" style={{ color:'var(--text-secondary)' }}>
                  <p>1️⃣ Nhấn nút <strong>Chia sẻ</strong> (□↑) ở thanh dưới Safari</p>
                  <p>2️⃣ Cuộn xuống → chọn <strong>"Thêm vào Màn hình chính"</strong></p>
                  <p>3️⃣ Nhấn <strong>Thêm</strong> — xong!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 mt-3">
              <button onClick={dismiss} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background:'var(--bg-elevated)', color:'var(--text-muted)' }}>
                Để sau
              </button>
              <button onClick={install} className="flex-2 px-6 py-2.5 rounded-xl text-sm font-bold"
                style={{ background:'var(--gold)', color:'white' }}>
                Cài ngay 🚀
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
