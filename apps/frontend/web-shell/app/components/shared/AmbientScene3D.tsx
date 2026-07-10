/* ───────────────────────────────────────────
   AmbientScene3D — fondo WebGL simple
   Nada de geometría compleja: solo un puñado
   de orbes suaves ("bokeh") flotando en
   trayectorias lentas y motas de luz que
   ascienden, en la paleta verde/azul/dorado
   de Rumbo. Fijo detrás de TODA la aplicación
   (z-index muy negativo, pointer-events none).
   Todo unlit (MeshBasicMaterial/SpriteMaterial/
   PointsMaterial): el color que se define es
   siempre el que se ve, sin depender de luces.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 55;
const ORB_COLORS = [0x4fc276, 0x2f7ef0, 0xffc400];

/** Textura radial suave, reutilizada para orbes y partículas */
function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(180,235,190,0.5)');
  gradient.addColorStop(1, 'rgba(180,235,190,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

export function AmbientScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealId = requestAnimationFrame(() => container.classList.add('visible'));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const glowTexture = createGlowTexture();

    /* ── Orbes de bokeh: 3 esferas de luz suave, flotando muy lento ── */
    const orbMaterials: THREE.SpriteMaterial[] = [];
    const orbs: THREE.Sprite[] = [];
    const orbSeeds = ORB_COLORS.map(() => ({
      speed: 0.05 + Math.random() * 0.05,
      radius: 2.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      baseY: (Math.random() - 0.5) * 3,
    }));
    ORB_COLORS.forEach((color, i) => {
      const material = new THREE.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      const scale = 4.5 + Math.random() * 2.5;
      sprite.scale.set(scale, scale, 1);
      scene.add(sprite);
      orbs.push(sprite);
      orbMaterials.push(material);
    });

    /* ── Partículas de "conocimiento" ascendiendo ── */
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = Math.random() * 7 - 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.1 + Math.random() * 0.16;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.11,
      map: glowTexture,
      transparent: true,
      opacity: 0.4,
      color: 0x8ad8a3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    /* ── Bucle de animación ── */
    const clock = new THREE.Clock();
    let smoothedProgress = scrollProgress();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      /* Deriva muy ligera de cámara según el scroll — un toque de vida, sin órbita */
      const target = scrollProgress();
      smoothedProgress += (target - smoothedProgress) * 0.05;
      camera.position.y = -smoothedProgress * 1.2;

      /* Orbes flotando en trayectorias suaves e independientes */
      orbs.forEach((orb, i) => {
        const seed = orbSeeds[i];
        orb.position.set(
          Math.sin(elapsed * seed.speed + seed.phase) * seed.radius,
          seed.baseY + Math.cos(elapsed * seed.speed * 0.7 + seed.phase) * 1.2,
          -2 - i * 1.5,
        );
      });

      /* Partículas ascendiendo y reapareciendo abajo */
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let y = posAttr.getY(i) + speeds[i] * delta;
        if (y > 3.5) y = -3.5;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(revealId);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      orbMaterials.forEach((m) => m.dispose());
      glowTexture.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="ambient-scene-layer" aria-hidden />;
}
