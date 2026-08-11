/**
 * Fase D-1 — Construcción de los cuerpos en Blender.
 *
 * Lanza `tools/blender/build_avatar.py` una vez por variante, en segundo plano
 * y sin interfaz. Cada ejecución guarda su `.blend` fuente, exporta los GLB y
 * escribe un reporte JSON que consumen `inspect`, `optimize` y `validate`.
 *
 * Blender no se instala con el repositorio. Si no está disponible, el script
 * falla con instrucciones en vez de dejar assets a medias o fingir éxito.
 *
 *   pnpm --filter frontend avatar:build
 *   BLENDER=/ruta/a/blender pnpm --filter frontend avatar:build
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { ASSET_DIRS, PORTRAITS_PER_BODY, PUBLIC_DIR, RAW_DIR, REPO_ROOT, VARIANTS } from './config.mjs';

/** Ubicaciones habituales de Blender por sistema, en orden de preferencia. */
const CANDIDATES = [
  process.env.BLENDER,
  'blender',
  'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe',
  'C:/Program Files/Blender Foundation/Blender 4.2/blender.exe',
  '/Applications/Blender.app/Contents/MacOS/Blender',
  '/usr/bin/blender',
  '/snap/bin/blender',
].filter(Boolean);

function resolveBlender() {
  for (const candidate of CANDIDATES) {
    // Un candidato con separador es una ruta concreta; el resto se busca en PATH.
    if (candidate.includes('/') || candidate.includes('\\')) {
      if (existsSync(candidate)) return candidate;
      continue;
    }
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  return null;
}

const blender = resolveBlender();
if (!blender) {
  console.error(
    [
      'No se encontró Blender.',
      '',
      'Instálalo o indica su ruta explícitamente:',
      '  BLENDER="C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" pnpm --filter frontend avatar:build',
      '',
      'Los GLB ya publicados en public/avatars/custom no se tocan.',
    ].join('\n'),
  );
  process.exit(1);
}

const version = spawnSync(blender, ['--version'], { encoding: 'utf8' }).stdout.split('\n')[0].trim();
console.log(`Blender: ${version}  (${blender})`);

// Blender escribe en el área de staging; `optimize` es quien publica.
for (const dir of ASSET_DIRS) {
  await mkdir(path.join(RAW_DIR, dir), { recursive: true });
}
await mkdir(path.join(PUBLIC_DIR, 'reports'), { recursive: true });
await mkdir(path.join(REPO_ROOT, 'assets/avatar-source/blender'), { recursive: true });
const qaDir = path.join(REPO_ROOT, 'assets/avatar-source/qa');
await mkdir(qaDir, { recursive: true });

let failed = 0;
for (const variant of VARIANTS) {
  console.log(`\n── ${variant.bodyId} (${variant.variant}) ──`);
  const result = spawnSync(
    blender,
    [
      '--background',
      '--factory-startup',
      '--python', path.join(REPO_ROOT, 'tools/blender/build_avatar.py'),
      '--',
      '--variant', variant.variant,
      '--body-id', variant.bodyId,
      '--blend', path.join(REPO_ROOT, 'assets/avatar-source/blender', variant.blend),
      '--out-dir', RAW_DIR,
      '--report', path.join(PUBLIC_DIR, 'reports', `${variant.bodyId}.json`),
      '--skin-tone', variant.skinTone,
      '--hair-tone', variant.hairTone,
      '--qa-dir', qaDir,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );

  if (result.status !== 0) {
    failed += 1;
    console.error(result.stdout?.split('\n').slice(-25).join('\n'));
    console.error(result.stderr?.split('\n').slice(-25).join('\n'));
    continue;
  }
  const triangles = /"trianglesVisible":\s*(\d+)/.exec(result.stdout)?.[1] ?? '?';
  const bytes = /"bytes":\s*(\d+)/.exec(result.stdout)?.[1] ?? '?';
  console.log(`  ok — ${triangles} triángulos visibles, ${(Number(bytes) / 1e6).toFixed(2)} MB`);

  /* Retratos de la galería. Se renderizan desde el .blend recién guardado, sin
     reconstruir geometría, así que cuestan poco más de un segundo cada uno. */
  /* Dos encuadres del mismo personaje y la misma pose: `portraits` (rostro y
     hombros) para los avatares pequeños, y `figures` (cuerpo entero) para el
     panel de detalle, donde se aprecian postura y ropa. */
  let framingFailed = false;
  for (const [folder, framing, resolution] of [
    ['portraits', 'portrait', 384],
    ['figures', 'figure', 420],
  ]) {
    const render = spawnSync(
      blender,
      [
        '--background',
        path.join(REPO_ROOT, 'assets/avatar-source/blender', variant.blend),
        '--python', path.join(REPO_ROOT, 'tools/blender/render_portraits.py'),
        '--',
        '--out-dir', path.join(RAW_DIR, folder),
        '--body-id', variant.bodyId,
        '--variants', String(PORTRAITS_PER_BODY),
        '--start-index', String(VARIANTS.indexOf(variant) * PORTRAITS_PER_BODY),
        '--framing', framing,
        '--resolution', String(resolution),
        // Los alumnos aparecen saludando en todo el apartado de estudiantes:
        // tanto en la tarjeta como en el panel de detalle.
        '--greeting',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    if (render.status !== 0) {
      framingFailed = true;
      console.error(render.stdout?.split('\n').slice(-15).join('\n'));
      console.error(render.stderr?.split('\n').slice(-15).join('\n'));
      break;
    }
  }
  if (framingFailed) {
    failed += 1;
    continue;
  }
  console.log(`  retratos — ${PORTRAITS_PER_BODY} de rostro + ${PORTRAITS_PER_BODY} de cuerpo entero`);
}

if (failed > 0) {
  console.error(`\n${failed} variante(s) fallaron.`);
  process.exit(1);
}
console.log('\nConstrucción completa.');
