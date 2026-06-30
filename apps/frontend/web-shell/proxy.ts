/* ───────────────────────────────────────────
   Next.js Proxy — Auth & Route Protection
   (renamed from middleware.ts in Next.js 16)
   Checks the httpOnly session cookie.
   Fine-grained permission checks happen
   client-side via <PermissionGate>.
   ─────────────────────────────────────────── */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/identity/auth',
  '/identity/register',
  '/modules/auth',
  '/modules/register',
];
const PROTECTED_PREFIXES = ['/modules', '/identity', '/learning', '/certification'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Only intercept protected domain routes */
  if (!PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const hasSession = request.cookies.has('pccl_session');

  /* Unauthenticated user trying to access a protected route → login */
  if (!isPublic && !hasSession) {
    const loginUrl = new URL('/identity/auth', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* Authenticated user trying to access login/register → dashboard */
  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL('/learning/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  /* Match all protected domain routes */
  matcher: ['/modules/:path*', '/identity/:path*', '/learning/:path*', '/certification/:path*'],
};
