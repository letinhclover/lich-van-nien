// ============================================================
// src/components/PushSubscribe.tsx — Web Push Notification Subscribe
// Bước 35 — VAPID public key cần set từ env
// ============================================================

import { useState, useEffect } from 'react';

type PermStatus = 'default' | 'granted' | 'denied';

const NOTIF_TYPES = [
  { id: 'good_day',    label: 'Ngày tốt khai trương, ký hợp đồng' },
  { id: 'wedding_day', label: 'Ngày tốt cưới hỏi'                 },
  { id: 'daily_7am',   label: 'Nhắc hàng ngày lúc 7:00 SA'        },
];

export default function PushSubscribe() {
  const [permission, setPermission] = useState<PermStatus>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [types, setTypes]           = useState<Record<string, boolean>>({
    good_day: true, wedding_day: false, daily_7am: true,
  });
  const [supported, setSupported]   = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);
    setPermission(Notification.permission as PermStatus);
    // Check if already subscribed
    navigator.serviceWorker.ready.then(reg =>
      reg.pushManager.getSubscription()
    ).then(sub => {
      if (sub) setSubscribed(true);
    }).catch(() => {});
  }, []);

  async function handleSubscribe() {
    if (!supported) return;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm as PermStatus);
      if (perm !== 'granted') { setLoading(false); return; }

      const reg = await navigator.serviceWorker.ready;
      // VAPID public key — set via env or hardcode for demo
      // Production: replace with real VAPID public key from wrangler secret
      const vapidKey = (import.meta as unknown as { env: Record<string,string> }).env?.PUBLIC_VAPID_KEY
        ?? 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBnUIzgNA-';

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: vapidKey,
      });

      // Save to backend
      await fetch('/api/push-subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subscription: sub.toJSON(), types }),
      }).catch(() => { /* Non-critical */ });

      setSubscribed(true);
    } catch (err) {
      console.warn('Push subscribe error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      setSubscribed(false);
      setPermission('default');
    } catch {}
  }

  if (!supported) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-3)' }}>
        Trình duyệt không hỗ trợ thông báo đẩy.
      </p>
    );
  }

  if (permission === 'denied') {
    return (
      <div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-2)' }}>
          🚫 Thông báo đã bị chặn.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>
          Vào cài đặt trình duyệt → Quyền riêng tư → Thông báo → Cho phép lichvannien.io.vn.
        </p>
      </div>
    );
  }

  if (subscribed) {
    return (
      <div>
        <p className="text-sm mb-3" style={{ color: 'var(--green)', fontWeight: 600 }}>
          ✅ Đã bật thông báo ngày tốt
        </p>
        <button onClick={handleUnsubscribe} className="btn-secondary text-sm py-2">
          Tắt thông báo
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>
        Nhận thông báo lúc 7:00 sáng khi có ngày tốt để làm việc quan trọng.
      </p>

      {/* Checkbox loại thông báo */}
      <div className="flex flex-col gap-2 mb-4">
        {NOTIF_TYPES.map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={types[id] ?? false}
              onChange={e => setTypes(prev => ({ ...prev, [id]: e.target.checked }))}
              style={{ accentColor: 'var(--red)', width: '16px', height: '16px' }}
            />
            <span className="text-sm" style={{ color: 'var(--text-1)' }}>{label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="btn-primary w-full"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? '⏳ Đang kích hoạt...' : '🔔 Nhận thông báo ngày tốt'}
      </button>
    </div>
  );
}
