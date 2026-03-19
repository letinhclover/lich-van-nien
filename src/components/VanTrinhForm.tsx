// ============================================================
// src/components/VanTrinhForm.tsx — Báo cáo vận trình AI 2027
// Free: preview 3 câu | Full: generate HTML + in PDF
// ============================================================

import { useState } from 'react';

interface Report {
  tongQuan:   string;
  taiLoc:     string;
  suNghiep:   string;
  tinhDuyen:  string;
  sucKhoe:    string;
  thangTot:   string[];
  loiKhuyen:  string;
  mauHop:     string[];
  canChi:     string;
  nguHanh:    string;
  birthYear:  number;
}

const CAN  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI  = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const NH   = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];
const GIAP = ['Chuột','Trâu','Hổ','Mèo','Rồng','Rắn','Ngựa','Dê','Khỉ','Gà','Chó','Lợn'];

function getCanChi(y: number) {
  return `${CAN[(y+6)%10]} ${CHI[(y+8)%12]}`;
}
function getNguHanh(y: number) { return NH[(y+6)%10]!; }
function getConGiap(y: number) { return GIAP[(y+8)%12]!; }

const inp: React.CSSProperties = {
  width:'100%', padding:'0.625rem 0.875rem', borderRadius:'0.75rem',
  border:'1px solid var(--border)', background:'var(--bg-surface)',
  color:'var(--text-1)', fontSize:'0.9rem', outline:'none',
};

export default function VanTrinhForm() {
  const [birthYear, setBirthYear] = useState('');
  const [report,    setReport]    = useState<Report | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [showFull,  setShowFull]  = useState(false);

  async function handleGenerate() {
    const y = parseInt(birthYear);
    if (!birthYear || isNaN(y) || y < 1924 || y > 2010) {
      setError('Năm sinh từ 1924 đến 2010');
      return;
    }
    setError('');
    setLoading(true);
    setReport(null);
    setShowFull(false);

    try {
      const res = await fetch('/api/van-trinh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthYear: y }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json() as Report;
      setReport(data);
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const SECTIONS = report ? [
    { icon:'🌟', title:'Tổng quan',   key:'tongQuan'  },
    { icon:'💰', title:'Tài lộc',     key:'taiLoc'    },
    { icon:'💼', title:'Sự nghiệp',   key:'suNghiep'  },
    { icon:'💕', title:'Tình duyên',  key:'tinhDuyen' },
    { icon:'🌿', title:'Sức khoẻ',   key:'sucKhoe'   },
    { icon:'✨', title:'Lời khuyên',  key:'loiKhuyen' },
  ] : [];

  return (
    <div>
      {/* Form */}
      {!report && (
        <div className="card p-4 mb-4">
          <p className="section-label mb-2">Nhập năm sinh của bạn</p>
          <input
            type="number" placeholder="VD: 1990" value={birthYear}
            min={1924} max={2010}
            onChange={e => setBirthYear(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            style={inp}
          />
          {error && <p className="text-xs mt-1" style={{ color:'var(--red)' }}>{error}</p>}
          <button
            onClick={handleGenerate} disabled={loading}
            className="btn-primary w-full mt-3"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '🔮 AI đang phân tích...' : '🔮 Xem vận trình 2027 →'}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card p-6 text-center">
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🔮</div>
          <p className="font-bold mb-1" style={{ color:'var(--text-1)' }}>AI đang phân tích vận trình...</p>
          <p className="text-sm" style={{ color:'var(--text-3)' }}>Thường mất 5–10 giây</p>
        </div>
      )}

      {/* Report */}
      {report && !loading && (
        <div id="van-trinh-report">

          {/* Header */}
          <div className="card overflow-hidden mb-4">
            <div style={{ height:'4px', background:'linear-gradient(90deg,#7c3aed,#a78bfa)' }} />
            <div className="p-4">
              <p className="section-label mb-1">Báo cáo vận trình năm 2027 (Đinh Mùi)</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-2xl" style={{ color:'#7c3aed' }}>
                    Tuổi {report.canChi}
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="badge-gold">🌿 {report.nguHanh}</span>
                    <span className="badge-green">Con {getConGiap(report.birthYear)}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:'#f3e8ff', color:'#7c3aed' }}>
                      Sinh {report.birthYear}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize:'3rem' }}>🔮</div>
              </div>
            </div>
          </div>

          {/* Tháng tốt */}
          {report.thangTot?.length > 0 && (
            <div className="card p-3 mb-4" style={{ background:'var(--green-pale)', borderColor:'rgba(29,158,117,0.3)' }}>
              <p className="section-label mb-2">📅 Tháng tốt nhất năm 2027</p>
              <div className="flex gap-2 flex-wrap">
                {report.thangTot.map(t => (
                  <span key={t} className="badge-green font-bold">Tháng {t} âm</span>
                ))}
              </div>
            </div>
          )}

          {/* Preview (first 2 sections always visible) */}
          {SECTIONS.slice(0, 2).map(({ icon, title, key }) => (
            <div key={key} className="card p-4 mb-3">
              <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>{icon} {title}</p>
              <p className="text-sm leading-relaxed" style={{ color:'var(--text-2)' }}>
                {report[key as keyof Report] as string}
              </p>
            </div>
          ))}

          {/* Blurred sections or full */}
          {!showFull ? (
            <div style={{ position:'relative', overflow:'hidden', borderRadius:'0.75rem' }}>
              <div style={{ filter:'blur(6px)', pointerEvents:'none' }}>
                {SECTIONS.slice(2).map(({ icon, title, key }) => (
                  <div key={key} className="card p-4 mb-3">
                    <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>{icon} {title}</p>
                    <p className="text-sm leading-relaxed" style={{ color:'var(--text-2)' }}>
                      {report[key as keyof Report] as string}
                    </p>
                  </div>
                ))}
              </div>
              {/* Unlock overlay */}
              <div style={{
                position:'absolute', inset:0, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                background:'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 30%)',
              }}>
                <p className="font-bold text-base mb-1" style={{ color:'var(--text-1)' }}>🔓 Xem báo cáo đầy đủ</p>
                <p className="text-sm mb-4 text-center px-4" style={{ color:'var(--text-3)' }}>
                  Sự nghiệp, tình duyên, sức khoẻ, lời khuyên + xuất PDF
                </p>
                <button
                  onClick={() => setShowFull(true)}
                  className="btn-primary"
                  style={{ background:'#7c3aed', padding:'0.75rem 2rem' }}
                >
                  ✨ Xem đầy đủ miễn phí →
                </button>
              </div>
            </div>
          ) : (
            <>
              {SECTIONS.slice(2).map(({ icon, title, key }) => (
                <div key={key} className="card p-4 mb-3">
                  <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>{icon} {title}</p>
                  <p className="text-sm leading-relaxed" style={{ color:'var(--text-2)' }}>
                    {report[key as keyof Report] as string}
                  </p>
                </div>
              ))}

              {/* Màu hợp */}
              {report.mauHop?.length > 0 && (
                <div className="card p-4 mb-4">
                  <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>🎨 Màu hợp năm 2027</p>
                  <div className="flex gap-2 flex-wrap">
                    {report.mauHop.map(c => (
                      <span key={c} className="px-3 py-1 rounded-full text-sm"
                        style={{ background:'#f3e8ff', color:'#7c3aed', border:'1px solid #ddd6fe' }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 btn-primary py-3"
                  style={{ background:'#7c3aed' }}
                >
                  🖨️ In / Lưu PDF
                </button>
                <button
                  onClick={() => { setReport(null); setBirthYear(''); }}
                  className="flex-1 btn-secondary py-3"
                >
                  🔄 Xem tuổi khác
                </button>
              </div>

              <p className="text-xs text-center" style={{ color:'var(--text-4)' }}>
                Nhấn "In / Lưu PDF" → trình duyệt mở hộp in → chọn "Save as PDF"
              </p>
            </>
          )}
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#van-trinh-report) { display: none !important; }
          .card { break-inside: avoid; }
          button, nav, footer { display: none !important; }
        }
      `}</style>
    </div>
  );
}
