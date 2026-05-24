'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Appbar } from '@/components/layout/Appbar';
import { PUBLIC_ROUTES } from '@/lib/routes';

export default function ModulesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  /* Login / Register pages render without the shell */
  if (isPublic) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar — auto width driven by its own collapsed state */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Appbar />
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          <div className="max-w-screen-xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
