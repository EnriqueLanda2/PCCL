'use client';

import type React from 'react';
import { Sidebar } from './Sidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { RouteGuard } from '@/app/components/shared/RouteGuard';

type PortalShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function PortalShell({ children }: PortalShellProps) {
  return (
    <div className="flex min-h-screen surface-page text-[var(--ink)]">
      <Sidebar />

      {/* min-w-0 es lo que permite que el contenido encoja: sin él, una tabla o
          un texto largo estiraría el flex y rompería el ancho en móvil. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-8">
          <div className="mx-auto w-full max-w-[92.5rem]">
            <RouteGuard>{children}</RouteGuard>
          </div>
        </main>
      </div>
    </div>
  );
}