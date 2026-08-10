/* ───────────────────────────────────────────
   Login y registro — una sola pantalla
   ───────────────────────────────────────────
   Antes eran dos rutas con su propio archivo. El problema era la animación de
   intercambio de paneles: al ser dos páginas, el App Router desmontaba una y
   montaba la otra, así que por más que se hiciera coincidir el fotograma final
   de una con el inicial de la otra, en el medio había un desmontaje y se veía
   como un cambio de página, no como un movimiento.

   Ahora las dos viven acá: los paneles se montan UNA vez y solo cambia `mode`,
   con lo cual el desplazamiento es un `transition` de CSS de verdad (ver el
   bloque "Intercambio de paneles login ↔ registro" en globals.css).

   Las dos URLs siguen existiendo — `/identity/auth` y `/identity/register`
   renderizan este mismo componente y el modo inicial sale del pathname. Al
   alternar se actualiza la barra de direcciones con `history.pushState`, que
   NO dispara navegación de Next: si se usara `router.push` volveríamos a
   desmontar el componente y a perder la animación, que es justo lo que se
   quería evitar.
   ─────────────────────────────────────────── */

'use client';

import type React from 'react';
import { use, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Field, Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { appRoutes, postLoginRoute, withNext } from '@/lib/routes';
import { APP_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';

type Mode = 'login' | 'register';

/** `CSSProperties` no admite custom properties (`--x`), y la animación de los
    íconos las necesita para que cada uno conserve su inclinación y su ritmo. */
type StyleWithVars = React.CSSProperties & Record<`--${string}`, string>;

/* Fondo del panel del formulario — íconos de educación que flotan detrás de
   la tarjeta. Es puramente ornamental: el contenedor va `aria-hidden` y sin
   eventos de puntero, así no aparece en lectores de pantalla ni intercepta
   clics del formulario. Las posiciones son en % para que se repartan igual
   sea cual sea el alto del panel. */
const BACKDROP_ICONS = [
  { id: 'book',     icon: APP_ICONS.book,     size: 68, pos: { top: '7%',     left:  '5%'  }, tilt: '-12deg', dur: '9s',    delay: '0s'   },
  { id: 'diploma',  icon: APP_ICONS.diploma,  size: 52, pos: { top: '16%',    right: '8%'  }, tilt: '10deg',  dur: '11s',   delay: '0.8s' },
  { id: 'medal',    icon: APP_ICONS.medal,    size: 38, pos: { top: '45%',    right: '4%'  }, tilt: '14deg',  dur: '10.5s', delay: '2.2s' },
  { id: 'notebook', icon: APP_ICONS.notebook, size: 54, pos: { bottom: '24%', left:  '4%'  }, tilt: '8deg',   dur: '10s',   delay: '1.6s' },
  { id: 'reading',  icon: APP_ICONS.reading,  size: 62, pos: { bottom: '7%',  right: '7%'  }, tilt: '-8deg',  dur: '12s',   delay: '0.4s' },
  { id: 'trophy',   icon: APP_ICONS.trophy,   size: 40, pos: { bottom: '42%', left:  '11%' }, tilt: '-16deg', dur: '13s',   delay: '1.1s' },
];

/** Copy del panel azul. Cambia por modo; el panel en sí nunca se desmonta. */
const NAVY_COPY: Record<Mode, {
  title: React.ReactNode;
  lead: string;
  features: { icon: string; text: string }[];
}> = {
  login: {
    title: <>Un espacio para <em className="text-primary-300 not-italic">enseñar</em> y aprender juntos.</>,
    lead: 'Gestiona cursos, evalúa alumnos y genera constancias — todo desde un solo lugar.',
    features: [
      { icon: APP_ICONS.book,   text: 'Cursos, lecciones y evaluaciones' },
      { icon: APP_ICONS.chart,  text: 'Progreso y certificados en tiempo real' },
      { icon: APP_ICONS.shield, text: 'Permisos granulares por rol' },
    ],
  },
  register: {
    title: <>Comienza tu camino de <em className="text-success-400 not-italic">aprendizaje</em>.</>,
    lead: 'Crea tu cuenta de alumno en segundos. Accede a cursos, lleva tu progreso y obtén constancias.',
    features: [
      { icon: APP_ICONS.checkFilled, text: 'Acceso inmediato al catálogo de cursos' },
      { icon: APP_ICONS.chart,       text: 'Seguimiento de progreso automático' },
      { icon: APP_ICONS.diploma,     text: 'Descarga tus constancias al completar' },
    ],
  },
};

type NextParam = string | string[] | undefined;

export default function AuthPage({
  searchParams,
}: Readonly<{ searchParams?: Promise<{ next?: NextParam }> }>) {
  const pathname = usePathname();
  /* `?next=` lo pone proxy.ts al expulsar de una ruta protegida. */
  const nextParam = searchParams ? use(searchParams).next : undefined;

  /* Solo el valor INICIAL sale del pathname: a partir de ahí manda el estado,
     porque `pushState` no actualiza lo que devuelve usePathname(). */
  const [mode, setMode] = useState<Mode>(() =>
    pathname?.startsWith(appRoutes.register) ? 'register' : 'login',
  );

  const switchTo = useCallback((target: Mode) => {
    setMode(target);
    const href = withNext(
      target === 'register' ? appRoutes.register : appRoutes.login,
      nextParam,
    );
    /* pushState y no router.push: hay que cambiar la URL SIN que Next navegue,
       porque navegar desmontaría el componente y cortaría la animación. */
    window.history.pushState(null, '', href);
  }, [nextParam]);

  /* Con pushState el botón "atrás" del navegador vuelve a la otra pantalla,
     pero nadie avisa a React: sin esto la URL cambiaría y el formulario se
     quedaría en el modo anterior. */
  useEffect(() => {
    const onPopState = () => {
      setMode(window.location.pathname.startsWith(appRoutes.register) ? 'register' : 'login');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const copy = NAVY_COPY[mode];

  return (
    /* Una sola columna por defecto; el panel decorativo solo aparece cuando hay
       ancho real para él. En móvil el intercambio no ocurre (ver globals.css):
       el panel azul está oculto y el formulario ocupa todo. */
    <div
      className={cn(
        'grid min-h-screen grid-cols-1 lg:grid-cols-2',
        mode === 'register' && 'auth-mode-register',
      )}
    >
      {/* ── Panel azul ── */}
      <div className="auth-panel auth-panel-navy relative hidden overflow-hidden bg-neutral-900 px-12 py-10 text-white lg:flex lg:flex-col">
        {/* Decorative blobs */}
        <div className="absolute -right-32 -top-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-32 w-80 h-80 rounded-full bg-warning-500/10 blur-3xl pointer-events-none" />

        {/* Logo — vuelve al landing. Antes apuntaba al dashboard, que sin sesión
            rebotaba de inmediato al propio login: un clic que no hacía nada. */}
        <div className="relative z-10">
          <Link href={appRoutes.home} className="no-underline inline-flex items-center hover:opacity-90 transition-opacity">
            <span className="font-serif text-2xl text-white font-bold tracking-tight">PCCL</span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-primary-300/80">Plataforma</span>
          </Link>
        </div>

        {/* `key` fuerza el remonte al cambiar de modo para que la entrada se
            vuelva a reproducir con el copy nuevo. */}
        <div key={mode} className="auth-content-in my-auto relative z-10 max-w-sm">
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight text-white mb-5">
            {copy.title}
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">{copy.lead}</p>

          <div className="flex flex-col gap-3">
            {copy.features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-neutral-300">
                <Icon icon={f.icon} width={18} height={18} className="flex-shrink-0" />
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-neutral-600 mt-auto">© {new Date().getFullYear()} PCCL · Todos los derechos reservados</p>
      </div>

      {/* ── Panel del formulario ── */}
      <div className="auth-panel auth-panel-form relative flex flex-col justify-center overflow-hidden bg-white px-6 py-10 sm:px-12">

        {/* Fondo temático (ver BACKDROP_ICONS) — detrás de la tarjeta */}
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
          {BACKDROP_ICONS.map((b) => (
            <Icon
              key={b.id}
              icon={b.icon}
              width={b.size}
              height={b.size}
              className="auth-book"
              style={{ ...b.pos, '--tilt': b.tilt, '--dur': b.dur, '--delay': b.delay } as StyleWithVars}
            />
          ))}
        </div>

        <div className="relative w-full max-w-md mx-auto">

          {/* Salida del flujo. Va en esta columna y no en el panel decorativo
              (que se oculta en <lg junto con su logo) porque si no, en móvil no
              queda ninguna forma de volver al sitio.
              Apunta al landing en vez de usar router.back(): acá se llega
              también por redirect de proxy.ts desde una ruta protegida, y un
              "atrás" ahí devolvería a esa ruta, que volvería a expulsar al
              login — un botón que no lleva a ningún lado. */}
          <Link
            href={appRoutes.home}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 no-underline transition-colors hover:text-neutral-800"
          >
            <Icon icon={APP_ICONS.chevronLeft} width={16} height={16} />
            Volver al inicio
          </Link>

          {/* Igual que el panel azul: `key` reinicia la entrada al cambiar de
              modo, y de paso descarta el estado del formulario anterior. */}
          <div key={mode} className="auth-content-in">
            {mode === 'login'
              ? <LoginForm nextParam={nextParam} onSwitch={() => switchTo('register')} />
              : <RegisterForm nextParam={nextParam} onSwitch={() => switchTo('login')} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Formulario de acceso ── */
function LoginForm({ nextParam, onSwitch }: Readonly<{ nextParam: NextParam; onSwitch: () => void }>) {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, access } = await api.login(email, password);
      sessionStorage.setItem('pccl_user',   JSON.stringify(user));
      sessionStorage.setItem('pccl_access', JSON.stringify(access));
      router.replace(postLoginRoute(nextParam, access.menu));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 403
          ? 'Tu cuenta está inactiva. Contacta al administrador.'
          : 'Credenciales inválidas. Verifica tu correo y contraseña.');
      } else {
        setError('No se pudo conectar con el servidor. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card auth-stagger rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9">
      <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white mb-6 shadow-md">
        <Icon icon={APP_ICONS.diploma} width={26} height={26} />
      </div>

      <h2 className="font-serif text-3xl text-neutral-900 mb-1">Iniciar sesión</h2>

      <p className="text-sm text-neutral-500 mb-7">
        ¿Primera vez?{' '}
        <SwitchButton onClick={onSwitch}>Crear cuenta →</SwitchButton>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Correo electrónico" error={error ? ' ' : undefined}>
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!error}
          />
        </Field>

        <Field label="Contraseña">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
            <input type="checkbox" className="accent-primary-500 w-4 h-4" />
            Recordarme
          </label>
          <Link href="#" className="text-primary-500 hover:text-primary-600 font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <div className="animate-fade-in bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" block loading={loading} type="submit" className="mt-1">
          {loading ? 'Verificando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="text-xs text-neutral-400 text-center mt-6 leading-relaxed">
        ¿Necesitas acceso sin cuenta?{' '}
        <span className="text-neutral-500">Solicítalo a tu administrador.</span>
      </p>
    </div>
  );
}

/* ── Formulario de registro ── */
function RegisterForm({ nextParam, onSwitch }: Readonly<{ nextParam: NextParam; onSwitch: () => void }>) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { user, access } = await api.register(fullName.trim(), email.trim(), password);
      sessionStorage.setItem('pccl_user',   JSON.stringify(user));
      sessionStorage.setItem('pccl_access', JSON.stringify(access));
      router.replace(postLoginRoute(nextParam, access.menu));
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('Ya existe una cuenta con ese correo. ¿Quieres iniciar sesión?');
        } else if (err.status === 404) {
          setError('El registro no está disponible en este momento. Contacta al administrador.');
        } else {
          setError('No se pudo completar el registro. Intenta de nuevo.');
        }
      } else {
        setError('No se pudo conectar con el servidor. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card auth-stagger rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9">
      <div className="w-12 h-12 rounded-lg bg-success-500 flex items-center justify-center text-white mb-6 shadow-md">
        <Icon icon={APP_ICONS.user} width={26} height={26} />
      </div>

      <h2 className="font-serif text-3xl text-neutral-900 mb-1">Crear cuenta</h2>

      <p className="text-sm text-neutral-500 mb-7">
        ¿Ya tienes cuenta?{' '}
        <SwitchButton onClick={onSwitch}>Iniciar sesión →</SwitchButton>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Nombre completo">
          <Input
            type="text"
            placeholder="María González"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
          />
        </Field>

        <Field label="Correo electrónico" error={error?.includes('correo') ? error : undefined}>
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error?.includes('correo')}
          />
        </Field>

        <Field label="Contraseña" hint="Mínimo 8 caracteres">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            error={!!error && (error.includes('contraseña') || error.includes('caracteres'))}
          />
        </Field>

        <Field label="Confirmar contraseña">
          <Input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            error={!!error && error.includes('coinciden')}
          />
        </Field>

        {error && (
          <div className="animate-fade-in bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
            {error}
            {error.includes('iniciar sesión') && (
              /* Antes era un <Link> al login; ahora alterna en el sitio, así
                 también hace el intercambio de paneles. */
              <button type="button" onClick={onSwitch} className="ml-1 underline font-medium">
                Ir al login
              </button>
            )}
          </div>
        )}

        <Button variant="success" size="lg" block loading={loading} type="submit" className="mt-1">
          {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
        </Button>
      </form>

      <p className="text-xs text-neutral-400 text-center mt-6 leading-relaxed">
        Al registrarte aceptas los{' '}
        <Link href="#" className="text-primary-500 hover:underline">Términos de uso</Link>
        {' '}y la{' '}
        <Link href="#" className="text-primary-500 hover:underline">Política de privacidad</Link>.
      </p>
    </div>
  );
}

/** Alterna entre login y registro. Es un <button> y no un <Link>: navegar
    desmontaría el componente y cortaría la animación de intercambio. */
function SwitchButton({ onClick, children }: Readonly<{ onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-primary-500 font-medium hover:text-primary-600 underline-offset-2 hover:underline"
    >
      {children}
    </button>
  );
}
