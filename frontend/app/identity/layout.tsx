'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import { PortalShell } from '@/components/layout/PortalShell';

const PUBLIC_PATHS = ['/identity/auth', '/identity/register'];

export default function IdentityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isPublic) {
    return <>{children}</>;
  }

  return <PortalShell>{children}</PortalShell>;
}