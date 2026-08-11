/**
 * Fase D-3 — Generación del `manifest.json` del catálogo propio.
 *
 * El manifest es el contrato entre el pipeline y el frontend. Todo lo que
 * contiene sale de los reportes reales de Blender y del tamaño real en disco
 * del GLB ya optimizado: ninguna cifra se escribe a mano, de modo que no puede
 * desincronizarse de los assets publicados.
 *
 * Ejecutable de forma independiente (`optimize` lo invoca al terminar):
 *   node tools/avatar-pipeline/manifest.mjs
 */

import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  PUBLIC_DIR,
  REPORTS_DIR,
  REQUIRED_ANIMATIONS,
  REQUIRED_BONES,
  REQUIRED_MORPHS,
  RIG_ID,
  VARIANTS,
} from './config.mjs';

/** Tamaño en disco del asset publicado, o null si todavía no existe. */
async function publishedBytes(url) {
  const relative = url.replace('/avatars/custom/', '');
  try {
    return (await stat(path.join(PUBLIC_DIR, relative))).size;
  } catch {
    return null;
  }
}

/** Etiquetas legibles del catálogo. Solo aquí; el pipeline no las inventa. */
const LABELS = {
  'chunky-short': 'Corto por mechones',
  'layered-bob': 'Melena por capas',
  'top-a': 'Sudadera vinilo',
  'top-b': 'Polo suave',
  'bottom-a': 'Pantalón largo',
  'bottom-b': 'Bermuda',
  'shoes-a': 'Tenis redondeados',
  'shoes-b': 'Zapato vinilo',
  'facial-hair-goatee': 'Perilla geométrica',
};

/**
 * Piezas incluidas dentro del GLB del cuerpo. No tienen `url` propia porque no
 * se descargan aparte: viajan en el cuerpo para que el avatar se vea completo
 * en la primera carga. El frontend las muestra u oculta por nombre de malla.
 */
const BUNDLED = {
  hair: [{ id: 'chunky-short', mesh: 'Hair_chunky-short' }],
  tops: [{ id: 'top-a', mesh: 'Top_A' }],
  bottoms: [{ id: 'bottom-a', mesh: 'Bottom_A' }],
  shoes: [{ id: 'shoes-a', mesh: 'Shoes_A' }],
};

/** Piezas que viven en su propio GLB y se descargan solo si se eligen. */
const MODULAR = {
  hair: [{ id: 'layered-bob', key: 'layered-bob', hides: 'Hair_chunky-short' }],
  tops: [{ id: 'top-b', key: 'top-b', hides: 'Top_A' }],
  bottoms: [{ id: 'bottom-b', key: 'bottom-b', hides: 'Bottom_A' }],
  shoes: [{ id: 'shoes-b', key: 'shoes-b', hides: 'Shoes_A' }],
};

export async function writeManifest() {
  const bodies = [];
  const categories = { hair: [], tops: [], bottoms: [], shoes: [], accessories: [] };

  for (const variant of VARIANTS) {
    const reportPath = path.join(REPORTS_DIR, `${variant.bodyId}.json`);
    const report = JSON.parse(await readFile(reportPath, 'utf8'));

    const url = `/avatars/custom/bodies/${variant.bodyId}.glb`;
    const bytes = await publishedBytes(url);
    if (bytes === null) {
      throw new Error(`Falta el asset publicado ${url}. Ejecuta avatar:build y avatar:optimize.`);
    }

    bodies.push({
      id: variant.bodyId,
      revision: 1,
      type: 'body',
      label: variant.label,
      url,
      thumbnail: `/avatars/custom/thumbnails/${variant.bodyId}.png`,
      // Se declara el género principal más `androgynous`: la presentación no
      // debe restringir qué ropa puede llevar el avatar (README §5).
      genders: [...new Set([variant.gender, 'androgynous'])],
      compatibleRigs: [RIG_ID],
      colorVariants: ['default'],
      hiddenBodyMasks: [],
      bytes,
      triangles: report.trianglesVisible,
      trianglesByObject: report.trianglesByObject,
      morphTargets: report.morphTargets,
      animations: report.animations,
      dependencies: [],
    });

    /* Piezas empaquetadas dentro del cuerpo.
     *
     * Se emite una entrada POR CUERPO, no una compartida entre los tres: cada
     * variante viste distinto (el masculino lleva bomber y botas donde el
     * femenino lleva sudadera y tenis), así que no pueden compartir etiqueta.
     * El `pieceId` sí es común, que es lo que persiste la configuración. */
    for (const [category, pieces] of Object.entries(BUNDLED)) {
      for (const piece of pieces) {
        categories[category].push({
          id: `${piece.id}__${variant.bodyId}`,
          pieceId: piece.id,
          revision: 1,
          label: report.garmentLabels?.[piece.id] ?? LABELS[piece.id] ?? piece.id,
          delivery: 'bundled',
          meshName: piece.mesh,
          thumbnail: `/avatars/custom/thumbnails/${variant.bodyId}.png`,
          compatibleBodies: [variant.bodyId],
          compatibleRigs: [RIG_ID],
          colorVariants: ['default'],
          hiddenBodyMasks: [],
          bytes: 0,
          triangles: report.trianglesByObject?.[piece.mesh] ?? 0,
          dependencies: [],
        });
      }
    }

    // Piezas modulares con GLB propio.
    for (const [category, pieces] of Object.entries(MODULAR)) {
      for (const piece of pieces) {
        const modular = report.modular?.[piece.key];
        if (!modular) continue;
        const pieceBytes = await publishedBytes(modular.url);
        if (pieceBytes === null) continue;

        categories[category].push({
          id: `${piece.id}__${variant.bodyId}`,
          pieceId: piece.id,
          revision: 1,
          label: report.garmentLabels?.[piece.id] ?? LABELS[piece.id] ?? piece.id,
          delivery: 'lazy',
          url: modular.url,
          hidesMesh: piece.hides,
          thumbnail: `/avatars/custom/thumbnails/${variant.bodyId}.png`,
          compatibleBodies: [variant.bodyId],
          compatibleRigs: [RIG_ID],
          colorVariants: ['default'],
          hiddenBodyMasks: [],
          bytes: pieceBytes,
          triangles: modular.triangles,
          dependencies: [variant.bodyId],
        });
      }
    }

    // Accesorios (por ahora solo vello facial en el cuerpo masculino).
    for (const [key, modular] of Object.entries(report.modular ?? {})) {
      if (!key.startsWith('facial-hair')) continue;
      const pieceBytes = await publishedBytes(modular.url);
      if (pieceBytes === null) continue;
      categories.accessories.push({
        id: `${key}__${variant.bodyId}`,
        pieceId: key,
        revision: 1,
        label: LABELS[key] ?? key,
        delivery: 'lazy',
        url: modular.url,
        thumbnail: `/avatars/custom/thumbnails/${variant.bodyId}.png`,
        compatibleBodies: [variant.bodyId],
        compatibleRigs: [RIG_ID],
        colorVariants: ['default'],
        hiddenBodyMasks: [],
        bytes: pieceBytes,
        triangles: modular.triangles,
        dependencies: [variant.bodyId],
      });
    }
  }

  const manifest = {
    schemaVersion: 1,
    catalogVersion: '2.0.0',
    generatedAt: new Date().toISOString(),
    rig: { id: RIG_ID, bones: REQUIRED_BONES },
    morphTargets: REQUIRED_MORPHS,
    animations: REQUIRED_ANIMATIONS.map((id) => ({
      id,
      revision: 1,
      delivery: 'bundled',
      compatibleRigs: [RIG_ID],
    })),
    bodies,
    hair: categories.hair,
    tops: categories.tops,
    bottoms: categories.bottoms,
    shoes: categories.shoes,
    accessories: [{ id: 'none', revision: 1, label: 'Sin accesorio', delivery: 'bundled' },
                  ...categories.accessories],
  };

  const target = path.join(PUBLIC_DIR, 'manifest.json');
  await writeFile(target, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `\nmanifest.json: ${bodies.length} cuerpos, ${manifest.hair.length} cabellos, ` +
      `${manifest.tops.length} superiores, ${manifest.bottoms.length} inferiores, ` +
      `${manifest.shoes.length} calzados, ${manifest.accessories.length} accesorios`,
  );
  return manifest;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  await writeManifest();
}
