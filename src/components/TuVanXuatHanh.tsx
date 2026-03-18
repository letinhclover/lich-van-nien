// ============================================================
// src/components/TuVanXuatHanh.tsx — Tư vấn xuất hành theo tuổi
// Bước 26
// ============================================================

import { useState } from 'react';

interface DayResult {
  d:      number;
  score:  number;
  canChi: string;
  thu:    string;
}

interface ApiResult {
  days:   DayResult[];
  advice: string;
  cached: boolean;
}

const PURPOSES = ['Đi xa', 'Ký hợp đồng', 'Gặp đối tác', 'Du lịch'];
const THU_FULL: Record<string, string> = {
  'CN':'Chủ Nhật', 'T2':'Thứ Hai', 'T3':'Thứ Ba', 'T4':'Thứ Tư',
  'T5':'Thứ Năm', 'T6':'Thứ Sáu', 'T7':'Thứ Bảy',
};

function getCurrentMonthYear(): { month: number; year: number } {
  const s = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
  const d = s.split(' ')[0]?.split('-') ?? ['2026','3','1'];
  return { month: parseInt(d[1] ?? '3'), year: parseInt(d[0] ?? '2026') };
}

const inp: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.75rem',
  border: '1px solid var(--border)', background: 'var(--bg-surface)',
  color: 'var(--text-1)', fontSize: '0.875rem', outline: 'none',
};

export default function TuVanXuatHanh() {
  const { month: curMonth, year: curYear } = getCurrentMonthYear();

  const [birthYear, setBirthYear] = useState('');
  const [purpose,   setPurpose]   = useState(PURPOSES[0]!);
  const [month,     setMonth]     = useState(curMonth);
  const [year,      setYear]      = useState(curYear);
  const [result,    setResult]    = useState<ApiResult | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleFind() {
    const by = parseInt(birthYear);
    if (!birthYear || isNaN(by) || by < 1940 || by > 2010) {
      setError('Vui lòng nhập năm sinh từ 1940 đến 2010');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai-xuat-hanh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthYear: by, month, year, purpose }),
      });
      const data = await res.json() as ApiResult;
      setResult(data);
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
  const YEARS  = [curYear, curYear + 1];

  return (
    <div>
      {/* Form */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="section-label mb-1">Năm sinh của bạn</p>
            <input
              type="number" placeholder="VD: 1990" value={birthYear}
              min={1940} max={2010}
              onChange={e => setBirthYear(e.target.value)}
              style={inp}
            />
          </div>
          <div>
            <p className="section-label mb-1">Mục đích</p>
            <select value={purpose} onChange={e => setPurpose(e.target.value)} style={inp}>
              {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div style={{ flex: 1 }}>
            <p className="section-label mb-1">Tháng</p>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))} style={inp}>
              {MONTHS.map(m => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <p className="section-label mb-1">Năm</p>
            <select value={year} onChange={e => setYear(parseInt(e.target.value))} style={inp}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-xs mb-2" style={{ color: 'var(--red)' }}>{error}</p>}

        <button
          onClick={handleFind}
          disabled={loading}
          className="btn-primary w-full"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '🔍 Đang tìm...' : '🔍 Tìm ngày xuất hành tốt →'}
        </button>
      </div>

      {/* Kết quả */}
      {result && (
        <div>
          {result.days.length === 0 ? (
            <div className="card p-4 text-center">
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>{result.advice}</p>
            </div>
          ) : (
            <>
              <h3 className="section-label mb-3">
                ✅ Top {result.days.length} ngày tốt để {purpose} tháng {month}/{year}
              </h3>

              {/* AI advice */}
              {result.advice && (
                <div
                  className="mb-3 p-3 rounded-xl text-sm"
                  style={{ background: '#EEEDFE', borderLeft: '3px solid #534AB7', lineHeight: 1.7, color: 'var(--text-1)' }}
                >
                  <p className="text-xs font-bold mb-1" style={{ color: '#534AB7' }}>🤖 AI phân tích</p>
                  <p>{result.advice}</p>
                </div>
              )}

              {/* Day cards */}
              <div className="flex flex-col gap-2">
                {result.days.map((day, i) => {
                  const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day.d).padStart(2,'0')}`;
                  const path    = `/lich/${year}/${String(month).padStart(2,'0')}/${String(day.d).padStart(2,'0')}`;
                  return (
                    <div key={i} className="card p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>
                          <span className="inline-block w-5 h-5 text-center text-xs font-black rounded-full mr-1.5"
                            style={{ background: 'var(--green)', color: 'white', lineHeight: '20px' }}>
                            {i+1}
                          </span>
                          {THU_FULL[day.thu] ?? day.thu} {day.d}/{month}/{year}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                          Can chi: {day.canChi} · {day.score}/5 điểm
                        </p>
                      </div>
                      <a
                        href={path}
                        className="badge-green text-xs no-underline shrink-0"
                        style={{ marginLeft: '0.5rem' }}
                      >
                        Xem chi tiết →
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-4)' }}>
            ⚠️ Thông tin mang tính tham khảo theo phong tục truyền thống.
          </p>
        </div>
      )}
    </div>
  );
}
