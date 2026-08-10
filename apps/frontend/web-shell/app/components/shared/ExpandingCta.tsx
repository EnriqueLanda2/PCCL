/* ───────────────────────────────────────────
   ExpandingCta — CTA final de la landing, "pineado"
   con scroll: apenas asoma en pantalla empieza a
   crecer (margen, radio y alto interpolados según
   cuánto se acercó su borde superior al top del
   viewport); al llegar arriba queda fijo a pantalla
   completa mientras el usuario sigue scrolleando
   ~HOLD_PX, y luego encoge de vuelta a su tamaño de
   tarjeta original en otros SHRINK_PX antes de soltar
   el scroll normal (donde sigue el Footer).

   Mecánica: un solo `position:sticky` continuo durante
   crecer+aguantar+encoger (nunca se alterna a mano entre
   sticky/relative — el navegador decide solo cuándo
   soltarla, que por spec es SIEMPRE sin salto porque en
   ese instante la posición de flujo normal coincide con
   la posición pineada). Un spacer FIJO (no depende del
   alto animado) le da a la sección ese margen de sobra.
   Como wrapperHeight = seccionAltura + spacerFijo, cuánto
   dura pineada (wrapperHeight - seccionAltura = spacerFijo)
   es constante pase lo que pase con el alto animado — así
   nunca compite consigo misma.

   El progreso 0↔1 objetivo sale de getBoundingClientRect()
   del wrapper. Con un scroll rápido (flick de trackpad,
   rueda del mouse) la posición puede saltar cientos de
   píxeles entre dos eventos de scroll — si `progress`
   siguiera ese objetivo al vuelo, la animación completa
   podía "saltarse" sin llegar a verse. Por eso lo que se
   pinta (`progress`) persigue al objetivo con una inercia
   (ease-hacia-el-objetivo en un loop de rAF que se mantiene
   corriendo mientras haya diferencia), no lo iguala de
   golpe: así siempre se alcanza a ver crecer/encoger, sin
   importar qué tan rápido se scrolleó.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { appRoutes } from '@/lib/routes';

/** Cuánto scroll queda pineado a pantalla completa antes de empezar a encoger. */
const HOLD_PX = 200;
/** Distancia de scroll sobre la que encoge de vuelta a su tamaño original. */
const SHRINK_PX = 260;
/** Qué tan rápido `progress` alcanza al objetivo cada frame (0-1, más alto = más directo). */
const EASE = 0.15;
/** Debajo de esto se considera "ya llegó" y se corta el loop de inercia. */
const SETTLE_EPSILON = 0.002;

interface Metrics {
  marginXPx: number;
  marginYPx: number;
  radiusPx: number;
  naturalHeightPx: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ExpandingCta() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  /** A dónde debería estar `progress` ahora mismo, según el scroll real. */
  const targetRef = useRef(0);
  /** Lo que de verdad se está pintando — persigue a targetRef con inercia. */
  const displayedRef = useRef(0);
  const animRafRef = useRef<number | null>(null);
  const firstRunRef = useRef(true);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      /* setState se difiere un frame (mismo patrón que Reveal.tsx) para no
         llamarlo síncronamente en el cuerpo del efecto. */
      const raf = requestAnimationFrame(() => setReduced(true));
      return () => cancelAnimationFrame(raf);
    }

    /* Tamaño "de tarjeta" de referencia — se mide una sola vez al montar,
       antes de que el scroll empiece a mover `progress`. */
    const section = sectionRef.current;
    if (section) {
      const cs = window.getComputedStyle(section);
      setMetrics({
        marginXPx: parseFloat(cs.marginLeft) || 0,
        marginYPx: parseFloat(cs.marginTop) || 0,
        radiusPx: parseFloat(cs.borderRadius) || 0,
        naturalHeightPx: section.getBoundingClientRect().height,
      });
    }

    /** Recalcula el objetivo a partir del scroll real — no toca `progress`. */
    const computeTarget = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;

      let p: number;
      if (rect.top > 0) {
        /* Todavía se acerca por abajo — crece con el scroll natural. */
        p = Math.min(1, Math.max(0, 1 - rect.top / vh));
      } else {
        /* Ya está pineada en top:0 — cuánto de HOLD_PX+SHRINK_PX ya se scrolleó.
           El spacer es fijo (ver JSX), así que este tope nunca se mueve por
           culpa del propio alto animado. */
        const stuckPx = Math.min(HOLD_PX + SHRINK_PX, -rect.top);
        p = stuckPx <= HOLD_PX ? 1 : 1 - Math.min(1, (stuckPx - HOLD_PX) / SHRINK_PX);
      }
      targetRef.current = p;
    };

    /** Acerca `displayed` a `target` un paso por frame; se detiene solo al alcanzarlo. */
    const tick = () => {
      const target = targetRef.current;
      const diff = target - displayedRef.current;
      if (Math.abs(diff) < SETTLE_EPSILON) {
        displayedRef.current = target;
        setProgress(target);
        animRafRef.current = null;
        return;
      }
      displayedRef.current += diff * EASE;
      setProgress(displayedRef.current);
      animRafRef.current = requestAnimationFrame(tick);
    };

    const ensureAnimating = () => {
      if (animRafRef.current === null) animRafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      computeTarget();
      /* Primera medición (o resize): salta directo, sin inercia — no hay
         "scroll rápido" que compensar todavía, solo el estado inicial real. */
      if (firstRunRef.current) {
        firstRunRef.current = false;
        displayedRef.current = targetRef.current;
        setProgress(targetRef.current);
        return;
      }
      ensureAnimating();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
    };
  }, []);

  const animated: CSSProperties | undefined = metrics
    ? {
        marginLeft: lerp(metrics.marginXPx, 0, progress),
        marginRight: lerp(metrics.marginXPx, 0, progress),
        marginTop: lerp(metrics.marginYPx, 0, progress),
        marginBottom: lerp(metrics.marginYPx, 0, progress),
        borderRadius: lerp(metrics.radiusPx, 0, progress),
        height: lerp(metrics.naturalHeightPx, window.innerHeight, progress),
      }
    : undefined;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'flow-root' }}>
      <section
        ref={sectionRef}
        style={{
          margin: '52px clamp(20px, 4vw, 48px)',
          padding: 'clamp(32px, 4.5vw, 68px)',
          borderRadius: '1.5rem',
          background: 'linear-gradient(135deg, var(--green-700), var(--blue-900))',
          color: 'var(--panel)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
          gap: '2.25rem',
          alignItems: 'center',
          alignContent: 'center',
          position: reduced ? 'relative' : 'sticky',
          top: 0,
          overflow: 'hidden',
          ...animated,
        }}
      >
        <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '22.5rem', height: '22.5rem', background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 60%)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '0.6563rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--blue-300)' }}>Comienza hoy</span>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px,2.6vw,34px)', color: 'var(--panel)', margin: '10px 0 13px', fontWeight: 800 }}>
            Tu próxima cohorte te <span style={{ color: 'var(--green-300)' }}>está esperando.</span>
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '1.375rem', fontSize: '0.9063rem' }}>Crea tu cuenta gratis. Sin tarjeta. Sin pelusa.</p>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Link href={appRoutes.register} style={{ display: 'inline-flex', alignItems: 'center', height: '2.75rem', padding: '0 24px', borderRadius: '999px', background: 'var(--green-300)', color: 'var(--green-900)', fontSize: '0.875rem', fontWeight: 500 }}>
              Crear cuenta
            </Link>
            <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', height: '2.75rem', padding: '0 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--panel)', fontSize: '0.875rem' }}>
              Ver catálogo
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', borderRadius: '0.875rem', padding: '1.1875rem', transform: 'rotate(-2deg)', boxShadow: 'var(--sh-3)', width: '14.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8125rem' }}>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--blue-600)' }}>Hoy</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--ink-muted)' }}>10:42</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', lineHeight: 1.3, marginBottom: '0.8125rem', color: 'var(--ink)' }}>
              &ldquo;Camila terminó su quiz con 95 puntos.&rdquo;
            </div>
            <div style={{ display: 'flex', gap: '0.4375rem', alignItems: 'center' }}>
              <div style={{ width: '1.6875rem', height: '1.6875rem', borderRadius: '50%', background: 'var(--green-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6563rem', fontWeight: 600, color: 'var(--green-900)' }}>CR</div>
              <div style={{ fontSize: '0.7188rem', color: 'var(--ink-muted)' }}>Camila Ríos · Visualización de datos</div>
            </div>
          </div>
        </div>
      </section>
      {!reduced && <div aria-hidden style={{ height: HOLD_PX + SHRINK_PX }} />}
    </div>
  );
}
