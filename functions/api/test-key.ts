// DEBUG ONLY — xóa file này sau khi xác nhận key hoạt động
interface Env { GROQ_API_KEY: string; }

export async function onRequestGet({ env }: { request: Request; env: Env }) {
  const key = env.GROQ_API_KEY ?? '';
  return Response.json({
    hasKey:    !!key,
    keyPrefix: key ? key.slice(0, 8) + '...' : 'MISSING',
    keyLength: key.length,
  }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
