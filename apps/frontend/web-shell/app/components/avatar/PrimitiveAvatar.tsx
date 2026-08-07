'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPose } from '@/lib/avatar/catalog';
import type { AvatarConfiguration } from '@/lib/avatar/types';

/* ───────────────────────────────────────────
   Avatar de respaldo — MARCADOR DE POSICIÓN
   ───────────────────────────────────────────
   Esto NO pretende cumplir el listón visual del proyecto. Es una silueta
   legible para que el editor, las luces, las poses y la exportación se puedan
   usar y probar antes de que exista una malla real.

   Se sustituye en cuanto hay un avatar del proveedor: ver AvatarStage.
   ─────────────────────────────────────────── */

const SKIN = '#C98C63';
const CLOTH = '#4FA870';
const PANTS = '#3A4A5C';

function useMaterial(color: string, roughness = 0.72) {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 }),
    [color, roughness],
  );
}

export function PrimitiveAvatar({ config }: Readonly<{ config: AvatarConfiguration }>) {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  const skin = useMaterial(SKIN);
  const cloth = useMaterial(CLOTH, 0.85);
  const pants = useMaterial(PANTS, 0.88);

  const feminine = config.gender === 'feminine';
  const shoulder = feminine ? 0.19 : 0.23;

  const pose = getPose(config.presentation.poseId);

  useFrame((_, delta) => {
    const t = Math.min(1, delta * 8);
    const [, , lz] = pose.boneRotations.LeftArm ?? [0, 0, 0];
    const [, , rz] = pose.boneRotations.RightArm ?? [0, 0, 0];
    if (leftArm.current) leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, 0.08 + lz, t);
    if (rightArm.current) rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, -0.08 + rz, t);
    if (root.current) root.current.position.y = Math.sin(performance.now() / 1400) * 0.005;
  });

  return (
    <group ref={root} dispose={null}>
      {/* Cabeza */}
      <mesh position={[0, 1.52, 0]} material={skin} castShadow>
        <sphereGeometry args={[0.115, 32, 24]} />
      </mesh>
      {/* Cuello */}
      <mesh position={[0, 1.40, 0]} material={skin} castShadow>
        <cylinderGeometry args={[0.042, 0.05, 0.08, 16]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.14, 0]} material={cloth} castShadow receiveShadow>
        <capsuleGeometry args={[feminine ? 0.135 : 0.152, 0.30, 8, 24]} />
      </mesh>

      {/* Brazos */}
      <group ref={leftArm} position={[shoulder, 1.30, 0]}>
        <mesh position={[0, -0.20, 0]} material={skin} castShadow>
          <capsuleGeometry args={[0.043, 0.30, 6, 16]} />
        </mesh>
      </group>
      <group ref={rightArm} position={[-shoulder, 1.30, 0]}>
        <mesh position={[0, -0.20, 0]} material={skin} castShadow>
          <capsuleGeometry args={[0.043, 0.30, 6, 16]} />
        </mesh>
      </group>

      {/* Piernas */}
      <mesh position={[0.075, 0.62, 0]} material={pants} castShadow>
        <capsuleGeometry args={[0.056, 0.44, 6, 16]} />
      </mesh>
      <mesh position={[-0.075, 0.62, 0]} material={pants} castShadow>
        <capsuleGeometry args={[0.056, 0.44, 6, 16]} />
      </mesh>
    </group>
  );
}
