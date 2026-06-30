'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from './EmptyState';

interface PermissionGateProps {
  /** At least one of these permissions must be present */
  permissions: string[];
  children: React.ReactNode;
  /** Optional custom fallback — defaults to a locked empty state */
  fallback?: React.ReactNode;
}

function getPermissions(): string[] {
  try {
    const raw = sessionStorage.getItem('pccl_access');
    if (!raw) return [];
    return (JSON.parse(raw) as { permissions: string[] }).permissions ?? [];
  } catch {
    return [];
  }
}

/**
 * Renders children only if the current user holds at least one of
 * the required permissions.  Falls back to a "Acceso restringido"
 * screen otherwise.
 *
 * Permission checks run client-side against the cached access profile
 * stored in sessionStorage after login.
 */
export function PermissionGate({ permissions, children, fallback }: PermissionGateProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const userPerms = getPermissions();
    const ok = permissions.length === 0 || permissions.some((p) => userPerms.includes(p));
    setAllowed(ok);
  }, [permissions]);

  if (allowed === null) return null; // still resolving

  if (!allowed) {
    return fallback ?? (
      <EmptyState
        icon="🔒"
        title="Acceso restringido"
        description="No tienes los permisos necesarios para ver esta sección."
      />
    );
  }

  return <>{children}</>;
}
