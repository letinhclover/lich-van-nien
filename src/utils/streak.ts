// src/utils/streak.ts — Daily streak & check-in system

const KEY_STREAK   = 'hcc_streak_count';
const KEY_LAST     = 'hcc_streak_last_date';
const KEY_BEST     = 'hcc_streak_best';

function todayStr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
}
function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
}

export interface StreakInfo {
  count:    number;  // chuỗi ngày hiện tại
  best:     number;  // kỷ lục
  lastDate: string;  // yyyy-mm-dd
  isCheckedInToday: boolean;
}

export function getStreak(): StreakInfo {
  try {
    const count    = parseInt(localStorage.getItem(KEY_STREAK) ?? '0', 10) || 0;
    const lastDate = localStorage.getItem(KEY_LAST) ?? '';
    const best     = parseInt(localStorage.getItem(KEY_BEST) ?? '0', 10) || 0;
    const isCheckedInToday = lastDate === todayStr();
    return { count, best, lastDate, isCheckedInToday };
  } catch {
    return { count: 0, best: 0, lastDate: '', isCheckedInToday: false };
  }
}

export function checkIn(): StreakInfo {
  try {
    const today = todayStr();
    const yesterday = yesterdayStr();
    const prev = getStreak();

    if (prev.isCheckedInToday) return prev; // already checked in

    let newCount: number;
    if (prev.lastDate === yesterday) {
      newCount = prev.count + 1; // consecutive day
    } else if (prev.lastDate === '') {
      newCount = 1; // first time
    } else {
      newCount = 1; // streak broken
    }

    const newBest = Math.max(newCount, prev.best);
    localStorage.setItem(KEY_STREAK, String(newCount));
    localStorage.setItem(KEY_LAST,   today);
    localStorage.setItem(KEY_BEST,   String(newBest));

    return { count: newCount, best: newBest, lastDate: today, isCheckedInToday: true };
  } catch {
    return { count: 1, best: 1, lastDate: todayStr(), isCheckedInToday: true };
  }
}
