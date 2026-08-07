/* ───────────────────────────────────────────
   Reveal — entrada escalonada de componentes
   Al montar la página, los bloques que ya están
   en el viewport aparecen "de a uno" (fundido +
   desplazamiento sutil, escalonados por `index`).
   Los que están más abajo se revelan solos cuando
   el usuario hace scroll y entran en pantalla
   (IntersectionObserver, se dispara una sola vez).
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Orden dentro del grupo — escalona el retraso cuando varios entran juntos */
  index?: number;
  /** ms de paso entre elementos escalonados */
  step?: number;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
}

export function Reveal({ children, index = 0, step = 90, className, as: Tag = 'div' }: Readonly<RevealProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reduceMotion = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(reduceMotion);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ElementType deriva de JSX.IntrinsicElements, que @react-three/fiber
     augmenta con los elementos de three. Sin acotarlo a props de HTML, la
     union de todos ellos intersecta a never y rompe este componente. */
  const Comp = Tag as unknown as React.FC<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;

  return (
    <Comp
      ref={ref}
      className={cn('reveal-on-scroll', visible && 'is-visible', className)}
      style={{ transitionDelay: visible ? `${index * step}ms` : '0ms' }}
    >
      {children}
    </Comp>
  );
}
