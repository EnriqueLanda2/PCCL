'use client';

import { usePathname } from 'next/navigation';
import { PortalShell } from '@/components/layout/PortalShell';
import { PUBLIC_ROUTES } from '@/lib/routes';

export default function ModulesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  /* Login / Register pages render without the shell */
  if (isPublic) return <>{children}</>;

  return <PortalShell>{children}</PortalShell>;
}
