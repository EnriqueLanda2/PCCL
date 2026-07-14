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
import { useState } from 'react';
import type { Lesson } from '@/lib/types';
import { contentTypeMeta } from '@/lib/lessonContentTypes';
import { NotesPanel } from './NotesPanel';

const linkStyle: React.CSSProperties = {
  fontSize: '12.5px',
  color: 'var(--blue-600)',
  fontWeight: 500,
  flexShrink: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  textDecoration: 'none',
};

function fileNameFromUrl(url: string, title: string): string {
  const last = url.split('/').pop() ?? '';
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(last);
  return hasExt ? last : `${title}.pdf`;
}

export function useLessonFileViewer(lesson: Lesson): { controls: React.ReactNode; content: React.ReactNode } {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isVideo = lesson.contentType === 'video';
  const isFile = lesson.contentType === 'file';

  if (!lesson.fileUrl || (!isVideo && !isFile)) {
    return { controls: null, content: null };
  }

  const handleDownload = async () => {
    if (!lesson.fileUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(lesson.fileUrl);
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
      window.open(lesson.fileUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  let toggleLabel = '↗ Ver documento';
  if (open) toggleLabel = '▲ Ocultar';
  else if (isVideo) toggleLabel = '▶ Ver video';

  const controls = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
      <button type="button" onClick={() => setOpen((v) => !v)} style={linkStyle}>
        {toggleLabel}
      </button>
      {isFile && (
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          style={{ ...linkStyle, color: 'var(--ink-muted)', opacity: downloading ? 0.6 : 1 }}
        >
          {downloading ? 'Descargando…' : '⬇ Descargar'}
        </button>
      )}
    </div>
  );

  let media: React.ReactNode = null;
  if (open && isVideo) {
    media = (
      <video
        controls
        preload="metadata"
        src={lesson.fileUrl}
        style={{ width: '100%', maxHeight: '420px', borderRadius: 'var(--radius-md)', background: '#000' }}
      >
        <track kind="captions" />
      </video>
    );
  } else if (open && isFile) {
    media = (
      <iframe
        src={lesson.fileUrl}
        title={lesson.title}
        style={{
          width: '100%',
          height: '520px',
          border: '1px solid var(--neutral-100)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--panel)',
        }}
      />
    );
  }

  const content = !open ? null : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
        gap: '14px',
        alignItems: 'start',
      }}
      className="lesson-viewer-grid"
    >
      {media}
      <NotesPanel lessonId={lesson.id} scopeLabel={contentTypeMeta(lesson.contentType).label} />
    </div>
  );

  return { controls, content };
}
