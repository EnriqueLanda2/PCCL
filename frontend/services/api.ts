/* ───────────────────────────────────────────
   Services · HTTP Client base
   Wrapper delgado sobre fetch — credentials,
   JSON parsing, manejo de errores uniforme.
   ─────────────────────────────────────────── */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text().catch(() => 'Error de solicitud');
    throw new ApiError(response.status, message || 'Error de solicitud');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
