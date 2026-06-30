/* ───────────────────────────────────────────
   Landing Page — Lumen.edu
   Hero · Value props · Featured courses · CTA
   ─────────────────────────────────────────── */

import Link from 'next/link';
import { Topbar } from '@/components/layout/Topbar';
import { Footer } from '@/components/layout/Footer';
import { appRoutes } from '@/lib/routes';

const STATS = [
  { value: '12.4k', label: 'Estudiantes activos' },
  { value: '218',   label: 'Cursos publicados'   },
  { value: '94%',   label: 'Tasa de finalización' },
];

const VALUE_PROPS = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM4 19a2 2 0 0 1 2-2h12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Cursos y lecciones que respiran',
    desc: 'Módulos, video, lectura, archivos o enlaces. Borradores, revisión y publicación con un botón.',
    style: { gridColumn: '1', gridRow: '1 / span 2', background: 'var(--blue-800)', color: 'var(--panel)' } as React.CSSProperties,
    dark: true,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Evaluaciones honestas',
    desc: 'Cuestionarios cronometrados, intentos múltiples y revisión por instructor.',
    style: { background: 'var(--green-100)', color: 'var(--green-900)' } as React.CSSProperties,
    dark: false,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Progreso visible',
    desc: 'Cada alumno ve dónde va, y cada instructor ve dónde se atascó el grupo.',
    style: { background: 'var(--panel)', border: '1px solid var(--neutral-100)' } as React.CSSProperties,
    dark: false,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13.5 7 22l5-3 5 3-1.5-8.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Certificados verificables',
    desc: 'PDF con sello y URL pública. Sin terceros.',
    style: { background: 'var(--blue-50)' } as React.CSSProperties,
    dark: false,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="11" r="4" strokeLinecap="round"/><circle cx="17" cy="11" r="4" strokeLinecap="round" opacity="0.6"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Roles y permisos finos',
    desc: 'Admin, instructor, alumno y revisor — con privilegios ajustables.',
    style: { background: 'var(--blue-900)', color: 'var(--panel)' } as React.CSSProperties,
    dark: true,
  },
];

const FEATURED_COURSES = [
  { coverClass: 'cover-1', cat: 'Datos', icon: '∿', title: 'Fundamentos de visualización de datos', instructor: 'Marina Cruz', lessons: 18, hours: '6h 20m' },
  { coverClass: 'cover-2', cat: 'Diseño', icon: '◐', title: 'Interfaces accesibles para todos', instructor: 'Diego Ortega', lessons: 24, hours: '9h 05m' },
  { coverClass: 'cover-3', cat: 'Pensamiento', icon: '✎', title: 'Pensamiento crítico para investigación', instructor: 'Marina Cruz', lessons: 14, hours: '4h 50m' },
];

export default function HomePage() {
  return (
    <>
      <Topbar />

      {/* ── Hero ── */}
      <section style={{
        padding: 'clamp(48px, 7vw, 120px) clamp(20px, 4vw, 56px) 80px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 'clamp(32px, 5vw, 80px)',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--blue-600)', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--blue-600)', display: 'inline-block' }} />
            Nueva cohorte · junio 2026
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '40px', maxWidth: '12ch' }}>
            Aprende algo<br />que <em style={{ fontStyle: 'italic', color: 'var(--blue-600)' }}>importe.</em>
          </h1>
          <p style={{ fontSize: '19px', color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: '46ch', marginBottom: '36px' }}>
            Una plataforma serena para impartir, cursar y certificar conocimiento. Clases, evaluaciones y constancias verificables, todo en un solo lugar.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '56px', flexWrap: 'wrap' }}>
            <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', height: '52px', padding: '0 28px', borderRadius: '999px', background: 'var(--blue-700)', color: 'var(--panel)', fontSize: '16px', fontWeight: 500, transition: 'background 160ms' }}>
              Explorar catálogo
            </Link>
            <Link href={appRoutes.login} style={{ display: 'inline-flex', alignItems: 'center', height: '52px', padding: '0 28px', borderRadius: '999px', background: 'var(--panel)', border: '1px solid var(--neutral-200)', fontSize: '16px', fontWeight: 500 }}>
              Soy instructor
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--ink)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '6px', letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual card collage */}
        <div style={{ position: 'relative', height: '520px' }}>
          {/* Blob azul */}
          <div style={{ position: 'absolute', top: '-40px', right: '40px', width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(61,108,229,0.18), transparent 60%)', borderRadius: '50%' }} />
          {/* Card curso */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', boxShadow: 'var(--sh-3)', borderRadius: '16px', overflow: 'hidden', transform: 'rotate(2.5deg)', background: 'var(--panel)', border: '1px solid var(--neutral-100)' }}>
            <div style={{ height: '160px', background: 'linear-gradient(135deg, #1f3ca8, #289b64)', color: 'var(--panel)', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '999px', alignSelf: 'flex-start', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>CURSO</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', lineHeight: 1.1 }}>Fundamentos de visualización de datos</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                <span>Lección 5 de 18</span><span style={{ color: 'var(--blue-700)', fontWeight: 600 }}>64%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--neutral-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: '64%', background: 'var(--blue-600)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
          {/* Card certificado */}
          <div style={{ position: 'absolute', bottom: '30px', left: 0, width: '280px', boxShadow: 'var(--sh-3)', borderRadius: '16px', background: 'var(--panel)', padding: '18px', border: '1px solid var(--neutral-100)', display: 'flex', gap: '14px', alignItems: 'center', transform: 'rotate(-3deg)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--panel)', fontFamily: 'var(--font-serif)', fontSize: '24px', flexShrink: 0 }}>★</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Certificado emitido</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: 1.2 }}>Estadística aplicada</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px' }}>18 · abril · 2026</div>
            </div>
          </div>
          {/* Card live */}
          <div style={{ position: 'absolute', top: '280px', left: '40%', width: '260px', boxShadow: 'var(--sh-3)', borderRadius: '16px', background: 'var(--bg-dark)', padding: '18px 22px', display: 'flex', gap: '12px', alignItems: 'center', transform: 'rotate(-1.5deg)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--green-300)', color: 'var(--green-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '13px', flexShrink: 0 }}>MC</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--panel)' }}>Marina está en vivo</div>
              <div style={{ fontSize: '11px', color: 'var(--blue-400)' }}>Taller · en 4 minutos</div>
            </div>
            <span style={{ width: '8px', height: '8px', background: 'var(--red-500)', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(220,38,38,0.25)', animation: 'pulse 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* ── Value props bento ── */}
      <section style={{ padding: '80px clamp(20px, 4vw, 56px)', borderTop: '1px solid var(--neutral-100)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px,4vw,56px)', maxWidth: '16ch', marginBottom: '56px' }}>
          Todo lo que necesitas para enseñar, evaluar y <em style={{ color: 'var(--blue-600)' }}>graduar.</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: '260px 260px', gap: '20px' }}>
          {VALUE_PROPS.map((vp, i) => (
            <div key={i} style={{ borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...vp.style }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: vp.dark ? 'rgba(255,255,255,0.1)' : 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: vp.dark ? 'var(--green-300)' : 'var(--blue-700)' }}>
                {vp.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: vp.dark ? 'var(--panel)' : 'var(--ink)', marginBottom: '8px' }}>{vp.title}</h3>
                <p style={{ fontSize: '14.5px', color: vp.dark ? 'rgba(255,255,255,0.7)' : 'var(--ink-soft)', maxWidth: '32ch' }}>{vp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured courses ── */}
      <section style={{ padding: '80px clamp(20px, 4vw, 56px)', background: 'var(--blue-50)', borderTop: '1px solid var(--neutral-100)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--blue-600)' }}>Cursos destacados</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,3vw,40px)', marginTop: '8px' }}>Una pequeña selección de lo que está abierto.</h2>
          </div>
          <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 20px', borderRadius: '999px', background: 'var(--panel)', border: '1px solid var(--neutral-200)', fontSize: '14.5px' }}>
            Ver catálogo completo →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {FEATURED_COURSES.map((c, i) => (
            <Link key={i} href={appRoutes.courses} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--panel)', borderRadius: '14px', border: '1px solid var(--neutral-100)', overflow: 'hidden', transition: 'transform 200ms, box-shadow 200ms', boxShadow: 'var(--sh-1)' }}>
                <div className={c.coverClass} style={{ aspectRatio: '16/10', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
                  <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(12,29,92,0.55)', color: 'var(--panel)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, backdropFilter: 'blur(6px)' }}>{c.cat}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '64px', lineHeight: 1, opacity: 0.9, color: 'var(--panel)' }}>{c.icon}</span>
                </div>
                <div style={{ padding: '18px 20px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', lineHeight: 1.2, color: 'var(--ink)', marginBottom: '8px' }}>{c.title}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>{c.instructor} · {c.lessons} lecciones · {c.hours}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        margin: '80px clamp(20px, 4vw, 56px)',
        padding: 'clamp(48px, 6vw, 96px)',
        borderRadius: '24px',
        background: 'var(--blue-900)',
        color: 'var(--panel)',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '48px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-120px', top: '-120px', width: '460px', height: '460px', background: 'radial-gradient(circle, rgba(61,108,229,0.18), transparent 60%)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--blue-300)' }}>Comienza hoy</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,3vw,44px)', color: 'var(--panel)', margin: '12px 0 16px' }}>
            Tu próxima cohorte te <em style={{ color: 'var(--green-300)' }}>está esperando.</em>
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '28px' }}>Crea tu cuenta gratis. Sin tarjeta. Sin pelusa.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={appRoutes.login} style={{ display: 'inline-flex', alignItems: 'center', height: '52px', padding: '0 28px', borderRadius: '999px', background: 'var(--green-300)', color: 'var(--green-900)', fontSize: '16px', fontWeight: 500 }}>
              Crear cuenta
            </Link>
            <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', height: '52px', padding: '0 28px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--panel)', fontSize: '16px' }}>
              Ver catálogo
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', borderRadius: '16px', padding: '24px', transform: 'rotate(-2deg)', boxShadow: 'var(--sh-3)', width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--blue-600)' }}>Hoy</span>
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>10:42</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: 1.3, marginBottom: '16px', color: 'var(--ink)' }}>
              &ldquo;Camila terminó su quiz con 95 puntos.&rdquo;
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--green-900)' }}>CR</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Camila Ríos · Visualización de datos</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
