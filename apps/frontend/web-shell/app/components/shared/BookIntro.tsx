/* ───────────────────────────────────────────
   BookIntro — intro de la landing (/)
   Al abrir la app, un libro CSS se abre a
   pantalla completa; luego se va al fondo poco
   a poco (se encoge, se desenfoca y se hunde).
   Al terminar, el intro se retira por completo
   y cede el lugar a <AmbientScene3D>: un fondo
   WebGL simple y persistente, fijo detrás de
   TODA la aplicación.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { OpeningBook, RevealLetters } from './DashboardFx';
import { AmbientScene3D } from './AmbientScene3D';

const OPEN_MS   = 2100;  // tiempo con el libro abierto al frente
const RECEDE_MS = 1500;  // duración del viaje al fondo

type Phase = 'open' | 'receding' | 'ambient';

export function BookIntro() {
  const [phase, setPhase] = useState<Phase>('open');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('ambient');
      return;
    }
    const recede = setTimeout(() => setPhase('receding'), OPEN_MS);
    const settle = setTimeout(() => setPhase('ambient'), OPEN_MS + RECEDE_MS);
    return () => { clearTimeout(recede); clearTimeout(settle); };
  }, []);

  useEffect(() => {
    // Bloquea el scroll mientras el intro está al frente
    if (phase === 'open') {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [phase]);

  // Fase final: el overlay del intro se retira del todo; la escena
  // WebGL persistente (fija, muy al fondo) toma su lugar para siempre.
  if (phase === 'ambient') return <AmbientScene3D />;

  return (
    <div className={cn('book-intro-overlay', phase === 'receding' && 'receding')} aria-hidden>
      <div className="book-intro-stage">
        <div className="book-intro-book">
          <OpeningBook />
        </div>
      </div>

      <p className="book-intro-text text-[clamp(44px,6vw,72px)] font-extrabold tracking-tight text-[var(--ink)] leading-none">
        <RevealLetters text="Rumbo" startDelay={0.35} />
      </p>

      <p className="book-intro-caption text-[13px] uppercase tracking-[0.24em] font-semibold text-[var(--green-600)]">
        Abriendo tu biblioteca…
      </p>
    </div>
  );
}
