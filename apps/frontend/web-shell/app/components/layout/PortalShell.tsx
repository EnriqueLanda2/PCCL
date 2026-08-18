'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { RouteGuard } from '@/app/components/shared/RouteGuard';
import { ChatWidget } from '@/app/components/shared/ChatWidget';
import { appRoutes } from '@/lib/routes';
import { PushRegistrar } from '@/app/components/shared/PushRegistrar';
import { PageHeaderProvider } from '@/hooks/usePageHeader';

type PortalShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  /* En la vista de página completa de AIRumbo el widget flotante estorba —
     ya estás en el chat, no tiene caso otro flotando encima. */
  const hideChatWidget = pathname === appRoutes.aiRumbo;

  return (
    <PageHeaderProvider>
      <div className="flex min-h-screen surface-page text-[var(--ink)]">
        <PushRegistrar />
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

      {!hideChatWidget && <ChatWidget />}
    </PageHeaderProvider>
  );
}