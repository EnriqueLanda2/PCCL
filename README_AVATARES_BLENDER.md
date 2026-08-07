# PCCL — Sistema de avatares humanos 3D propios

> Especificación de implementación para continuar desde el editor existente en
> `/identity/avatar`. Este documento debe ser leído completo antes de modificar el
> proyecto.

## 1. Objetivo

Completar el sistema actual de avatares de PCCL mediante personajes humanos 3D
originales creados y procesados con Blender, integrados en el editor existente de
Next.js y React Three Fiber.

La dirección artística toma como referencia el dragón 3D proporcionado por el
equipo: formas redondeadas, silueta caricaturesca, volúmenes suaves, colores
sólidos, materiales semibrillantes tipo vinilo y presentación limpia de videojuego.
Los humanos deben pertenecer al mismo universo visual sin copiar la geometría del
dragón ni personajes de Xbox, Ready Player Me u otras plataformas.

El resultado mínimo aceptable incluye:

- Un avatar masculino original y terminado.
- Un avatar femenino original y terminado.
- Una base neutral o variaciones que no restrinjan ropa por género.
- Archivos fuente `.blend` reproducibles.
- Archivos `.glb` optimizados para web.
- Un esqueleto humano compartido.
- Cabello, ropa y accesorios modulares.
- Expresiones mediante morph targets.
- Animaciones `idle`, respiración, saludo y presentación.
- Integración funcional en `/identity/avatar` mediante `source.provider = "custom"`.
- Persistencia, undo/redo, poses, expresiones y exportación PNG funcionando con las
  mallas reales.
- Pipeline reproducible para construir, validar y optimizar los recursos.
- Typecheck, lint, tests y build de producción aprobados.

Completar la infraestructura sin entregar mallas humanas reales no completa este
objetivo.

## 2. Estado inicial que debe conservarse

El proyecto ya cuenta con:

| Parte | Estado inicial |
|---|---|
| Arquitectura, store, catálogo y migraciones | Hecho y probado con 26 tests |
| Escena R3F, iluminación y controles | Hecho y compilando |
| Ready Player Me con iframe y `postMessage` | Implementado, sin verificación E2E |
| `AvatarModel.tsx` | Carga de GLB, morphs, poses y liberación de GPU |
| `PrimitiveAvatar.tsx` | Solo marcador de posición y fallback |
| Persistencia | `localStorage` |
| Exportación | Captura PNG existente |
| Mallas humanas, Blender, rig y animaciones propias | Pendiente |

No reescribir ni eliminar lo que ya funciona sin demostrar una necesidad concreta.
Antes de editar, revisar el código real porque este README describe el punto de
partida, pero el repositorio es la fuente definitiva.

Decisiones que deben conservarse:

1. Se guarda `AvatarConfiguration`, nunca un GLB por usuario.
2. `source.provider` mantiene el sistema agnóstico.
3. Ready Player Me permanece como proveedor opcional mientras no interfiera con los
   modelos propios.
4. No instalar `@readyplayerme/visage`: es incompatible con React 19/R3F 9 usados
   por el proyecto.
5. Undo/redo conserva configuraciones completas.
6. Toda URL externa continúa pasando por `isSafeAvatarUrl`.
7. `PrimitiveAvatar` queda únicamente como fallback técnico. No debe presentarse
   como resultado visual final.

## 3. Reglas de ejecución y permisos

El agente tiene autorización para:

- Leer y modificar archivos dentro del proyecto.
- Crear las carpetas, scripts, pruebas y documentación necesarios.
- Instalar dependencias JavaScript locales con el gestor del repositorio.
- Instalar o ejecutar Blender cuando el entorno y sus permisos lo permitan.
- Usar Blender en modo gráfico o headless.
- Crear scripts Python para Blender.
- Crear archivos `.blend`, `.glb`, texturas y reportes.
- Ejecutar pruebas, lint, typecheck y builds.
- Iterar sobre los modelos y la escena hasta cumplir los criterios visuales.

Restricciones:

- Usar `pnpm`; no mezclar npm, Yarn y pnpm.
- Las dependencias JavaScript se instalan en el workspace correspondiente, no
  globalmente.
- No instalar complementos de Blender con licencias dudosas.
- No descargar ni reutilizar modelos protegidos o sin licencia comercial clara.
- No eliminar trabajo existente ni cambios no relacionados.
- No degradar React, Next.js, Three.js, R3F o Drei para acomodar otra biblioteca.
- No hardcodear URLs externas sin validarlas.
- No utilizar secretos en código cliente.
- Si instalar Blender requiere permisos del sistema no disponibles, dejar los
  scripts, contratos y comandos listos, y reportar explícitamente el bloqueo. No
  fingir que se generaron mallas.

## 4. Inspección obligatoria

Antes de implementar:

```bash
git status --short
pnpm --version
blender --version
pnpm --filter frontend test
pnpm --filter frontend build
pnpm --filter frontend lint
```

Además:

1. Localizar `AGENTS.md`, `CLAUDE.md` y documentación interna.
2. Confirmar la ruta real del workspace `frontend`/`web-shell`.
3. Revisar `lib/avatar/*` y `app/components/avatar/*` completos.
4. Registrar las versiones reales de React, Next.js, Three.js, R3F y Drei.
5. Revisar cambios locales antes de modificar archivos.
6. Guardar el resultado inicial de tests, lint y build.
7. Localizar la imagen de referencia del dragón. Si no está en el repositorio,
   solicitar que se coloque en:

```text
assets/avatar-source/references/dragon-style.png
```

La referencia sirve para dirección artística; no debe incluirse en el bundle de
producción.

## 5. Dirección artística

### 5.1 Lenguaje visual común

- Personajes humanos estilizados, amigables y claramente 3D.
- Cabezas grandes, pero no infantiles: 28–33 % de la altura total.
- Cráneo y mandíbula construidos con volúmenes redondeados.
- Torso compacto, manos simplificadas y calzado ligeramente grande.
- Anatomía coherente bajo ropa y durante animación.
- Cabello creado con mechones geométricos grandes, no hair cards fotorrealistas.
- Ojos grandes, legibles, con iris simple y reflejo controlado.
- Nariz, boca, orejas y cejas simplificadas.
- Detalles de ropa mediante geometría, normal maps o relieves suaves.
- Paletas sólidas y saturadas.
- Materiales limpios, semimate o semibrillantes.
- Sin texturas fotográficas ni poros realistas.
- Sin logotipos ni prendas de marcas reales.
- Silueta reconocible incluso en miniatura.

### 5.2 Avatar femenino

- Rostro original con mandíbula redondeada.
- Ojos estilizados coherentes con el lenguaje común.
- Cuerpo estilizado sin sexualización exagerada.
- Cabello modular con volumen.
- Al menos dos prendas superiores, dos inferiores y dos opciones de calzado.
- Al menos dos peinados.

### 5.3 Avatar masculino

- Rostro original con mandíbula moderadamente definida.
- Hombros y torso equilibrados; musculatura discreta.
- Debe compartir calidad, materiales y detalle con el avatar femenino.
- Al menos dos prendas superiores, dos inferiores y dos opciones de calzado.
- Al menos dos peinados y una opción de vello facial.

### 5.4 Materiales orientativos

Usar `Principled BSDF`. Ajustar visualmente; estos valores son puntos de partida:

| Material | Metallic | Roughness | Coat Weight | Observación |
|---|---:|---:|---:|---|
| Piel estilizada | 0.0 | 0.42–0.55 | 0.04–0.10 | Evitar plástico mojado |
| Cabello | 0.0 | 0.32–0.48 | 0.05–0.12 | Variación suave entre mechones |
| Algodón | 0.0 | 0.60–0.78 | 0.0 | Reflejo amplio |
| Tenis/vinilo | 0.0 | 0.28–0.42 | 0.08–0.18 | Similar al acabado del dragón |
| Metal | 0.75–1.0 | 0.20–0.40 | 0.0 | Solo cierres/accesorios |

Usar color management coherente con exportación glTF. Validar el resultado en el
navegador; el viewport de Blender no constituye aprobación final.

## 6. Estructura de recursos

Crear o adaptar esta estructura a la arquitectura real:

```text
assets/avatar-source/
├── references/
│   └── dragon-style.png
├── blender/
│   ├── avatar-base.blend
│   ├── avatar-female.blend
│   ├── avatar-male.blend
│   └── avatar-neutral.blend
├── textures/
│   ├── shared/
│   ├── skin/
│   ├── hair/
│   └── clothing/
└── licenses/

tools/blender/
├── build_avatar.py
├── build_rig.py
├── create_materials.py
├── validate_scene.py
├── export_glb.py
└── README.md

tools/avatar-pipeline/
├── build.mjs
├── optimize.mjs
├── validate.mjs
└── inspect.mjs

public/avatars/custom/
├── manifest.json
├── bodies/
├── hair/
├── clothing/
├── accessories/
├── animations/
└── thumbnails/
```

Los fuentes de Blender y las referencias nunca deben descargarse al cliente.

## 7. Modelado en Blender

### 7.1 Requisitos geométricos

Crear topología apta para deformación, con loops adecuados en:

- Ojos y boca.
- Cuello y hombros.
- Codos y muñecas.
- Dedos si están separados.
- Cadera e ingle.
- Rodillas y tobillos.

Valores objetivo iniciales:

| Pieza | Triángulos objetivo |
|---|---:|
| Cuerpo completo visible | 25,000–60,000 |
| Cabeza | 8,000–20,000 |
| Cabello | 5,000–20,000 |
| Prenda individual | 3,000–15,000 |
| Par de zapatos | 2,000–8,000 |
| Accesorio | Mínimo que conserve silueta |

Aplicar o resolver correctamente:

- `Mirror` durante edición.
- `Subdivision Surface` solo cuando aporte a la silueta.
- Bevels controlados.
- `Shade Smooth` y normales correctas.
- Transformaciones aplicadas antes de exportar.
- Escala en metros y orientación compatible con glTF.
- Orígenes y nombres estables.
- Sin caras duplicadas, geometría non-manifold ni normales invertidas.

### 7.2 UV y texturas

- Rostro/cabeza: máximo 2048×2048.
- Cuerpo: 1024 o 2048.
- Cabello: 1024.
- Prendas: 1024 por atlas o conjunto.
- Accesorios pequeños: 512 o atlas compartido.
- Canales: Base Color, Roughness, Normal y AO cuando aporte valor.
- Metallic solo para materiales verdaderamente metálicos.
- Alpha únicamente cuando no haya alternativa geométrica razonable.
- Evitar una textura independiente por cada variación de color; usar tintes de
  material cuando sea posible.

### 7.3 Rig compartido

Usar un esqueleto común para cuerpos, cabello y prendas. Contrato mínimo:

```text
Root
└── Hips
    ├── Spine
    │   └── Spine1
    │       ├── Neck
    │       │   └── Head
    │       ├── LeftShoulder
    │       │   └── LeftArm
    │       │       └── LeftForeArm
    │       │           └── LeftHand
    │       └── RightShoulder
    │           └── RightArm
    │               └── RightForeArm
    │                   └── RightHand
    ├── LeftUpLeg
    │   └── LeftLeg
    │       └── LeftFoot
    └── RightUpLeg
        └── RightLeg
            └── RightFoot
```

Puede ampliarse con dedos, ojos, mandíbula y puntas de pie. No cambiar nombres una
vez publicados sin una migración del catálogo.

Requisitos:

- Máximo cuatro influencias de hueso por vértice cuando sea viable.
- Pesos normalizados.
- Sin vértices sin influencia.
- Deformación revisada en hombros, codos, muñecas, cadera y rodillas.
- Ropa vinculada al mismo rig.
- Ocultar partes corporales cubiertas por ropa mediante máscaras del catálogo para
  evitar clipping y overdraw.

### 7.4 Expresiones

Exportar morph targets con nombres canónicos propios:

```text
blinkLeft
blinkRight
smile
mouthOpen
browUp
surprised
sad
```

`provider.ts` debe traducir estos nombres cuando otra fuente utilice ARKit u otra
convención. El catálogo no debe depender directamente de nombres de Ready Player Me.

### 7.5 Animaciones

Clips mínimos:

```text
Idle
Breathing
Wave
Presentation
```

- Mantener el avatar en el origen.
- Evitar root motion en poses de editor.
- Recortar correctamente cada clip.
- No exportar acciones o controles de trabajo innecesarios.
- Probar las animaciones con cuerpo masculino, femenino y prendas.

## 8. Automatización de Blender

Los scripts Python deben facilitar tareas reproducibles, no sustituir el criterio
artístico. Deben poder ejecutarse así:

```bash
blender --background assets/avatar-source/blender/avatar-female.blend \
  --python tools/blender/validate_scene.py

blender --background assets/avatar-source/blender/avatar-female.blend \
  --python tools/blender/export_glb.py -- \
  --output public/avatars/custom/bodies/female-base.glb
```

El validador debe fallar con código distinto de cero ante:

- Objetos sin nombre o nombres duplicados.
- Escala no aplicada.
- Normales invertidas detectables.
- Geometría non-manifold relevante.
- Texturas faltantes.
- Texturas que excedan el presupuesto.
- Huesos obligatorios ausentes.
- Pesos sin normalizar o vértices sin peso.
- Morph targets requeridos ausentes.
- Animaciones requeridas ausentes.
- Número de triángulos por encima del límite configurado.

El exportador debe incluir mallas, skinning, materiales, texturas, morph targets y
clips; debe excluir cámaras, luces, controles del rig y objetos de trabajo.

## 9. Dependencias y pipeline glTF

Instalar en el workspace correcto cuando existan GLB reales que procesar:

```bash
pnpm --filter frontend add -D \
  @gltf-transform/core \
  @gltf-transform/extensions \
  @gltf-transform/functions \
  meshoptimizer
```

Agregar scripts equivalentes, adaptados al `package.json` real:

```json
{
  "scripts": {
    "avatar:build": "node tools/avatar-pipeline/build.mjs",
    "avatar:inspect": "node tools/avatar-pipeline/inspect.mjs",
    "avatar:optimize": "node tools/avatar-pipeline/optimize.mjs",
    "avatar:validate": "node tools/avatar-pipeline/validate.mjs"
  }
}
```

Pipeline obligatorio:

1. Exportar GLB sin sobrescribir el `.blend`.
2. Inspeccionar tamaño, escenas, mallas, primitivas, materiales, texturas, huesos,
   morph targets y animaciones.
3. Ejecutar `dedup` y `prune`.
4. Reordenar y comprimir geometría con Meshopt.
5. Comprimir texturas a WebP o KTX2 cuando la infraestructura y navegadores objetivo
   estén verificados.
6. Validar el resultado optimizado.
7. Escribir un reporte JSON reproducible.
8. Generar o actualizar `manifest.json`.

No aplicar Draco y Meshopt simultáneamente sin medir. Preferir Meshopt para esta
implementación salvo que una comparación real justifique otra decisión.

Presupuestos iniciales:

- Descarga del avatar visible inicial: máximo 12 MB; objetivo 8 MB.
- Texturas individuales: máximo 2048×2048.
- No descargar el catálogo completo al entrar a la página.
- No mantener en GPU prendas que ya no se muestran.
- Limitar `devicePixelRatio` de la escena.
- Registrar triángulos, draw calls, tamaño transferido, tiempo de carga y memoria
  aproximada.

## 10. Proveedor `custom`

Ampliar el tipo de proveedor sin romper configuraciones existentes:

```ts
type AvatarProvider = "primitive" | "ready-player-me" | "custom";
```

La configuración continúa guardando identificadores, no archivos:

```ts
interface CustomAvatarSource {
  provider: "custom";
  bodyId: string;
  revision: number;
}
```

Crear un manifest versionado semejante a:

```json
{
  "schemaVersion": 1,
  "catalogVersion": "1.0.0",
  "bodies": [],
  "hair": [],
  "tops": [],
  "bottoms": [],
  "shoes": [],
  "accessories": [],
  "animations": []
}
```

Cada entrada debe declarar como mínimo:

- `id` estable.
- `revision`.
- Tipo/categoría.
- URL local segura.
- Miniatura.
- Géneros/presentaciones compatibles sin bloquear innecesariamente.
- Cuerpos o rigs compatibles.
- Variantes de color.
- Máscaras de partes corporales ocultas.
- Tamaño en bytes.
- Conteo de triángulos.
- Dependencias.

Crear un mapa de huesos por proveedor. Ejemplo:

```ts
export const CUSTOM_BONE_MAP = {
  hips: "Hips",
  spine: "Spine",
  chest: "Spine1",
  head: "Head",
  leftUpperArm: "LeftArm",
  leftLowerArm: "LeftForeArm",
  rightUpperArm: "RightArm",
  rightLowerArm: "RightForeArm",
  leftUpperLeg: "LeftUpLeg",
  rightUpperLeg: "RightUpLeg"
} as const;
```

Las poses y expresiones deben operar sobre nombres semánticos y resolverlos mediante
el adaptador del proveedor.

## 11. Integración con `AvatarStage`

La selección debe conservar las tres rutas:

```tsx
switch (configuration.source.provider) {
  case "custom":
    return (
      <AvatarModel
        url={resolveCustomAvatarUrl(configuration)}
        configuration={configuration}
      />
    );

  case "ready-player-me":
    return (
      <AvatarModel
        url={resolveReadyPlayerMeUrl(configuration)}
        configuration={configuration}
      />
    );

  default:
    return <PrimitiveAvatar configuration={configuration} />;
}
```

Adaptar el ejemplo a las firmas reales; no duplicar lógica existente.

Requisitos de carga:

- `Suspense` con progreso real.
- Error boundary por recurso.
- Fallback a `PrimitiveAvatar` solo tras un error auténtico.
- Caché de modelos y texturas.
- Carga bajo demanda por categoría.
- Reutilizar materiales y esqueletos cuando sea seguro.
- Liberar recursos que ya no están referenciados.
- Evitar disponer recursos compartidos mientras otro componente los usa.
- No reconstruir o clonar la escena completa en cada cambio de color.
- Las animaciones deben usar el `AnimationMixer` o `useAnimations` ya compatible con
  la arquitectura.

## 12. Iluminación y presentación

Conservar la escena actual si ya cumple estos objetivos; calibrarla con las mallas
reales, no con el marcador de posición:

- Cámara perspective con FOV aproximado de 28–35.
- Luz principal cálida.
- Luz de relleno fría y suave.
- Luz de contorno discreta.
- Environment de estudio.
- `ACESFilmicToneMapping`.
- Salida sRGB.
- Sombras suaves y contact shadow.
- Fondo oscuro similar al visor del dragón y fondos claros alternativos.
- Sin bloom excesivo.
- Ambient occlusion moderada solo si mejora de forma medible la lectura.
- Piel sin aspecto metálico o mojado.
- Encuadre consistente de cuerpo completo.

No instalar postprocessing hasta probar las mallas reales. Si se añade:

```bash
pnpm --filter frontend add @react-three/postprocessing postprocessing
```

Debe medirse el impacto en FPS y bundle. La escena debe seguir siendo funcional sin
postprocesamiento en dispositivos de baja capacidad.

## 13. UI del editor

Conectar los recursos `custom` a las categorías existentes:

- Cuerpo/presentación.
- Tono de piel.
- Rostro.
- Ojos y color.
- Cabello y color.
- Vello facial.
- Prenda superior.
- Prenda inferior.
- Calzado.
- Accesorios.
- Expresión.
- Pose o animación.
- Fondo.

Reemplazar chips de texto por miniaturas cuando existan los recursos. Mantener texto
accesible y estados seleccionados visibles. No descargar el GLB solo para generar una
miniatura en tiempo de ejecución; generar miniaturas durante el pipeline.

## 14. Persistencia y migraciones

- Mantener compatibilidad con configuraciones existentes.
- Incrementar `AVATAR_SCHEMA_VERSION` solo si cambia el formato persistido.
- Añadir migración para `provider: "custom"` cuando sea necesario.
- Una pieza inexistente debe migrar al reemplazo configurado o al valor base.
- No romper el editor por una revisión antigua del catálogo.
- Preparar una interfaz de persistencia que pueda reemplazar `localStorage` por API
  sin cambiar los componentes visuales.
- No implementar backend fuera del alcance salvo que ya exista un contrato claro.

## 15. Seguridad

- Las rutas del catálogo propio deben permanecer bajo un prefijo permitido, como
  `/avatars/custom/`.
- Ready Player Me mantiene validación de protocolo, host, origen y extensión.
- Validar manifests antes de consumirlos.
- Rechazar rutas con traversal.
- Limitar tamaños de recursos y tiempos de carga.
- No registrar tokens o datos personales.
- No ejecutar scripts incluidos en archivos externos.
- Documentar licencias de cualquier recurso que no haya sido creado desde cero.

## 16. Pruebas

Conservar los 26 tests y añadir como mínimo:

1. Serialización de `provider: "custom"`.
2. Migración desde configuraciones anteriores.
3. Rechazo de IDs o rutas desconocidos.
4. Validación de `manifest.json`.
5. Resolución de cuerpo, cabello, ropa y accesorios.
6. Compatibilidad de rig y cuerpo.
7. Resolución de bone map.
8. Resolución de morph targets.
9. Fallback cuando falta un GLB.
10. Sustitución de una pieza retirada del catálogo.
11. Undo/redo con componentes custom.
12. Persistencia y restauración.

Añadir una verificación E2E o smoke test que confirme:

- `/identity/avatar` abre.
- WebGL/Canvas inicializa.
- El GLB custom termina de cargar.
- El avatar cambia de cabello o prenda.
- Se aplica una expresión.
- Se reproduce `Idle`.
- La configuración se guarda y restaura.
- La captura PNG produce una imagen válida.
- No aparecen errores críticos en consola.

## 17. Orden obligatorio de trabajo

### Fase A — Baseline

- Inspección completa.
- Ejecutar y registrar tests, lint y build existentes.
- No modificar todavía la arquitectura.

### Fase B — Contrato custom

- Tipos y migración.
- Manifest y validación.
- Adaptador de proveedor.
- Bone map y morph map.
- Tests unitarios.

### Fase C — Blender

- Preparar estructura y scripts.
- Crear base artística masculina y femenina.
- Crear rig compartido.
- Crear materiales, UV y texturas.
- Crear prendas y cabello mínimos.
- Crear morph targets y animaciones.
- Validar en Blender.

### Fase D — Exportación y optimización

- Exportar GLB.
- Inspeccionar.
- Optimizar.
- Validar.
- Generar manifest, reportes y miniaturas.

### Fase E — Integración

- Cargar GLB custom.
- Conectar categorías.
- Aplicar colores, expresiones, poses y animaciones.
- Verificar liberación de GPU.
- Conservar Ready Player Me como opción.

### Fase F — QA visual y rendimiento

- Comparar con la referencia del dragón.
- Revisar frontal, perfil, posterior y tres cuartos.
- Revisar clipping en animación.
- Medir móvil y escritorio.
- Iterar modelos, materiales e iluminación.

### Fase G — Producción

- Ejecutar suite completa.
- Build real de producción.
- Documentar comandos, mediciones y limitaciones.

No saltar de la Fase B directamente a declarar terminado sin completar C–G.

## 18. Comandos esperados

Mantener los existentes:

```bash
pnpm --filter frontend dev
pnpm --filter frontend test
pnpm --filter frontend build
pnpm --filter frontend lint
```

Agregar o adaptar:

```bash
pnpm --filter frontend avatar:build
pnpm --filter frontend avatar:inspect
pnpm --filter frontend avatar:optimize
pnpm --filter frontend avatar:validate
```

Si existe un script separado de typecheck:

```bash
pnpm --filter frontend typecheck
```

Todos los comandos documentados deben haber sido ejecutados realmente o marcarse
como no ejecutados con su motivo.

## 19. Criterios de aceptación

### Visuales

- Existen avatares masculino y femenino humanos, originales y completos.
- Comparten el lenguaje visual redondeado y semibrillante del dragón.
- No parecen construidos con cápsulas y esferas provisionales.
- Rostros, manos, ojos, cabello y calzado están terminados.
- La piel no luce metálica ni excesivamente plástica.
- No hay clipping visible en pose neutral, `Idle` y `Wave`.
- El personaje conserva identidad desde todos los ángulos.
- El resultado se ve correctamente dentro del navegador, no solo en Blender.

### Técnicos

- Hay archivos `.blend` fuente y GLB optimizados.
- El pipeline es reproducible.
- Los GLB contienen rig, morph targets y animaciones requeridas.
- `source.provider = "custom"` funciona y se persiste.
- Poses, expresiones, fondos y exportación PNG siguen funcionando.
- El avatar inicial cumple el presupuesto de descarga o documenta una excepción
  medida y justificada.
- No se descarga el catálogo completo al entrar.
- Un recurso defectuoso no derriba toda la ruta.
- Los tests anteriores y nuevos pasan.
- Lint, typecheck y build de producción pasan.

### No aceptable como entrega final

- Mostrar únicamente `PrimitiveAvatar`.
- Integrar solo el iframe de Ready Player Me.
- Renombrar el dragón y presentarlo como avatar humano.
- Entregar capturas sin `.blend` y `.glb` reproducibles.
- Entregar GLB sin rig, expresiones o animación.
- Añadir scripts que no se ejecutaron y afirmar que funcionan.
- Declarar “paridad visual” sin inspección en el navegador.
- Copiar modelos o assets de Xbox u otra plataforma.

## 20. Informe final obligatorio

Al concluir, entregar un reporte con:

1. Resumen de lo implementado.
2. Archivos creados y modificados.
3. Dependencias instaladas y justificación.
4. Versiones de Blender, Node, pnpm y paquetes 3D.
5. Modelos entregados y sus rutas.
6. Conteo de triángulos por modelo.
7. Tamaño original y optimizado.
8. Resolución y formato de texturas.
9. Huesos, morph targets y animaciones detectados.
10. Resultados de tests, lint, typecheck y build.
11. Resultado del smoke test en `/identity/avatar`.
12. Mediciones aproximadas de carga, FPS y memoria.
13. Comparación visual honesta contra la referencia.
14. Limitaciones pendientes.
15. Pasos exactos para reproducir exportación y optimización.

Separar explícitamente:

- **Paridad técnica:** carga, personalización, persistencia y exportación.
- **Paridad visual:** modelado, materiales, iluminación y animación.
- **No verificado:** cualquier punto que no haya podido probarse.

## 21. Instrucción final al agente

Trabaja de manera autónoma dentro del alcance descrito. No vuelvas a implementar el
store, la escena o los tests que ya existen salvo que sea necesario para integrar el
proveedor custom. Reutiliza la arquitectura actual y concentra el esfuerzo en la
producción real de recursos Blender, su contrato, optimización e integración.

No declares terminado el proyecto solo porque compile. El objetivo se cumple cuando
los modelos humanos reales aparecen en `/identity/avatar`, se pueden personalizar,
animar, guardar y exportar, conservan el lenguaje visual del dragón y pasan las
verificaciones técnicas de producción.

Si el entorno impide realizar trabajo artístico manual suficiente para alcanzar el
nivel esperado, entrega todo lo verificable, conserva los archivos fuente, registra
la limitación con precisión y no sustituye la malla faltante por una afirmación de
éxito.
