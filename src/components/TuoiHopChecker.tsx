// src/components/TuoiHopChecker.tsx
import { useState } from 'react';
import { xemTuoiHop } from '../lib/tuoiHop';

const inp: React.CSSProperties = {
  width:'100%', padding:'0.625rem 0.875rem', borderRadius:'0.75rem',
  border:'1px solid var(--border)', background:'var(--bg-surface)',
  color:'var(--text-1)', fontSize:'1rem', outline:'none', textAlign:'center',
  fontWeight:'700',
};

const COLOR: Record<string, string> = {
  'tam-hop':     'var(--green)',
  'luc-hop':     '#16a34a',
  'binh-thuong': 'var(--gold-dark)',
  'luc-hai':     '#d97706',
  'luc-xung':    'var(--red)',
};

const LABEL: Record<string, string> = {
  'tam-hop':     '❤️ Tam Hợp — Rất hợp',
  'luc-hop':     '💚 Lục Hợp — Hợp duyên',
  'binh-thuong': '💛 Bình thường',
  'luc-hai':     '🟠 Lục Hại — Cần chú ý',
  'luc-xung':    '❌ Lục Xung — Khắc nhau',
};

export default function TuoiHopChecker() {
  const [namNam, setNamNam] = useState('');
  const [namNu,  setNamNu]  = useState('');
  const [result, setResult] = useState<ReturnType<typeof xemTuoiHop> | null>(null);
  const [error,  setError]  = useState('');

  function handle() {
    const n = parseInt(namNam), f = parseInt(namNu);
    if (!n || !f || n < 1920 || n > 2010 || f < 1920 || f > 2010) {
      setError('Năm sinh từ 1920 đến 2010'); return;
    }
    setError('');
    setResult(xemTuoiHop(n, f));
  }

  return (
    <div>
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs font-bold mb-1.5" style={{ color:'var(--text-3)' }}>👨 Năm sinh Nam</p>
            <input type="number" placeholder="VD: 1990" value={namNam}
              style={inp} min={1920} max={2010}
              onChange={e => setNamNam(e.target.value)} />
          </div>
          <div>
            <p className="text-xs font-bold mb-1.5" style={{ color:'var(--text-3)' }}>👩 Năm sinh Nữ</p>
            <input type="number" placeholder="VD: 1993" value={namNu}
              style={inp} min={1920} max={2010}
              onChange={e => setNamNu(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-xs mb-2" style={{ color:'var(--red)' }}>{error}</p>}
        <button onClick={handle} className="btn-primary w-full">
          💑 Xem tuổi có hợp không →
        </button>
      </div>

      {result && (
        <div>
          {/* Header kết quả */}
          <div className="card overflow-hidden mb-4">
            <div style={{ height:'4px', background: COLOR[result.ketQua] }} />
            <div className="p-4 text-center">
              <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>
                {result.diemSo >= 4 ? '💑' : result.diemSo === 3 ? '🤝' : '⚠️'}
              </div>
              <div className="flex justify-center gap-4 mb-3">
                <div>
                  <p className="text-xs" style={{ color:'var(--text-3)' }}>Nam · {result.nam.namSinh}</p>
                  <p className="font-bold text-lg" style={{ color: COLOR[result.ketQua] }}>{result.nam.tuoi}</p>
                  <p className="text-xs" style={{ color:'var(--text-3)' }}>Mệnh {result.nam.menh}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', color:'var(--text-4)', fontSize:'1.5rem' }}>+</div>
                <div>
                  <p className="text-xs" style={{ color:'var(--text-3)' }}>Nữ · {result.nu.namSinh}</p>
                  <p className="font-bold text-lg" style={{ color: COLOR[result.ketQua] }}>{result.nu.tuoi}</p>
                  <p className="text-xs" style={{ color:'var(--text-3)' }}>Mệnh {result.nu.menh}</p>
                </div>
              </div>
              <span className="text-sm font-bold px-3 py-1.5 rounded-full"
                style={{ background: COLOR[result.ketQua] + '18', color: COLOR[result.ketQua] }}>
                {LABEL[result.ketQua]}
              </span>
            </div>
          </div>

          {/* Điểm số */}
          <div className="card p-4 mb-3">
            <p className="section-label mb-2">Mức độ tương hợp</p>
            <div className="flex gap-1.5 items-center">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-3 flex-1 rounded-full"
                  style={{ background: i <= result.diemSo ? COLOR[result.ketQua] : 'var(--border)' }} />
              ))}
              <span className="text-sm font-bold ml-2" style={{ color: COLOR[result.ketQua] }}>
                {result.diemSo}/5
              </span>
            </div>
          </div>

          {/* Nhận xét */}
          <div className="card p-4 mb-3">
            <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>💬 Nhận xét</p>
            <p className="text-sm leading-relaxed" style={{ color:'var(--text-2)' }}>{result.nhanXet}</p>
          </div>

          {/* Chi tiết */}
          <div className="card p-4 mb-3">
            <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>📋 Chi tiết</p>
            <div className="flex flex-col gap-1.5">
              {result.chiTiet.map((c, i) => (
                <p key={i} className="text-sm" style={{ color:'var(--text-2)' }}>• {c}</p>
              ))}
            </div>
          </div>

          {/* Màu hợp */}
          {result.mauHopNhau.length > 0 && (
            <div className="card p-4 mb-4">
              <p className="font-bold text-sm mb-2" style={{ color:'var(--text-1)' }}>🎨 Màu hợp mệnh</p>
              <div className="flex gap-2 flex-wrap">
                {result.mauHopNhau.map(m => (
                  <span key={m} className="text-xs px-3 py-1 rounded-full"
                    style={{ background:'var(--bg-surface)', color:'var(--text-1)', border:'1px solid var(--border)' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-center mb-4" style={{ color:'var(--text-4)' }}>
            ✳️ Thông tin mang tính tham khảo theo phong tục truyền thống
          </p>

          <button onClick={() => { setResult(null); setNamNam(''); setNamNu(''); }}
            className="btn-secondary w-full">🔄 Xem tuổi khác</button>
        </div>
      )}
    </div>
  );
}
