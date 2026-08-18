/* ───────────────────────────────────────────
   NotificationBell — campanita del header. Guarda su propia lista
   (clase que arrancó, clase cancelada, etc.), independiente de si el
   navegador dio o no permiso de push — funciona siempre.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { APP_ICONS } from '@/lib/icons';
import { api } from '@/lib/api';
import type { NotificationItem } from '@/lib/types';

const POLL_MS = 45_000;

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} d`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const poll = () => api.unreadNotificationCount().then((n) => { if (alive) setUnread(n); }).catch(() => {});
    poll();
    const timer = window.setInterval(poll, POLL_MS);
    return () => { alive = false; window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    if (!items) {
      setLoading(true);
      api.notifications().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
    }
  };

  const markRead = (id: string) => {
    setItems((prev) => prev?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? null);
    setUnread((n) => Math.max(0, n - 1));
    api.markNotificationRead(id).catch(() => {});
  };

  const markAllRead = () => {
    setItems((prev) => prev?.map((n) => ({ ...n, read: true })) ?? null);
    setUnread(0);
    api.markAllNotificationsRead().catch(() => {});
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notificaciones"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--green-50)] hover:text-[var(--green-700)]"
      >
        <Icon icon={APP_ICONS.bell} width={19} height={19} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--red-500,#E5484D)] px-1 text-[0.625rem] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notificaciones"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--neutral-100)] bg-white p-2 shadow-[0_20px_48px_rgba(23,50,77,0.18)]"
        >
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <p className="text-[0.8125rem] font-extrabold text-[var(--ink)]">Notificaciones</p>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="text-[0.75rem] font-semibold text-[var(--blue-600)] hover:text-[var(--blue-700)]">
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {loading ? (
              <p className="px-3 py-6 text-center text-[0.8125rem] text-[var(--ink-muted)]">Cargando…</p>
            ) : !items || items.length === 0 ? (
              <p className="px-3 py-6 text-center text-[0.8125rem] text-[var(--ink-muted)]">Sin notificaciones todavía.</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {items.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={`flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--green-50)] ${
                      n.read ? '' : 'bg-[#F3F8EE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[0.8125rem] font-bold text-[var(--ink)]">{n.title}</p>
                      {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--green-600)]" />}
                    </div>
                    <p className="text-[0.8125rem] leading-5 text-[var(--ink-soft)]">{n.body}</p>
                    <p className="text-[0.6875rem] text-[var(--ink-muted)]">{relativeTime(n.createdAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
