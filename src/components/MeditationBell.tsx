// src/components/MeditationBell.tsx — Chuông thiền + Âm thanh
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { playBell, playOm } from '../utils/sounds';

export function MeditationBell() {
  const [ringing, setRinging] = useState(false);
  const [omming,  setOmming]  = useState(false);
  const [count,   setCount]   = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  function ring() {
    if (ringing) return;
    playBell(0.5);
    setRinging(true);
    setCount(c => c + 1);
    timerRef.current = setTimeout(() => setRinging(false), 3600);
  }

  function om() {
    if (omming) return;
    setOmming(true);
    playOm(4);
    setTimeout(() => setOmming(false), 4100);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm font-bold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
        Chuông Thiền
      </p>

      {/* Main bell */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        animate={ringing ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        onClick={ring}
        className="w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1"
        style={{
          background: 'radial-gradient(circle at 35% 35%, var(--gold-light), var(--gold))',
          boxShadow: ringing
            ? '0 0 40px rgba(200,134,10,0.5), 0 8px 32px rgba(200,134,10,0.3)'
            : '0 4px 24px rgba(200,134,10,0.25)',
        }}>
        <span style={{ fontSize:'3rem', lineHeight:1 }}>🔔</span>
      </motion.button>

      {/* Count */}
      {count > 0 && (
        <motion.p initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
          className="text-sm font-semibold" style={{ color:'var(--gold)' }}>
          {count} lần
        </motion.p>
      )}

      {/* Om button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={om}
        className="px-6 py-3 rounded-2xl font-bold text-base"
        style={{
          background: omming ? 'var(--accent-blue)' : 'var(--bg-elevated)',
          color: omming ? 'white' : 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        }}>
        {omming ? '🧘 Đang Om...' : '🧘 Tụng Om'}
      </motion.button>

      <p className="text-xs text-center px-6" style={{ color:'var(--text-faint)' }}>
        Gõ chuông để thanh tâm · Mỗi tiếng chuông là một hơi thở
      </p>
    </div>
  );
}
