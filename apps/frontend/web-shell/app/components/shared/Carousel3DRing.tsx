/* ───────────────────────────────────────────
   Carousel3DRing — anillo de tarjetas en 3D
   Prisma de tarjetas (rotateY + translateZ) que
   gira solo, despacio, y se pausa al pasar el
   mouse — como el clásico "3D carousel" pero con
   la paleta de Rumbo y a un tamaño discreto.
   ─────────────────────────────────────────── */

'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export interface Carousel3DItem {
  id: string;
  title: string;
  category: string;
  coverClass: string;
  href: string;
  /** Portada real (Cloudinary) — si está presente, reemplaza el gradiente */
  coverImageUrl?: string;
}

export function Carousel3DRing({ items }: Readonly<{ items: Carousel3DItem[] }>) {
  const [paused, setPaused] = useState(false);
  if (items.length === 0) return null;

  return (
    <div
      className="carousel3d-scene"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn('carousel3d-ring', paused && 'paused')}
        style={{ '--ring-count': items.length } as CSSProperties}
      >
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(item.coverImageUrl ? 'bg-neutral-700' : item.coverClass, 'carousel3d-card')}
            style={{ '--i': i } as CSSProperties}
          >
            {item.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <span className="carousel3d-card-eyebrow">{item.category}</span>
            <span className="carousel3d-card-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
