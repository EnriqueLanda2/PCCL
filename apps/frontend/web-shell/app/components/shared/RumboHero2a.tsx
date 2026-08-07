/* ───────────────────────────────────────────
   RumboHero2a — recreación de la sección "2a"
   (Dashboard vivo) del handoff de diseño: topbar +
   hero con carrusel de destacados + ticker + carrusel
   de cursos + estadísticas animadas. Un solo bloque,
   consciente de sesión (sesionActiva) para adaptar
   textos, CTAs y las tarjetas de curso (progreso vs.
   temario).
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { appRoutes } from '@/lib/routes';
import { CardCarousel, type CardCarouselItem } from '@/app/components/shared/CardCarousel';

export interface FeaturedSlideItem {
  id: string;
  titulo: string;
  nivel: string;
  tono: string;
  desc: string;
  href: string;
}

interface RumboHero2aProps {
  sesionActiva?: boolean;
  userName?: string;
  /** Tarjetas del carrusel "Continúa aprendiendo" — reusa CardCarousel/CourseHoloCard tal cual */
  courses: CardCarouselItem[];
  destacados: FeaturedSlideItem[];
  stats: { est: number; cur: number; fin: number };
}

const TICKER_ITEMS = ['Interfaces accesibles', 'Evaluaciones que enseñan', 'Diseño de temarios', 'Clases en vivo', 'Certificados verificables'];
const SANS = "'Manrope', ui-sans-serif, system-ui, sans-serif";
const DISPLAY = "'Sora', ui-sans-serif, system-ui, sans-serif";

function useCountUp(target: number, durationMs = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

export function RumboHero2a({ sesionActiva = false, userName, courses, destacados, stats }: Readonly<RumboHero2aProps>) {
  const [slide, setSlide] = useState(0);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* El landing se renderiza estático en el servidor, donde no hay forma de
     saber si hay sesión (la cookie pccl_session es httpOnly y leerla con
     cookies() volvería dinámica toda la página). Se detecta en el cliente con
     el mismo `pccl_user` que escribe el login y borra el logout. */
  const [sesionDetectada] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem('pccl_user');
      if (!raw) return null;
      const u = JSON.parse(raw) as { fullName?: string; email?: string };
      return u.fullName ?? u.email ?? 'Usuario';
    } catch {
      /* sessionStorage bloqueado o JSON corrupto → se trata como sin sesión */
      return null;
    }
  });

  const activa = sesionActiva || sesionDetectada !== null;
  const nombre = userName ?? sesionDetectada ?? 'Usuario';

  useEffect(() => {
    if (destacados.length <= 1) return;
    heroTimer.current = setInterval(() => setSlide((s) => (s + 1) % destacados.length), 4500);
    return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  }, [destacados.length]);

  const goToSlide = (i: number) => {
    if (heroTimer.current) clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => setSlide((s) => (s + 1) % destacados.length), 4500);
    setSlide(i);
  };

  const initials = nombre.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ background: '#f4faf6' }}>
      {/* ── Topbar ── */}
      <header className="rumbo2a-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', borderBottom: '1px solid #e3efe7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1a7a4a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 17 }}>R</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: '#16241c' }}>Rumbo</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', color: '#1a7a4a' }}>PROFESORES</div>
          </div>
        </div>

        <nav className="rumbo2a-topbar-nav" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: '#3d5147' }}>
          <Link href={appRoutes.home} style={{ color: '#1a7a4a', textDecoration: 'none' }}>Inicio</Link>
          <Link href={appRoutes.courses} style={{ color: 'inherit', textDecoration: 'none' }}>Catálogo</Link>
          <Link href={appRoutes.inscriptions} style={{ color: 'inherit', textDecoration: 'none' }}>Mis cursos</Link>
          <Link href={appRoutes.certificates} style={{ color: 'inherit', textDecoration: 'none' }}>Certificados</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div className="rumbo2a-badge" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#eef6f0', borderRadius: 999, padding: '7px 16px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2aa863', animation: 'rumbo2a-pulse 1.6s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: '#1a7a4a', whiteSpace: 'nowrap' }}>NUEVA COHORTE · JUNIO</span>
          </div>
          {activa ? (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dcefe3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 13, color: '#1a7a4a', flexShrink: 0 }}>
              {initials}
            </div>
          ) : (
            <>
              <Link href={appRoutes.login} className="rumbo2a-login-link" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: '#16241c', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Iniciar sesión
              </Link>
              <Link href={appRoutes.register} className="rumbo2a-cta-primary" style={{ background: '#1a7a4a', color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 14, padding: '10px 22px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Comenzar →
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="rumbo2a-hero-grid rumbo2a-fade-up">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          {activa ? (
            <>
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.12, color: '#16241c', margin: 0 }}>
                Hola, {nombre}.<br />¿Qué hacemos <span style={{ color: '#1a7a4a' }}>hoy</span>?
              </h1>
              <p style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.6, color: '#5b6f64', margin: 0 }}>
                Crea un curso nuevo o retoma el que dejaste a medias — todo desde aquí.
              </p>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.12, color: '#16241c', margin: 0 }}>
                Aprende algo que <span style={{ color: '#1a7a4a' }}>importe.</span>
              </h1>
              <p style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.6, color: '#5b6f64', margin: 0 }}>
                Clases, evaluaciones y certificados verificables, todo en un solo lugar. Explora el catálogo sin cuenta.
              </p>
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <Link
              href={activa ? appRoutes.courses : appRoutes.register}
              className="rumbo2a-cta-primary"
              style={{ background: '#1a7a4a', color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 15, padding: '14px 26px', borderRadius: 999, textDecoration: 'none', display: 'inline-block' }}
            >
              {activa ? 'Crear curso →' : 'Comenzar gratis →'}
            </Link>
            <Link href={appRoutes.courses} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: '#1a7a4a', textDecoration: 'none' }}>
              {activa ? 'Tomar un curso →' : 'Explorar catálogo →'}
            </Link>
          </div>
        </div>

        {/* Carrusel de destacados */}
        {destacados.length > 0 && (
          <div style={{ position: 'relative', minWidth: 0 }}>
            <div style={{ overflow: 'hidden', borderRadius: 20 }}>
              <div style={{ display: 'flex', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)', transform: `translateX(-${slide * 100}%)` }}>
                {destacados.map((d) => (
                  <div key={d.id} style={{ minWidth: '100%', boxSizing: 'border-box', background: d.tono, padding: '36px 36px 30px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ background: 'rgba(255,255,255,0.92)', color: '#1a7a4a', fontFamily: SANS, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 999 }}>{d.nivel}</span>
                      <span style={{ background: 'rgba(22,36,28,0.08)', color: '#16241c', fontFamily: SANS, fontWeight: 700, fontSize: 11, padding: '4px 10px', borderRadius: 999 }}>DESTACADO</span>
                    </div>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, lineHeight: 1.2, color: '#16241c' }}>{d.titulo}</div>
                    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14, lineHeight: 1.5, color: '#3d5147', maxWidth: 420 }}>{d.desc}</div>
                    <Link href={d.href} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, color: '#1a7a4a', textDecoration: 'none', marginTop: 'auto' }}>
                      Ver temario del curso →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {destacados.length > 1 && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', gap: 8 }}>
                {destacados.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    aria-label={`Ver ${d.titulo}`}
                    onClick={() => goToSlide(i)}
                    style={{ width: i === slide ? 26 : 8, height: 8, borderRadius: 999, background: i === slide ? '#1a7a4a' : 'rgba(22,36,28,0.18)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.4s' }}
                  />
                ))}
              </div>
            )}

            {/* Tarjeta flotante — certificados */}
            <Link
              href={appRoutes.scan}
              className="rumbo2a-float-card"
              style={{
                position: 'absolute', top: -16, right: -14, background: '#ffffff', border: '1px solid #e3efe7', borderRadius: 14,
                padding: '12px 16px', boxShadow: '0 12px 32px rgba(22,36,28,0.12)', display: 'flex', alignItems: 'center', gap: 10,
                textDecoration: 'none', animation: 'rumbo2a-float-y 4s ease-in-out infinite',
              }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#1a7a4a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>✓</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12, color: '#16241c', whiteSpace: 'nowrap' }}>Certificados verificables</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 11, color: '#1a7a4a' }}>Abrir escáner →</div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* ── Ticker ── */}
      <div className="scrollbar-hide" style={{ overflow: 'hidden', borderTop: '1px solid #e3efe7', borderBottom: '1px solid #e3efe7', marginTop: 28, background: '#ffffff', padding: '12px 0' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'rumbo2a-marquee 20s linear infinite' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={`${t}-${i}`} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', color: '#1a7a4a', padding: '0 28px', whiteSpace: 'nowrap' }}>
              {t} <span style={{ color: '#bfe0cd', paddingLeft: 28 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Continúa aprendiendo / catálogo — reusa el carrusel de cursos compartido
          (CardCarousel/CourseHoloCard: flechas + tilt 3D + barra de progreso ya incluidos) ── */}
      {courses.length > 0 && (
        <div className="rumbo2a-courses-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: '#16241c' }}>
            {activa ? 'Continúa aprendiendo' : 'Cursos del catálogo'}
          </div>
          <CardCarousel items={courses} />
        </div>
      )}

      {/* ── Estadísticas ── */}
      <StatsRow stats={stats} />
    </div>
  );
}

function StatsRow({ stats }: Readonly<{ stats: { est: number; cur: number; fin: number } }>) {
  const est = useCountUp(stats.est);
  const cur = useCountUp(stats.cur);
  const fin = useCountUp(stats.fin);
  return (
    <div className="rumbo2a-stats-row">
      <div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: '#16241c' }}>{est}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', color: '#5b6f64' }}>ESTUDIANTES ACTIVOS</div>
      </div>
      <div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: '#16241c' }}>{cur}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', color: '#5b6f64' }}>CURSOS PUBLICADOS</div>
      </div>
      <div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: '#16241c' }}>{fin}%</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', color: '#5b6f64' }}>TASA DE FINALIZACIÓN</div>
      </div>
    </div>
  );
}
