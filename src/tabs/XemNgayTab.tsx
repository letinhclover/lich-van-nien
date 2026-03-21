// src/tabs/XemNgayTab.tsx — Tìm ngày tốt theo mục đích
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { solarToLunar } from '../utils/astrology';
import { MUC_DICH_DATA } from '../data/xem-ngay-muc-dich';

const MONTHS = Array.from({length:12},(_,i)=>i+1);

function getDaysInMonth(year:number, month:number) {
  return new Date(year, month, 0).getDate();
}

function getScore(day:number, month:number, year:number, mucDichId:string): number {
  const lunar = solarToLunar(day, month, year);
  const jdn = (() => {
    let yy=year,mm=month;
    if(mm<=2){yy--;mm+=12;}
    const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+day+B-1524;
  })();
  const chi = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'][(jdn+1)%12]!;

  // Bad days
  if([5,14,23].includes(lunar.day)) return 1; // Nguyệt kỵ
  if([3,7,13,18,22,27].includes(lunar.day)) return 1; // Tam nương

  // Good days by purpose
  const goodLunar: Record<string,number[]> = {
    cuoi:    [2,4,6,8,10,12],  // Chẵn
    kinhDoanh:[1,6,8,9,13,15,21,24,25,27,28],
    xayNha:  [3,6,8,9,12,15,18,21,24,27],
    xuatHanh:[1,3,6,7,8,12,15,16,21,24,28],
    nhapTrach:[3,6,8,9,12,15,18,21,24,27],
  };

  const good = goodLunar[mucDichId] ?? goodLunar['kinhDoanh']!;
  if(good.includes(lunar.day)) return 5;
  if(good.includes(lunar.day+1) || good.includes(lunar.day-1)) return 3;
  return 2;
}

const MUC_DICH = [
  { id:'cuoi',      icon:'💍', label:'Cưới hỏi'    },
  { id:'kinhDoanh', icon:'🏪', label:'Khai trương' },
  { id:'xayNha',    icon:'🏗️', label:'Xây nhà'    },
  { id:'xuatHanh',  icon:'✈️', label:'Xuất hành'  },
  { id:'nhapTrach', icon:'🏠', label:'Nhập trạch'  },
];

export function XemNgayTab() {
  const now = new Date();
  const [mucDich, setMucDich] = useState('cuoi');
  const [month, setMonth] = useState(now.getMonth()+1);
  const [year]  = useState(now.getFullYear());
  const [picked, setPicked] = useState<{d:number;m:number;y:number}|null>(null);

  const goodDays = useMemo(() => {
    const days = getDaysInMonth(year, month);
    const result: {day:number;score:number;lunar:string;weekday:string}[] = [];
    const WD = ['CN','T2','T3','T4','T5','T6','T7'];
    for(let d=1;d<=days;d++){
      const score = getScore(d, month, year, mucDich);
      if(score >= 4) {
        const lunar = solarToLunar(d, month, year);
        const wd = new Date(year,month-1,d).getDay();
        result.push({day:d, score, lunar:`${lunar.day}/${lunar.month}`, weekday:WD[wd]??'CN'});
      }
    }
    return result;
  }, [mucDich, month, year]);

  const mucDichInfo = MUC_DICH.find(m=>m.id===mucDich)!;

  return (
    <div className="px-4 pb-24">
      <div className="py-3 mb-3">
        <h2 className="font-display font-bold text-xl" style={{color:'var(--text-primary)'}}>Tìm Ngày Tốt</h2>
        <p className="text-xs" style={{color:'var(--text-muted)'}}>Chọn mục đích để tìm ngày phù hợp</p>
      </div>

      {/* Mục đích */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{scrollbarWidth:'none'}}>
        {MUC_DICH.map(md => (
          <motion.button key={md.id} whileTap={{scale:0.92}} onClick={()=>setMucDich(md.id)}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl shrink-0"
            style={{
              background: mucDich===md.id ? 'var(--gold)' : 'var(--bg-surface)',
              border: `1px solid ${mucDich===md.id?'transparent':'var(--border-subtle)'}`,
            }}>
            <span style={{fontSize:'1.5rem'}}>{md.icon}</span>
            <span className="text-xs font-bold" style={{color:mucDich===md.id?'white':'var(--text-muted)'}}>{md.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Month selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4" style={{scrollbarWidth:'none'}}>
        {MONTHS.map(m => (
          <button key={m} onClick={()=>setMonth(m)}
            className="px-3 py-1.5 rounded-xl text-sm font-semibold shrink-0"
            style={{
              background: month===m ? 'var(--gold)' : 'var(--bg-elevated)',
              color: month===m ? 'white' : 'var(--text-muted)',
            }}>
            T.{m}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-3 flex items-center gap-2">
        <span style={{fontSize:'1.3rem'}}>{mucDichInfo.icon}</span>
        <p className="font-bold text-sm" style={{color:'var(--text-primary)'}}>
          {goodDays.length} ngày tốt để <span style={{color:'var(--gold)'}}>{mucDichInfo.label}</span> — tháng {month}/{year}
        </p>
      </div>

      {goodDays.length === 0 ? (
        <div className="text-center py-8" style={{color:'var(--text-muted)'}}>
          <p className="text-2xl mb-2">🙏</p>
          <p className="text-sm">Không có ngày đặc biệt tốt tháng này.<br/>Thử tháng khác.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {goodDays.map(({day,score,lunar,weekday}) => (
            <motion.button key={day} whileTap={{scale:0.97}}
              onClick={()=>setPicked({d:day,m:month,y:year})}
              className="flex items-center gap-4 p-3.5 rounded-2xl text-left"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
              }}>
              {/* Date */}
              <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0"
                style={{background:'linear-gradient(135deg,var(--gold),var(--gold-light))'}}>
                <span className="font-display font-bold text-2xl text-white leading-none">{day}</span>
                <span className="text-[9px] text-white opacity-80">{weekday}</span>
              </div>
              {/* Info */}
              <div className="flex-1">
                <p className="font-bold text-base" style={{color:'var(--text-primary)'}}>
                  {day} tháng {month} năm {year}
                </p>
                <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>
                  Âm lịch: {lunar} · {weekday}
                </p>
              </div>
              {/* Stars */}
              <div className="flex flex-col items-center gap-0.5">
                {'⭐'.repeat(score)}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {picked && (
          <motion.div className="fixed inset-0 z-50 flex items-end"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setPicked(null)}>
            <div className="absolute inset-0" style={{background:'rgba(0,0,0,0.5)'}} />
            <motion.div className="relative w-full rounded-t-3xl p-6"
              style={{background:'var(--bg-surface)'}}
              initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}}
              onClick={e=>e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{background:'var(--border-medium)'}} />
              <p className="font-display font-bold text-xl text-center mb-1" style={{color:'var(--text-primary)'}}>
                {mucDichInfo.icon} Ngày {picked.d}/{picked.m}/{picked.y}
              </p>
              {(() => {
                const lunar = solarToLunar(picked.d, picked.m, picked.y);
                return (
                  <div className="text-center">
                    <p className="text-sm mb-3" style={{color:'var(--text-muted)'}}>
                      Âm lịch: ngày {lunar.day} tháng {lunar.month} · {lunar.canChiDay}
                    </p>
                    <p className="text-base font-semibold mb-4" style={{color:'var(--text-primary)'}}>
                      ✅ Ngày tốt để {mucDichInfo.label}
                    </p>
                    <button onClick={()=>setPicked(null)}
                      className="w-full py-3 rounded-2xl font-bold"
                      style={{background:'var(--gold)',color:'white'}}>
                      Đóng
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
