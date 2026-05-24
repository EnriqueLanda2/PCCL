/* ───────────────────────────────────────────
   Next.js Proxy — Auth & Route Protection
   (renamed from middleware.ts in Next.js 16)
   Checks the httpOnly session cookie.
   Fine-grained permission checks happen
   client-side via <PermissionGate>.
   ─────────────────────────────────────────── */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/modules/auth', '/modules/register'];
const MODULES_PREFIX = '/modules';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Only intercept /modules/* routes */
  if (!pathname.startsWith(MODULES_PREFIX)) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const hasSession = request.cookies.has('pccl_session');

  /* Unauthenticated user trying to access a protected route → login */
  if (!isPublic && !hasSession) {
    const loginUrl = new URL('/modules/auth', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* Authenticated user trying to access login/register → dashboard */
  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL('/modules/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  /* Match all /modules/* routes */
  matcher: ['/modules/:path*'],
};
