/**
 * apiClient.ts
 * Axios-based HTTP client for PCCL.
 *
 * Features:
 *  - Base URL from env (NEXT_PUBLIC_API_URL)
 *  - Sends & receives cookies (withCredentials)
 *  - Request interceptor: injects Content-Type + optional abort signal
 *  - Response interceptor: normalises errors into ApiError
 *  - Auto-redirect to /identity/auth on 401 (client-side only)
 *  - Retry logic on 429 / 503 (up to 2 retries with exponential back-off)
 *  - Typed error classes: ApiError, NetworkError, TimeoutError
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

/* ─────────────────────────── Error classes ─────────────────────────── */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Sin conexión. Verifica tu red e intenta de nuevo.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'La solicitud tardó demasiado. Intenta de nuevo.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/* ─────────────────────── Human-readable messages ───────────────────── */

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Datos inválidos. Revisa los campos e intenta de nuevo.',
  401: 'Tu sesión expiró. Inicia sesión nuevamente.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  408: 'La solicitud tardó demasiado.',
  409: 'Conflicto: el recurso ya existe o está en uso.',
  422: 'Los datos enviados no son válidos.',
  429: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.',
  500: 'Error interno del servidor. Intenta más tarde.',
  502: 'El servidor no está disponible temporalmente.',
  503: 'Servicio temporalmente fuera de servicio.',
};

/* ───────────────────────── Retry configuration ─────────────────────── */

const RETRYABLE_STATUSES = new Set([429, 503]);
const MAX_RETRIES = 2;

function getRetryDelay(attempt: number, retryAfter?: string): number {
  if (retryAfter) {
    const seconds = parseInt(retryAfter, 10);
    if (!Number.isNaN(seconds)) return seconds * 1000;
  }
  return Math.min(1000 * 2 ** attempt, 8000); // 1s, 2s, 4s… capped at 8s
}

/* ────────────────────────── Client factory ─────────────────────────── */

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL:         process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    timeout:         15_000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
  });

  /* ── Request interceptor ── */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Attach CSRF token if present (cookie-to-header pattern)
      if (typeof document !== 'undefined') {
        const csrfToken = document.cookie
          .split('; ')
          .find((c) => c.startsWith('csrf_token='))
          ?.split('=')[1];
        if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  /* ── Response interceptor ── */
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      // Network / timeout errors (no response)
      if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          return Promise.reject(new TimeoutError());
        }
        return Promise.reject(new NetworkError());
      }

      const { response, config } = error;
      const status: number        = response.status;

      /* ── Retry on 429 / 503 ── */
      const retryCount = (config as AxiosRequestConfig & { _retryCount?: number })._retryCount ?? 0;
      if (RETRYABLE_STATUSES.has(status) && retryCount < MAX_RETRIES) {
        (config as AxiosRequestConfig & { _retryCount?: number })._retryCount = retryCount + 1;
        const delay = getRetryDelay(retryCount, response.headers['retry-after']);
        await new Promise((res) => setTimeout(res, delay));
        return client(config);
      }

      /* ── 401 → redirect to login (client-side only) ── */
      if (status === 401 && typeof window !== 'undefined') {
        window.location.href = '/identity/auth';
        return Promise.reject(new ApiError(401, 'UNAUTHORIZED', STATUS_MESSAGES[401]));
      }

      /* ── Normalise into ApiError ── */
      const body    = response.data as Record<string, unknown> | string | undefined;
      const code    = (typeof body === 'object' && (body?.error as string)) || String(status);
      const message =
        (typeof body === 'object' && (body?.message as string)) ||
        (typeof body === 'string' && body)                        ||
        STATUS_MESSAGES[status]                                   ||
        'Error desconocido';

      return Promise.reject(
        new ApiError(status, code, message, typeof body === 'object' ? body?.details : undefined),
      );
    },
  );

  return client;
}

export const apiClient: AxiosInstance = createClient();

/* ─────────────────── Typed convenience wrappers ────────────────────── */

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<T>(url, data, config);
  return res.data;
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.put<T>(url, data, config);
  return res.data;
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.patch<T>(url, data, config);
  return res.data;
}

export async function del<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config);
  return res.data;
}

/* ─────────────────── Error type guards ─────────────────────────────── */

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export function isNetworkError(err: unknown): err is NetworkError {
  return err instanceof NetworkError;
}

export function isAuthError(err: unknown): err is ApiError {
  return isApiError(err) && err.status === 401;
}

export function isForbiddenError(err: unknown): err is ApiError {
  return isApiError(err) && err.status === 403;
}

/** Returns a friendly message for any error type */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError)    return err.message;
  if (err instanceof NetworkError) return err.message;
  if (err instanceof TimeoutError) return err.message;
  if (isAxiosError(err))           return err.message;
  if (err instanceof Error)        return err.message;
  return 'Error desconocido';
}
