/* ───────────────────────────────────────────
   useLessonFileViewer — visor de adjunto de lección
   (video o PDF), compartido entre CourseContentView
   y la página de "Mis lecciones" para no duplicar
   el bloque de "Ver documento" / "Ver video".

   Se expone como hook (no componente) porque el botón
   de toggle vive dentro de una fila flex horizontal,
   mientras que el contenido expandido (video/iframe)
   debe ocupar el ancho completo en la fila de abajo —
   ambos comparten el mismo estado de "abierto".

   - video: <video controls>, igual que antes.
   - file (PDF): visor embebido (<iframe>) + botón de
     descarga real (fetch → blob → <a download>, ya que
     Cloudinary sirve los documentos como resource_type
     "raw" sin Content-Disposition: attachment, así que
     un <a href> simple solo abre el archivo inline en
     vez de descargarlo).

   Cuando está abierto, el contenido se muestra en un
   layout de dos columnas (visor + <NotesPanel>), inspirado
   en la vista de detalle con "Notas" del panel de admin.
   ─────────────────────────────────────────── */

'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import type { Lesson } from '@/lib/types';
import { contentTypeMeta } from '@/lib/lessonContentTypes';
import { NotesPanel } from './NotesPanel';
import { ChatWidget } from './ChatWidget';

const linkSx = {
  minWidth: 0,
  flexShrink: 0,
  p: 0,
  color: 'var(--blue-600)',
  fontFamily: 'var(--font-sans)',
  fontSize: 12.5,
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': { bgcolor: 'transparent', color: 'var(--blue-700)' },
};

function fileNameFromUrl(url: string, title: string): string {
  const last = url.split('/').pop() ?? '';
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(last);
  return hasExt ? last : `${title}.pdf`;
}

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
}

function absoluteMediaUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
}

function previewFetchUrl(url: string): string {
  const absolute = absoluteMediaUrl(url);
  try {
    const media = new URL(absolute);
    const apiBase = new URL(apiBaseUrl());
    if (media.origin === apiBase.origin && media.pathname.startsWith('/uploads/files/')) {
      return absolute;
    }
  } catch {
    return absolute;
  }
  return `${apiBaseUrl()}/uploads/preview?url=${encodeURIComponent(absolute)}`;
}

async function isPdfBlob(blob: Blob): Promise<boolean> {
  if (blob.type.toLowerCase().includes('pdf')) return true;
  const header = await blob.slice(0, 5).text().catch(() => '');
  return header === '%PDF-';
}

function DocumentPreview({ url, title }: Readonly<{ url: string; title: string }>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    let objectUrl: string | null = null;

    const timer = window.setTimeout(() => {
      setPreviewUrl(null);
      setFailed(false);
      fetch(previewFetchUrl(url), { credentials: 'include' })
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const isPdf = await isPdfBlob(blob);
          if (!isPdf) throw new Error('El documento no es un PDF previsualizable');
          const displayBlob = new Blob([blob], { type: 'application/pdf' });
          objectUrl = URL.createObjectURL(displayBlob);
          if (alive) setPreviewUrl(objectUrl);
        })
        .catch(() => { if (alive) setFailed(true); });
    }, 0);

    return () => {
      alive = false;
      window.clearTimeout(timer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [title, url]);

  if (failed) {
    return (
      <div
        style={{
          minHeight: '32.5rem',
          border: '1px dashed var(--neutral-200)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--panel)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          color: 'var(--ink-muted)',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>No se pudo previsualizar el documento.</p>
        <p style={{ fontSize: '0.7813rem' }}>Puedes abrirlo en una pestaña nueva o descargarlo.</p>
        <Button href={url} target="_blank" rel="noreferrer" variant="outlined" sx={{ borderRadius: '999px', textTransform: 'none' }}>
          Abrir documento
        </Button>
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div
        style={{
          height: '32.5rem',
          border: '1px solid var(--neutral-100)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--panel)',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--ink-muted)',
          fontSize: '0.8125rem',
        }}
      >
        Cargando documento…
      </div>
    );
  }

  return (
    <iframe
      src={previewUrl}
      title={title}
      style={{
        width: '100%',
        height: '32.5rem',
        border: '1px solid var(--neutral-100)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--panel)',
      }}
    />
  );
}

export function useLessonFileViewer(lesson: Lesson, options?: {
  /** Para vistas dedicadas a UNA sola actividad (ej. el camino/serpiente):
      no tiene sentido poder "ocultar" el contenido si es lo único que hay
      en pantalla, así que se fuerza siempre abierto y no se ofrece el botón
      de ocultar — solo el de descargar, si aplica. */
  alwaysOpen?: boolean;
}): {
  controls: React.ReactNode;
  content: React.ReactNode;
  /** Estado de "abierto" — expuesto para armar disparadores propios (p. ej. una miniatura clicable). */
  open: boolean;
  toggle: () => void;
} {
  const alwaysOpen = options?.alwaysOpen ?? false;
  const [openState, setOpenState] = useState(false);
  const open = alwaysOpen || openState;
  const [downloading, setDownloading] = useState(false);
  const toggle = () => setOpenState((v) => !v);

  const isVideo = lesson.contentType === 'video';
  const isFile = lesson.contentType === 'file';

  if (!lesson.fileUrl || (!isVideo && !isFile)) {
    return { controls: null, content: null, open: false, toggle };
  }

  const handleDownload = async () => {
    if (!lesson.fileUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(previewFetchUrl(lesson.fileUrl), { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileNameFromUrl(lesson.fileUrl, lesson.title);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      /* CORS u otro fallo de red: al menos deja verlo/descargarlo manualmente */
      window.open(absoluteMediaUrl(lesson.fileUrl), '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  let toggleLabel = '↗ Ver documento';
  if (open) toggleLabel = '▲ Ocultar';
  else if (isVideo) toggleLabel = '▶ Ver video';

  const controls = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
      {!alwaysOpen && (
        <Button type="button" onClick={toggle} variant="text" disableRipple sx={linkSx}>
          {toggleLabel}
        </Button>
      )}
      {isFile && (
        <Button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          variant="text"
          disableRipple
          sx={{ ...linkSx, color: 'var(--ink-muted)', opacity: downloading ? 0.6 : 1 }}
        >
          {downloading ? 'Descargando…' : '⬇ Descargar'}
        </Button>
      )}
    </div>
  );

  let media: React.ReactNode = null;
  if (open && isVideo) {
    media = (
      <video
        controls
        preload="metadata"
        src={absoluteMediaUrl(lesson.fileUrl)}
        style={{ width: '100%', maxHeight: '26.25rem', borderRadius: 'var(--radius-md)', background: '#000' }}
      >
        <track kind="captions" />
      </video>
    );
  } else if (open && isFile) {
    media = <DocumentPreview url={lesson.fileUrl} title={lesson.title} />;
  }

  const content = !open ? null : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
        gap: '0.875rem',
        alignItems: 'start',
      }}
      className="lesson-viewer-grid"
    >
      {media}
      <NotesPanel lessonId={lesson.id} scopeLabel={contentTypeMeta(lesson.contentType).label} />
      <ChatWidget lessonId={lesson.id} variant="inline" />
    </div>
  );

  return { controls, content, open, toggle };
}
