/**
 * Fase D-2 — Optimización y publicación de los GLB.
 *
 * Lee los GLB en crudo de `assets/avatar-source/glb-raw`, los procesa y escribe
 * el resultado en `public/avatars/custom`. El crudo nunca se publica: así el
 * cliente no puede descargar por error una versión sin comprimir, y volver a
 * ejecutar el paso siempre parte del mismo origen (es idempotente).
 *
 * Cadena aplicada:
 *   dedup    — funde materiales y accessors repetidos entre piezas.
 *   prune    — elimina nodos, materiales y accessors que ya no referencia nadie.
 *   reorder  — reordena índices y vértices para la caché de la GPU (Meshopt).
 *   quantize — pasa los atributos a enteros (KHR_mesh_quantization).
 *   Meshopt  — comprime los buffers con EXT_meshopt_compression, método FILTER
 *              porque la cuantización ya la hizo el paso anterior. Usar el
 *              método QUANTIZE aquí volvería a cuantizar lo ya cuantizado.
 *
 * No se aplica Draco: el README pide medir antes de combinar ambos, y Meshopt
 * por sí solo ya deja los cuerpos muy por debajo del presupuesto. `useGLTF` de
 * drei registra el decodificador Meshopt por defecto, así que la carga en el
 * cliente no necesita configuración adicional.
 *
 *   pnpm --filter frontend avatar:optimize
 */

import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, prune, quantize, reorder } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

import { ASSET_DIRS, PUBLIC_DIR, RAW_DIR, REPORTS_DIR } from './config.mjs';
import { writeManifest } from './manifest.mjs';

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });

/** Carpetas de imágenes: no se optimizan como glTF, solo se publican. */
const IMAGE_DIRS = ['thumbnails', 'portraits', 'figures'];
const GLB_DIRS = ASSET_DIRS.filter((dir) => !IMAGE_DIRS.includes(dir));

async function listGlb(dir) {
  try {
    const entries = await readdir(path.join(RAW_DIR, dir));
    return entries.filter((name) => name.toLowerCase().endsWith('.glb'));
  } catch {
    return [];
  }
}

async function optimizeOne(dir, name) {
  const source = path.join(RAW_DIR, dir, name);
  const target = path.join(PUBLIC_DIR, dir, name);

  const document = await io.read(source);

  await document.transform(
    dedup(),
    prune({ keepAttributes: false, keepLeaves: false }),
    reorder({ encoder: MeshoptEncoder, target: 'performance' }),
    quantize(),
  );

  document
    .createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });

  await io.write(target, document);

  const rawBytes = (await stat(source)).size;
  const optimizedBytes = (await stat(target)).size;
  return {
    file: `/avatars/custom/${dir}/${name}`,
    rawBytes,
    optimizedBytes,
    ratio: Number((optimizedBytes / rawBytes).toFixed(4)),
    saved: rawBytes - optimizedBytes,
  };
}

for (const dir of ASSET_DIRS) {
  await mkdir(path.join(PUBLIC_DIR, dir), { recursive: true });
}
await mkdir(REPORTS_DIR, { recursive: true });

const rows = [];
for (const dir of GLB_DIRS) {
  for (const name of await listGlb(dir)) {
    rows.push(await optimizeOne(dir, name));
  }
}

if (rows.length === 0) {
  console.error(
    `No hay GLB que optimizar en ${RAW_DIR}.\nEjecuta antes: pnpm --filter frontend avatar:build`,
  );
  process.exit(1);
}

// Miniaturas y retratos ya se renderizaron durante el build; aquí solo se
// publican. Son PNG con alfa y no pasan por la cadena glTF.
let images = 0;
for (const dir of IMAGE_DIRS) {
  const files = await readdir(path.join(RAW_DIR, dir)).catch(() => []);
  for (const name of files) {
    await copyFile(path.join(RAW_DIR, dir, name), path.join(PUBLIC_DIR, dir, name));
    images += 1;
  }
}

const totalRaw = rows.reduce((sum, row) => sum + row.rawBytes, 0);
const totalOptimized = rows.reduce((sum, row) => sum + row.optimizedBytes, 0);

const report = {
  generatedAt: new Date().toISOString(),
  pipeline: ['dedup', 'prune', 'reorder(meshopt)', 'quantize', 'EXT_meshopt_compression(FILTER)'],
  totals: {
    rawBytes: totalRaw,
    optimizedBytes: totalOptimized,
    ratio: Number((totalOptimized / totalRaw).toFixed(4)),
  },
  rows,
};
await writeFile(path.join(REPORTS_DIR, 'optimize.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const row of rows) {
  console.log(
    `${row.file.padEnd(50)} ${(row.rawBytes / 1e6).toFixed(2)} → ` +
      `${(row.optimizedBytes / 1e6).toFixed(2)} MB  (${(row.ratio * 100).toFixed(1)} %)`,
  );
}
console.log(
  `\nTotal: ${(totalRaw / 1e6).toFixed(2)} MB → ${(totalOptimized / 1e6).toFixed(2)} MB ` +
    `(${((totalOptimized / totalRaw) * 100).toFixed(1)} %) · ${images} imágenes publicadas`,
);

await writeManifest();
