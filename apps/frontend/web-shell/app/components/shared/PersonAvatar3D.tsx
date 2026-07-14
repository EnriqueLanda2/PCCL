/* ───────────────────────────────────────────
   PersonAvatar3D — muñeco 3D procedural con
   proporciones humanas normales (no "chibi"):
   playera + pantalón + cabello simple, de pie,
   construido con geometría primitiva de
   three.js. No usa ningún asset ni cuenta
   externa — no es una réplica de ningún
   personaje con derechos de autor, solo un
   estilo casual genérico propio.

   Color de camisa/piel/cabello determinísticos
   por userId (mismo alumno → mismo avatar
   siempre).
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const SHIRT_COLORS = [0x00c9ff, 0xff2e9a, 0xb026ff, 0x39a35c, 0xe0a400, 0x3d8bff, 0xe0522f];
const SKIN_TONES = [0xe3b48a, 0xc48a5e, 0x8d5a3b, 0x4a2f22];
const HAIR_COLORS = [0x2b1c14, 0x1b1b24, 0x5c3a21, 0x8a8a8a];
const PANTS_COLOR = 0x2b2f38;
const SHOE_COLOR = 0x1a1a1f;

function hashString(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function buildPerson(userId: string): THREE.Group {
  const hash = hashString(userId);
  const shirtColor = SHIRT_COLORS[hash % SHIRT_COLORS.length];
  const skinColor = SKIN_TONES[Math.floor(hash / SHIRT_COLORS.length) % SKIN_TONES.length];
  const hairColor = HAIR_COLORS[Math.floor(hash / (SHIRT_COLORS.length * SKIN_TONES.length)) % HAIR_COLORS.length];
  const withGlasses = hash % 3 === 0;

  const group = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: PANTS_COLOR, roughness: 0.65 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.45 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: SHOE_COLOR, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1b1b24, roughness: 0.3 });
  const glassesMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1f, roughness: 0.2, metalness: 0.4 });

  /* Pies */
  const shoeGeo = new THREE.BoxGeometry(0.16, 0.08, 0.26);
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
  shoeL.position.set(-0.12, 0.04, 0.05);
  const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
  shoeR.position.set(0.12, 0.04, 0.05);
  group.add(shoeL, shoeR);

  /* Piernas (más largas y delgadas — proporción real) */
  const legGeo = new THREE.CapsuleGeometry(0.1, 0.62, 4, 8);
  const legL = new THREE.Mesh(legGeo, pantsMat);
  legL.position.set(-0.12, 0.46, 0);
  const legR = new THREE.Mesh(legGeo, pantsMat);
  legR.position.set(0.12, 0.46, 0);
  group.add(legL, legR);

  /* Cadera */
  const hip = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.06, 4, 8), pantsMat);
  hip.position.y = 0.86;
  group.add(hip);

  /* Torso (playera) */
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.5, 4, 12), shirtMat);
  torso.position.y = 1.18;
  group.add(torso);

  /* Brazos (manga corta: hombro con color de camisa, antebrazo piel) */
  const sleeveGeo = new THREE.CapsuleGeometry(0.075, 0.2, 4, 8);
  const forearmGeo = new THREE.CapsuleGeometry(0.06, 0.32, 4, 8);
  for (const side of [-1, 1]) {
    const sleeve = new THREE.Mesh(sleeveGeo, shirtMat);
    sleeve.position.set(0.28 * side, 1.34, 0);
    sleeve.rotation.z = 0.12 * side;
    group.add(sleeve);

    const forearm = new THREE.Mesh(forearmGeo, skinMat);
    forearm.position.set(0.32 * side, 1.06, 0);
    forearm.rotation.z = 0.08 * side;
    group.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), skinMat);
    hand.position.set(0.34 * side, 0.88, 0);
    group.add(hand);
  }

  /* Cuello */
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.08, 12), skinMat);
  neck.position.y = 1.48;
  group.add(neck);

  /* Cabeza (proporción real, no agrandada) */
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 20), skinMat);
  head.position.y = 1.62;
  group.add(head);

  /* Cabello */
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.168, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
  hair.position.y = 1.655;
  group.add(hair);

  if (withGlasses) {
    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.03), glassesMat);
    glasses.position.set(0, 1.62, 0.145);
    group.add(glasses);
  } else {
    const eyeGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.055, 1.625, 0.15);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.055, 1.625, 0.15);
    group.add(eyeL, eyeR);
  }

  return group;
}

interface PersonAvatar3DProps {
  userId: string;
  size?: number;
  height?: number;
  interactive?: boolean;
  autoRotate?: boolean;
}

export function PersonAvatar3D({ userId, size = 110, height, interactive = false, autoRotate = true }: PersonAvatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const h = height ?? size * 1.5;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, size / h, 0.1, 20);
    camera.position.set(0, 1.05, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2, 4, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x88ccff, 0.5);
    rim.position.set(-2, 1, -3);
    scene.add(rim);

    const person = buildPerson(userId);
    person.position.y = -0.85;
    scene.add(person);

    let controls: OrbitControls | null = null;
    if (interactive) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.55, 0);
      controls.enablePan = false;
      controls.minDistance = 2.2;
      controls.maxDistance = 6;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 2.2;
      controls.update();
    }

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!interactive && autoRotate) person.rotation.y += 0.011;
      controls?.update();
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      controls?.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => m.dispose());
        }
      });
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [userId, size, h, interactive, autoRotate]);

  return <div ref={containerRef} style={{ width: size, height: h }} />;
}
