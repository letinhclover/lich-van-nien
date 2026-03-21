// src/tabs/TuViDailyTab.tsx — Tử vi 12 cung hàng ngày
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HOROSCOPES } from '../data/horoscopes';
import { solarToLunar } from '../utils/astrology';

const CUNG_INFO = [
  { id:'tý',    name:'Tý',   icon:'🐭', years:[2020,2008,1996,1984,1972,1960,1948] },
  { id:'sửu',   name:'Sửu',  icon:'🐮', years:[2021,2009,1997,1985,1973,1961,1949] },
  { id:'dần',   name:'Dần',  icon:'🐯', years:[2022,2010,1998,1986,1974,1962,1950] },
  { id:'mão',   name:'Mão',  icon:'🐰', years:[2023,2011,1999,1987,1975,1963,1951] },
  { id:'thìn',  name:'Thìn', icon:'🐲', years:[2024,2012,2000,1988,1976,1964,1952] },
  { id:'tỵ',   name:'Tỵ',   icon:'🐍', years:[2025,2013,2001,1989,1977,1965,1953] },
  { id:'ngọ',   name:'Ngọ',  icon:'🐴', years:[2026,2014,2002,1990,1978,1966,1954] },
  { id:'mùi',   name:'Mùi',  icon:'🐑', years:[2027,2015,2003,1991,1979,1967,1955] },
  { id:'thân',  name:'Thân', icon:'🐵', years:[2028,2016,2004,1992,1980,1968,1956] },
  { id:'dậu',   name:'Dậu',  icon:'🐓', years:[2029,2017,2005,1993,1981,1969,1957] },
  { id:'tuất',  name:'Tuất', icon:'🐕', years:[2018,2006,1994,1982,1970,1958] },
  { id:'hợi',   name:'Hợi',  icon:'🐷', years:[2019,2007,1995,1983,1971,1959] },
];

// Daily fortunes by day of week × cung (deterministic but varied)
function getDailyFortune(cungIdx: number, dayOfWeek: number, lunarDay: number): {
  overall: number; love: number; work: number; money: number; summary: string; lucky: string; avoid: string;
} {
  const seed = (cungIdx * 7 + dayOfWeek + lunarDay) % 12;
  const overall = 3 + (seed % 3);
  const SUMMARIES = [
    'Ngày thuận lợi cho việc giao tiếp và hợp tác. Hãy chủ động kết nối.',
    'Năng lượng tốt để bắt đầu dự án mới. Đừng do dự.',
    'Thời điểm ôn lại và suy ngẫm. Tránh quyết định vội vã.',
    'Cơ hội tài chính bất ngờ có thể xuất hiện. Tỉnh táo nhận biết.',
    'Ngày của sự sáng tạo và cảm hứng. Hãy để tâm trí bay bổng.',
    'Chú ý sức khỏe hơn hôm nay. Nghỉ ngơi đúng giờ.',
    'Các mối quan hệ được nhấn mạnh hôm nay. Hãy lắng nghe nhiều hơn.',
    'Kiên nhẫn là chìa khóa. Kết quả sẽ đến, nhưng cần thời gian.',
    'Ngày tốt để giải quyết các vấn đề còn tồn đọng.',
    'Hãy tự thưởng cho bản thân hôm nay. Bạn xứng đáng.',
    'Tập trung vào mục tiêu dài hạn, không bị phân tâm.',
    'Sự linh hoạt sẽ mang lại lợi thế cho bạn hôm nay.',
  ];
  const LUCKY = ['Đỏ','Vàng','Xanh lá','Trắng','Tím','Cam','Hồng','Đen','Xanh dương','Bạc'];
  const AVOID = ['Chi tiêu lớn','Tranh luận','Đầu tư rủi ro','Quyết định vội','Thức khuya','Bỏ bữa'];
  return {
    overall,
    love:  2 + (seed + 1) % 4,
    work:  2 + (seed + 2) % 4,
    money: 2 + (seed + 3) % 4,
    summary: SUMMARIES[seed] ?? SUMMARIES[0]!,
    lucky: LUCKY[seed % LUCKY.length] ?? 'Vàng',
    avoid: AVOID[seed % AVOID.length] ?? 'Thức khuya',
  };
}

interface Props { birthYear?: number; currentDate?: Date; }

export function TuViDailyTab({ birthYear, currentDate = new Date() }: Props) {
  const lunar = useMemo(() =>
    solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear()),
    [currentDate]
  );

  // Find user's cung from birth year
  const userCungIdx = birthYear
    ? CUNG_INFO.findIndex(c => c.years.includes(birthYear))
    : -1;

  const [selected, setSelected] = useState<number>(userCungIdx >= 0 ? userCungIdx : 0);

  const fortune = getDailyFortune(selected, currentDate.getDay(), lunar.day);

  const stars = (n: number) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between py-3 mb-3">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>
            Tử Vi Hôm Nay
          </h2>
          <p className="text-xs" style={{ color:'var(--text-muted)' }}>
            {currentDate.toLocaleDateString('vi-VN', { weekday:'long', day:'numeric', month:'long' })}
          </p>
        </div>
        {userCungIdx >= 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full font-bold"
            style={{ background:'var(--gold-bg)', color:'var(--gold)', border:'1px solid var(--gold-border)' }}>
            Tuổi bạn: {CUNG_INFO[userCungIdx]?.icon} {CUNG_INFO[userCungIdx]?.name}
          </span>
        )}
      </div>

      {/* 12 cung selector */}
      <div className="grid grid-cols-6 gap-1.5 mb-4">
        {CUNG_INFO.map((c, i) => (
          <motion.button key={c.id} whileTap={{ scale:0.9 }} onClick={() => setSelected(i)}
            className="flex flex-col items-center py-2 rounded-xl"
            style={{
              background: selected === i ? 'var(--gold)' : 'var(--bg-surface)',
              border: `1px solid ${selected===i?'transparent':'var(--border-subtle)'}`,
            }}>
            <span style={{ fontSize:'1.3rem', lineHeight:1 }}>{c.icon}</span>
            <span className="text-[9px] font-bold mt-0.5"
              style={{ color: selected===i ? 'white' : 'var(--text-muted)' }}>
              {c.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Fortune card */}
      <AnimatePresence mode="wait">
        <motion.div key={selected}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-12 }} transition={{ duration:0.2 }}>

          <div className="card overflow-hidden mb-3" style={{ boxShadow:'var(--shadow-float)' }}>
            <div className="h-1.5" style={{ background:'linear-gradient(90deg,var(--gold),var(--gold-light))' }} />
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize:'2.5rem', lineHeight:1 }}>{CUNG_INFO[selected]?.icon}</span>
                <div>
                  <p className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>
                    Tuổi {CUNG_INFO[selected]?.name}
                  </p>
                  <p className="text-sm" style={{ color:'var(--gold)' }}>{stars(fortune.overall)}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4" style={{ color:'var(--text-secondary)' }}>
                {fortune.summary}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label:'Tình duyên', icon:'❤️', val:fortune.love },
                  { label:'Công danh',  icon:'💼', val:fortune.work },
                  { label:'Tài lộc',    icon:'💰', val:fortune.money },
                ].map(({ label, icon, val }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl"
                    style={{ background:'var(--bg-elevated)' }}>
                    <span style={{ fontSize:'1.2rem' }}>{icon}</span>
                    <div className="flex mt-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full mx-0.5"
                          style={{ background: i<=val ? 'var(--gold)' : 'var(--border-medium)' }} />
                      ))}
                    </div>
                    <p className="text-[9px] mt-1" style={{ color:'var(--text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded-xl text-center"
                  style={{ background:'rgba(20,83,45,0.10)', border:'1px solid rgba(20,83,45,0.2)' }}>
                  <p className="text-[9px] font-bold mb-0.5" style={{ color:'var(--accent-emerald)' }}>MÀU HỢP</p>
                  <p className="text-xs font-bold" style={{ color:'var(--text-primary)' }}>{fortune.lucky}</p>
                </div>
                <div className="flex-1 px-3 py-2 rounded-xl text-center"
                  style={{ background:'rgba(127,29,29,0.08)', border:'1px solid rgba(127,29,29,0.2)' }}>
                  <p className="text-[9px] font-bold mb-0.5" style={{ color:'var(--accent-red)' }}>NÊN TRÁNH</p>
                  <p className="text-xs font-bold" style={{ color:'var(--text-primary)' }}>{fortune.avoid}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
