/* ───────────────────────────────────────────
   Editor de avatares 3D
   ───────────────────────────────────────────
   La escena se carga con dynamic import y ssr:false: R3F toca `window` y
   WebGL en el montaje, así que renderizarla en servidor rompería la build.
   ─────────────────────────────────────────── */

'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { AppButton } from '@/app/components/ui/AppControls';
import { Card } from '@/app/components/ui/Card';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { AvatarErrorBoundary, webglStore } from '@/app/components/avatar/AvatarErrorBoundary';
import { AvatarCreatorDialog } from '@/app/components/avatar/AvatarCreatorDialog';
import { api } from '@/lib/api';
import { listEntries } from '@/lib/avatar/catalog';
import {
  listColorOptions,
  listCustomBodies,
  listCustomPieces,
  type CustomCategory,
  type TintChannel,
} from '@/lib/avatar/custom';
import { useAvatarStore, selectCanUndo, selectCanRedo } from '@/lib/avatar/store';
import type { AvatarGender, AvatarQuality } from '@/lib/avatar/types';
import { APP_ICONS } from '@/lib/icons';

const AvatarStage = dynamic(
  () => import('@/app/components/avatar/AvatarStage').then((m) => m.AvatarStage),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-[1rem] bg-[var(--surface-2)]">
        <WaveSpinner size="sm" />
      </div>
    ),
  },
);

const GENDERS: { id: AvatarGender; label: string }[] = [
  { id: 'feminine', label: 'Femenino' },
  { id: 'masculine', label: 'Masculino' },
  { id: 'androgynous', label: 'Andrógino' },
];

const QUALITIES: { id: AvatarQuality; label: string; hint: string }[] = [
  { id: 'low', label: 'Ligera', hint: 'Menor peso, ideal en móvil' },
  { id: 'medium', label: 'Media', hint: 'Equilibrio recomendado' },
  { id: 'high', label: 'Alta', hint: 'Máximo detalle' },
];

function OptionRow({
  label,
  options,
  activeId,
  onSelect,
}: Readonly<{
  label: string;
  options: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}>) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option.id === activeId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={[
                'rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors',
                active
                  ? 'border-[var(--green-500)] bg-[var(--green-50)] text-[var(--green-700)]'
                  : 'border-[var(--neutral-200)] bg-[var(--panel)] text-[var(--ink-soft)] hover:border-[var(--green-300)]',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Selector de color. El color es un tinte de material, no un asset nuevo, así
 *  que la muestra puede pintarse con el mismo hex que se aplicará a la malla. */
function SwatchRow({
  label,
  options,
  activeId,
  onSelect,
}: Readonly<{
  label: string;
  options: { id: string; label: string; hex: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}>) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.id === activeId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              /* El nombre va en el título accesible y no como texto visible:
                 la muestra de color ya comunica la opción y una fila de
                 etiquetas rompería la retícula. */
              title={option.label}
              aria-label={option.label}
              className={[
                'h-7 w-7 rounded-full border-2 transition-transform',
                active
                  ? 'border-[var(--green-600)] scale-110'
                  : 'border-[var(--neutral-200)] hover:scale-105',
              ].join(' ')}
              style={{ backgroundColor: option.hex }}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

/** Selector de cuerpo con las miniaturas renderizadas por el pipeline. */
function BodyRow({
  bodies,
  activeId,
  onSelect,
}: Readonly<{
  bodies: { id: string; label: string; thumbnail: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}>) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
        Modelo PCCL
      </legend>
      <div className="flex flex-wrap gap-2">
        {bodies.map((body) => {
          const active = body.id === activeId;
          return (
            <button
              key={body.id}
              type="button"
              onClick={() => onSelect(body.id)}
              aria-pressed={active}
              className={[
                'flex w-[5.5rem] flex-col items-center gap-1 rounded-xl border p-1.5 transition-colors',
                active
                  ? 'border-[var(--green-500)] bg-[var(--green-50)]'
                  : 'border-[var(--neutral-200)] bg-[var(--panel)] hover:border-[var(--green-300)]',
              ].join(' ')}
            >
              {/* Miniatura generada durante el pipeline: descargar el GLB solo
                  para pintar un chip sería absurdo (README §13). */}
              <Image
                src={body.thumbnail}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
              />
              <span className="text-[0.6875rem] font-medium leading-tight text-[var(--ink-soft)]">
                {body.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Recorta la captura de la escena a un cuadrado centrado en cabeza y torso.
 *
 * El editor encuadra el cuerpo entero, pero una foto de perfil se muestra en un
 * círculo pequeño: sin recortar, el avatar aparecería como un trozo de camiseta.
 * Los factores están calibrados sobre el encuadre de `AvatarStage`.
 */
async function toSquarePortrait(dataUrl: string, size = 256): Promise<Blob | null> {
  const image = new window.Image();
  image.src = dataUrl;
  try {
    await image.decode();
  } catch {
    return null;
  }

  const side = Math.min(image.width, image.height * 0.62);
  const sx = (image.width - side) / 2;
  const sy = image.height * 0.04;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.drawImage(image, sx, sy, side, side, 0, 0, size, size);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

/**
 * Refresca la copia en sessionStorage que leen el topbar y el sidebar, y avisa
 * a la interfaz de que cambió.
 *
 * El evento es lo que hace que la foto nueva aparezca al instante en la barra
 * superior y en el menú lateral: ambos ya escuchaban `pccl_user_updated`, pero
 * nadie lo emitía tras publicar el avatar.
 */
function cacheAvatarUrl(avatarUrl: string) {
  try {
    const raw = sessionStorage.getItem('pccl_user');
    const previous = raw ? JSON.parse(raw) : {};
    sessionStorage.setItem('pccl_user', JSON.stringify({ ...previous, avatarUrl }));
    window.dispatchEvent(new Event('pccl_user_updated'));
  } catch {
    /* sessionStorage bloqueado o con JSON corrupto: no es crítico, la próxima
       llamada a /auth/me devolverá el avatar ya persistido. */
  }
}

export default function AvatarPage() {
  const config = useAvatarStore((s) => s.config);
  const status = useAvatarStore((s) => s.status);
  const error = useAvatarStore((s) => s.error);
  const canUndo = useAvatarStore(selectCanUndo);
  const canRedo = useAvatarStore(selectCanRedo);
  const store = useAvatarStore();

  const [creatorOpen, setCreatorOpen] = useState(false);
  /* useSyncExternalStore en vez de un efecto: lee un valor exclusivo de cliente
     sin desajuste de hidratación y sin setState dentro de useEffect. */
  const webgl = useSyncExternalStore(webglStore.subscribe, webglStore.getSnapshot, webglStore.getServerSnapshot);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null);
  const captureRef = useRef<(() => string | null) | null>(null);

  const loadStored = store.load;
  useEffect(() => { loadStored(); }, [loadStored]);

  const handleCaptureReady = useCallback((fn: () => string | null) => {
    captureRef.current = fn;
  }, []);

  /**
   * Guarda en dos niveles con prioridades distintas.
   *
   * 1. La configuración se persiste en local SIEMPRE y primero. Es la fuente de
   *    verdad del editor y no debe depender de la red.
   * 2. La foto de perfil se publica en el backend en modo "mejor esfuerzo": se
   *    sube el retrato y se guarda su URL. Si falla (sin sesión, almacenamiento
   *    de imágenes no configurado, red caída) se avisa, pero el guardado local
   *    ya ocurrió y no se pierde nada.
   */
  const handleSave = async () => {
    store.save();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);

    const dataUrl = captureRef.current?.();
    if (!dataUrl) {
      setNotice({ tone: 'warn', text: 'No se pudo capturar el retrato; se guardó solo la configuración.' });
      return;
    }

    setPublishing(true);
    setNotice(null);
    try {
      const portrait = await toSquarePortrait(dataUrl);
      if (!portrait) throw new Error('No se pudo recortar el retrato.');

      const file = new File([portrait], 'avatar.png', { type: 'image/png' });
      const { url } = await api.uploadImage(file);
      await api.updateMyAvatar(url);
      cacheAvatarUrl(url);
      setNotice({ tone: 'ok', text: 'Avatar publicado. Ya aparece en tu perfil y en los listados.' });
    } catch {
      setNotice({
        tone: 'warn',
        text: 'Se guardó tu avatar en este navegador, pero no se pudo publicar la foto de perfil.',
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleExport = () => {
    const dataUrl = captureRef.current?.();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `avatar-${Date.now()}.png`;
    link.click();
  };

  const expressions = listEntries('expression').map((e) => ({ id: e.id, label: e.label }));
  const poses = listEntries('pose').map((e) => ({ id: e.id, label: e.label }));
  const backgrounds = listEntries('background').map((e) => ({ id: e.id, label: e.label }));
  const customBodies = listCustomBodies();
  const isCustom = config.source.provider === 'custom';
  /* Se comprueba `provider` en la propia expresión y no a través de `isCustom`:
     un booleano intermedio no estrecha la unión de `AvatarSource`. */
  const activeCustomBody =
    config.source.provider === 'custom' ? config.source.bodyId : customBodies[0]?.id;

  /* Las piezas se listan por cuerpo: cada GLB trae su propio corte de ropa, y
     ofrecer una prenda de otro cuerpo dejaría al avatar sin esa prenda. */
  const pieceOptions = (category: CustomCategory) =>
    listCustomPieces(category, activeCustomBody ?? '').map((piece) => ({
      id: piece.pieceId,
      label: piece.label,
    }));

  const swatches = (channel: TintChannel) => listColorOptions(channel);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tu avatar"
        subtitle="Personaliza tu personaje 3D y úsalo como imagen de perfil."
        action={
          <div className="flex flex-wrap gap-2">
            <AppButton onClick={() => setCreatorOpen(true)} variant="contained">
              {config.source.provider === 'readyplayerme' ? 'Rediseñar avatar' : 'Crear con Ready Player Me'}
            </AppButton>
            {config.source.provider !== 'custom' && (
              <AppButton onClick={() => store.setCustomBody(activeCustomBody ?? 'neutral-base')}>
                Usar modelo PCCL
              </AppButton>
            )}
            <AppButton onClick={handleSave} disabled={publishing}>
              {publishing ? 'Publicando…' : saved ? 'Guardado ✓' : 'Guardar'}
            </AppButton>
          </div>
        }
      />

      {error && (
        <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
      )}

      {notice && (
        <p
          role="status"
          className={[
            'rounded-xl px-3.5 py-2.5 text-[0.8125rem]',
            notice.tone === 'ok' ? 'bg-[var(--green-50)] text-[var(--green-700)]' : 'bg-[#FFF7E6] text-[#8A5300]',
          ].join(' ')}
        >
          {notice.text}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* ── Escena ── */}
        <Card className="h-[32rem] p-2 lg:h-[38rem]">
          {webgl ? (
            <AvatarErrorBoundary
              fallback={(reset) => (
                <EmptyState
                  icon={APP_ICONS.warning}
                  title="No se pudo mostrar el avatar"
                  description="El modelo no se pudo cargar. Puedes reintentar o crear uno nuevo."
                  action={{ label: 'Reintentar', onClick: reset }}
                />
              )}
            >
              <AvatarStage config={config} onCaptureReady={handleCaptureReady} />
            </AvatarErrorBoundary>
          ) : (
            <EmptyState
              icon={APP_ICONS.warning}
              title="Tu navegador no admite WebGL"
              description="El editor 3D necesita WebGL. Prueba con otro navegador o activa la aceleración por hardware."
            />
          )}
        </Card>

        {/* ── Panel de personalización ── */}
        <div className="flex flex-col gap-4">
          <Card className="flex max-h-[38rem] flex-col gap-4 overflow-y-auto p-4">
            <OptionRow label="Cuerpo" options={GENDERS} activeId={config.gender} onSelect={(id) => store.setGender(id as AvatarGender)} />
            {customBodies.length > 0 && (
              <BodyRow
                bodies={customBodies}
                activeId={activeCustomBody ?? 'neutral-base'}
                onSelect={store.setCustomBody}
              />
            )}

            {/* Vestuario y color solo aplican al catálogo propio: una malla de
                Ready Player Me trae su ropa dentro y no expone estas piezas. */}
            {isCustom && (
              <>
                <SwatchRow label="Tono de piel" options={swatches('skin')} activeId={config.colors.skin} onSelect={(id) => store.setColor('skin', id)} />
                <OptionRow label="Cabello" options={pieceOptions('hair')} activeId={config.wardrobe.hairId} onSelect={(id) => store.setWardrobePiece('hair', id)} />
                <SwatchRow label="Color de cabello" options={swatches('hair')} activeId={config.colors.hair} onSelect={(id) => store.setColor('hair', id)} />
                <SwatchRow label="Color de ojos" options={swatches('eyes')} activeId={config.colors.eyes} onSelect={(id) => store.setColor('eyes', id)} />
                <OptionRow label="Prenda superior" options={pieceOptions('tops')} activeId={config.wardrobe.topId} onSelect={(id) => store.setWardrobePiece('tops', id)} />
                <SwatchRow label="Color superior" options={swatches('top')} activeId={config.colors.top} onSelect={(id) => store.setColor('top', id)} />
                <OptionRow label="Prenda inferior" options={pieceOptions('bottoms')} activeId={config.wardrobe.bottomId} onSelect={(id) => store.setWardrobePiece('bottoms', id)} />
                <SwatchRow label="Color inferior" options={swatches('bottom')} activeId={config.colors.bottom} onSelect={(id) => store.setColor('bottom', id)} />
                <OptionRow label="Calzado" options={pieceOptions('shoes')} activeId={config.wardrobe.shoesId} onSelect={(id) => store.setWardrobePiece('shoes', id)} />
                <SwatchRow label="Color de calzado" options={swatches('shoes')} activeId={config.colors.shoes} onSelect={(id) => store.setColor('shoes', id)} />
                {pieceOptions('accessories').length > 0 && (
                  <OptionRow
                    label="Accesorio"
                    options={[{ id: 'none', label: 'Sin accesorio' }, ...pieceOptions('accessories')]}
                    activeId={config.wardrobe.accessoryId}
                    onSelect={(id) => store.setWardrobePiece('accessories', id)}
                  />
                )}
              </>
            )}

            <OptionRow label="Expresión" options={expressions} activeId={config.presentation.expressionId} onSelect={store.setExpression} />
            <OptionRow label="Pose" options={poses} activeId={config.presentation.poseId} onSelect={store.setPose} />
            <OptionRow label="Fondo" options={backgrounds} activeId={config.presentation.backgroundId} onSelect={store.setBackground} />
            <OptionRow
              label="Calidad"
              options={QUALITIES.map((q) => ({ id: q.id, label: q.label }))}
              activeId={config.quality}
              onSelect={(id) => store.setQuality(id as AvatarQuality)}
            />
          </Card>

          <Card className="flex flex-wrap gap-2 p-4">
            <AppButton onClick={store.undo} disabled={!canUndo}>Deshacer</AppButton>
            <AppButton onClick={store.redo} disabled={!canRedo}>Rehacer</AppButton>
            <AppButton onClick={store.randomize}>Aleatorizar</AppButton>
            <AppButton onClick={store.reset}>Restablecer</AppButton>
            <AppButton onClick={handleExport} variant="contained">Exportar PNG</AppButton>
          </Card>

          {status === 'loading' && (
            <p className="text-[0.8125rem] text-[var(--ink-muted)]">Cargando modelo…</p>
          )}
        </div>
      </div>

      <AvatarCreatorDialog
        open={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        onExported={store.setRemoteAvatar}
      />
    </div>
  );
}
