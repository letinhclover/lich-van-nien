// src/components/StreakBadge.tsx — Daily check-in streak
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStreak, checkIn, type StreakInfo } from '../utils/streak';
import { playCheckIn, playSuccess } from '../utils/sounds';

export function StreakBadge() {
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [showCelebrate, setShowCelebrate] = useState(false);

  useEffect(() => { setStreak(getStreak()); }, []);

  function handleCheckIn() {
    if (!streak || streak.isCheckedInToday) return;
    const newStreak = checkIn();
    setStreak(newStreak);
    if (newStreak.count >= 7) { playSuccess(); }
    else { playCheckIn(); }
    setShowCelebrate(true);
    setTimeout(() => setShowCelebrate(false), 2000);
  }

  if (!streak) return null;

  const isNew = !streak.isCheckedInToday;
  const flames = streak.count >= 30 ? '🔥🔥🔥' : streak.count >= 14 ? '🔥🔥' : '🔥';

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleCheckIn}
        disabled={streak.isCheckedInToday}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all"
        style={{
          background: isNew
            ? 'linear-gradient(135deg,var(--gold),var(--gold-light))'
            : 'var(--bg-elevated)',
          border: `1px solid ${isNew ? 'transparent' : 'var(--border-subtle)'}`,
          boxShadow: isNew ? '0 2px 12px rgba(184,114,10,0.35)' : 'none',
          cursor: isNew ? 'pointer' : 'default',
        }}>
        <span className="text-lg leading-none">{flames}</span>
        <div>
          <p className="text-xs font-bold leading-tight"
            style={{ color: isNew ? 'white' : 'var(--text-primary)' }}>
            {streak.count} ngày
          </p>
          <p className="text-[9px] leading-tight"
            style={{ color: isNew ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
            {isNew ? 'Điểm danh!' : 'Hôm nay ✓'}
          </p>
        </div>
      </motion.button>

      <AnimatePresence>
        {showCelebrate && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl pointer-events-none"
          >
            {streak.count >= 7 ? '🎉' : '⭐'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
