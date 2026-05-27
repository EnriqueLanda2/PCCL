'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, getInitials } from '@/components/ui/Avatar';
import { appRoutes } from '@/lib/routes';

/* ── Breadcrumb from pathname ── */
const ROUTE_LABELS: Record<string, string> = {
  dashboard:    'Inicio',
  courses:      'Catálogo',
  lessons:      'Mis cursos',
  progress:     'Progreso',
  certificates: 'Certificados',
  inscriptions: 'Inscripciones',
  califications:'Calificaciones',
  audit:        'Auditoría',
  users:        'Usuarios',
  rbac:         'RBAC',
};

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  const last = segments.at(-1);
  if (!last) return null;
  const label = ROUTE_LABELS[last] ?? last;

  return (
    <nav aria-label="breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm">
      <Link href={appRoutes.dashboard} className="text-neutral-400 hover:text-neutral-700 no-underline transition-colors">
        Inicio
      </Link>
      {last !== 'dashboard' && (
        <>
          <span className="text-neutral-300 select-none">/</span>
          <span className="text-neutral-800 font-medium capitalize">{label}</span>
        </>
      )}
    </nav>
  );
}

/* ── Notification bell ── */
function NotificationBell({ count = 0 }: Readonly<{ count?: number }>) {
  return (
    <button
      aria-label={count > 0 ? `${count} notificaciones` : 'Notificaciones'}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-all duration-150 border-0 bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" aria-hidden />
      )}
    </button>
  );
}

/* ── Search bar ── */
function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  /* ⌘K / Ctrl+K shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    globalThis.addEventListener('keydown', handler);
    return () => globalThis.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative flex-1 max-w-xs lg:max-w-sm">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" aria-hidden>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" strokeLinecap="round"/>
          <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        placeholder="Buscar…"
        aria-label="Buscar cursos y lecciones"
        className="w-full h-9 pl-9 pr-10 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none
          focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100
          text-neutral-900 placeholder:text-neutral-400 transition-all duration-150"
      />
      <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5
        px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 rounded">
        ⌘K
      </kbd>
    </div>
  );
}

/* ── Main Appbar ── */
export function Appbar() {
  const [userName,  setUserName]  = useState('');
  const [roleLabel, setRoleLabel] = useState('');

  useEffect(() => {
    try {
      const u = sessionStorage.getItem('pccl_user');
      const a = sessionStorage.getItem('pccl_access');
      if (u) setUserName((JSON.parse(u) as { fullName: string }).fullName);
      if (a) setRoleLabel((JSON.parse(a) as { roles: string[] }).roles[0] ?? '');
    } catch { /* ignore */ }
  }, []);

  return (
    <header className="h-14 flex items-center gap-4 px-5 bg-white border-b border-neutral-200 sticky top-0 z-40">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Search */}
      <div className="flex-1 flex justify-end sm:justify-start">
        <SearchBar />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell count={0} />

        <div className="w-px h-5 bg-neutral-200 mx-1" aria-hidden />

        {/* User info */}
        <div className="flex items-center gap-2.5 pl-1">
          <Avatar
            initials={userName ? getInitials(userName) : 'US'}
            size="sm"
            variant="blue"
          />
          <div className="hidden md:block leading-tight">
            <p className="text-sm font-semibold text-neutral-900">{userName || 'Usuario'}</p>
            {roleLabel && (
              <p className="text-[11px] text-neutral-500">{roleLabel}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
