// ============================================================
// src/lib/analytics.ts — Analytics wrapper (Plausible / GA4)
// Dùng: import { trackEvent } from '../lib/analytics';
// ============================================================

type EventName =
  | 'AI Chat Sent'
  | 'Converter Used'
  | 'Wedding Date Searched'
  | 'Install Prompt Shown'
  | 'PWA Installed'
  | 'Share Image Created'
  | 'Paywall Hit'
  | 'Push Subscribed'
  | 'Tiet Khi Viewed'
  | 'Can Chi Viewed';

/**
 * Track custom event — works with Plausible or GA4
 * Silent fail if analytics not loaded
 */
export function trackEvent(
  name: EventName,
  props?: Record<string, string | number>,
): void {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.plausible) {
      w.plausible(name, { props });
    } else if (w.gtag) {
      w.gtag('event', name, props);
    }
  } catch { /* silent */ }
}

/**
 * Track page view (dùng cho SPA navigation nếu cần)
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.plausible) w.plausible('pageview', { u: url });
    else if (w.gtag) w.gtag('config', w.GA_MEASUREMENT_ID ?? '', { page_path: url });
  } catch { /* silent */ }
}
