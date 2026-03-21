// src/utils/sounds.ts — Web Audio API (no external files)
let ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

// Tick cho nav buttons
export function playTick() {
  try {
    const c = getCtx();
    const osc = c.createOscillator(), gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.frequency.setValueAtTime(1200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    osc.start(c.currentTime); osc.stop(c.currentTime + 0.06);
  } catch {}
}

// Gieo quẻ — 3 tiếng đồng
export function playGieoQue() {
  try {
    const c = getCtx();
    [0, 0.08, 0.18].forEach(delay => {
      const osc = c.createOscillator(), gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900 + Math.random() * 200, c.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + delay + 0.12);
      gain.gain.setValueAtTime(0.22, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.14);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(c.currentTime + delay); osc.stop(c.currentTime + delay + 0.15);
    });
  } catch {}
}

// 🔔 Chuông thiền — âm thanh trong sáng, vang xa
export function playBell(volume = 0.4) {
  try {
    const c = getCtx();
    // Fundamental + harmonics cho âm chuông tự nhiên
    const freqs = [440, 880, 1320, 1760];
    const gains = [1, 0.5, 0.25, 0.125];
    freqs.forEach((freq, i) => {
      const osc = c.createOscillator(), gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(volume * (gains[i] ?? 0.1), c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 3.5);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(c.currentTime); osc.stop(c.currentTime + 3.6);
    });
  } catch {}
}

// 🎵 Tiếng chuông gõ nhẹ — cho streak check-in
export function playCheckIn() {
  try {
    const c = getCtx();
    // Ascending ding-ding
    [523, 659, 784].forEach((freq, i) => {
      const osc = c.createOscillator(), gain = c.createGain();
      osc.type = 'sine';
      const t = c.currentTime + i * 0.12;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + 0.55);
    });
  } catch {}
}

// 🧘 Tiếng om thiền — cho meditation
export function playOm(duration = 3) {
  try {
    const c = getCtx();
    const osc = c.createOscillator(), gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(136.1, c.currentTime); // sacred "Om" freq
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, c.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, c.currentTime + duration - 0.5);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + duration);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(c.currentTime); osc.stop(c.currentTime + duration + 0.1);
  } catch {}
}

// ✨ Success sound — khi unlock tính năng
export function playSuccess() {
  try {
    const c = getCtx();
    [400, 600, 800, 1000].forEach((freq, i) => {
      const osc = c.createOscillator(), gain = c.createGain();
      osc.type = 'sine';
      const t = c.currentTime + i * 0.07;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + 0.35);
    });
  } catch {}
}
