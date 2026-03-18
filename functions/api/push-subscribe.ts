// functions/api/push-subscribe.ts — Save push subscriptions to KV
interface Env { AI_CACHE?: KVNamespace; }

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    const { subscription, types } = await request.json() as { subscription: unknown; types: Record<string,boolean> };
    if (!subscription) return Response.json({ error: 'No subscription' }, { status: 400, headers: CORS });

    // Store in KV if available
    if (env.AI_CACHE) {
      const key = `push:${Date.now()}`;
      await env.AI_CACHE.put(key, JSON.stringify({ subscription, types, ts: Date.now() }), {
        expirationTtl: 365 * 24 * 3600,
      });
    }

    return Response.json({ ok: true }, { headers: CORS });
  } catch {
    return Response.json({ ok: false }, { headers: CORS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
