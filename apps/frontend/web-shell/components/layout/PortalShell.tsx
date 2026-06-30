'use client';

import type React from 'react';
import { Sidebar } from './Sidebar';
import { Appbar } from './Appbar';

type PortalShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function PortalShell({ children }: PortalShellProps) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

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