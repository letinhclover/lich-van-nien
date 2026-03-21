// src/components/BanMenhChecker.tsx
import { useState } from 'react';
import { getBanMenh } from '../lib/banMenh';

const inp: React.CSSProperties = {
  width:'100%', padding:'0.625rem 0.875rem', borderRadius:'0.75rem',
  border:'1px solid var(--border)', background:'var(--bg-surface)',
  color:'var(--text-1)', fontSize:'1rem', outline:'none',
  textAlign:'center', fontWeight:'700',
};

const HANH_COLOR: Record<string,string> = {
  Kim:'#bdc3c7', Mộc:'#27ae60', Thủy:'#2980b9', Hỏa:'#e74c3c', Thổ:'#e67e22',
};
const HANH_ICON: Record<string,string> = {
  Kim:'🪙', Mộc:'🌿', Thủy:'💧', Hỏa:'🔥', Thổ:'🌍',
};

export default function BanMenhChecker() {
  const [year, setYear]   = useState('');
  const [result, setResult] = useState<ReturnType<typeof getBanMenh> | null>(null);
  const [error, setError]   = useState('');

  function handle() {
    const y = parseInt(year);
    if (!y || y < 1924 || y > 2010) { setError('Năm sinh từ 1924 đến 2010'); return; }
    setError('');
    setResult(getBanMenh(y));
  }

  const color = result ? (HANH_COLOR[result.napAm.hanh] ?? 'var(--red)') : 'var(--red)';

  return (
    <div>
      <div className="card p-4 mb-4">
        <p className="section-label mb-2">Nhập năm sinh dương lịch</p>
        <input type="number" placeholder="VD: 1990" value={year}
          style={inp} min={1924} max={2010}
          onChange={e => setYear(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()} />
        {error && <p className="text-xs mt-1" style={{ color:'var(--red)' }}>{error}</p>}
        <button onClick={handle} className="btn-primary w-full mt-3">
          🔮 Xem bản mệnh →
        </button>
      </div>

      {result && (
        <div>
          {/* Hero */}
          <div className="card overflow-hidden mb-4">
            <div style={{ height:'4px', background: color }} />
            <div className="p-4 text-center">
              <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>
                {HANH_ICON[result.napAm.hanh]}
              </div>
              <p className="font-bold text-2xl mb-1" style={{ color }}>
                {result.canChi}
              </p>
              <p className="text-sm mb-1" style={{ color:'var(--text-3)' }}>
                Năm {result.namSinh} · Con {result.conGiap}
              </p>
              <span className="text-xs px-3 py-1 rounded-full font-bold"
                style={{ background: color + '18', color }}>
                Mệnh {result.napAm.hanh} · {result.napAm.moTa.split(' — ')[0]}
              </span>
            </div>
          </div>

          {/* Nạp âm */}
          <div className="card p-4 mb-3" style={{ borderColor: color + '40', background: color + '08' }}>
            <p className="font-bold text-sm mb-1" style={{ color:'var(--text-1)' }}>
              {HANH_ICON[result.napAm.hanh]} Nạp Âm Ngũ Hành
            </p>
            <p className="text-base font-bold" style={{ color }}>{result.napAm.moTa}</p>
          </div>

          {/* Mô tả */}
          <div className="card p-4 mb-3">
            <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>💬 Phân tích bản mệnh</p>
            <p className="text-sm leading-relaxed" style={{ color:'var(--text-2)' }}>{result.moTa}</p>
          </div>

          {/* Màu sắc */}
          <div className="card p-4 mb-3">
            <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>🎨 Màu sắc</p>
            <div className="flex gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold" style={{ color:'var(--green)' }}>✅ Hợp:</span>
              {result.mauHop.map(m => (
                <span key={m} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background:'var(--green-pale)', color:'var(--green)' }}>{m}</span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-bold" style={{ color:'var(--red)' }}>❌ Kỵ:</span>
              {result.mauKy.map(m => (
                <span key={m} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background:'var(--red-pale)', color:'var(--red)' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Hướng & Nghề */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="card p-3">
              <p className="section-label mb-2">🧭 Hướng tốt</p>
              {result.huongHop.map(h => (
                <p key={h} className="text-sm font-semibold" style={{ color }}>{h}</p>
              ))}
            </div>
            <div className="card p-3">
              <p className="section-label mb-2">💼 Nghề hợp</p>
              {result.ngheNghiep.slice(0,3).map(n => (
                <p key={n} className="text-xs" style={{ color:'var(--text-2)' }}>• {n}</p>
              ))}
            </div>
          </div>

          {/* Tuổi hợp/kỵ */}
          <div className="card p-4 mb-4">
            <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>💑 Tuổi hợp/kỵ</p>
            <div className="flex gap-4">
              <div>
                <p className="text-xs font-bold mb-1" style={{ color:'var(--green)' }}>✅ Tam hợp</p>
                {result.tuongHop.map(t => (
                  <span key={t} className="badge-green text-xs mr-1">{t}</span>
                ))}
              </div>
              {result.tuongKy.length > 0 && (
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color:'var(--red)' }}>❌ Tương xung</p>
                  {result.tuongKy.map(t => (
                    <span key={t} className="badge-red text-xs mr-1">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-center mb-4" style={{ color:'var(--text-4)' }}>
            ✳️ Thông tin mang tính tham khảo theo phong tục truyền thống
          </p>

          <button onClick={() => { setResult(null); setYear(''); }}
            className="btn-secondary w-full">🔄 Xem năm sinh khác</button>
        </div>
      )}
    </div>
  );
}
