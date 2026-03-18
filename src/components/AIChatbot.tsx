// ============================================================
// src/components/AIChatbot.tsx — AI Chatbot với SSE Streaming
// Rate limit: 3 câu/ngày, paywall khi hết
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role:      'user' | 'assistant';
  content:   string;
  streaming?: boolean;
}

const SUGGESTED = [
  'Hôm nay có tốt để ký hợp đồng không?',
  'Tháng 4/2026 ngày nào tốt để khai trương?',
  'Ngày 20/4/2026 hợp để tổ chức đám cưới không?',
  'Tôi sinh 1990, tuần này nên xuất hành ngày nào?',
];

export default function AIChatbot() {
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [remaining,  setRemaining]  = useState(3);
  const [rateLimited,setRateLimited]= useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Load remaining từ localStorage (estimate)
  useEffect(() => {
    const today = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).split(' ')[0] ?? '';
    const key   = `lvn_chat_count:${today}`;
    const count = parseInt(localStorage.getItem(key) ?? '0', 10);
    const rem   = Math.max(0, 3 - count);
    setRemaining(rem);
    if (rem === 0) setRateLimited(true);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || loading || rateLimited) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    // Placeholder AI message
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    try {
      const today = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).split(' ')[0] ?? '';

      const res = await fetch('/api/ai-chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          date:    today,
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setRemaining(0);
        setMessages(prev => prev.slice(0, -1)); // remove placeholder
        setLoading(false);
        return;
      }

      const rem = parseInt(res.headers.get('X-Rate-Limit-Remaining') ?? '2', 10);
      setRemaining(rem);
      if (rem === 0) setRateLimited(true);

      // Update localStorage count
      const key = `lvn_chat_count:${today}`;
      const cnt = parseInt(localStorage.getItem(key) ?? '0', 10);
      localStorage.setItem(key, String(cnt + 1));

      // Read SSE stream
      if (!res.body) throw new Error('No body');
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6)) as { text?: string; done?: boolean; remaining?: number };
            if (data.text) {
              setMessages(prev => {
                const updated = [...prev];
                const last    = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content:   last.content + data.text,
                    streaming: true,
                  };
                }
                return updated;
              });
            }
            if (data.done) {
              setMessages(prev => {
                const updated = [...prev];
                const last    = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, streaming: false };
                }
                return updated;
              });
              if (data.remaining !== undefined) setRemaining(data.remaining);
            }
          } catch { /* skip */ }
        }
      }

    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const last    = updated[updated.length - 1];
        if (last?.role === 'assistant' && last.streaming) {
          updated[updated.length - 1] = {
            ...last,
            content:  'Xin lỗi, có lỗi kết nối. Vui lòng thử lại.',
            streaming: false,
          };
        }
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [messages, loading, rateLimited]);

  const s: Record<string, React.CSSProperties> = {
    wrap:     { display:'flex', flexDirection:'column', height:'480px', position:'relative' },
    msgArea:  { flex:1, overflowY:'auto', padding:'0.75rem', display:'flex', flexDirection:'column', gap:'0.75rem' },
    userMsg:  { alignSelf:'flex-end', maxWidth:'80%', background:'var(--red-pale)', border:'1px solid var(--border-red)', borderRadius:'1rem 1rem 0.25rem 1rem', padding:'0.6rem 0.875rem', fontSize:'0.875rem', color:'var(--text-1)' },
    aiMsg:    { alignSelf:'flex-start', maxWidth:'80%', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'1rem 1rem 1rem 0.25rem', padding:'0.6rem 0.875rem', fontSize:'0.875rem', color:'var(--text-1)', lineHeight:1.7 },
    inputRow: { display:'flex', gap:'0.5rem', padding:'0.75rem', borderTop:'1px solid var(--border)', background:'var(--bg-card)' },
    input:    { flex:1, padding:'0.55rem 0.875rem', borderRadius:'1.5rem', border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-1)', fontSize:'0.875rem', outline:'none' },
    sendBtn:  { padding:'0.5rem 1rem', borderRadius:'1.5rem', background:'var(--red)', color:'white', border:'none', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity: loading || rateLimited ? 0.5 : 1 },
  };

  return (
    <div className="card overflow-hidden" style={{ position:'relative' }}>

      {/* Rate limit counter */}
      <div style={{ padding:'0.5rem 0.75rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg-surface)' }}>
        <span style={{ fontSize:'0.7rem', fontWeight:600, color:'var(--text-3)' }}>
          🤖 Trợ lý Lịch Vạn Niên AI
        </span>
        {!rateLimited ? (
          <span style={{ fontSize:'0.65rem', color:'var(--text-3)', padding:'2px 8px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px' }}>
            Còn {remaining}/{3} câu hôm nay
          </span>
        ) : (
          <span style={{ fontSize:'0.65rem', color:'var(--red)', fontWeight:600 }}>
            Hết lượt hôm nay
          </span>
        )}
      </div>

      {/* Messages area */}
      <div style={s.msgArea}>

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'auto', paddingTop:'1rem' }}>
            <p style={{ fontSize:'0.7rem', color:'var(--text-3)', textAlign:'center', marginBottom:'0.25rem' }}>
              Bạn có thể hỏi:
            </p>
            {SUGGESTED.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                disabled={rateLimited}
                style={{
                  textAlign:'left', padding:'0.6rem 0.875rem', borderRadius:'0.75rem',
                  border:'1px solid var(--border)', background:'var(--bg-surface)',
                  color:'var(--text-2)', fontSize:'0.8rem', cursor:'pointer',
                  opacity: rateLimited ? 0.5 : 1,
                }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? s.userMsg : s.aiMsg}>
            {msg.content || (msg.streaming ? (
              /* Typing indicator */
              <span style={{ display:'inline-flex', gap:'3px', alignItems:'center' }}>
                {[0,1,2].map(j => (
                  <span key={j} style={{
                    width:'6px', height:'6px', borderRadius:'50%', background:'var(--text-3)',
                    animation:'bounce 1s ease-in-out infinite',
                    animationDelay: `${j*0.2}s`,
                  }} />
                ))}
              </span>
            ) : '')}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={s.inputRow}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder={rateLimited ? 'Hết lượt hôm nay...' : 'Hỏi về lịch âm, ngày tốt xấu...'}
          disabled={loading || rateLimited}
          style={s.input}
          maxLength={300}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || rateLimited || !input.trim()}
          style={s.sendBtn}
          aria-label="Gửi"
        >
          Gửi
        </button>
      </div>

      {/* Rate limit overlay */}
      {rateLimited && (
        <div style={{
          position:'absolute', inset:0, background:'rgba(0,0,0,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          backdropFilter:'blur(4px)', borderRadius:'inherit',
        }}>
          <div style={{
            background:'var(--bg-card)', borderRadius:'1rem', padding:'1.5rem',
            maxWidth:'280px', textAlign:'center',
          }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🔒</div>
            <p style={{ fontWeight:700, marginBottom:'0.5rem', color:'var(--text-1)' }}>
              Hết lượt miễn phí hôm nay
            </p>
            <p style={{ fontSize:'0.8rem', color:'var(--text-3)', marginBottom:'1rem' }}>
              3 câu hỏi/ngày miễn phí. Quay lại ngày mai hoặc xem thông tin lịch bên dưới.
            </p>
            <a href="/gio-hoang-dao"
              style={{ display:'block', padding:'0.6rem', background:'var(--red)', color:'white', borderRadius:'0.75rem', textDecoration:'none', fontWeight:700, fontSize:'0.875rem', marginBottom:'0.5rem' }}>
              Xem giờ hoàng đạo →
            </a>
            <button onClick={() => setRateLimited(false)}
              style={{ width:'100%', padding:'0.5rem', background:'transparent', border:'1px solid var(--border)', borderRadius:'0.75rem', color:'var(--text-3)', fontSize:'0.8rem', cursor:'pointer' }}>
              Đóng
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }
      `}</style>
    </div>
  );
}
