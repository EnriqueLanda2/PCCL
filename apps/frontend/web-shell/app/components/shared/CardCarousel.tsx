/* ───────────────────────────────────────────
   CardCarousel — carrusel de tarjetas horizontal
   Fila de tarjetas con scroll-snap (varias visibles
   a la vez, con "peek" de la siguiente), flechas de
   navegación y entrada escalonada.

   Cada tarjeta se inclina siguiendo al puntero y se
   puede girar con un clic para ver más detalle en el
   reverso — la misma mecánica holográfica que
   CertificateHoloCard (mismas clases .holo-*), solo
   que aquí sin el sello de verificación/QR.
   ─────────────────────────────────────────── */

'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { cn } from '@/lib/cn';
import { ProgressBar } from '@/app/components/ui/ProgressBar';

export interface CardCarouselItem {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
  /** Clase de gradiente ya definida (p. ej. cover-1..6) para el encabezado */
  coverClass?: string;
  /** Estilo inline alternativo para el encabezado (gradientes ad-hoc) */
  coverStyle?: CSSProperties;
  /** Portada real (Cloudinary) — si está presente, reemplaza el gradiente/ícono */
  coverImageUrl?: string;
  icon?: ReactNode;
  progress?: number;
  href?: string;
  /** Si se provee (en vez de href), la tarjeta no navega — solo notifica la selección */
  onSelect?: () => void;
  linkLabel?: string;
}

function CardLink({ item }: Readonly<{ item: CardCarouselItem }>) {
  if (!item.href && !item.onSelect) return null;

  const inner = (
    <>
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[0.375rem] bg-[var(--green-500)] text-white transition-transform group-hover:translate-x-0.5">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {item.linkLabel ?? 'Ver más'}
    </>
  );

  const className = 'mt-auto inline-flex w-fit items-center gap-2 pt-2.5 text-[0.8125rem] font-semibold text-[var(--green-700)] no-underline';
  const linkSx = {
    mt: 'auto',
    width: 'fit-content',
    minWidth: 0,
    justifyContent: 'flex-start',
    gap: 1,
    pt: 1.25,
    p: 0,
    color: 'var(--green-700)',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.4,
    textTransform: 'none',
    '&:hover': { bgcolor: 'transparent', color: 'var(--green-800)' },
  };

  if (item.onSelect) {
    return (
      <Button
        onClick={(e) => { e.stopPropagation(); item.onSelect!(); }}
        variant="text"
        disableRipple
        className="group"
        sx={linkSx}
      >
        {inner}
      </Button>
    );
  }

  return (
    <Link href={item.href!} onClick={(e) => e.stopPropagation()} className={className}>
      {inner}
    </Link>
  );
}

/**
 * Tarjeta holográfica de curso — tilt al mover el mouse, se voltea con un clic
 * para ver el reverso. Usada tanto en el carrusel horizontal (Tu contenido)
 * como en grids (p. ej. Mis cursos) vía la prop `fluid`.
 *
 * `active` la fija CardCarousel según qué tarjeta queda al centro del track;
 * queda `undefined` en usos tipo grid (`fluid`), donde "centro" no aplica.
 */
export function CourseHoloCard({
  item,
  fluid = false,
  active,
  flipped: flippedProp,
  onToggleFlip,
  onHoverEnter,
  onHoverLeave,
}: Readonly<{
  item: CardCarouselItem;
  fluid?: boolean;
  active?: boolean;
  /** CardCarousel las controla (una sola abierta a la vez) pasando `flipped` +
      `onToggleFlip`; sin ellas la tarjeta administra su propio flip (grids `fluid`). */
  flipped?: boolean;
  onToggleFlip?: () => void;
  /** CardCarousel las usa para enfocar esta tarjeta con solo pasar el cursor
      — sin clic — y para soltar el enfoque al salir. */
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
}>) {
  const inCarousel = active !== undefined;
  const [localFlipped, setLocalFlipped] = useState(false);
  const flipped = flippedProp ?? localFlipped;
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 14;
    const rotX = (0.5 - py) * 10;
    el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    el.style.setProperty('--hx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--hy', `${(py * 100).toFixed(1)}%`);
  }, []);

  const handleLeave = useCallback(() => {
    const el = tiltRef.current;
    if (el) el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }, []);

  /* Dos modos, nunca los dos a la vez: si el contenedor controla el volteo
     (carrusel, que solo admite una tarjeta abierta) manda `onToggleFlip`; si no
     —grids `fluid`, o un carrusel de una sola tarjeta— la tarjeta se administra
     sola. `flipped = flippedProp ?? localFlipped` garantiza que la rama que no
     se usa quede ignorada, así que esto no puede togglear dos veces.

     `onToggleFlip` es opcional: llamarlo sin comprobar revienta en el grid de
     calificaciones y en el carrusel de una sola tarjeta. */
  const toggleFlip = useCallback(() => {
    if (onToggleFlip) onToggleFlip();
    else setLocalFlipped((f) => !f);
  }, [onToggleFlip]);

  return (
    <div
      data-carousel-card
      /* En este wrapper (no en holo-scene, que se encoge 6% cuando está
         inactiva) para que el área de hover cubra toda la tarjeta tal como
         se ve, sin el margen muerto que deja el scale-down cerca de los bordes. */
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      /* El toque es el "hover" del móvil: sin esto, tocar una tarjeta no la
         enfocaba y el carrusel seguía avanzando por debajo. pointerdown vale
         para dedo y ratón; en ratón solo repite lo que ya hizo mouseenter. */
      onPointerDown={onHoverEnter}
      className={fluid ? 'w-full animate-fade-in' : 'w-[14.75rem] flex-shrink-0 snap-center animate-fade-in sm:w-[16.25rem]'}
    >
      {/* El scale/opacity de "activa" vive en holo-scene, no en el wrapper de
          arriba — así el wrapper conserva su tamaño de layout tal cual y el
          texto "Gira para ver más" no se mueve. El bleed del scale lo absorbe
          el padding vertical del track (ver .card-carousel-track). */}
      <div
        className={cn(
          'holo-scene relative',
          inCarousel && 'transition-all duration-300 ease-out',
          inCarousel && (active ? 'scale-[1.05] opacity-100 z-10 holo-scene-active' : 'scale-[0.94] opacity-60'),
        )}
      >
        <div ref={tiltRef} className="holo-tilt" onPointerMove={handleMove} onPointerLeave={handleLeave}>
          <Tooltip
            title={flipped ? 'Clic para volver al frente' : 'Clic para ver los detalles del curso'}
            placement="top"
            arrow
            enterDelay={400}
            enterTouchDelay={400}
            slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -8] } }] } }}
          >
          <div
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Ver frente de la tarjeta' : 'Girar para ver más detalle'}
            onClick={toggleFlip}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); } }}
            className={cn('holo-flipper h-[26.25rem] cursor-pointer outline-none', flipped && 'is-flipped')}
          >
            {/* ── Frente ── */}
            <div className="holo-face group relative flex h-[26.25rem] flex-col overflow-hidden rounded-[1.25rem] border border-[#E4EBDD] bg-white shadow-[0_10px_28px_rgba(23,50,77,0.06)]">
              <div className={cn(item.coverImageUrl ? 'bg-neutral-200' : [item.coverClass, 'cover-pattern'], 'relative flex h-[9.375rem] w-full flex-shrink-0 items-center justify-center overflow-hidden')} style={item.coverStyle}>
                {item.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="relative z-[1]">{item.icon}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 overflow-hidden p-5">
                {item.eyebrow && (
                  <span className="line-clamp-1 flex-shrink-0 text-[0.6563rem] font-bold uppercase tracking-[0.18em] text-[var(--green-600)]">
                    {item.eyebrow}
                  </span>
                )}
                <h3 className="line-clamp-2 flex-shrink-0 font-serif text-[1rem] leading-snug text-[var(--ink)]">{item.title}</h3>
                <p className="line-clamp-2 text-[0.8125rem] leading-6 text-[var(--ink-soft)]">{item.description}</p>
                {typeof item.progress === 'number' && (
                  <div className="mt-0.5 flex items-center gap-2.5">
                    <ProgressBar value={item.progress} color="green" className="flex-1" />
                    <span className="text-[0.6875rem] font-semibold text-[var(--ink-muted)]">{item.progress}%</span>
                  </div>
                )}
                <CardLink item={item} />
              </div>
              <span className="holo-shine" aria-hidden />
            </div>

            {/* ── Reverso ── */}
            <div className="holo-face holo-face-back group flex h-[26.25rem] flex-col overflow-hidden rounded-[1.25rem] border border-[#E4EBDD] bg-white p-5 shadow-[0_10px_28px_rgba(23,50,77,0.06)]">
              <div className="flex flex-shrink-0 items-center justify-between">
                <span
                  className={cn(item.coverImageUrl ? 'bg-neutral-200' : item.coverClass, 'relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[0.75rem] text-[1.625rem]')}
                  style={item.coverStyle}
                >
                  {item.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    item.icon
                  )}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[var(--ink-muted)]">
                  <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {item.eyebrow && (
                <span className="mt-3 line-clamp-1 flex-shrink-0 text-[0.6563rem] font-bold uppercase tracking-[0.18em] text-[var(--green-600)]">
                  {item.eyebrow}
                </span>
              )}
              <h3 className="mt-1 line-clamp-2 flex-shrink-0 font-serif text-[1rem] leading-snug text-[var(--ink)]">{item.title}</h3>
              <p className="mt-2 line-clamp-4 flex-1 text-[0.8125rem] leading-6 text-[var(--ink-soft)]">{item.description}</p>
              <CardLink item={item} />
              <span className="holo-shine" aria-hidden />
            </div>
          </div>
          </Tooltip>
        </div>
      </div>
      <p className="mt-2 select-none text-center text-[0.6875rem] text-[var(--ink-muted)]">ver más ↻</p>
    </div>
  );
}

/** Estilo compartido por las flechas; se atenúan y dejan de responder en el extremo correspondiente en vez de quedar en un estado ambiguo de "no pasa nada". */
function arrowSx(disabled: boolean, side: 'left' | 'right') {
  return {
    position: 'absolute' as const,
    /* El padding lateral del contenedor (position:relative, ver el JSX) NO
       reduce el área de este `left`/`right` — offsets de un absolute se miden
       contra el borde completo del ancestro, no contra su padding-box. Por
       eso este valor es chico y positivo (8px desde el borde real de la
       pantalla): con los 3.5rem de padding de acá arriba sobra hueco de
       sobra antes de que empiece la primera tarjeta. */
    [side]: '0.5rem',
    top: '36%',
    display: 'flex',
    minWidth: 40,
    width: 40,
    height: 40,
    transform: 'translateY(-50%)',
    borderRadius: '999px',
    borderColor: '#E4EBDD',
    bgcolor: '#fff',
    color: disabled ? 'var(--ink-muted)' : 'var(--ink)',
    opacity: disabled ? 0.45 : 1,
    fontSize: 20,
    lineHeight: 1,
    boxShadow: '0 8px 20px rgba(23,50,77,0.12)',
    '&:hover': disabled ? undefined : {
      borderColor: 'var(--blue-400)',
      bgcolor: '#fff',
      color: 'var(--blue-600)',
      boxShadow: '0 10px 24px rgba(23,50,77,0.16)',
    },
  };
}

/** Cada cuánto avanza el autoplay. Se reinicia cada vez que el usuario mueve el carrusel a mano (scroll o flechas). */
const AUTOPLAY_MS = 1000;
/** Cuánto debe descansar el cursor sobre una tarjeta antes de que el enfoque cambie a ella. */
const HOVER_FOCUS_DELAY_MS = 500;

export function CardCarousel({ items }: Readonly<{ items: CardCarouselItem[] }>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  /** Puntero encima (ratón). */
  const [hovered, setHovered] = useState(false);
  /** Índice bajo el cursor — el enfoque lo sigue tras HOVER_FOCUS_DELAY_MS,
      sin depender de que el scroll de centrado termine de asentarse. */
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  /** Índice de la única tarjeta que puede tener el reverso abierto a la vez. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* Tarjeta activa = la más cercana al centro visible del track, recalculada
     en cada scroll/resize. Mismo listener que las flechas para no duplicar
     trabajo por frame. */
  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);

    const cards = track.querySelectorAll<HTMLElement>('[data-carousel-card]');
    if (cards.length === 0) return;
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateState();
    });
  }, [updateState]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateState();
    /* En captura y sobre el track, no en el contenedor: así el gesto se
       registra aunque algún hijo detenga la propagación. Cubre dedo y ratón
       con el mismo par de eventos. */
    /* Corta en seco el scroll suave que el autoplay pudiera tener en vuelo.
       Sin esto, la tarjeta sigue desplazándose bajo el dedo mientras se
       completa el gesto: se acaba abriendo una que ya iba de salida y
       centrarla arrastra el carrusel HACIA ATRÁS, que es justo el salto a
       "la tarjeta previa" que se veía. Un scrollTo a la posición actual con
       behavior instantáneo aborta la animación en curso.
       En captura y sobre el track, no en el contenedor: así se registra aunque
       algún hijo detenga la propagación. */
    const down = () => track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
    track.addEventListener('pointerdown', down, { passive: true, capture: true });
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      track.removeEventListener('pointerdown', down, { capture: true });
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [items.length, onScroll, updateState]);

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-carousel-card]');
    const step = (card?.offsetWidth ?? 260) + 20;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  /** Centra la tarjeta `i` — se dispara al abrir su reverso (para que "activa"
      siga siempre a la que muestra detalle) y en cada paso del autoplay. */
  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelectorAll<HTMLElement>('[data-carousel-card]')[i];
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
    /* Destino ABSOLUTO, no un scrollBy relativo: si ya hay una animación en
       vuelo, un desplazamiento relativo se suma a donde la animación vaya a
       terminar y el resultado depende del navegador. scrollLeft + delta, leídos
       en el mismo instante, siempre dan la posición exacta que centra la
       tarjeta. */
    track.scrollTo({ left: track.scrollLeft + delta, behavior: 'smooth' });
  }, []);

  /** Abrir una tarjeta cierra cualquier otra que estuviera abierta — solo una a la vez. */
  const handleToggleFlip = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  /** Enfocar por hover es inmediato. Cancela cualquier "vuelta al centro"
      pendiente — si el cursor ya está sobre otra tarjeta, no hace falta
      esperar a que esa vuelta se complete.

      Solo mueve el ENFOQUE, nunca el scroll. Centrar la tarjeta señalada
      provocaba un bucle: al deslizarse las tarjetas bajo un cursor quieto,
      otra quedaba debajo y disparaba su propio hover, que volvía a centrar…
      El carrusel se iba solo mientras el usuario intentaba mirar una tarjeta,
      que es justo lo contrario de "con hover se mantiene en la card". */
  const focusOnHover = useCallback((i: number) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoverIndex(i);
  }, []);

  /** Al salir el cursor, el enfoque espera HOVER_FOCUS_DELAY_MS antes de
      volver al centro — así pasar el mouse por un hueco entre tarjetas
      (o hacia otra) no lo hace parpadear de vuelta al medio en el camino. */
  const scheduleReturnToCenter = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      hoverTimerRef.current = null;
      setHoverIndex(null);
    }, HOVER_FOCUS_DELAY_MS);
  }, []);

  useEffect(() => () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  /* Al abrirse una tarjeta (openIndex cambia a un índice válido), se centra.
     Vive en un efecto aparte — nunca dentro del updater de setOpenIndex — para
     no repetir el error de "setState durante el render de otro componente". */
  useEffect(() => {
    if (openIndex !== null) scrollToIndex(openIndex);
  }, [openIndex, scrollToIndex]);

  /* Única fuente de verdad de por qué el carrusel deja de avanzar solo.

     Las tres razones son las que pidió el diseño:
      · detalles abiertos → la tarjeta se queda enfocada hasta que se cierren
        o se abran los de otra (openIndex ya es exclusivo: solo una a la vez);
      · puntero encima → se queda en esa tarjeta y el enfoque pasa a ella;
      · dedo apoyado → el equivalente táctil de lo anterior, porque en una
        pantalla sin ratón el hover nunca ocurre.

     Con una sola tarjeta no hay nada que rotar. */
  /* Sin equivalente táctil del hover: en móvil, tocar una tarjeta sin abrir
     sus detalles NO pausa el autoplay — solo lo hace abrir el reverso
     (openIndex). Es una decisión explícita del usuario, no un descuido. */
  const paused = items.length <= 1 || openIndex !== null || hovered;

  /* Autoplay: avanza en loop. Se reprograma cada vez que activeIndex se
     asienta (manual o automático), así que mover el carrusel a mano reinicia
     la cuenta en vez de competir con el temporizador.

     Las tres razones para detenerlo viven juntas acá arriba a propósito:
     antes estaban repartidas entre banderas distintas y era imposible saber
     qué lo frenaba en táctil — de hecho, en táctil no lo frenaba nada. */
  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => {
      scrollToIndex((activeIndex + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [activeIndex, items.length, paused, scrollToIndex]);

  if (items.length === 0) return null;

  /* Una sola tarjeta enfocada a la vez, en orden de prioridad: la que tiene
     el reverso abierto > la que está bajo el cursor (tras el delay de hover)
     > la más cercana al centro. */
  const focusIndex = openIndex ?? hoverIndex ?? activeIndex;

  return (
    <div
      className="relative"
      /* Se sale del contenedor angosto del padre (que tiene su propio padding
         lateral) para ocupar el 100% del ancho de pantalla — el padding de
         acá abajo es el que de verdad manda cuánto respiran las tarjetas Y
         deja hueco fijo a los lados para las flechas, en vez de que floten
         encima de la primera/última tarjeta como pasaba antes. */
      style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', padding: '0 3.5rem' }}
      /* Solo ratón. El equivalente táctil (dedo apoyado) se escucha en captura
         sobre el track — ver el efecto de listeners más arriba. */
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={trackRef} className="card-carousel-track scrollbar-hide flex snap-x snap-mandatory items-start gap-5 overflow-x-auto scroll-smooth px-1 py-6">
        {items.map((item, i) => (
          <CourseHoloCard
            key={item.id}
            item={item}
            active={items.length > 1 ? i === focusIndex : undefined}
            flipped={items.length > 1 ? i === openIndex : undefined}
            onToggleFlip={items.length > 1 ? () => handleToggleFlip(i) : undefined}
            onHoverEnter={items.length > 1 ? () => focusOnHover(i) : undefined}
            onHoverLeave={items.length > 1 ? () => scheduleReturnToCenter() : undefined}
          />
        ))}
      </div>

      {items.length > 1 && (
        <>
          <Button
            aria-label="Anterior"
            aria-disabled={atStart}
            onClick={() => !atStart && scrollByCards(-1)}
            variant="outlined"
            sx={arrowSx(atStart, 'left')}
          >
            ‹
          </Button>
          <Button
            aria-label="Siguiente"
            aria-disabled={atEnd}
            onClick={() => !atEnd && scrollByCards(1)}
            variant="outlined"
            sx={arrowSx(atEnd, 'right')}
          >
            ›
          </Button>
        </>
      )}
    </div>
  );
}
