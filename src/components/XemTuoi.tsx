// ============================================================
// src/components/XemTuoi.tsx — Xem tuổi đặt tên con
// Bước 27
// ============================================================

import { useState } from 'react';

interface ApiResult {
  advice:        string;
  childCanChi:   string;
  childNguHanh:  string;
  childConGiap:  string;
  cached:        boolean;
  fallback?:     boolean;
}

function getCurrentYear(): number {
  try {
    const s = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
    return parseInt(s.split('-')[0] ?? '2026');
  } catch { return 2026; }
}

const inp: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.75rem',
  border: '1px solid var(--border)', background: 'var(--bg-surface)',
  color: 'var(--text-1)', fontSize: '0.875rem', outline: 'none',
};

const NGU_HANH_EMOJI: Record<string, string> = {
  'Mộc': '🌿', 'Hỏa': '🔥', 'Thổ': '🌏', 'Kim': '🪙', 'Thủy': '💧',
};

export default function XemTuoi() {
  const curYear = getCurrentYear();

  const [fatherYear, setFatherYear] = useState('');
  const [motherYear, setMotherYear] = useState('');
  const [childYear,  setChildYear]  = useState(String(curYear));
  const [gender,     setGender]     = useState<'trai'|'gai'|'chua_biet'>('chua_biet');
  const [result,     setResult]     = useState<ApiResult | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState(false);

  async function handleAnalyze() {
    const fy = parseInt(fatherYear);
    const my = parseInt(motherYear);
    const cy = parseInt(childYear);
    if (isNaN(fy) || fy < 1940 || fy > 2010) { setError('Năm sinh cha không hợp lệ (1940–2010)'); return; }
    if (isNaN(my) || my < 1940 || my > 2010) { setError('Năm sinh mẹ không hợp lệ (1940–2010)'); return; }
    if (isNaN(cy) || cy < curYear || cy > curYear + 5) { setError(`Năm sinh con: ${curYear}–${curYear+5}`); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fatherYear: fy, motherYear: my, childYear: cy, gender }),
      });
      const data = await res.json() as ApiResult;
      setResult(data);
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    const text =
      `🌟 KẾT QUẢ XEM TUỔI ĐẶT TÊN CON\n` +
      `Con sinh năm ${childYear}: ${result.childCanChi} · ${NGU_HANH_EMOJI[result.childNguHanh] ?? ''} ${result.childNguHanh} · Con ${result.childConGiap}\n\n` +
      `${result.advice}\n\n` +
      `📱 Xem thêm tại lichvannien.io.vn`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }

  const GENDER_OPTIONS: { value: 'trai'|'gai'|'chua_biet'; label: string }[] = [
    { value: 'trai',      label: '👦 Con Trai' },
    { value: 'gai',       label: '👧 Con Gái'  },
    { value: 'chua_biet', label: '🤍 Chưa biết' },
  ];

  return (
    <div>
      {/* Form */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="section-label mb-1">Năm sinh cha</p>
            <input type="number" placeholder="VD: 1990" value={fatherYear} min={1940} max={2010}
              onChange={e => setFatherYear(e.target.value)} style={inp} />
          </div>
          <div>
            <p className="section-label mb-1">Năm sinh mẹ</p>
            <input type="number" placeholder="VD: 1993" value={motherYear} min={1940} max={2010}
              onChange={e => setMotherYear(e.target.value)} style={inp} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="section-label mb-1">Năm dự sinh con</p>
            <input type="number" value={childYear} min={curYear} max={curYear + 5}
              onChange={e => setChildYear(e.target.value)} style={inp} />
          </div>
          <div>
            <p className="section-label mb-1">Giới tính</p>
            <select value={gender} onChange={e => setGender(e.target.value as typeof gender)} style={inp}>
              {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-xs mb-2" style={{ color: 'var(--red)' }}>{error}</p>}

        <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-full"
          style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? '🔍 Đang phân tích...' : '🔍 Xem tuổi đặt tên con →'}
        </button>
      </div>

      {/* Kết quả */}
      {result && (
        <div>
          {/* Child info card */}
          <div className="card p-4 mb-3"
            style={{ background: 'var(--gold-pale)', borderColor: 'rgba(241,196,15,0.3)' }}>
            <p className="section-label mb-2">🌟 Thông tin năm sinh con</p>
            <div className="flex gap-3 flex-wrap">
              <span className="badge-gold">{result.childCanChi}</span>
              <span className="badge-gold">{NGU_HANH_EMOJI[result.childNguHanh]} {result.childNguHanh}</span>
              <span className="badge-gold">Con {result.childConGiap}</span>
            </div>
          </div>

          {/* AI advice */}
          <div className="card p-4 mb-3"
            style={{ borderLeft: '3px solid #534AB7', background: '#EEEDFE' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🤖</span>
              <p className="text-xs font-bold" style={{ color: '#534AB7' }}>Phân tích AI</p>
            </div>
            <p className="text-sm" style={{ lineHeight: 1.8, color: 'var(--text-1)', whiteSpace: 'pre-line' }}>
              {result.advice}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleCopy} className="flex-1 btn-secondary text-sm py-2.5">
              {copied ? '✓ Đã copy!' : '📋 Copy kết quả (paste Zalo)'}
            </button>
            <a href="/tu-van" className="flex-1 btn-primary text-sm py-2.5 text-center no-underline">
              🤖 Hỏi AI thêm →
            </a>
          </div>

          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-4)' }}>
            ⚠️ Thông tin mang tính tham khảo theo phong tục truyền thống Việt Nam.
          </p>
        </div>
      )}
    </div>
  );
}
