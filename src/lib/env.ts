// ============================================================
// src/lib/env.ts — Type-safe Cloudflare Workers Environment
//
// Interface này phải KHỚP CHÍNH XÁC với wrangler.toml:
//   - binding names trong [[kv_namespaces]], [[d1_databases]]
//   - key names trong [vars]
//   - secrets được set qua `wrangler secret put`
//
// Dùng trong: Astro API routes, Cloudflare Functions
// Không dùng trong: .astro pages (dùng import.meta.env thay)
// ============================================================

/**
 * Cloudflare Workers/Pages Runtime Environment.
 * Được inject tự động bởi Cloudflare runtime — không tự tạo object này.
 *
 * Trong Astro API route: context.locals.runtime.env
 * Trong CF Functions:    env parameter của handler
 */
export interface Env {
  // ── KV Namespaces ─────────────────────────────────────────
  /**
   * Cache cho AI responses (Anthropic API results).
   * Key format: "ai-summary:{YYYY-MM-DD}"
   * TTL: 86400 giây (24 giờ)
   */
  AI_CACHE: KVNamespace;

  // ── D1 Databases ──────────────────────────────────────────
  /**
   * SQLite database cho analytics và future features.
   * Tables: page_views, ai_feedback, popular_dates
   */
  DB: D1Database;

  // ── Secrets (set qua wrangler secret put) ─────────────────
  /**
   * Anthropic API key.
   * ⚠️ KHÔNG log, KHÔNG trả về client, KHÔNG cache key này.
   * Set production: wrangler secret put ANTHROPIC_API_KEY
   * Set local: .dev.vars → ANTHROPIC_API_KEY=sk-ant-...
   */
  ANTHROPIC_API_KEY: string;

  // ── Vars (từ [vars] trong wrangler.toml) ──────────────────
  /** "production" | "development" | "preview" */
  ENVIRONMENT: 'production' | 'development' | 'preview';

  /** Base URL của site: "https://lichvannien.io.vn" */
  BASE_URL: string;

  /** Tên site */
  SITE_NAME: string;
}

// ─── Helper: lấy env an toàn với type checking ───────────────

/**
 * Validate và trả về Env object.
 * Throw nếu thiếu required fields.
 * Dùng ở đầu mỗi handler để fail fast nếu misconfigured.
 *
 * @example
 * export const GET: APIRoute = async ({ locals }) => {
 *   const env = getEnv(locals.runtime.env);
 *   const cache = await env.AI_CACHE.get('key');
 * };
 */
export function getEnv(raw: unknown): Env {
  const env = raw as Env;

  // Chỉ validate ANTHROPIC_API_KEY vì là critical secret
  // KV/D1 có thể absent trong preview deployments
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY chưa được set. ' +
      'Local: thêm vào .dev.vars. ' +
      'Production: chạy wrangler secret put ANTHROPIC_API_KEY'
    );
  }

  return env;
}

/**
 * Kiểm tra xem AI features có khả dụng không.
 * Dùng để graceful degrade khi thiếu config.
 */
export function isAIAvailable(env: Partial<Env>): boolean {
  return typeof env.ANTHROPIC_API_KEY === 'string'
    && env.ANTHROPIC_API_KEY.startsWith('sk-ant-');
}

/**
 * Kiểm tra environment hiện tại.
 */
export function isDevelopment(env: Partial<Env>): boolean {
  return env.ENVIRONMENT === 'development';
}

export function isProduction(env: Partial<Env>): boolean {
  return env.ENVIRONMENT === 'production';
}

// ─── KV Cache helpers ─────────────────────────────────────────

/** Key format chuẩn cho AI cache */
export function aiCacheKey(dateStr: string): string {
  return `ai-summary:${dateStr}`;
}

/**
 * Get từ KV cache với error handling.
 * Trả về null nếu không có hoặc lỗi (không throw).
 */
export async function kvGet<T>(
  kv: KVNamespace,
  key: string,
): Promise<T | null> {
  try {
    const val = await kv.get(key, 'json');
    return val as T | null;
  } catch {
    // KV lỗi → graceful degrade, không crash handler
    return null;
  }
}

/**
 * Put vào KV cache với error handling.
 * Silent fail — không crash nếu KV unavailable.
 */
export async function kvPut(
  kv: KVNamespace,
  key: string,
  value: unknown,
  ttlSeconds = 86400, // 24 giờ default
): Promise<void> {
  try {
    await kv.put(key, JSON.stringify(value), {
      expirationTtl: ttlSeconds,
    });
  } catch {
    // Silent fail — cache miss tệ hơn crash
  }
}
