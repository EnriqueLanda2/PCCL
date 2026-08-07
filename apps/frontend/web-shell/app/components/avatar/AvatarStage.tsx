'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarModel } from './AvatarModel';
import { PrimitiveAvatar } from './PrimitiveAvatar';
import { getBackground } from '@/lib/avatar/catalog';
import { resolveAvatarModelUrl } from '@/lib/avatar/provider';
import { useAvatarStore } from '@/lib/avatar/store';
import type { AvatarConfiguration } from '@/lib/avatar/types';

/* Encuadre de cuerpo entero.

   Los avatares propios miden 1.70 m y se apoyan en y=0. Con un FOV vertical de
   32° la altura visible es 2·d·tan(16°) ≈ 0.573·d, así que a 3.2 m entran algo
   más de 1.8 m: el personaje completo con aire arriba y abajo. Acortar esta
   distancia recorta los pies, que es justo lo que hay que evitar en un editor
   donde se elige el calzado.

   32° además mantiene la perspectiva contenida: un FOV ancho en primer plano
   deforma la nariz y rompe la lectura del rostro. */
const CAMERA = { position: [0, 1.05, 3.2] as [number, number, number], fov: 32 };

/** Punto al que mira la cámara: centro de masa aproximado del personaje. */
const CAMERA_TARGET: [number, number, number] = [0, 0.88, 0];

/* ── Iluminación de estudio de tres puntos ──
   Key cálida al frente-izquierda, fill fría y suave a la derecha para levantar
   sombras sin aplanar, y rim detrás para separar la silueta del fondo. */
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2.4, 3.2, 2.6]}
        intensity={2.1}
        color="#FFF3E2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 12]} />
      </directionalLight>
      <directionalLight position={[-2.8, 1.6, 1.4]} intensity={0.55} color="#DCE9FF" />
      <directionalLight position={[0, 2.2, -3.2]} intensity={0.9} color="#FFFFFF" />
    </>
  );
}

/** Expone el renderer para poder exportar el retrato desde fuera del Canvas. */
function CaptureBridge({ onReady }: Readonly<{ onReady: (fn: () => string | null) => void }>) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    onReady(() => {
      try {
        /* Se fuerza un render inmediato: con `preserveDrawingBuffer` desactivado
           el búfer puede estar vacío en el momento de leerlo. */
        gl.render(scene, camera);
        return gl.domElement.toDataURL('image/png');
      } catch {
        return null;
      }
    });
  }, [gl, scene, camera, onReady]);

  return null;
}

function AvatarContent({ config }: Readonly<{ config: AvatarConfiguration }>) {
  const setStatus = useAvatarStore((s) => s.setStatus);

  const modelUrl = useMemo(() => resolveAvatarModelUrl(config), [config]);

  const handleReady = useCallback(() => setStatus('ready'), [setStatus]);

  if (!modelUrl) return <PrimitiveAvatar config={config} />;
  return <AvatarModel url={modelUrl} config={config} onReady={handleReady} />;
}

interface AvatarStageProps {
  config: AvatarConfiguration;
  onCaptureReady?: (capture: () => string | null) => void;
}

export function AvatarStage({ config, onCaptureReady }: Readonly<AvatarStageProps>) {
  const background = getBackground(config.presentation.backgroundId);
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  /* Calidad adaptativa: en equipos modestos se limita el pixel ratio antes que
     dejar caer los fps. Se calcula en el inicializador y no en un efecto porque
     este componente solo se monta en cliente (dynamic con ssr:false), así que
     `navigator` ya existe en el primer render y no hay riesgo de hidratación. */
  const [dpr] = useState<[number, number]>(() =>
    (navigator.hardwareConcurrency ?? 4) <= 4 ? [1, 1.5] : [1, 2],
  );

  const handleCapture = useCallback(
    (fn: () => string | null) => onCaptureReady?.(fn),
    [onCaptureReady],
  );

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[1rem]"
      style={{ background: `linear-gradient(160deg, ${background.from} 0%, ${background.to} 100%)` }}
    >
      <Canvas
        shadows
        dpr={dpr}
        camera={CAMERA}
        /* preserveDrawingBuffer permite exportar el retrato a PNG. Tiene coste
           de memoria, por eso no se activa a la ligera en otras escenas. */
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <StudioLighting />
        <Environment preset="studio" environmentIntensity={0.45} />

        <Suspense fallback={null}>
          <AvatarContent config={config} />
        </Suspense>

        <ContactShadows position={[0, 0, 0]} opacity={0.32} scale={4} blur={2.6} far={2.4} resolution={512} />

        <OrbitControls
          ref={controls}
          makeDefault
          target={CAMERA_TARGET}
          enablePan={false}
          minDistance={1.6}
          maxDistance={5.0}
          /* Se impide bajar de la horizontal: mirar al avatar desde abajo
             deforma el rostro y rompe la lectura del personaje. */
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.95}
          enableDamping
          dampingFactor={0.08}
        />

        <CaptureBridge onReady={handleCapture} />
      </Canvas>
    </div>
  );
}

/** Permite precargar el GLB antes de montar la escena. */
export function preloadAvatar(url: string) {
  useGLTF.preload(url);
}
