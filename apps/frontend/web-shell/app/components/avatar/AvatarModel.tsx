'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { getExpression, getPose } from '@/lib/avatar/catalog';
import {
  hiddenMeshNames,
  lazyPieces,
  resolveColor,
  TINT_TARGETS,
  type TintChannel,
} from '@/lib/avatar/custom';
import { adaptMorphTargets } from '@/lib/avatar/provider';
import type { AvatarConfiguration } from '@/lib/avatar/types';

/* Suavizado de morphs y poses: saltar de golpe entre expresiones se ve robótico.
   Cuanto mayor, más rápido converge. */
const BLEND_SPEED = 8;

/** Material del GLB → color hex pedido por la configuración. */
function buildTints(config: AvatarConfiguration): Map<string, string> {
  const tints = new Map<string, string>();
  if (config.source.provider !== 'custom') return tints;
  for (const [channel, materials] of Object.entries(TINT_TARGETS)) {
    const { hex } = resolveColor(channel as TintChannel, config.colors[channel as TintChannel]);
    for (const material of materials) tints.set(material, hex);
  }
  return tints;
}

/** Aplica los tintes sobre los materiales (ya clonados) de un objeto. */
function applyTints(root: THREE.Object3D, tints: Map<string, string>) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      const hex = material && tints.get(material.name);
      if (hex && 'color' in material) {
        (material as THREE.MeshStandardMaterial).color.set(hex);
      }
    }
  });
}

/** Clona los materiales de un objeto para que sean propios de esta instancia. */
function ownMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.material = Array.isArray(child.material)
      ? child.material.map((material) => material.clone())
      : child.material.clone();
  });
}

function disposeMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      material.dispose();
    }
  });
}

/**
 * Pieza modular del catálogo acoplada al esqueleto del cuerpo.
 *
 * La prenda viaja en su propio GLB con una copia del mismo rig. En vez de
 * animar dos esqueletos en paralelo (que se desincronizan), se toma la malla y
 * se **reasocia al esqueleto del cuerpo**, emparejando los huesos por nombre y
 * no por índice: así la pieza sigue exactamente la animación del cuerpo aunque
 * el exportador reordene las articulaciones.
 *
 * Se monta como hijo del mismo grupo que el cuerpo para compartir espacio de
 * mundo, y al desmontarse libera su GLTF de la caché: una prenda que ya no se
 * ve no debe seguir ocupando memoria de GPU.
 */
function AttachedPiece({
  url,
  root,
  bones,
  tints,
}: Readonly<{
  url: string;
  root: THREE.Object3D | null;
  bones: Map<string, THREE.Bone> | null;
  tints: Map<string, string>;
}>) {
  const { scene } = useGLTF(url);
  const attachedRef = useRef<THREE.SkinnedMesh | null>(null);

  useEffect(() => {
    if (!root || !bones) return;

    let source: THREE.SkinnedMesh | null = null;
    scene.traverse((child) => {
      if (!source && (child as THREE.SkinnedMesh).isSkinnedMesh) source = child as THREE.SkinnedMesh;
    });
    if (!source) return;
    const original = source as THREE.SkinnedMesh;

    const remapped = original.skeleton.bones.map((bone) => bones.get(bone.name));
    /* Si al rig del cuerpo le falta algún hueso de la pieza, no se acopla nada:
       es preferible que falte la prenda a montar una malla que se deforme mal. */
    if (remapped.some((bone) => bone === undefined)) return;

    const material = Array.isArray(original.material)
      ? original.material.map((entry) => entry.clone())
      : original.material.clone();

    const attached = new THREE.SkinnedMesh(original.geometry, material);
    attached.name = `Attached_${original.name}`;
    attached.castShadow = true;
    attached.receiveShadow = true;
    attached.bind(
      new THREE.Skeleton(remapped as THREE.Bone[], original.skeleton.boneInverses),
      original.bindMatrix,
    );

    root.add(attached);
    attachedRef.current = attached;

    return () => {
      root.remove(attached);
      disposeMaterials(attached);
      attached.skeleton.dispose();
      attachedRef.current = null;
      /* La geometría pertenece al GLTF cacheado, así que se libera vaciando la
         entrada de caché en lugar de destruirla aquí. */
      useGLTF.clear(url);
    };
  }, [scene, root, bones, url]);

  useEffect(() => {
    if (attachedRef.current) applyTints(attachedRef.current, tints);
  }, [tints]);

  return null;
}

interface AvatarModelProps {
  url: string;
  config: AvatarConfiguration;
  onReady?: () => void;
}

/**
 * Renderiza el GLB del avatar y le aplica vestuario, color, expresión y pose.
 *
 * Trabaja siempre sobre un clon del escenario: `useGLTF` cachea el GLTF por URL
 * y varias instancias compartirían el mismo grafo, de modo que mover un hueso
 * en una afectaría a las demás.
 */
export function AvatarModel({ url, config, onReady }: Readonly<AvatarModelProps>) {
  const { scene, animations } = useGLTF(url);
  const rootRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  /** true cuando un clip del GLB ya articula esta pose. */
  const clipDrivenRef = useRef(false);

  const cloned = useMemo(() => {
    const clone = cloneSkeleton(scene) as THREE.Group;
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;
      }
    });
    /* Materiales propios de esta instancia. `SkeletonUtils.clone` los comparte
       con el GLTF cacheado: teñir uno cambiaría todos los avatares en pantalla,
       y liberarlos al desmontar dejaría sin material a la entrada de caché. */
    ownMaterials(clone);
    return clone;
  }, [scene]);

  /* El rig vive en un ref, no en useMemo, a propósito: cada frame se mutan
     huesos e influencias de morph, y el compilador de React considera inmutable
     todo lo que sale de un useMemo. Un ref es el contenedor correcto para
     estado imperativo de three.js.

     La pose de descanso se captura una vez por clon para poder aplicar las
     rotaciones como delta y no acumularlas frame a frame. */
  const rig = useRef<{
    rest: Map<string, THREE.Euler>;
    bones: Map<string, THREE.Bone>;
    morphs: THREE.Mesh[];
  } | null>(null);

  /* El índice de huesos se deriva del clon, no se lee del ref: las piezas
     modulares lo necesitan durante el render, y un ref todavía vacío en el
     primer render las dejaría sin acoplar hasta el siguiente cambio. */
  const bonesByName = useMemo(() => {
    const bones = new Map<string, THREE.Bone>();
    cloned.traverse((child) => {
      if (child instanceof THREE.Bone) bones.set(child.name, child);
    });
    return bones;
  }, [cloned]);

  useEffect(() => {
    const rest = new Map<string, THREE.Euler>();
    const morphs: THREE.Mesh[] = [];

    cloned.traverse((child) => {
      if (child instanceof THREE.Bone) {
        rest.set(child.name, child.rotation.clone());
      } else if (child instanceof THREE.Mesh && child.morphTargetDictionary && child.morphTargetInfluences) {
        morphs.push(child);
      }
    });

    rig.current = { rest, bones: bonesByName, morphs };
    onReady?.();
  }, [cloned, bonesByName, onReady]);

  /* Vestuario: se muestran u ocultan las mallas empaquetadas dentro del GLB del
     cuerpo. Cambiar de prenda por visibilidad evita reconstruir la escena y no
     descarga nada; solo las alternativas viajan en su propio archivo. */
  const bodyId = config.source.provider === 'custom' ? config.source.bodyId : '';
  const wardrobe = config.wardrobe;

  const hidden = useMemo(() => {
    if (!bodyId) return new Set<string>();
    return new Set(
      hiddenMeshNames(bodyId, {
        hair: wardrobe.hairId,
        tops: wardrobe.topId,
        bottoms: wardrobe.bottomId,
        shoes: wardrobe.shoesId,
      }),
    );
  }, [bodyId, wardrobe.hairId, wardrobe.topId, wardrobe.bottomId, wardrobe.shoesId]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) child.visible = !hidden.has(child.name);
    });
  }, [cloned, hidden]);

  const pieces = useMemo(() => {
    if (!bodyId) return [];
    return lazyPieces(bodyId, {
      hair: wardrobe.hairId,
      tops: wardrobe.topId,
      bottoms: wardrobe.bottomId,
      shoes: wardrobe.shoesId,
      accessories: wardrobe.accessoryId,
    });
  }, [bodyId, wardrobe.hairId, wardrobe.topId, wardrobe.bottomId, wardrobe.shoesId, wardrobe.accessoryId]);

  const tints = useMemo(() => buildTints(config), [config]);

  useEffect(() => {
    applyTints(cloned, tints);
  }, [cloned, tints]);

  useEffect(() => {
    const mixer = new THREE.AnimationMixer(cloned);
    mixerRef.current = mixer;

    const animationByPose: Record<string, string> = {
      idle: 'Idle',
      relaxed: 'Breathing',
      presenting: 'Presentation',
      wave: 'Wave',
    };
    const clipName = animationByPose[config.presentation.poseId] ?? 'Idle';
    const clip = THREE.AnimationClip.findByName(animations, clipName) ?? animations[0];

    /* Si existe el clip correspondiente a la pose, la animación manda y NO se
       aplican además las rotaciones estáticas del catálogo. Aplicar las dos
       cosas las pone a competir: el bucle de frame escribe la rotación estática
       después del mixer y la anula, que es lo que dejaba el brazo del saludo
       metido dentro del torso. Las rotaciones del catálogo siguen siendo el
       camino para mallas sin clips (Ready Player Me). */
    clipDrivenRef.current = Boolean(THREE.AnimationClip.findByName(animations, clipName));

    if (clip) {
      const action = mixer.clipAction(clip);
      action.reset().fadeIn(0.2).play();
      actionRef.current = action;
    }

    return () => {
      actionRef.current?.fadeOut(0.1);
      mixer.stopAllAction();
      mixer.uncacheRoot(cloned);
      mixerRef.current = null;
      actionRef.current = null;
    };
  }, [animations, cloned, config.presentation.poseId]);

  /* Liberación explícita. R3F desmonta el grafo, pero la GPU no libera
     materiales ni texturas por sí sola: sin esto, cambiar de avatar repetidas
     veces filtra memoria de vídeo.

     Solo se libera lo que esta instancia posee (sus materiales clonados). La
     geometría la comparte con el GLTF cacheado, así que destruirla aquí dejaría
     inservible la entrada de caché para el siguiente montaje; de esa memoria se
     encarga quien invalida la caché. */
  useEffect(() => {
    const disposable = cloned;
    return () => disposeMaterials(disposable);
  }, [cloned]);

  const expression = getExpression(config.presentation.expressionId);
  const pose = getPose(config.presentation.poseId);
  /* Las expresiones del catálogo hablan ARKit; el adaptador del proveedor las
     traduce a los nombres canónicos de las mallas propias. */
  const morphWeights = useMemo(
    () => adaptMorphTargets(config.source.provider, expression.morphTargets),
    [config.source.provider, expression.morphTargets],
  );

  /* eslint-disable react-hooks/immutability --
     El compilador considera inmutable todo lo alcanzable desde un ref, pero
     aquí es demasiado conservador: useFrame es un callback de animación, no
     fase de render, y animar un personaje en three.js consiste precisamente en
     mutar huesos e influencias de morph en cada frame. Reconstruir esos objetos
     por frame destruiría el rendimiento y rompería el skinning. */
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
    const current = rig.current;
    if (!current) return;
    const t = Math.min(1, delta * BLEND_SPEED);

    /* Expresión: se interpola hacia el peso objetivo. Un morph que el modelo no
       tenga simplemente no aparece en el diccionario y se ignora. */
    for (const mesh of current.morphs) {
      const dictionary = mesh.morphTargetDictionary!;
      const influences = mesh.morphTargetInfluences!;
      for (const [name, index] of Object.entries(dictionary)) {
        const target = morphWeights[name] ?? 0;
        influences[index] = THREE.MathUtils.lerp(influences[index] ?? 0, target, t);
      }
    }

    /* Pose: delta sobre la pose de descanso, nunca absoluta. Solo para mallas
       sin clip para esta pose; si el GLB la anima, se deja pasar el mixer. */
    if (!clipDrivenRef.current) {
      for (const [name, bone] of current.bones) {
        const rest = current.rest.get(name);
        if (!rest) continue;
        const [rx, ry, rz] = pose.boneRotations[name] ?? [0, 0, 0];
        bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, rest.x + rx, t);
        bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, rest.y + ry, t);
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, rest.z + rz, t);
      }
    }

    /* Respiración: micro-movimiento que evita la sensación de maniquí. */
    if (rootRef.current) {
      const breath = Math.sin(performance.now() / 1400) * 0.004;
      rootRef.current.position.y = breath;
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group ref={rootRef} dispose={null}>
      <primitive object={cloned} />
      {pieces.map((piece) =>
        piece.url ? (
          <AttachedPiece key={piece.id} url={piece.url} root={cloned} bones={bonesByName} tints={tints} />
        ) : null,
      )}
    </group>
  );
}
