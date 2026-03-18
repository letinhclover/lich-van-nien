// ============================================================
// src/components/LichConverter.tsx — React Island chuyển đổi lịch
// Tab 1: Dương → Âm  |  Tab 2: Âm → Dương
// Validate real-time, debounce 200ms, copy clipboard, 5 history
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────
interface ConvertResult {
  type:     'solar-to-lunar' | 'lunar-to-solar';
  input:    string;
  output:   string;
  canChi:   string;
  lunarStr: string;
  path:     string;
  thang:    string;
  score?:   number;
  label?:   string;
}

// ─── Inline lunar calc (no server needed) ────────────────────
function toJDN(d: number, m: number, y: number): number {
  let yy = y, mm = m;
  if (mm <= 2) { yy--; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524;
}

const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const JD_BASE = 2415021;
const SYNODIC = 29.530588853;

function newMoon(k: number): number {
  const T = k / 1236.85, T2 = T*T, T3 = T2*T;
  let JDE = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3
          + 0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*Math.PI/180);
  const M  = (359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3)*Math.PI/180;
  const Mf = (306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3)*Math.PI/180;
  const Om = (21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3)*Math.PI/180;
  JDE += (0.1734-0.000393*T)*Math.sin(M)+0.0021*Math.sin(2*M)
       - 0.4068*Math.sin(Mf)+0.0161*Math.sin(2*Mf)-0.0004*Math.sin(3*Mf)
       + 0.0104*Math.sin(2*Om)-0.0051*Math.sin(M+Mf)-0.0074*Math.sin(M-Mf)
       + 0.0005*Math.sin(M+2*Mf);
  return Math.floor(JDE + 0.5 + 7/24) - JD_BASE;
}

function sunLon(jd: number): number {
  const T = (jd-0.5-7/24)/36525, T2 = T*T;
  let L0 = 280.46646+36000.76983*T+0.0003032*T2;
  const M0 = (357.52911+35999.05029*T-0.0001537*T2)*Math.PI/180;
  const C = (1.9146-0.004817*T-0.000014*T2)*Math.sin(M0)+(0.019993-0.000101*T)*Math.sin(2*M0)+0.00029*Math.sin(3*M0);
  L0 = (L0+C)%360; return L0<0?L0+360:L0;
}

function lunarMonth11(year: number): number {
  const off = toJDN(31,12,year)-JD_BASE, k = Math.floor(off/SYNODIC);
  let nm = newMoon(k); if(sunLon(nm+JD_BASE)<270) nm=newMoon(k-1); return nm;
}

function leapOffset(a11: number): number {
  const k = Math.floor(0.5+(a11+JD_BASE-2415021.076)/SYNODIC);
  let last=0;
  for(let i=1;i<14;i++){const arc=sunLon(newMoon(k+i)+JD_BASE);if(Math.abs(arc-Math.floor(arc/30)*30)<=7)break;last=i;}
  return last;
}

function solarToLunar(d: number, m: number, y: number): { day:number;month:number;year:number;leap:boolean } {
  const dn=toJDN(d,m,y)-JD_BASE, k=Math.floor((dn-0.5)/SYNODIC);
  let nm=newMoon(k+1); if(nm>dn)nm=newMoon(k);
  let a11=lunarMonth11(y),b11=a11,ly: number;
  if(a11>=nm){ly=y;a11=lunarMonth11(y-1);}else{ly=y+1;b11=lunarMonth11(y+1);}
  const ld=dn-nm+1,diff=Math.floor((nm-a11)/29);
  let lm=diff+11,leap=false;
  if(b11-a11>365){const lo=leapOffset(a11);if(diff>=lo){lm=diff+10;if(diff===lo)leap=true;}}
  if(lm>12)lm-=12; if(lm>11&&diff<4)ly--;
  return {day:ld,month:lm,year:ly,leap};
}

function getCanChiDay(d: number, m: number, y: number): string {
  const jdn = toJDN(d,m,y);
  return `${CAN[(jdn+9)%10]} ${CHI[(jdn+1)%12]}`;
}
function getCanChiYear(year: number): string {
  return `${CAN[(year+6)%10]} ${CHI[(year+8)%12]}`;
}
function isValidDate(d: number, m: number, y: number): boolean {
  const dt = new Date(Date.UTC(y,m-1,d));
  return dt.getUTCFullYear()===y && dt.getUTCMonth()+1===m && dt.getUTCDate()===d;
}

const HISTORY_KEY = 'lvn_convert_history';
function loadHistory(): ConvertResult[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'); } catch { return []; }
}
function saveHistory(r: ConvertResult): void {
  try {
    const h = loadHistory().filter(x => x.input !== r.input).slice(0, 4);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([r, ...h]));
  } catch {}
}

// ─── Component ───────────────────────────────────────────────
export default function LichConverter() {
  const [tab, setTab] = useState<'solar' | 'lunar'>('solar');

  // Tab 1: dương → âm
  const [sDay, setSDay]     = useState('');
  const [sMon, setSMon]     = useState('');
  const [sYear, setSYear]   = useState('');
  const [sResult, setSResult] = useState<ConvertResult | null>(null);
  const [sError, setSError]  = useState('');

  // Tab 2: âm → dương
  const [lDay, setLDay]     = useState('');
  const [lMon, setLMon]     = useState('');
  const [lYear, setLYear]   = useState('');
  const [lLeap, setLLeap]   = useState(false);
  const [lResult, setLResult] = useState<ConvertResult | null>(null);
  const [lError, setLError]  = useState('');

  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ConvertResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setHistory(loadHistory()); }, []);

  // ── Debounced convert solar → lunar ─────────────────────────
  const convertSolar = useCallback(() => {
    const d = parseInt(sDay), m = parseInt(sMon), y = parseInt(sYear);
    if (!sDay || !sMon || !sYear) { setSResult(null); setSError(''); return; }
    if (isNaN(d)||isNaN(m)||isNaN(y)) { setSError('Vui lòng nhập đủ ngày tháng năm'); return; }
    if (!isValidDate(d, m, y)) { setSError(`Ngày ${d}/${m}/${y} không hợp lệ`); setSResult(null); return; }
    setSError('');
    const lunar  = solarToLunar(d, m, y);
    const canChi = getCanChiDay(d, m, y);
    const canNam = getCanChiYear(lunar.year);
    const result: ConvertResult = {
      type:     'solar-to-lunar',
      input:    `${d}/${m}/${y}`,
      output:   `${lunar.leap ? 'Nhuận ' : ''}${lunar.day}/${lunar.month}/${lunar.year}`,
      canChi,
      lunarStr: `Ngày ${lunar.leap ? 'Nhuận ' : ''}${lunar.day} tháng ${lunar.month} năm ${canNam}`,
      path:     `/lich/${y}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`,
      thang:    `/lich/thang/${y}/${String(m).padStart(2,'0')}`,
    };
    setSResult(result);
    saveHistory(result);
    setHistory(loadHistory());
  }, [sDay, sMon, sYear]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(convertSolar, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [convertSolar]);

  // ── Convert lunar → solar ────────────────────────────────────
  const handleLunarConvert = () => {
    const d = parseInt(lDay), m = parseInt(lMon), y = parseInt(lYear);
    if (isNaN(d)||isNaN(m)||isNaN(y)||d<1||d>30||m<1||m>12) {
      setLError('Ngày âm lịch không hợp lệ'); return;
    }
    setLError('');
    // lunarToSolar inline
    let a11: number, b11: number;
    if(m<11){a11=lunarMonth11(y-1);b11=lunarMonth11(y);}
    else{a11=lunarMonth11(y);b11=lunarMonth11(y+1);}
    const k=Math.floor(0.5+(a11+JD_BASE-2415021.076)/SYNODIC);
    let offset=m-11; if(offset<0)offset+=12;
    let nm: number;
    if(b11-a11>365){const lo=leapOffset(a11);const adj=offset>=lo&&(offset!==lo||lLeap)?1:0;nm=newMoon(k+offset+adj);}
    else nm=newMoon(k+offset);
    const jdn=nm+JD_BASE+d-1;
    const A=jdn+32044,BB=Math.floor((4*A+3)/146097),C=A-Math.floor(146097*BB/4);
    const DD=Math.floor((4*C+3)/1461),E=C-Math.floor(1461*DD/4),MM=Math.floor((5*E+2)/153);
    const sd=E-Math.floor((153*MM+2)/5)+1,sm=MM+3-12*Math.floor(MM/10),sy=100*BB+DD-4800+Math.floor(MM/10);
    const result: ConvertResult = {
      type:'lunar-to-solar',
      input: `${d}/${m}/${y}${lLeap?' (nhuận)':''}`,
      output:`${sd}/${sm}/${sy}`,
      canChi: getCanChiDay(sd,sm,sy),
      lunarStr:`Dương lịch: ${sd}/${sm}/${sy}`,
      path:`/lich/${sy}/${String(sm).padStart(2,'0')}/${String(sd).padStart(2,'0')}`,
      thang:`/lich/thang/${sy}/${String(sm).padStart(2,'0')}`,
    };
    setLResult(result);
    saveHistory(result);
    setHistory(loadHistory());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const inp = 'w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all';
  const inpStyle = { background:'var(--bg-surface)', border:'1px solid var(--border)', color:'var(--text-1)' };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{background:'var(--bg-surface)'}}>
        {(['solar','lunar'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: tab===t ? 'var(--red)' : 'transparent', color: tab===t ? 'white' : 'var(--text-3)' }}>
            {t === 'solar' ? '☀️ Dương → Âm' : '🌙 Âm → Dương'}
          </button>
        ))}
      </div>

      {/* Tab 1: Solar → Lunar */}
      {tab === 'solar' && (
        <div>
          <div className="flex gap-2 mb-3">
            {[
              { val:sDay,   set:setSDay,   ph:'Ngày', min:1, max:31 },
              { val:sMon,   set:setSMon,   ph:'Tháng',min:1, max:12 },
              { val:sYear,  set:setSYear,  ph:'Năm',  min:1900, max:2100 },
            ].map(({ val, set, ph, min, max }) => (
              <input key={ph} type="number" placeholder={ph} value={val} min={min} max={max}
                onChange={e => set(e.target.value)}
                className={inp}
                style={{ ...inpStyle, borderColor: sError && val ? 'var(--red)' : 'var(--border)' }}
              />
            ))}
          </div>
          {sError && <p className="text-xs mb-2" style={{ color:'var(--red)' }}>{sError}</p>}

          {sResult && (
            <div className="card p-4 mb-3" style={{ borderColor:'rgba(29,158,117,0.3)', background:'rgba(29,158,117,0.05)' }}>
              <p className="section-label mb-1">KẾT QUẢ ÂM LỊCH</p>
              <p className="font-bold text-lg" style={{ color:'var(--text-1)' }}>{sResult.lunarStr}</p>
              <p className="text-sm mt-0.5" style={{ color:'var(--text-3)' }}>Can chi ngày: {sResult.canChi}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <a href={sResult.path} className="btn-primary text-xs py-2 px-3 no-underline">Xem chi tiết →</a>
                <a href={sResult.thang} className="btn-secondary text-xs py-2 px-3 no-underline">Xem cả tháng</a>
                <button onClick={() => handleCopy(`${sResult.input} = ${sResult.lunarStr} (${sResult.canChi})`)}
                  className="btn-secondary text-xs py-2 px-3">
                  {copied ? '✓ Đã copy' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Lunar → Solar */}
      {tab === 'lunar' && (
        <div>
          <div className="flex gap-2 mb-2">
            {[
              { val:lDay,  set:setLDay,  ph:'Ngày âm' },
              { val:lMon,  set:setLMon,  ph:'Tháng âm' },
              { val:lYear, set:setLYear, ph:'Năm âm' },
            ].map(({ val, set, ph }) => (
              <input key={ph} type="number" placeholder={ph} value={val}
                onChange={e => set(e.target.value)}
                className={inp} style={inpStyle} />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer" style={{ color:'var(--text-2)' }}>
            <input type="checkbox" checked={lLeap} onChange={e => setLLeap(e.target.checked)}
              style={{ accentColor:'var(--red)' }} />
            Tháng nhuận
          </label>
          <button onClick={handleLunarConvert} className="btn-primary w-full mb-3">
            Chuyển đổi →
          </button>
          {lError && <p className="text-xs mb-2" style={{ color:'var(--red)' }}>{lError}</p>}
          {lResult && (
            <div className="card p-4 mb-3" style={{ borderColor:'rgba(29,158,117,0.3)', background:'rgba(29,158,117,0.05)' }}>
              <p className="section-label mb-1">KẾT QUẢ DƯƠNG LỊCH</p>
              <p className="font-bold text-lg" style={{ color:'var(--text-1)' }}>{lResult.output}</p>
              <p className="text-sm mt-0.5" style={{ color:'var(--text-3)' }}>Can chi: {lResult.canChi}</p>
              <div className="flex gap-2 mt-3">
                <a href={lResult.path} className="btn-primary text-xs py-2 px-3 no-underline">Xem chi tiết →</a>
                <button onClick={() => handleCopy(`${lResult.input} (âm) = ${lResult.output} (dương)`)}
                  className="btn-secondary text-xs py-2 px-3">
                  {copied ? '✓ Đã copy' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lịch sử tra cứu */}
      {history.length > 0 && (
        <div>
          <p className="section-label mb-2">🕐 Tra cứu gần đây</p>
          <div className="flex flex-col gap-1.5">
            {history.map((r, i) => (
              <a key={i} href={r.path}
                className="card-surface p-2.5 flex items-center justify-between no-underline hover:opacity-80">
                <span className="text-sm" style={{ color:'var(--text-1)' }}>{r.input}</span>
                <span className="text-xs" style={{ color:'var(--text-3)' }}>{r.type === 'solar-to-lunar' ? r.output : r.output} →</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
