/* ───────────────────────────────────────────
   LiveClassRoom — videollamada efímera (Jitsi Meet)
   Sin grabación local, en la nube ni streaming: el
   video solo existe mientras haya gente en la sala.

   La interfaz se despega de la marca Jitsi:
   · idioma forzado a español (`lang` + defaultLanguage)
   · watermark suprimido por config y tapado por una
     placa propia, porque en el meet.jit.si público la
     marca la controla su despliegue, no nosotros
   · el chat nativo se reemplaza por un panel propio
     con MessageBubble, conectado por la API externa
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import type IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { MessageBubble } from '@/registry/new-york/ui/message-bubble';
import { Composer } from '@/registry/new-york/ui/composer';
import { Icon } from '@iconify/react';
import { APP_ICONS } from '@/lib/icons';

interface LiveClassRoomProps {
  /** Identificador único de la sala, ej. "Rumbo-Clase-X99" */
  roomName: string;
  /** Nombre mostrado del alumno o profesor actual */
  userName: string;
  /** El profesor entra con privilegios de moderador (salta la sala de espera) */
  isHost?: boolean;
  /** Se dispara cuando el usuario sale de la llamada — úsalo para redirigir */
  onLeave?: () => void;
  className?: string;
}

type RoomStatus = 'connecting' | 'live' | 'ended';

interface ChatMessage {
  id: string;
  author: string;
  body: string;
  mine: boolean;
  at: string;
}

/** Dominio público de Jitsi por defecto; sobreescribible si se autoaloja un servidor propio */
const JITSI_DOMAIN = process.env.NEXT_PUBLIC_JITSI_DOMAIN ?? 'meet.jit.si';

function shortTime(): string {
  return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function JitsiSpinner() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[var(--bg-dark)]">
      <WaveSpinner size="lg" label="Conectando a la sala…" />
      <p className="text-sm text-white/60">Conectando a la sala…</p>
    </div>
  );
}

export function LiveClassRoom({ roomName, userName, isHost = false, onLeave, className }: Readonly<LiveClassRoomProps>) {
  const [status,   setStatus]   = useState<RoomStatus>('connecting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft,    setDraft]    = useState('');
  const [unread,   setUnread]   = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const apiRef    = useRef<IJitsiMeetExternalApi | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatOpenRef = useRef(chatOpen);
  const leavingRef = useRef(false);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  const handleReadyToClose = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setStatus('ended');
    apiRef.current?.dispose?.();
    apiRef.current = null;
    onLeave?.();
  }, [onLeave]);

  /* Se enlazan los eventos de chat de la API externa para pintar los mensajes
     con MessageBubble en vez de abrir el panel nativo de Jitsi. */
  const handleApiReady = useCallback((api: IJitsiMeetExternalApi) => {
    apiRef.current = api;
    setStatus('live');

    api.executeCommand('setLanguage', 'es');
    api.on('readyToClose', handleReadyToClose);
    api.on('videoConferenceLeft', handleReadyToClose);
    api.on('toolbarButtonClicked', (event: { key?: string }) => {
      if (event?.key === 'hangup') handleReadyToClose();
    });

    api.on('incomingMessage', (e: { nick?: string; message?: string; from?: string }) => {
      if (!e?.message) return;
      setMessages((prev) => [...prev, {
        id: `${e.from ?? 'x'}-${Date.now()}-${prev.length}`,
        author: e.nick || 'Participante',
        body: e.message!,
        mine: false,
        at: shortTime(),
      }]);
      if (!chatOpenRef.current) setUnread((n) => n + 1);
    });

    /* Jitsi confirma el envío por su cuenta; se pinta desde aquí para que el
       mensaje propio aparezca una sola vez y siempre en el mismo orden. */
    api.on('outgoingMessage', (e: { message?: string }) => {
      if (!e?.message) return;
      setMessages((prev) => [...prev, {
        id: `me-${Date.now()}-${prev.length}`,
        author: userName,
        body: e.message!,
        mine: true,
        at: shortTime(),
      }]);
    });
  }, [handleReadyToClose, userName]);

  useEffect(() => {
    const api = apiRef.current;
    return () => { api?.dispose?.(); };
  }, []);

  /* Autoscroll al último mensaje */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chatOpen) return;
    const timer = window.setTimeout(() => setUnread(0), 0);
    return () => window.clearTimeout(timer);
  }, [chatOpen, messages.length]);

  /** Composer entrega el texto ya listo, no un evento de formulario. */
  const sendMessage = (message: string) => {
    const body = message.trim();
    if (!body || !apiRef.current) return;
    apiRef.current.executeCommand('sendChatMessage', body);
    setDraft('');
  };

  if (status === 'ended') {
    return (
      <div
        className={`flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-white/10 bg-[var(--bg-dark)] text-center ${className ?? ''}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <Icon icon={APP_ICONS.checkFilled} width={26} height={26} />
        </div>
        <p className="text-base font-semibold text-white">Clase finalizada</p>
        <p className="max-w-[32ch] text-sm text-white/50">
          La sesión terminó y no quedó ninguna grabación — así son todas las clases en Rumbo.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-3 lg:flex-row ${className ?? ''}`}>
      {/* ── Video ── */}
      <div
        className="relative aspect-video w-full flex-1 overflow-hidden rounded-[1.25rem] bg-[var(--bg-dark)]"
        style={{ boxShadow: '0 0 0 1px var(--glow-accent, var(--green-500)), 0 24px 48px rgba(14,26,38,0.35)' }}
      >
        <JitsiMeeting
          domain={JITSI_DOMAIN}
          roomName={roomName}
          lang="es"
          spinner={JitsiSpinner}
          userInfo={{ displayName: userName, email: '' }}
          onApiReady={handleApiReady}
          onReadyToClose={handleReadyToClose}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.width = '100%';
            iframeRef.style.height = '100%';
            iframeRef.style.border = '0';
          }}
          configOverwrite={{
            // Toda la interfaz de Jitsi en español, sin autodetección de idioma
            defaultLanguage: 'es',
            language: 'es',
            locale: 'es',
            i18n: { lng: 'es', defaultLanguage: 'es', fallbackLng: 'es' },
            notifications: [],
            // Cero grabación / streaming — el video no sobrevive a la llamada
            fileRecordingsEnabled: false,
            liveStreamingEnabled: false,
            localRecording: { enabled: false, notifyAllParticipants: false },
            recordingSharingEnabled: false,
            disableDeepLinking: true,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: !isHost,
            disableInviteFunctions: true,
            // Marca: sin logo ni promos de Jitsi
            defaultLogoUrl: '',
            hideConferenceSubject: true,
            hideConferenceTimer: false,
            /* El panel nativo de chat se oculta quitando su botón del toolbar,
               NO con `disableChat`: esa bandera apagaría también el transporte
               de mensajes del que depende el panel propio de abajo. */
            toolbarButtons: ['microphone', 'camera', 'desktop', 'raisehand', 'tileview', 'hangup'],
          }}
          interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'raisehand', 'tileview', 'hangup'],
            DEFAULT_LANGUAGE: 'es',
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            JITSI_WATERMARK_LINK: '',
            BRAND_WATERMARK_LINK: '',
            MOBILE_APP_PROMO: false,
            HIDE_INVITE_MORE_HEADER: true,
            LANG_DETECTION: false,
            DEFAULT_BACKGROUND: '#0E1A26',
            DEFAULT_REMOTE_DISPLAY_NAME: 'Participante',
            DEFAULT_LOCAL_DISPLAY_NAME: 'Tú',
          }}
        />

        {/* Placa de marca sobre la esquina del watermark. En el meet.jit.si
            público el logo lo sirve su despliegue y las banderas de config no
            siempre bastan, así que se tapa desde nuestro lado. `pointer-events-none`
            para no robarle clics a la interfaz de la llamada. */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 flex items-center gap-2 rounded-br-[1rem] bg-[var(--bg-dark)] py-2.5 pl-4 pr-5">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-[0.4375rem] text-white"
            style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-400))' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 17 L11 11 L15 14 L19 7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="19" cy="7" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-[0.8125rem] font-extrabold tracking-tight text-white">Rumbo</span>
          <span className="ml-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white/45">En vivo</span>
        </div>
      </div>

      {/* ── Chat propio ── */}
      <aside className="flex w-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--neutral-100)] bg-white lg:w-[20rem] lg:flex-shrink-0">
        <button
          type="button"
          onClick={() => setChatOpen((v) => !v)}
          className="flex items-center justify-between gap-2 border-b border-[var(--neutral-100)] px-4 py-3 text-left lg:cursor-default"
        >
          <span className="flex items-center gap-2 text-[0.875rem] font-bold text-[var(--ink)]">
            Chat de la clase
            {unread > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--green-600)] px-1.5 text-[0.6875rem] font-bold text-white">
                {unread}
              </span>
            )}
          </span>
          <span className="text-[var(--ink-muted)] lg:hidden">{chatOpen ? '▾' : '▸'}</span>
        </button>

        <div className={`${chatOpen ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col lg:flex`}>
          <div ref={scrollRef} className="flex min-h-[11.25rem] flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-3 lg:max-h-[26.25rem]">
            {messages.length === 0 ? (
              <p className="m-auto max-w-[26ch] text-center text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                Aún no hay mensajes. Escribe para saludar a la clase.
              </p>
            ) : (
              /* El MessageBubble del registry solo pinta la burbuja; el autor y
                 la hora se envuelven aquí para no modificar el componente. */
              messages.map((m) => (
                <div key={m.id} className={`flex flex-col gap-0.5 ${m.mine ? 'items-end' : 'items-start'}`}>
                  {!m.mine && (
                    <span className="px-3 text-[0.6875rem] font-semibold text-[var(--ink-muted)]">{m.author}</span>
                  )}
                  <MessageBubble message={m.body} variant={m.mine ? 'sent' : 'received'} />
                  <span className="px-3 text-[0.625rem] tabular-nums text-[var(--ink-muted)]">{m.at}</span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[var(--neutral-100)] p-2">
            <Composer
              placeholder="Escribe un mensaje…"
              value={draft}
              onChange={setDraft}
              onSubmit={sendMessage}
              disabled={status !== 'live'}
              /* Sin herramientas ni adjuntos: en una clase el chat es solo texto */
              showToolsButton={false}
              maxRows={4}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
