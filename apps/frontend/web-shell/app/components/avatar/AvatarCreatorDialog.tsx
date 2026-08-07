'use client';

import { useEffect, useRef } from 'react';
import { Modal } from '@/app/components/ui/Modal';
import {
  RPM_CREATOR_ORIGIN,
  RPM_SUBSCRIBE_MESSAGE,
  buildCreatorUrl,
  parseFrameEvent,
} from '@/lib/avatar/provider';

interface AvatarCreatorDialogProps {
  open: boolean;
  onClose: () => void;
  onExported: (url: string) => void;
}

/**
 * Creador de Ready Player Me embebido.
 *
 * Se implementa el iframe directamente en vez de usar su SDK de React porque
 * ese paquete arrastra `@readyplayerme/visage`, que fija three 0.166 y
 * @react-three/fiber 8 — incompatibles con three 0.185 y React 19 de este
 * proyecto. El protocolo es un postMessage sencillo y aquí queda bajo control,
 * incluida la validación de origen.
 */
export function AvatarCreatorDialog({ open, onClose, onExported }: Readonly<AvatarCreatorDialogProps>) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) return;

    const onMessage = (event: MessageEvent) => {
      /* parseFrameEvent descarta cualquier mensaje que no venga del origen
         esperado y con la forma esperada. */
      const parsed = parseFrameEvent(event);
      if (!parsed) return;

      if (parsed.eventName === 'v1.frame.ready') {
        frameRef.current?.contentWindow?.postMessage(RPM_SUBSCRIBE_MESSAGE, RPM_CREATOR_ORIGIN);
        return;
      }
      if (parsed.eventName === 'v1.avatar.exported' && parsed.data?.url) {
        onExported(parsed.data.url);
        onClose();
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [open, onExported, onClose]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Crear tu avatar"
      description="Diseña tu personaje y se aplicará al editor al terminar."
      className="max-w-4xl"
    >
      <iframe
        ref={frameRef}
        title="Creador de avatar"
        src={buildCreatorUrl({ clearCache: false })}
        allow="camera *; microphone *; clipboard-write"
        className="h-[70vh] w-full rounded-[0.75rem] border border-[var(--neutral-200)]"
      />
    </Modal>
  );
}
