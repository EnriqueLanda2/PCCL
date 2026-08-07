/**
 * Fase D-3 — Inspección de los GLB publicados.
 *
 * Lee lo que realmente se va a servir al navegador (no el crudo) y vuelca un
 * inventario: escenas, mallas, primitivas, materiales, texturas, huesos, morph
 * targets, animaciones y triángulos. Es la fuente de verdad del informe final y
 * lo que consume `validate.mjs`.
 *
 *   pnpm --filter frontend avatar:inspect
 */

import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

import { ASSET_DIRS, PUBLIC_DIR, REPORTS_DIR } from './config.mjs';

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });

const GLB_DIRS = ASSET_DIRS.filter((dir) => dir !== 'thumbnails');

/** Triángulos de una primitiva, respetando su modo de dibujo. */
function primitiveTriangles(primitive) {
  const indices = primitive.getIndices();
  const position = primitive.getAttribute('POSITION');
  const count = indices ? indices.getCount() : (position?.getCount() ?? 0);
  // 4 = TRIANGLES, 5 = TRIANGLE_STRIP, 6 = TRIANGLE_FAN
  switch (primitive.getMode()) {
    case 4: return Math.floor(count / 3);
    case 5:
    case 6: return Math.max(0, count - 2);
    default: return 0;
  }
}

async function inspectFile(dir, name) {
  const filePath = path.join(PUBLIC_DIR, dir, name);
  const document = await io.read(filePath);
  const root = document.getRoot();

  let triangles = 0;
  let primitives = 0;
  const morphTargets = new Set();
  const meshNames = [];

  for (const mesh of root.listMeshes()) {
    meshNames.push(mesh.getName());
    for (const primitive of mesh.listPrimitives()) {
      primitives += 1;
      triangles += primitiveTriangles(primitive);
    }
    // Los nombres de los morph targets viven en `extras.targetNames` del mesh.
    const names = mesh.getExtras()?.targetNames;
    if (Array.isArray(names)) names.forEach((entry) => morphTargets.add(entry));
  }

  const bones = new Set();
  for (const skin of root.listSkins()) {
    for (const joint of skin.listJoints()) bones.add(joint.getName());
  }

  // Nombres de nodo: son los que GLTFLoader asigna a `Object3D.name`, y por
  // tanto los únicos con los que el frontend puede localizar una prenda. El
  // nombre del datablock de malla lleva sufijo y no sirve para eso.
  const nodeNames = root
    .listNodes()
    .filter((node) => node.getMesh() !== null)
    .map((node) => node.getName());

  return {
    file: `/avatars/custom/${dir}/${name}`,
    bytes: (await stat(filePath)).size,
    scenes: root.listScenes().length,
    nodes: root.listNodes().length,
    meshes: root.listMeshes().length,
    meshNames,
    nodeNames,
    primitives,
    materials: root.listMaterials().map((material) => material.getName()),
    textures: root.listTextures().length,
    skins: root.listSkins().length,
    bones: [...bones].sort(),
    triangles,
    morphTargets: [...morphTargets].sort(),
    animations: root.listAnimations().map((animation) => animation.getName()).sort(),
    extensions: root.listExtensionsUsed().map((extension) => extension.extensionName).sort(),
  };
}

const assets = [];
for (const dir of GLB_DIRS) {
  const entries = await readdir(path.join(PUBLIC_DIR, dir)).catch(() => []);
  for (const name of entries.filter((entry) => entry.toLowerCase().endsWith('.glb'))) {
    assets.push(await inspectFile(dir, name));
  }
}

if (assets.length === 0) {
  console.error('No hay GLB publicados que inspeccionar. Ejecuta avatar:build y avatar:optimize.');
  process.exit(1);
}

const report = { generatedAt: new Date().toISOString(), assets };
await writeFile(path.join(REPORTS_DIR, 'inspect.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const asset of assets) {
  console.log(
    `${asset.file}\n` +
      `  ${(asset.bytes / 1024).toFixed(0)} KB · ${asset.triangles} tris · ` +
      `${asset.meshes} mallas · ${asset.materials.length} materiales · ${asset.textures} texturas · ` +
      `${asset.bones.length} huesos · ${asset.morphTargets.length} morphs · ` +
      `${asset.animations.length} animaciones`,
  );
}
console.log(`\nInventario escrito en ${path.join(REPORTS_DIR, 'inspect.json')}`);
