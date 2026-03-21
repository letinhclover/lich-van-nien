// src/utils/groq.ts — Groq AI (thay thế Gemini)

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

export async function askGroq(
  systemPrompt: string,
  userMessage: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY ?? '').trim();
  if (!apiKey) throw new Error('Chưa cấu hình VITE_GROQ_API_KEY');

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage   },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens:  options.maxTokens  ?? 400,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error('AI đang bận, thử lại sau 1 phút.');
    throw new Error(`Lỗi AI (${res.status})`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

// Streaming version for chat
export async function askGroqStream(
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
  options: { temperature?: number } = {}
): Promise<void> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY ?? '').trim();
  if (!apiKey) throw new Error('Chưa cấu hình VITE_GROQ_API_KEY');

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage   },
      ],
      temperature: options.temperature ?? 0.8,
      max_tokens: 500,
      stream: true,
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error('AI đang bận, thử lại sau 1 phút.');
    throw new Error(`Lỗi AI (${res.status})`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('Không đọc được stream');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const text = json.choices?.[0]?.delta?.content ?? '';
        if (text) onChunk(text);
      } catch {}
    }
  }
}
