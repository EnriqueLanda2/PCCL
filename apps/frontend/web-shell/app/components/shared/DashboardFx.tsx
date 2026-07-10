/* ───────────────────────────────────────────
   DashboardFx — efectos de entrada e interacción
   · RevealWords: título palabra por palabra (máscara + blur)
   · RevealLetters: marca de agua letra por letra
   · CursorFx: anillo + plaquita de vidrio con física LERP
   · OpeningBook: libro CSS 3D abriéndose con páginas
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef } from 'react';

/* ── Reveal palabra por palabra ── */
export function RevealWords({
  text,
  startDelay = 0,
  step = 0.1,
}: Readonly<{ text: string; startDelay?: number; step?: number }>) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="reveal-word-mask">
            <span className="reveal-word" style={{ animationDelay: `${startDelay + i * step}s` }}>
              {word}
            </span>
          </span>
          {' '}
        </span>
      ))}
    </>
  );
}

/* ── Reveal letra por letra (marca de agua estilo wordmark) ── */
export function RevealLetters({
  text,
  startDelay = 0,
  step = 0.09,
}: Readonly<{ text: string; startDelay?: number; step?: number }>) {
  return (
    <>
      {[...text].map((char, i) => (
        <span key={`${char}-${i}`} className="reveal-letter-mask">
          <span className="reveal-letter" style={{ animationDelay: `${startDelay + i * step}s` }}>
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </>
  );
}

/* ── Cursor personalizado: anillo instantáneo + plaquita con retraso ── */
export function CursorFx() {
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const card = cardRef.current;
    if (!ring || !card) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cardX = mouseX, cardY = mouseY;   // plaquita: movimiento lento
    let ringX = mouseX, ringY = mouseY;   // anillo: instantáneo
    let isFirstMove = true;
    let scale = 0, targetScale = 0;
    let hoveringCta = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isFirstMove) {
        cardX = mouseX; cardY = mouseY;
        ringX = mouseX; ringY = mouseY;
        isFirstMove = false;
        card.classList.add('active');
        ring.classList.add('active');
      }
      if (!hoveringCta) targetScale = 1;
    };
    const onLeave = () => { targetScale = 0; };
    const onEnter = () => { if (!hoveringCta) targetScale = 1; };

    const onOver = (e: MouseEvent) => {
      const cta = (e.target as HTMLElement).closest('[data-cursor-expand]');
      if (cta && !hoveringCta) {
        hoveringCta = true;
        targetScale = 0;
        ring.classList.add('expanded');
      } else if (!cta && hoveringCta) {
        hoveringCta = false;
        targetScale = 1;
        ring.classList.remove('expanded');
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);

    const update = () => {
      // La plaquita persigue al puntero con LERP suave; el anillo va pegado
      cardX += (mouseX - cardX) * 0.08;
      cardY += (mouseY - cardY) * 0.08;
      ringX = mouseX;
      ringY = mouseY;
      scale += (targetScale - scale) * 0.15;

      const ringScale = ring.classList.contains('expanded') ? 1.6 * scale : scale;
      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring-outline" aria-hidden />
      <div ref={cardRef} className="glass-cursor-card" aria-hidden>
        <span className="cursor-card-text">
          <span className="text-ink">Sigue</span> aprendiendo!
        </span>
      </div>
    </>
  );
}

/* ── Libro abriéndose con partículas de conocimiento ── */
const PARTICLES = [
  { left: '22%', delay: 0,   symbol: '✦' },
  { left: '48%', delay: 1.1, symbol: '¶' },
  { left: '70%', delay: 2.2, symbol: '✧' },
  { left: '36%', delay: 2.9, symbol: 'a' },
];

export function OpeningBook() {
  return (
    <div className="book-scene relative h-[190px]" aria-hidden>
      <span className="book-glow" />
      <div className="book">
        {/* Mitad izquierda con renglones */}
        <div className="book-half left">
          {[26, 44, 62, 80].map((top) => (
            <span key={top} className="book-line" style={{ top: `${top}px` }} />
          ))}
        </div>
        {/* Mitad derecha con renglones */}
        <div className="book-half right">
          {[26, 44, 62, 80].map((top) => (
            <span key={top} className="book-line" style={{ top: `${top}px` }} />
          ))}
        </div>
        {/* Páginas que se pasan solas */}
        <div className="book-page" style={{ animationDelay: '0s' }} />
        <div className="book-page" style={{ animationDelay: '1.3s', background: 'linear-gradient(100deg, #fbfdf8, #eef5e8)' }} />
        <div className="book-page" style={{ animationDelay: '2.6s' }} />
      </div>
      {PARTICLES.map((p) => (
        <span
          key={p.left}
          className="knowledge-particle"
          style={{ left: p.left, bottom: '46%', animationDelay: `${p.delay}s` }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
