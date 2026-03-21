// ============================================================
// src/hooks/useAsyncData.ts — React hook fetch với retry & timeout
//
// Tính năng:
//   - Retry tự động 2 lần với backoff 1s → 2s
//   - AbortController timeout 8 giây
//   - Cleanup khi component unmount (tránh setState trên unmounted)
//   - Type-safe với generic <T>
//   - refetch() để trigger lại thủ công
//
// Dùng cho: AI summary fetch, giờ hoàng đạo realtime, v.v.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncError {
  /** Message thân thiện cho UI — không technical */
  message: string;
  /** Loại lỗi để chọn ErrorState type */
  type: 'ai' | 'data' | 'network' | 'notfound';
  /** HTTP status code nếu có */
  status?: number;
  /** Số lần đã retry */
  attempts: number;
}

export interface AsyncState<T> {
  data:    T | null;
  loading: boolean;
  error:   AsyncError | null;
  status:  AsyncStatus;
  /** Số lần retry đã thực hiện */
  attempts: number;
}

export interface UseAsyncDataOptions {
  /**
   * Có fetch ngay khi mount không.
   * false = chỉ fetch khi gọi refetch() thủ công.
   * @default true
   */
  immediate?: boolean;
  /**
   * Timeout tính bằng ms trước khi abort.
   * @default 8000
   */
  timeout?: number;
  /**
   * Số lần retry tối đa khi lỗi.
   * @default 2
   */
  maxRetries?: number;
  /**
   * Delay ms cho lần retry 1, retry 2 = delay*2 (exponential backoff).
   * @default 1000
   */
  retryDelay?: number;
  /**
   * Callback khi fetch thành công.
   */
  onSuccess?: (data: unknown) => void;
  /**
   * Callback khi hết retry mà vẫn lỗi.
   */
  onError?: (error: AsyncError) => void;
}

export interface UseAsyncDataReturn<T> extends AsyncState<T> {
  /** Trigger fetch thủ công (hoặc refetch sau lỗi) */
  refetch: () => void;
}

// ─── Helper: classify lỗi thành type thân thiện ──────────────

function classifyError(err: unknown, status?: number): AsyncError['type'] {
  // Network không có kết nối
  if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
    return 'network';
  }
  // Abort = timeout
  if (err instanceof DOMException && err.name === 'AbortError') {
    return 'ai'; // timeout thường do AI chậm
  }
  // HTTP 404
  if (status === 404) return 'notfound';
  // HTTP 4xx/5xx liên quan AI
  if (status === 429 || status === 503) return 'ai';
  // Các lỗi data khác
  return 'data';
}

function friendlyMessage(type: AsyncError['type'], attempts: number): string {
  const retryNote = attempts > 0 ? ` (đã thử ${attempts} lần)` : '';
  switch (type) {
    case 'ai':
      return `Trợ lý AI tạm thời không phản hồi${retryNote}. Thông tin lịch bên dưới vẫn chính xác.`;
    case 'network':
      return 'Không có kết nối mạng. Đang hiển thị dữ liệu đã lưu.';
    case 'notfound':
      return 'Không tìm thấy dữ liệu cho ngày này.';
    default:
      return `Không tải được dữ liệu${retryNote}. Vui lòng thử lại.`;
  }
}

// ─── Sleep helper ─────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Hook chính ───────────────────────────────────────────────

/**
 * React hook để fetch dữ liệu async với retry và timeout.
 *
 * @example
 * // Fetch AI summary
 * const { data, loading, error, refetch } = useAsyncData(
 *   async (signal) => {
 *     const res = await fetch('/api/ai-summary?date=2026-03-15', { signal });
 *     if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *     return res.json();
 *   },
 *   { timeout: 8000, maxRetries: 2 }
 * );
 */
export function useAsyncData<T>(
  /** Hàm fetch — nhận AbortSignal để hỗ trợ cancel */
  fetchFn: (signal: AbortSignal) => Promise<T>,
  options: UseAsyncDataOptions = {},
): UseAsyncDataReturn<T> {
  const {
    immediate  = true,
    timeout    = 8000,
    maxRetries = 2,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data:     null,
    loading:  false,
    error:    null,
    status:   'idle',
    attempts: 0,
  });

  // Dùng ref để track mounted — tránh setState sau unmount
  const mountedRef  = useRef(true);
  // ref cho fetch key để trigger refetch
  const fetchKeyRef = useRef(0);
  // ref cho AbortController hiện tại
  const abortRef    = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    // Hủy request cũ nếu có
    abortRef.current?.abort();

    if (!mountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, status: 'loading', error: null }));

    let lastError: AsyncError | null = null;

    // ── Retry loop: 0 = lần đầu, 1 = retry 1, 2 = retry 2 ───
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // Backoff: lần đầu không delay, retry 1 = 1s, retry 2 = 2s
      if (attempt > 0) {
        await sleep(retryDelay * attempt);
        if (!mountedRef.current) return; // unmounted trong lúc sleep
      }

      // Tạo AbortController mới cho mỗi lần thử
      const controller = new AbortController();
      abortRef.current = controller;

      // Timeout: abort sau `timeout` ms
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const data = await fetchFn(controller.signal);
        clearTimeout(timeoutId);

        if (!mountedRef.current) return;

        setState({
          data,
          loading:  false,
          error:    null,
          status:   'success',
          attempts: attempt,
        });

        onSuccess?.(data);
        return; // thành công → dừng retry loop

      } catch (err) {
        clearTimeout(timeoutId);

        if (!mountedRef.current) return;

        // Nếu là AbortError do cleanup (unmount) — im lặng
        if (err instanceof DOMException && err.name === 'AbortError' && !mountedRef.current) {
          return;
        }

        // Tính HTTP status nếu có
        const status = err instanceof Response ? err.status : undefined;
        const errType = classifyError(err, status);

        lastError = {
          message:  friendlyMessage(errType, attempt),
          type:     errType,
          status,
          attempts: attempt,
        };

        // Network error → không retry (vô nghĩa nếu mất kết nối)
        if (errType === 'network') break;
        // notfound → không retry
        if (errType === 'notfound') break;

      } finally {
        abortRef.current = null;
      }
    }

    // Hết retry mà vẫn lỗi
    if (mountedRef.current && lastError) {
      setState(prev => ({
        ...prev,
        loading: false,
        status:  'error',
        error:   lastError,
        attempts: lastError?.attempts ?? prev.attempts,
      }));
      onError?.(lastError);
    }
  }, [fetchFn, timeout, maxRetries, retryDelay, onSuccess, onError]);

  // Trigger execute
  const refetch = useCallback(() => {
    fetchKeyRef.current += 1;
    execute();
  }, [execute]);

  // Auto-fetch khi mount (nếu immediate = true)
  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      execute();
    }

    // Cleanup: abort request đang chạy, đánh dấu unmounted
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [immediate, execute]);

  return {
    data:     state.data,
    loading:  state.loading,
    error:    state.error,
    status:   state.status,
    attempts: state.attempts,
    refetch,
  };
}

// ─── Convenience hooks ────────────────────────────────────────

/**
 * Fetch AI summary cho một ngày
 * @example
 * const { data, loading, error, refetch } = useAISummary('2026-03-15');
 */
export function useAISummary(dateStr: string) {
  const fetchFn = useCallback(async (signal: AbortSignal) => {
    const res = await fetch(`/api/ai-summary?date=${dateStr}`, { signal });
    if (!res.ok) {
      const err = new Response(null, { status: res.status });
      throw err;
    }
    return res.json() as Promise<{ summary: string; cached: boolean }>;
  }, [dateStr]);

  return useAsyncData(fetchFn, {
    timeout:    8000,
    maxRetries: 2,
    retryDelay: 1000,
  });
}
