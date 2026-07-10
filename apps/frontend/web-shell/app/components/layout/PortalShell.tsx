'use client';

import type React from 'react';
import { Sidebar } from './Sidebar';
import { RouteGuard } from '@/app/components/shared/RouteGuard';

type PortalShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function PortalShell({ children }: PortalShellProps) {
  return (
    <div className="flex min-h-screen surface-page text-[var(--ink)]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 p-4 sm:p-5 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-[1480px] mx-auto">
            <RouteGuard>{children}</RouteGuard>
          </div>
        </main>
      </div>
    </div>
  );
}