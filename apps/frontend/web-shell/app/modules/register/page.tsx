'use client';

import type React from 'react';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Field, Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { appRoutes, postLoginRoute, withNext } from '@/lib/routes';
import { APP_ICONS } from '@/lib/icons';

export default function RegisterPage({
  searchParams,
}: Readonly<{ searchParams?: Promise<{ next?: string | string[] }> }>) {
  const router = useRouter();
  /* Mismo `?next=` que el login: quien llegó aquí desde una ruta protegida
     debe terminar en ella, no en el dashboard. */
  const nextParam = searchParams ? use(searchParams).next : undefined;
  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

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
    /* Ver auth/page.tsx: una columna en móvil, el panel decorativo solo desde lg. */
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* ── Left panel ── */}
      <div className="relative hidden overflow-hidden bg-neutral-900 px-12 py-10 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 -top-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-32 w-80 h-80 rounded-full bg-success-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href={appRoutes.home} className="font-serif text-2xl text-white font-bold tracking-tight no-underline">PCCL</Link>
          <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-primary-300/80">Plataforma</span>
        </div>

        <div className="my-auto relative z-10 max-w-sm">
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight text-white mb-5">
            Comienza tu camino de <em className="text-success-400 not-italic">aprendizaje</em>.
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            Crea tu cuenta de alumno en segundos. Accede a cursos, lleva tu progreso y obtén constancias.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { icon: APP_ICONS.checkFilled, text: 'Acceso inmediato al catálogo de cursos' },
              { icon: APP_ICONS.chart, text: 'Seguimiento de progreso automático' },
              { icon: APP_ICONS.diploma, text: 'Descarga tus constancias al completar' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-neutral-300">
                <Icon icon={f.icon} width={18} height={18} className="flex-shrink-0" />
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-neutral-600 mt-auto">© {new Date().getFullYear()} PCCL · Todos los derechos reservados</p>
      </div>

      {/* ── Right panel — register form ── */}
      <div className="bg-white flex flex-col justify-center px-12 py-10 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">

          <div className="w-12 h-12 rounded-lg bg-success-500 flex items-center justify-center text-2xl mb-8 shadow-md">
            P
          </div>

          <h2 className="font-serif text-3xl text-neutral-900 mb-1">Crear cuenta</h2>
          <p className="text-sm text-neutral-500 mb-8">
            ¿Ya tienes cuenta?{' '}
            <Link href={withNext(appRoutes.login, nextParam)} className="text-primary-500 font-medium hover:text-primary-600">
              Iniciar sesión →
            </Link>
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
              <div className="bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
                {error}
                {error.includes('iniciar sesión') && (
                  <Link href={withNext(appRoutes.login, nextParam)} className="ml-1 underline font-medium">
                    Ir al login
                  </Link>
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
      </div>
    </div>
  );
}
