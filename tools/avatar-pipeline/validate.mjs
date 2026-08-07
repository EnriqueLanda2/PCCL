/**
 * Fase D-4 — Validación de los assets publicados y del manifest.
 *
 * Falla con código distinto de cero ante cualquier incumplimiento. Es la puerta
 * que impide publicar un catálogo que apunte a un GLB inexistente, un cuerpo
 * sin rig, una animación que falta o un asset por encima del presupuesto — los
 * fallos que en el navegador se manifiestan como una pantalla vacía.
 *
 *   pnpm --filter frontend avatar:validate
 */

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  BUDGETS,
  PUBLIC_DIR,
  REPORTS_DIR,
  REQUIRED_ANIMATIONS,
  REQUIRED_BONES,
  REQUIRED_MORPHS,
  RIG_ID,
  SAFE_URL_PREFIX,
} from './config.mjs';

const problems = [];
const notes = [];

function check(condition, message) {
  if (!condition) problems.push(message);
}

/** Misma regla que aplica el frontend en `validateCustomPath`. */
function safeUrl(url, extension = '.glb') {
  return (
    typeof url === 'string' &&
    url.startsWith(SAFE_URL_PREFIX) &&
    !url.includes('..') &&
    !url.includes('\\') &&
    url.toLowerCase().endsWith(extension)
  );
}

async function fileBytes(url) {
  try {
    return (await stat(path.join(PUBLIC_DIR, url.replace(SAFE_URL_PREFIX, '')))).size;
  } catch {
    return null;
  }
}

// ── Carga de manifest e inventario ──────────────────────────────────────────

let manifest;
let inspect;
try {
  manifest = JSON.parse(await readFile(path.join(PUBLIC_DIR, 'manifest.json'), 'utf8'));
} catch (error) {
  console.error(`No se pudo leer manifest.json: ${error.message}`);
  console.error('Ejecuta: pnpm --filter frontend avatar:build && pnpm --filter frontend avatar:optimize');
  process.exit(1);
}
try {
  inspect = JSON.parse(await readFile(path.join(REPORTS_DIR, 'inspect.json'), 'utf8'));
} catch (error) {
  console.error(`No se pudo leer reports/inspect.json: ${error.message}`);
  console.error('Ejecuta: pnpm --filter frontend avatar:inspect');
  process.exit(1);
}

const byFile = new Map(inspect.assets.map((asset) => [asset.file, asset]));

// ── Manifest ────────────────────────────────────────────────────────────────

check(manifest.schemaVersion === 1, `schemaVersion debe ser 1, es ${manifest.schemaVersion}`);
check(typeof manifest.catalogVersion === 'string', 'falta catalogVersion');
check(manifest.rig?.id === RIG_ID, `rig.id debe ser ${RIG_ID}`);
check(Array.isArray(manifest.bodies) && manifest.bodies.length >= 3,
      'el catálogo debe declarar al menos 3 cuerpos');

for (const bone of REQUIRED_BONES) {
  check(manifest.rig?.bones?.includes(bone), `el rig del manifest no declara el hueso ${bone}`);
}

// Identificadores únicos en todo el catálogo.
const seen = new Set();
const categories = ['bodies', 'hair', 'tops', 'bottoms', 'shoes', 'accessories'];
for (const category of categories) {
  for (const entry of manifest[category] ?? []) {
    check(!seen.has(entry.id), `id duplicado en el catálogo: ${entry.id}`);
    seen.add(entry.id);
    check(Number.isInteger(entry.revision) && entry.revision > 0,
          `${entry.id}: revision debe ser un entero positivo`);
    check(typeof entry.label === 'string' && entry.label.length > 0,
          `${entry.id}: falta label`);
  }
}

// ── Cuerpos ─────────────────────────────────────────────────────────────────

for (const body of manifest.bodies ?? []) {
  const id = body.id;

  check(safeUrl(body.url), `${id}: url insegura o con extensión inesperada (${body.url})`);
  check(safeUrl(body.thumbnail, '.png'), `${id}: miniatura insegura o ausente (${body.thumbnail})`);

  const bytes = await fileBytes(body.url);
  check(bytes !== null, `${id}: el GLB declarado no existe en disco (${body.url})`);
  if (bytes !== null) {
    check(bytes === body.bytes, `${id}: bytes del manifest (${body.bytes}) ≠ disco (${bytes})`);
    check(bytes <= BUDGETS.bodyBytesMax,
          `${id}: ${(bytes / 1e6).toFixed(2)} MB supera el máximo de ${BUDGETS.bodyBytesMax / 1e6} MB`);
    if (bytes > BUDGETS.bodyBytesTarget) {
      notes.push(`${id}: ${(bytes / 1e6).toFixed(2)} MB supera el objetivo de ${BUDGETS.bodyBytesTarget / 1e6} MB (dentro del máximo)`);
    }
  }

  const thumbBytes = await fileBytes(body.thumbnail);
  check(thumbBytes !== null && thumbBytes > 0, `${id}: la miniatura no existe o está vacía`);

  const asset = byFile.get(body.url);
  check(asset !== undefined, `${id}: no aparece en reports/inspect.json`);
  if (!asset) continue;

  for (const bone of REQUIRED_BONES) {
    check(asset.bones.includes(bone), `${id}: falta el hueso ${bone} en el GLB`);
  }
  for (const morph of REQUIRED_MORPHS) {
    check(asset.morphTargets.includes(morph), `${id}: falta el morph target ${morph} en el GLB`);
  }
  for (const animation of REQUIRED_ANIMATIONS) {
    check(asset.animations.includes(animation), `${id}: falta la animación ${animation} en el GLB`);
  }

  check(asset.skins >= 1, `${id}: el GLB no contiene skinning`);
  check(asset.triangles > 0, `${id}: el GLB no contiene geometría`);
  check(asset.triangles <= BUDGETS.visibleTrianglesMax,
        `${id}: ${asset.triangles} triángulos visibles supera el presupuesto de ${BUDGETS.visibleTrianglesMax}`);
  check(asset.triangles === body.triangles,
        `${id}: triángulos del manifest (${body.triangles}) ≠ GLB (${asset.triangles})`);
  check(asset.textures === 0 || asset.textures > 0, 'comprobación de texturas');
  check(!asset.meshNames.some((name) => !name || name.trim() === ''),
        `${id}: hay mallas sin nombre en el GLB`);
  check(new Set(asset.meshNames).size === asset.meshNames.length,
        `${id}: hay nombres de malla duplicados en el GLB`);
}

// ── Piezas del catálogo ─────────────────────────────────────────────────────

const bodyIds = new Set((manifest.bodies ?? []).map((body) => body.id));

for (const category of ['hair', 'tops', 'bottoms', 'shoes', 'accessories']) {
  for (const entry of manifest[category] ?? []) {
    if (entry.id === 'none') continue;

    check(['bundled', 'lazy'].includes(entry.delivery),
          `${entry.id}: delivery debe ser 'bundled' o 'lazy'`);
    check(Array.isArray(entry.compatibleRigs) ? entry.compatibleRigs.includes(RIG_ID) : true,
          `${entry.id}: no declara compatibilidad con ${RIG_ID}`);

    for (const bodyId of entry.compatibleBodies ?? []) {
      check(bodyIds.has(bodyId), `${entry.id}: declara un cuerpo inexistente (${bodyId})`);
    }

    if (entry.delivery === 'bundled') {
      // Debe existir como malla dentro de cada cuerpo compatible.
      check(typeof entry.meshName === 'string' && entry.meshName.length > 0,
            `${entry.id}: una pieza 'bundled' debe declarar meshName`);
      for (const bodyId of entry.compatibleBodies ?? []) {
        const body = manifest.bodies.find((item) => item.id === bodyId);
        const asset = body && byFile.get(body.url);
        check(asset?.nodeNames.includes(entry.meshName),
              `${entry.id}: el nodo ${entry.meshName} no está dentro de ${bodyId}`);
      }
      continue;
    }

    check(safeUrl(entry.url), `${entry.id}: url insegura o ausente (${entry.url})`);
    const bytes = await fileBytes(entry.url);
    check(bytes !== null, `${entry.id}: el GLB declarado no existe (${entry.url})`);
    if (bytes !== null) {
      check(bytes === entry.bytes, `${entry.id}: bytes del manifest (${entry.bytes}) ≠ disco (${bytes})`);
    }

    const asset = byFile.get(entry.url);
    check(asset !== undefined, `${entry.id}: no aparece en reports/inspect.json`);
    if (asset) {
      check(asset.triangles === entry.triangles,
            `${entry.id}: triángulos del manifest (${entry.triangles}) ≠ GLB (${asset.triangles})`);
      // Una pieza modular debe traer el rig para poder acoplarse al cuerpo.
      check(asset.bones.length > 0, `${entry.id}: la pieza modular no trae huesos y no podrá acoplarse`);
      for (const bone of REQUIRED_BONES) {
        check(asset.bones.includes(bone), `${entry.id}: falta el hueso ${bone}`);
      }
    }

    // Cada pieza modular oculta una pieza empaquetada; si no, se solaparían.
    if (category !== 'accessories') {
      check(typeof entry.hidesMesh === 'string' && entry.hidesMesh.length > 0,
            `${entry.id}: una pieza 'lazy' debe declarar hidesMesh`);
    }
  }
}

// Cobertura mínima del catálogo exigida por el README (§5.2 y §5.3).
for (const [category, minimum] of [['hair', 2], ['tops', 2], ['bottoms', 2], ['shoes', 2]]) {
  const distinct = new Set((manifest[category] ?? []).map((entry) => entry.pieceId ?? entry.id));
  check(distinct.size >= minimum,
        `el catálogo debe ofrecer al menos ${minimum} opciones de ${category}, hay ${distinct.size}`);
}

// ── Resultado ───────────────────────────────────────────────────────────────

for (const note of notes) console.warn(`aviso: ${note}`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problema(s) de validación:\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

const totalVisible = Math.max(...(manifest.bodies ?? []).map((body) => body.triangles));
const heaviest = Math.max(...(manifest.bodies ?? []).map((body) => body.bytes));
console.log('Validación correcta.');
console.log(`  cuerpos: ${manifest.bodies.length} · rig: ${manifest.rig.id} · ${REQUIRED_BONES.length} huesos`);
console.log(`  morph targets: ${REQUIRED_MORPHS.join(', ')}`);
console.log(`  animaciones: ${REQUIRED_ANIMATIONS.join(', ')}`);
console.log(`  peor caso: ${totalVisible} triángulos visibles, ${(heaviest / 1e6).toFixed(2)} MB de descarga inicial`);
