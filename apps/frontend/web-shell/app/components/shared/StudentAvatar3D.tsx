/* ───────────────────────────────────────────
   StudentAvatar3D — visor 3D interactivo (rotable
   con mouse/touch) de un avatar Ready Player Me,
   usado en el panel lateral de detalle de un
   alumno (no en la grilla — cargar un .glb por
   tarjeta sería demasiado pesado para 12 a la vez).

   Solo se monta cuando hay un avatarId real
   configurado en lib/rpmAvatars.ts; si no, el
   caller debe mostrar el fallback de iniciales.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { rpm3dModelUrl } from '@/lib/rpmAvatars';

interface StudentAvatar3DProps {
  avatarId: string;
  height?: number;
}

export function StudentAvatar3D({ avatarId, height = 320 }: StudentAvatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setStatus('loading');

    const width = container.clientWidth || 280;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.1, 0);
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
    controls.update();

    let rafId = 0;
    let disposed = false;
    let model: THREE.Object3D | null = null;

    const loader = new GLTFLoader();
    loader.load(
      rpm3dModelUrl(avatarId),
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        scene.add(model);
        setStatus('ready');
      },
      undefined,
      () => { if (!disposed) setStatus('error'); },
    );

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.clientWidth || 280;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (model) {
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
            materials.forEach((m) => m.dispose());
          }
        });
      }
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [avatarId, height]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', color: 'var(--ink-muted)' }}>
          Cargando avatar 3D…
        </div>
      )}
      {status === 'error' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', color: 'var(--ink-muted)' }}>
          No se pudo cargar el avatar 3D.
        </div>
      )}
    </div>
  );
}
