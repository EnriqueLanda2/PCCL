'use client';

import type React from 'react';
import { PortalShell } from '@/components/layout/PortalShell';

export default function LearningLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PortalShell>{children}</PortalShell>;
}