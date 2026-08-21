/* ───────────────────────────────────────────
   AIRumbo — página completa con lista de
   conversaciones estilo WhatsApp: a la izquierda una
   fila por cada conversación real (general o por
   lección), a la derecha el hilo seleccionado (mismo
   ChatThread que usa el widget flotante).
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { api, getErrorMessage } from '@/lib/api';
import type { ChatConversationSummary } from '@/lib/types';
import { ChatThread } from '@/app/components/shared/ChatThread';
import { APP_ICONS } from '@/lib/icons';

function previewTime(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

function ConversationRow({
  row, active, onClick, onDelete,
}: Readonly<{
  row: ChatConversationSummary; active: boolean;
  onClick: () => void; onDelete: () => void;
}>) {
  return (
    <div
      className="group"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem', width: '100%',
        borderRadius: '0.875rem', background: active ? 'var(--green-50)' : 'transparent',
        transition: 'background 0.12s ease',
      }}
    >
      <button
        type="button"
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0,
          padding: '0.75rem 0 0.75rem 0.875rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer',
        }}
      >
        <span
          style={{
            width: '2.5rem', height: '2.5rem', flexShrink: 0, borderRadius: '999px',
            background: row.lessonId ? 'var(--blue-100)' : 'linear-gradient(135deg, var(--green-500), var(--green-700))',
            color: row.lessonId ? 'var(--blue-700)' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon icon={row.lessonId ? APP_ICONS.book : APP_ICONS.robot} width={18} height={18} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: '0.8438rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.title}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.lastMessage}
          </p>
        </div>
        {row.lastMessageAt && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--ink-muted)', flexShrink: 0, alignSelf: 'flex-start', marginTop: '0.125rem' }}>
            {previewTime(row.lastMessageAt)}
          </span>
        )}
      </button>
      <div className="opacity-0 group-hover:opacity-100" style={{ display: 'flex', flexShrink: 0, paddingRight: '0.5rem', transition: 'opacity 0.15s ease' }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Eliminar conversación"
          title="Eliminar conversación"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red-600)', display: 'flex', padding: '0.25rem' }}
        >
          <Icon icon={APP_ICONS.trash} width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

function DeleteConversationModal({
  title, deleting, onCancel, onConfirm,
}: Readonly<{
  title: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}>) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.25rem',
        background: 'rgba(12, 24, 18, 0.26)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar eliminación de chat"
        style={{
          width: 'min(28rem, 100%)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(192, 211, 194, 0.95)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,245,0.98))',
          boxShadow: '0 30px 80px rgba(23,50,77,0.20)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.2rem 1.25rem 1rem', borderBottom: '1px solid rgba(222, 231, 221, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span
              style={{
                width: '3rem', height: '3rem', flexShrink: 0, borderRadius: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #ffe8e6, #fff1ef)', color: 'var(--red-600)',
                boxShadow: 'inset 0 0 0 1px rgba(224, 85, 65, 0.10)',
              }}
            >
              <Icon icon={APP_ICONS.trash} width={20} height={20} />
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red-600)' }}>
                Confirmar eliminación
              </p>
              <h3 style={{ marginTop: '0.15rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink)' }}>
                Eliminar este chat
              </h3>
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem 1.25rem 0.8rem' }}>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--ink-muted)' }}>
            Vas a borrar <strong style={{ color: 'var(--ink)' }}>{title}</strong>. Esta acción elimina todo el historial del chat y no se puede deshacer.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '0.95rem 1.25rem 1.2rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            style={{
              height: '2.85rem', padding: '0 1.1rem', borderRadius: '999px',
              border: '1px solid rgba(205, 216, 203, 0.95)', background: '#fff', color: 'var(--ink)',
              cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            style={{
              height: '2.85rem', padding: '0 1.15rem', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #e05541, #c7382d)', color: '#fff',
              boxShadow: '0 14px 30px rgba(199, 56, 45, 0.28)',
              cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.75 : 1,
            }}
          >
            {deleting ? 'Eliminando…' : 'Sí, eliminar chat'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AiRumboPage() {
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [newTick, setNewTick] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChatConversationSummary | null>(null);
  const [deletingConversation, setDeletingConversation] = useState(false);

  /* Autoseleccionar la conversación más reciente solo aplica ANTES de que el
     usuario haga cualquier selección explícita (clic en una fila, en "+").
     Gatear esto por "ya resolvió la primera petición" no basta: si el
     usuario pulsa "+" mientras el fetch inicial sigue en vuelo, esa
     respuesta llega después y su fallback `current ?? list[0]` pisaba la
     conversación nueva en silencio, devolviendo a la última existente. Al
     marcar la bandera en el momento del clic (no cuando resuelve la
     petición) la carrera desaparece sin importar el orden de llegada. */
  const userActed = useRef(false);

  const refresh = () => {
    api.chatConversations()
      .then((list) => {
        setConversations(list);
        if (!userActed.current) {
          setSelectedId((current) => current ?? list[0]?.id);
        }
      })
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const requestDeleteConversation = (row: ChatConversationSummary) => {
    setPickerOpen(false);
    setDeleteTarget(row);
  };

  const deleteConversation = async () => {
    if (!deleteTarget || deletingConversation) return;
    setDeletingConversation(true);
    try {
      await api.clearChatHistory(deleteTarget.id);
      setConversations((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      userActed.current = true;
      setSelectedId((current) => (current === deleteTarget.id ? undefined : current));
      setDeleteTarget(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingConversation(false);
    }
  };

  const startNewConversation = () => {
    userActed.current = true;
    setSelectedId(undefined);
    setNewTick((t) => t + 1);
    setPickerOpen(false);
  };

  const selectConversation = (id: string) => {
    userActed.current = true;
    setSelectedId(id);
    setPickerOpen(false);
  };

  const rows = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()),
    [conversations],
  );

  const activeRow = rows.find((r) => r.id === selectedId);

  /* Sin PageHeader propio: el título "AIRumbo" con su ícono ya vive arriba,
     en la barra superior (ver DashboardTopbar) — repetirlo aquí abajo era
     un encabezado duplicado y le robaba alto al panel de chat. */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: 'calc(100vh - 6.5rem)', minHeight: 0, overflow: 'hidden' }}>
      {error && <p style={{ fontSize: '0.8125rem', color: 'var(--red-600)' }}>{error}</p>}

      <div
        style={{
          position: 'relative', display: 'flex', flex: 1, minHeight: 0,
          border: '1px solid var(--neutral-100)', borderRadius: '1.25rem', background: 'var(--panel)',
          overflow: 'hidden', boxShadow: '0 2px 10px rgba(23,50,77,0.05)',
        }}
      >
        {deleteTarget && (
          <DeleteConversationModal
            title={deleteTarget.title}
            deleting={deletingConversation}
            onCancel={() => {
              if (deletingConversation) return;
              setDeleteTarget(null);
            }}
            onConfirm={() => void deleteConversation()}
          />
        )}

        {pickerOpen && (
          <button
            type="button"
            aria-label="Cerrar lista de conversaciones"
            onClick={() => setPickerOpen(false)}
            style={{
              position: 'absolute', inset: 0, border: 'none', background: 'rgba(12, 24, 18, 0.16)',
              backdropFilter: 'blur(2px)', cursor: 'pointer', zIndex: 10,
            }}
          />
        )}

        <div style={{ position: 'absolute', top: '0.35rem', left: '1rem', zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            aria-expanded={pickerOpen}
            aria-haspopup="dialog"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              height: '3.25rem',
              /* Antes era minWidth:'21rem' + maxWidth:'min(24rem, calc(100vw - 18rem))'.
                 Con viewport < 39rem (21+18) el min ganaba sobre el max — así se
                 resuelven los conflictos min/max — y el botón se quedaba forzado a
                 336px de ancho. En un teléfono de 412px eso empujaba el botón "+"
                 de al lado 12.6px fuera de la pantalla, sin forma de tocarlo.
                 Un solo width con min() nunca puede entrar en conflicto consigo
                 mismo: topa en 21rem en desktop y encoge en cualquier viewport más
                 angosto, dejando siempre el hueco exacto para el 1rem de margen
                 izquierdo, el botón "+" (2.85rem), su gap (0.625rem) y otro 1rem de
                 respiro a la derecha. */
              width: 'min(21rem, calc(100vw - 1rem - 2.85rem - 0.625rem - 1rem))',
              padding: '0 1.1rem', borderRadius: '999px', border: '1px solid rgba(87, 132, 94, 0.18)',
              background: 'rgba(255,255,255,0.94)', color: 'var(--ink)',
              boxShadow: '0 10px 22px rgba(23,50,77,0.08)', cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '2.1rem', height: '2.1rem', borderRadius: '999px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', color: '#fff',
              }}
            >
              <Icon icon={APP_ICONS.robot} width={16} height={16} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-700)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.05 }}>
                Chats
              </span>
              <span style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', maxWidth: '14.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.15 }}>
                {activeRow?.title ?? 'Nueva conversación'}
              </span>
            </span>
            <span style={{ flex: 1, minWidth: '0.5rem' }} />
            <Icon icon={pickerOpen ? APP_ICONS.chevronUp : APP_ICONS.chevronDown} width={20} height={20} style={{ color: 'var(--ink-muted)', flexShrink: 0 }} />
          </button>

          <button
            type="button"
            onClick={startNewConversation}
            aria-label="Nueva conversación"
            title="Nueva conversación"
            style={{
              width: '2.85rem', height: '2.85rem', borderRadius: '999px', border: 'none',
              background: 'var(--green-600)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 10px 22px rgba(31,154,75,0.16)',
            }}
          >
            <Icon icon={APP_ICONS.newChat} width={17} height={17} />
          </button>
        </div>

        {pickerOpen && (
          <div
            role="dialog"
            aria-label="Lista de conversaciones"
            style={{
              position: 'absolute', top: '4.15rem', left: '1rem', width: '22rem', maxWidth: 'calc(100% - 2rem)',
              maxHeight: 'min(32rem, calc(100% - 5.4rem))',
              border: '1px solid rgba(87, 132, 94, 0.16)', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.98)',
              boxShadow: '0 26px 60px rgba(23,50,77,0.18)', overflow: 'hidden', zIndex: 20,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ padding: '0.95rem 1rem 0.8rem', borderBottom: '1px solid var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.9063rem', fontWeight: 700, color: 'var(--ink)' }}>Conversaciones</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{rows.length} chats guardados</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Cerrar"
                style={{ background: 'none', border: 'none', display: 'flex', color: 'var(--ink-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <Icon icon={APP_ICONS.close} width={18} height={18} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: 'calc(min(32rem, 100vh - 12rem) - 4rem)' }}>
              {loading ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', padding: '0.75rem' }}>Cargando…</p>
              ) : rows.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', padding: '0.75rem' }}>
                  Aún no tienes conversaciones. Escribe algo para empezar.
                </p>
              ) : (
                rows.map((row) => (
                  <ConversationRow
                    key={row.id}
                    row={row}
                    active={row.id === selectedId}
                    onClick={() => selectConversation(row.id)}
                    onDelete={() => requestDeleteConversation(row)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Hilo seleccionado ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ChatThread
            key={selectedId ?? `new-${newTick}`}
            conversationId={selectedId}
            autoResume={false}
            onConversationCreated={(id) => {
              userActed.current = true;
              setSelectedId(id);
              setPickerOpen(false);
              refresh();
            }}
            onActivity={refresh}
            showNewConversationButton={false}
            title=""
            subtitle={undefined}
            headerStyle="flush"
          />
        </div>
      </div>
    </div>
  );
}
