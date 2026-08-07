# Pipeline Blender de avatares PCCL

Genera los humanos estilizados de PCCL: malla, rig, materiales, morph targets y
animaciones, sin ningún paso manual. La salida son los `.blend` fuente y los GLB
en crudo que después optimiza `tools/avatar-pipeline`.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `proportions.py` | Canon de medidas. Único sitio donde vive la proporción. |
| `create_materials.py` | Paleta y materiales `Principled BSDF` (acabado vinilo). |
| `build_rig.py` | Esqueleto compartido y pesado automático por calor. |
| `build_avatar.py` | Geometría, rostro, vestuario, animación y exportación. |
| `validate_scene.py` | Validación de una escena `.blend`; falla con código ≠ 0. |
| `export_glb.py` | Reexporta un `.blend` ya construido sin reconstruirlo. |

## Cómo se construye el cuerpo

El cuerpo **no** se ensambla con cápsulas sueltas. El proceso es:

1. **Blockout**: cadenas de elipsoides a lo largo de los ejes del esqueleto
   (torso por lonchas, brazos y piernas por cadenas con radio variable).
2. **Remallado por vóxeles** (`voxel_remesh`): funde todas las piezas en una
   única superficie manifold y continua. Aquí desaparecen las juntas: hombros,
   codos y rodillas quedan como transiciones orgánicas.
3. **Suavizado y decimado** al presupuesto de triángulos.
4. **Pesado automático por calor** (`ARMATURE_AUTO`), limitado a 4 influencias
   por vértice y normalizado.

El paso 2 es lo que hace posible el paso 4: el pesado por calor necesita una
malla cerrada para repartir cada vértice entre varios huesos. Con piezas sueltas
cada objeto acaba atado rígidamente a un solo hueso y las articulaciones se
parten al animar.

La **ropa** se construye igual —volúmenes cerrados inflados sobre el mismo
perfil que el cuerpo— y no como cáscaras recortadas. Una cáscara necesita un
borde, y cualquier borde generado por umbral sobre malla decimada sale dentado.
Un volumen cerrado no tiene borde: el cuello, las muñecas y los tobillos
emergen atravesando la superficie.

La **cabeza** sí conserva topología de esfera UV (no se remalla) porque los
morph targets necesitan anillos regulares alrededor de ojos y boca.

## Uso

Normalmente no se invoca a mano; lo hace `pnpm --filter frontend avatar:build`.
Para una variante suelta:

```bash
blender --background --factory-startup \
  --python tools/blender/build_avatar.py -- \
  --variant feminine \
  --body-id female-base \
  --blend assets/avatar-source/blender/avatar-female.blend \
  --out-dir assets/avatar-source/glb-raw \
  --report apps/frontend/web-shell/public/avatars/custom/reports/female-base.json \
  --skin-tone porcelain --hair-tone auburn \
  --qa-dir assets/avatar-source/qa
```

Variantes: `feminine`, `masculine`, `androgynous`.
Tonos: ver `SKIN_TONES` y `HAIR_TONES` en `create_materials.py`.

Validar una escena ya construida:

```bash
blender --background assets/avatar-source/blender/avatar-female.blend \
  --python tools/blender/validate_scene.py
```

Reexportar sin reconstruir:

```bash
blender --background assets/avatar-source/blender/avatar-female.blend \
  --python tools/blender/export_glb.py -- \
  --output assets/avatar-source/glb-raw/bodies/female-base.glb
```

## Notas de versión

Escrito y probado contra **Blender 5.2.0 LTS**. Dos detalles que cambian entre
versiones y que el código ya contempla:

- El motor de render se llama `BLENDER_EEVEE` (en 4.2 fue `BLENDER_EEVEE_NEXT`).
- `use_auto_smooth` ya no existe; el sombreado suave se aplica con
  `shade_smooth()`.

## Convención de ejes

Blender: **Z arriba**, el personaje mira hacia **-Y**. El exportador glTF
convierte a Y arriba / +Z al frente, que es la orientación que espera la cámara
de `AvatarStage`.
