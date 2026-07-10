'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Input, Field } from '@/app/components/ui/Input';
import { RadarChart } from '@/app/components/ui/RadarChart';

const topics = ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Microservicios', 'JWT & Auth', 'CI/CD', 'AWS'];

/* Consumo por categoría derivado de los cursos del usuario
   (ruta: HTML/CSS, JS y React completados · Node.js 60% · AWS siguiente) */
const CATEGORY_CONSUMPTION = [
  { categoria: 'Frontend',  tu: 88, promedio: 60 },
  { categoria: 'Backend',   tu: 62, promedio: 58 },
  { categoria: 'Bases de datos', tu: 35, promedio: 48 },
  { categoria: 'DevOps',    tu: 22, promedio: 35 },
  { categoria: 'Cloud',     tu: 18, promedio: 40 },
  { categoria: 'Diseño',    tu: 41, promedio: 45 },
];

const stats = [
  { value: '4', label: 'Cursos impartidos' },
  { value: '1,860', label: 'Estudiantes' },
  { value: '4.85', label: 'Calificación' },
  { value: '312', label: 'Certificados emitidos' },
];

export default function IdentityProfilePage() {
  const [activeRole, setActiveRole] = useState<'profesor' | 'alumno'>('profesor');

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold tracking-tight text-[var(--ink)]">
            Perfil e impartición
          </h1>
          <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
            Tu información y los temas que enseñas
          </p>
        </div>

        <div className="w-full max-w-[340px]">
          <Input placeholder="Buscar cursos, lecciones…" />
        </div>
      </div>

      <div className="inline-flex rounded-2xl bg-white border border-[#E4EBDD] p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveRole('profesor')}
          className={activeRole === 'profesor'
            ? 'h-10 px-5 rounded-xl bg-[#E4F4E9] text-[var(--green-700)] font-semibold'
            : 'h-10 px-5 rounded-xl text-[var(--ink-muted)] font-semibold'}
        >
          Profesor
        </button>
        <button
          type="button"
          onClick={() => setActiveRole('alumno')}
          className={activeRole === 'alumno'
            ? 'h-10 px-5 rounded-xl bg-[#E4F4E9] text-[var(--green-700)] font-semibold'
            : 'h-10 px-5 rounded-xl text-[var(--ink-muted)] font-semibold'}
        >
          Alumno
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr] items-start">
        <Card className="p-6 lg:p-7">
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-600)] text-2xl font-bold text-white shadow-[0_16px_24px_rgba(31,154,75,0.18)]">
              RS
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">Ricardo Salazar</h2>
                <Badge variant="blue">{activeRole === 'profesor' ? 'Instructor' : 'Estudiante'}</Badge>
              </div>
              <p className="mt-1 text-[var(--ink-muted)]">Ingeniero de Software · Instructor</p>
              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[var(--ink-soft)]">
                Backend engineer con 9 años construyendo APIs y sistemas distribuidos. Me gusta enseñar
                con proyectos reales y explicar el “por qué” detrás de cada decisión.
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-[#E4EBDD]" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[#F8FBF5] p-4 border border-[#E4EBDD]">
                <div className="text-[28px] font-extrabold tracking-tight text-[var(--ink)]">{stat.value}</div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-[#E4EBDD]" />

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--ink-muted)]">Temas que imparte</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-full bg-[#E4F4E9] px-4 py-2 text-[13px] font-semibold text-[var(--green-700)]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--ink)]">Datos de cuenta</h2>
              <p className="mt-1 text-[var(--ink-muted)]">identity-service</p>
            </div>
            <Badge variant="dark">Verificado</Badge>
          </div>

          <div className="mt-6 space-y-5">
            <Field label="Nombre completo">
              <Input defaultValue="Ricardo Salazar Méndez" />
            </Field>
            <Field label="Correo">
              <Input defaultValue="ricardo.salazar@rumbo.mx" />
            </Field>
            <Field label="Rol">
              <Input defaultValue="Instructor · Verificado" />
            </Field>
            <Field label="País">
              <Input defaultValue="México" />
            </Field>
          </div>

          <div className="mt-6">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              Guardar cambios
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Consumo por categoría (learning-service) ── */}
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr] items-start">
        <Card className="p-6 lg:p-7">
          <RadarChart
            data={CATEGORY_CONSUMPTION}
            angleKey="categoria"
            valueKeys={['tu', 'promedio']}
            seriesLabels={['Tú', 'Promedio de la plataforma']}
            title="Consumo por categoría"
            description="Basado en los cursos que has tomado"
          />
        </Card>

        <Card className="p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--ink)]">Tu categoría dominante</h2>
              <p className="mt-1 text-[var(--ink-muted)]">learning-service</p>
            </div>
            <Badge variant="green">Frontend</Badge>
          </div>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--ink-soft)]">
            Tus cursos completados se concentran en <strong className="text-[var(--ink)]">Frontend</strong> (HTML & CSS,
            JavaScript esencial y React moderno), y ahora estás avanzando hacia{' '}
            <strong className="text-[var(--ink)]">Backend</strong> con Node.js & APIs. La gráfica compara tu consumo con
            el promedio de la plataforma: Cloud y DevOps son tus siguientes áreas de oportunidad para completar tu ruta.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { value: 'Frontend', label: 'Categoría top' },
              { value: '3',        label: 'Cursos completados en ella' },
              { value: 'Cloud',    label: 'Siguiente en tu ruta' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#F8FBF5] p-4 border border-[#E4EBDD]">
                <div className="text-[20px] font-extrabold tracking-tight text-[var(--ink)]">{item.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">{item.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
