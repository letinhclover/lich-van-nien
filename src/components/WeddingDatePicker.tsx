// ============================================================
// src/components/WeddingDatePicker.tsx — Chọn ngày cưới đẹp
// Lọc theo: score >= 4, không Tam Nương, không Nguyệt Kỵ
// ============================================================

import { useState } from 'react';

// ─── Inline lunar calc ────────────────────────────────────────
const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const THU = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const JD_BASE = 2415021, SYNODIC = 29.530588853;

function toJDN(d: number, m: number, y: number): number {
  let yy=y,mm=m; if(mm<=2){yy--;mm+=12;}
  const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+d+B-1524;
}
function nm(k: number): number {
  const T=k/1236.85,T2=T*T,T3=T2*T;
  let J=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3+0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*Math.PI/180);
  const M=(359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3)*Math.PI/180;
  const Mf=(306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3)*Math.PI/180;
  const Om=(21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3)*Math.PI/180;
  J+=(0.1734-0.000393*T)*Math.sin(M)+0.0021*Math.sin(2*M)-0.4068*Math.sin(Mf)+0.0161*Math.sin(2*Mf)-0.0004*Math.sin(3*Mf)+0.0104*Math.sin(2*Om)-0.0051*Math.sin(M+Mf)-0.0074*Math.sin(M-Mf)+0.0005*Math.sin(M+2*Mf);
  return Math.floor(J+0.5+7/24)-JD_BASE;
}
function sunLon(jd: number): number {
  const T=(jd-0.5-7/24)/36525,T2=T*T;
  let L=280.46646+36000.76983*T+0.0003032*T2;
  const M=(357.52911+35999.05029*T-0.0001537*T2)*Math.PI/180;
  const C=(1.9146-0.004817*T-0.000014*T2)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.00029*Math.sin(3*M);
  L=(L+C)%360; return L<0?L+360:L;
}
function lm11(y: number): number {
  const off=toJDN(31,12,y)-JD_BASE,k=Math.floor(off/SYNODIC);
  let n=nm(k); if(sunLon(n+JD_BASE)<270)n=nm(k-1); return n;
}
function loff(a11: number): number {
  const k=Math.floor(0.5+(a11+JD_BASE-2415021.076)/SYNODIC);
  let last=0; for(let i=1;i<14;i++){const arc=sunLon(nm(k+i)+JD_BASE);if(Math.abs(arc-Math.floor(arc/30)*30)<=7)break;last=i;} return last;
}
function s2l(d: number, m: number, y: number) {
  const dn=toJDN(d,m,y)-JD_BASE,k=Math.floor((dn-0.5)/SYNODIC);
  let n=nm(k+1); if(n>dn)n=nm(k);
  let a11=lm11(y),b11=a11,ly: number;
  if(a11>=n){ly=y;a11=lm11(y-1);}else{ly=y+1;b11=lm11(y+1);}
  const ld=dn-n+1,diff=Math.floor((n-a11)/29);
  let lmn=diff+11,leap=false;
  if(b11-a11>365){const lo=loff(a11);if(diff>=lo){lmn=diff+10;if(diff===lo)leap=true;}}
  if(lmn>12)lmn-=12; if(lmn>11&&diff<4)ly--;
  return {day:ld,month:lmn,year:ly,leap};
}
function getDayScore(d: number, m: number, y: number): { score:number; label:string; canChi:string; lunarDay:number; lunarMonth:number; isTamNuong:boolean; isNguyetKy:boolean } {
  const jdn=toJDN(d,m,y), lunar=s2l(d,m,y);
  const tuIdx=((jdn-2451549)%28+28)%28;
  const TU_DIEM=[1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];
  const tuScore=TU_DIEM[tuIdx]??0;
  const isTamNuong=[3,7,13,18,22,27].includes(lunar.day);
  const isNguyetKy=[5,14,23].includes(lunar.day);
  let diem=3+tuScore;
  if(isTamNuong)diem-=2; if(isNguyetKy)diem-=1;
  const score=Math.max(1,Math.min(5,Math.round(diem))) as 1|2|3|4|5;
  const LABELS:Record<number,string>={5:'Đại Cát',4:'Ngày Tốt',3:'Bình Thường',2:'Hung',1:'Đại Hung'};
  const canChi=`${CAN[(jdn+9)%10]} ${CHI[(jdn+1)%12]}`;
  return {score,label:LABELS[score]??'',canChi,lunarDay:lunar.day,lunarMonth:lunar.month,isTamNuong,isNguyetKy};
}

interface WeddingDay {
  d: number; m: number; y: number;
  dow: number; score: number; label: string;
  canChi: string; lunarDay: number; lunarMonth: number;
  reason: string; path: string;
}

const THANG_VI=['','T.1','T.2','T.3','T.4','T.5','T.6','T.7','T.8','T.9','T.10','T.11','T.12'];

export default function WeddingDatePicker() {
  const [namDau, setNamDau] = useState('');
  const [namRe,  setNamRe]  = useState('');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [year, setYear] = useState(2026);
  const [results, setResults] = useState<WeddingDay[]>([]);
  const [searched,    setSearched]    = useState(false);
  const [selectedDay, setSelectedDay] = useState<WeddingDay | null>(null);
  const [aiAdvice,    setAiAdvice]    = useState('');
  const [aiLoading,   setAiLoading]   = useState(false);

  const toggleMonth = (m: number) => {
    setSelectedMonths(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev,m]);
  };

  const fetchAdvice = async (day: WeddingDay) => {
    setSelectedDay(day);
    setAiAdvice('');
    setAiLoading(true);
    try {
      const dateStr = `${day.y}-${String(day.m).padStart(2,'0')}-${String(day.d).padStart(2,'0')}`;
      const res = await fetch('/api/ai-wedding-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, groomBirthYear: namRe ? parseInt(namRe) : undefined, brideBirthYear: namDau ? parseInt(namDau) : undefined }),
      });
      const data = await res.json() as { advice?: string };
      setAiAdvice(data.advice ?? 'Xem chi tiết tại trang ngày.');
    } catch {
      setAiAdvice('Xem chi tiết giờ hoàng đạo tại trang ngày.');
    } finally {
      setAiLoading(false);
    }
  };

  const findDays = () => {
    const months = selectedMonths.length > 0 ? selectedMonths : Array.from({length:12},(_,i)=>i+1);
    const good: WeddingDay[] = [];

    for (const m of months) {
      const daysInMonth = new Date(Date.UTC(year, m, 0)).getUTCDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const { score, label, canChi, lunarDay, lunarMonth, isTamNuong, isNguyetKy } = getDayScore(d, m, year);
        if (score < 4 || isTamNuong || isNguyetKy) continue;
        const dow = new Date(Date.UTC(year, m-1, d)).getUTCDay();
        // Ưu tiên thứ 6 và thứ 7 cho ngày cưới
        const dayBonus = dow === 6 || dow === 0 ? ' · Cuối tuần' : '';
        good.push({
          d, m, y: year, dow, score, label, canChi, lunarDay, lunarMonth,
          reason: `${label} · Trực ${canChi.split(' ')[1]}${dayBonus}`,
          path: `/lich/${year}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`,
        });
      }
    }
    // Sort: score cao trước, thứ 6/7 ưu tiên
    good.sort((a,b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aw = a.dow===6||a.dow===0 ? 1 : 0;
      const bw = b.dow===6||b.dow===0 ? 1 : 0;
      return bw - aw;
    });
    setResults(good.slice(0, 30));
    setSearched(true);
  };

  const exportText = () => {
    if (!results.length) return;
    const text = `NGÀY CƯỚI ĐỀ XUẤT NĂM ${year}\n` +
      results.slice(0,10).map(r =>
        `${THU[r.dow]} ${r.d}/${r.m}/${r.y} — Âm: ${r.lunarDay}/${r.lunarMonth} — ${r.canChi} (${r.label})`
      ).join('\n');
    navigator.clipboard.writeText(text).then(() => alert('Đã copy danh sách!'));
  };

  const inp = { background:'var(--bg-surface)', border:'1px solid var(--border)', color:'var(--text-1)', borderRadius:'0.75rem', padding:'0.5rem 0.75rem', width:'100%', fontSize:'0.875rem', outline:'none' };

  return (
    <div>
      {/* Form */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="section-label mb-1">Năm sinh cô dâu</p>
            <input type="number" placeholder="VD: 1997" value={namDau} min={1970} max={2010}
              onChange={e => setNamDau(e.target.value)} style={inp} />
          </div>
          <div>
            <p className="section-label mb-1">Năm sinh chú rể</p>
            <input type="number" placeholder="VD: 1995" value={namRe} min={1970} max={2010}
              onChange={e => setNamRe(e.target.value)} style={inp} />
          </div>
        </div>

        {/* Chọn năm */}
        <div className="flex gap-2 mb-3">
          {[2025,2026,2027].map(y => (
            <button key={y} onClick={() => setYear(y)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold"
              style={{ background: year===y ? 'var(--red)' : 'var(--bg-surface)', color: year===y ? 'white' : 'var(--text-3)', border:'1px solid var(--border)' }}>
              {y}
            </button>
          ))}
        </div>

        {/* Chọn tháng */}
        <p className="section-label mb-2">Tháng muốn cưới (bỏ trống = tất cả)</p>
        <div className="grid grid-cols-6 gap-1 mb-4">
          {Array.from({length:12},(_,i)=>i+1).map(m => (
            <button key={m} onClick={() => toggleMonth(m)}
              className="py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: selectedMonths.includes(m) ? 'var(--red)' : 'var(--bg-surface)', color: selectedMonths.includes(m) ? 'white' : 'var(--text-3)', border:'1px solid var(--border)' }}>
              {THANG_VI[m]}
            </button>
          ))}
        </div>

        <button onClick={findDays} className="btn-primary w-full">
          🔍 Tìm ngày cưới đẹp →
        </button>
      </div>

      {/* Kết quả */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">
              {results.length > 0 ? `Tìm được ${results.length} ngày đẹp năm ${year}` : 'Không tìm được ngày phù hợp'}
            </p>
            {results.length > 0 && (
              <button onClick={exportText} className="btn-secondary text-xs py-1.5 px-3">
                📋 Copy danh sách
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="card p-4 text-center">
              <p className="text-sm" style={{ color:'var(--text-3)' }}>
                Thử chọn thêm tháng hoặc chọn năm khác.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {results.map((r, i) => (
                <a key={i} href={r.path}
                  className="card p-3.5 no-underline flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="min-w-0">
                    <p className="font-bold text-sm" style={{ color:'var(--text-1)' }}>
                      {THU[r.dow]} {r.d}/{r.m}/{r.y}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text-3)' }}>
                      Âm lịch: {r.lunarDay}/{r.lunarMonth} · {r.canChi}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--green)' }}>
                      {r.reason}
                    </p>
                  </div>
                  <div className="flex flex-col items-center ml-3 shrink-0">
                    <span className="font-black text-xl" style={{ color:'var(--green)' }}>{r.score}</span>
                    <span className="text-[9px]" style={{ color:'var(--text-3)' }}>/5</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-center mt-4" style={{ color:'var(--text-4)' }}>
        ⚠️ Thông tin mang tính tham khảo theo phong tục truyền thống. Không thay thế tư vấn chuyên gia.
      </p>
    </div>
  );
}
