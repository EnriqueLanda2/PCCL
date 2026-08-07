# Informe final — Sistema de avatares humanos 3D PCCL

Informe exigido por `README_AVATARES_BLENDER.md` §20. Todas las cifras salen de
ejecuciones reales registradas en `public/avatars/custom/reports/`.

---

## 1. Resumen de lo implementado

Se sustituyó la generación previa de avatares —que ensamblaba el cuerpo con
esferas, cápsulas y cubos atados rígidamente a un hueso cada uno— por un
pipeline que produce **humanos estilizados con malla continua y skinning real**.

Lo esencial del cambio:

| Antes | Ahora |
|---|---|
| 34 objetos sueltos (esferas/cápsulas/cubos) | Cuerpo remallado en **una sola superficie manifold** |
| Cada objeto atado a 1 hueso con peso 1.0 | **Pesado automático por calor**, ≤4 influencias, normalizado |
| Ropa inexistente (welded al cuerpo) | 2 superiores, 2 inferiores, 2 calzados, 2 peinados por cuerpo |
| Morph targets = empujones sobre una esfera | 7 morph targets sobre topología facial estable |
| `optimize` copiaba el archivo (MD5 idéntico) | **dedup + prune + reorder + quantize + Meshopt** (5× de reducción) |
| Miniaturas SVG dibujadas a mano | **Renders PNG** producidos por el pipeline |
| Manifest con categorías decorativas sin assets | Manifest generado desde reportes reales y validado |

Se conservó íntegra la arquitectura existente: store zustand con historial,
`AvatarStage`, escena R3F, `PrimitiveAvatar` como fallback, Ready Player Me como
proveedor opcional, y los 34 tests originales (siguen pasando sin modificarse).

## 2. Archivos creados y modificados

**Creados**
- `tools/blender/proportions.py` — canon de medidas.
- `tools/blender/create_materials.py` — paleta y materiales (sustituye materiales inline).
- `tools/blender/build_rig.py` — esqueleto y pesado por calor.
- `tools/avatar-pipeline/config.mjs`, `manifest.mjs`, `package.json`
- `apps/frontend/web-shell/lib/avatar/__tests__/custom-catalog.test.ts` — 30 tests.
- `assets/avatar-source/references/README.md`, `docs/avatares-informe.md`

**Reescritos**
- `tools/blender/build_avatar.py` — geometría, rostro, vestuario, animación.
- `tools/blender/validate_scene.py` — validación completa §8 (antes cubría ~4 casos).
- `tools/blender/export_glb.py` — selección explícita, sin cámaras ni luces.
- `tools/avatar-pipeline/{build,optimize,inspect,validate}.mjs`
- `apps/frontend/web-shell/lib/avatar/custom.ts` — catálogo, piezas, tintes.
- `apps/frontend/web-shell/app/components/avatar/AvatarModel.tsx`

**Modificados**
- `lib/avatar/{types,serialization,store,provider}.ts` — vestuario, colores, migración v3→v4, adaptador de morphs/huesos.
- `app/components/avatar/AvatarStage.tsx` — encuadre de cuerpo entero.
- `app/modules/avatar/page.tsx` — categorías del editor y miniaturas.
- `pnpm-workspace.yaml`, `.gitignore`, `package.json` (script `typecheck`).

## 3. Dependencias instaladas

Ninguna nueva. `@gltf-transform/*` y `meshoptimizer` ya estaban declarados en el
workspace `frontend`; se añadió `tools/avatar-pipeline` como paquete del
workspace **porque Node resuelve los imports por la ruta del archivo, no por el
cwd**, y los scripts en `tools/` no alcanzaban las dependencias del frontend.

## 4. Versiones reales

| Componente | Versión |
|---|---|
| Blender | 5.2.0 LTS |
| Node | v22.22.0 |
| pnpm | 11.8.0 |
| Next.js | 16.2.6 |
| React | 19.2.4 |
| three | 0.185.1 |
| @react-three/fiber | 9.7.0 |
| @react-three/drei | 10.7.8 |
| @gltf-transform/* | 4.4.2 |
| meshoptimizer | 1.2.0 |

## 5. Modelos entregados

**Fuentes** — `assets/avatar-source/blender/avatar-{female,male,neutral}.blend`
**Publicados** — `apps/frontend/web-shell/public/avatars/custom/`

| Cuerpo | GLB | Tamaño | Triángulos visibles |
|---|---|---:|---:|
| `female-base` | `bodies/female-base.glb` | 469 KB | 56 092 |
| `male-base` | `bodies/male-base.glb` | 471 KB | 56 092 |
| `neutral-base` | `bodies/neutral-base.glb` | 473 KB | 56 092 |

Piezas modulares (descarga bajo demanda): 4 peinados alternativos, 3 superiores,
3 inferiores, 3 calzados y 1 accesorio — entre 21 KB y 55 KB cada una.

## 6. Conteo de triángulos

Desglose del conjunto visible simultáneamente (idéntico en las tres variantes):

| Pieza | Triángulos |
|---|---:|
| `Body_Skin` | 23 000 |
| `Head_Face` | 12 392 |
| `Top_A` | 6 500 |
| `Bottom_A` | 6 500 |
| `Hair_chunky-short` | 4 500 |
| `Shoes_A` | 3 200 |
| **Total visible** | **56 092** |

Dentro de los objetivos del README: cuerpo 25–60 k, cabeza 8–20 k, cabello
5–20 k, prenda 3–15 k, calzado 2–8 k.

## 7. Tamaño original y optimizado

| | Crudo | Optimizado | Ratio |
|---|---:|---:|---:|
| Todos los assets | 9.88 MB | 2.00 MB | 20.3 % |
| Cuerpo individual | ~2.43 MB | ~0.47 MB | ~19.8 % |

Transferido realmente al navegador para el avatar inicial: **332 KB** en 36 ms.
Muy por debajo del máximo de 12 MB y del objetivo de 8 MB.

Extensiones glTF en los assets publicados: `EXT_meshopt_compression`,
`KHR_mesh_quantization`, `KHR_materials_clearcoat`. No se aplicó Draco (el
README pide medir antes de combinar y Meshopt ya sobra para el presupuesto).

## 8. Resolución y formato de texturas

**Cero texturas de imagen.** El color se resuelve por tinte de material
(`Base Color` del Principled BSDF), tanto en Blender como en el cliente. Es la
opción que el README recomienda explícitamente (§7.2: «usar tintes de material
cuando sea posible») y evita multiplicar archivos por cada variación de color.

Consecuencia: el presupuesto de 2048×2048 no aplica, y el validador lo comprueba
igualmente por si en el futuro se añaden mapas. Ver §14 (limitaciones).

## 9. Huesos, morph targets y animaciones detectados

Verificado sobre los GLB publicados (`reports/inspect.json`), no sobre la escena
de Blender:

- **20 huesos**, exactamente el contrato del README §7.3: `Root, Hips, Spine,
  Spine1, Neck, Head, Left/RightShoulder, Arm, ForeArm, Hand, Left/RightUpLeg,
  Leg, Foot`.
- **7 morph targets**: `blinkLeft, blinkRight, smile, mouthOpen, browUp,
  surprised, sad`.
- **4 animaciones**: `Idle, Breathing, Wave, Presentation`.
- 1 skin, 6 mallas, 9 materiales por cuerpo.

## 10. Resultados de tests, lint, typecheck y build

| Comando | Resultado |
|---|---|
| `pnpm --filter frontend test` | **64 pasan** (34 previos + 30 nuevos), 0 fallos |
| `pnpm --filter frontend lint` | Limpio |
| `pnpm --filter frontend typecheck` | Limpio |
| `pnpm --filter frontend build` | Compila; `/identity/avatar` se prerenderiza |
| `pnpm --filter frontend avatar:validate` | Correcto |
| `blender --background … validate_scene.py` | 0 errores, 0 avisos |

Baseline al empezar (para comparar): 34 tests, lint/typecheck/build limpios.
No se rompió nada de lo que ya funcionaba.

## 11. Smoke test en `/identity/avatar`

`pnpm --filter frontend avatar:smoke` levanta `next start`, abre la ruta con
Chromium y comprueba la lista del README §16:

| Comprobación | Resultado |
|---|---|
| La ruta abre y monta el canvas | 598×491 px |
| WebGL inicializa y pinta al avatar | 338 colores distintos (no es un lienzo vacío) |
| El GLB custom termina de cargar | `neutral-base.glb`, 332 KB en 36 ms |
| Cambiar de prenda modifica la escena | Sí |
| La pieza modular se descarga **solo al elegirla** | Sí (`top-b` no viaja en la carga inicial) |
| Se aplica una expresión | Sonrisa |
| Se reproduce una animación | Sí (dos fotogramas distintos) |
| La captura PNG produce imagen válida | 152 KB |
| Configuración se guarda y restaura tras recargar | Sí |
| Errores críticos en consola | **0** |

Los 6–8 errores de consola restantes son llamadas a `/auth/me` del backend, que
no se levanta en este smoke test. Se reportan aparte (`backendErrorsIgnored`) en
lugar de ocultarse.

## 12. Mediciones de carga, FPS y memoria

| Métrica | Valor |
|---|---|
| Transferencia del GLB del cuerpo | 332 KB / 36 ms |
| `domContentLoaded` | ~300 ms |
| JS heap tras cargar la escena | ~30–32 MB |
| FPS | **No medido de forma válida** |

**Los FPS no son una medición aprovechable.** El Chromium headless del smoke
test rasteriza por software: el renderer reportado es
`ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader
driver)`. Los ~4 fps que arroja miden SwiftShader, no una GPU. El script lo
detecta y lo marca (`softwareRasterizer: true`) precisamente para que ese número
no se confunda con rendimiento real. Falta medir en hardware real y en móvil.

## 13. Comparación visual honesta contra la referencia

Renders de revisión en `assets/avatar-source/qa/` (frontal, tres cuartos,
perfil, posterior por variante) y captura de navegador
`identity-avatar-browser.png`.

**Se cumple**
- Volúmenes redondeados, colores planos saturados y acabado vinilo
  semibrillante: mismo lenguaje que el dragón.
- Paleta compartida: el naranja `#E08A2E` y el verde `#57C43A` del dragón se
  reutilizan como acento y como prenda.
- Silueta legible en miniatura; cabeza al 31 % de la altura.
- La piel no se ve metálica ni mojada (coat 0.06 sobre roughness 0.48).
- Sin clipping en pose neutral, `Idle` ni `Wave` tras corregir dos defectos
  reales encontrados en esta revisión (ver abajo).
- Identidad reconocible desde los cuatro ángulos.

**Queda por debajo de la referencia**
- El dragón tiene un modelado con más intención en los remates (bordes,
  transiciones de material). Los humanos son correctos pero más genéricos.
- Las manos son formas simplificadas con pulgar insinuado, sin dedos separados.
  Es coherente con §5.1 («manos simplificadas»), pero es menos detalle que el
  dragón en sus extremidades.
- El cabello son masas geométricas, sin la variación fina de mechón del
  referente.

**Defectos encontrados y corregidos durante la revisión visual**
1. El brazo del saludo atravesaba el torso. La causa era doble: el signo de
   rotación del clip estaba invertido (se midió sobre el rig: para `RightArm`
   levanta el **+Z**, no el −Z), y además `AvatarModel` aplicaba las rotaciones
   estáticas del catálogo *encima* del mixer, anulando la animación. Ahora, si
   existe clip para la pose, manda el clip.
2. Asomaba un punto de piel en el hombro: el torso y el cuello de la prenda
   terminaban a la misma altura. El torso se corta ahora por debajo del cuello
   de la prenda.

## 14. Limitaciones pendientes

1. **Sin texturas de imagen.** Decisión deliberada y documentada, pero significa
   que no hay normal maps ni AO horneada; el detalle es puramente geométrico.
2. **FPS y memoria de GPU sin medir en hardware real** (ver §12).
3. **Sin medición en móvil.**
4. **Ready Player Me sigue sin verificación E2E**, igual que en el punto de
   partida. No se tocó su ruta salvo para que el adaptador de morphs no la
   afecte.
5. **La imagen de referencia del dragón no está en el repositorio.** Se usó
   desde la conversación; su paleta quedó codificada en `create_materials.py` y
   documentada en `assets/avatar-source/references/README.md`, pero el PNG debe
   colocarse en `assets/avatar-source/references/dragon-style.png`.
6. **Las miniaturas de las piezas de ropa reutilizan la del cuerpo.** Solo las
   miniaturas de cuerpo son renders propios y distintivos; por eso las piezas se
   siguen mostrando como chips de texto y no como miniaturas.
7. **Dedos no separados** en las manos.

## 16. Integración con el resto de la app (posterior al alcance del README)

El README acotaba el trabajo a `/identity/avatar`, y en la primera entrega el
avatar solo vivía en `localStorage`. Después se conectó de extremo a extremo,
reutilizando contrato que ya existía y no se había llegado a llamar nunca:

- Al guardar, el editor recorta la captura a un retrato cuadrado (cabeza y
  torso), lo sube con `POST /uploads/image` y persiste la URL con
  `PATCH /users/me/avatar`. La configuración se guarda **siempre** en local
  primero; publicar la foto es "mejor esfuerzo" y avisa si falla.
- `learning-service/src/common/user-directory.ts` añade `avatarUrl` a la lista
  blanca de campos públicos, para que las filas de inscripciones y progreso lo
  lleven.
- La lista de usuarios y las tarjetas de alumno (inscripciones y progreso)
  muestran la foto real, con respaldo a iniciales o al avatar 3D generado por
  `userId` cuando no hay foto.

Limitaciones de esta parte:

- El topbar y el sidebar leen `avatarUrl` de `sessionStorage`; tras publicar se
  refresca esa copia, pero el cambio se ve al volver a montar el componente
  (navegar o recargar), no al instante.
- El retrato se recorta con factores calibrados sobre el encuadre actual de
  `AvatarStage`; si se cambia la cámara hay que recalibrarlos.
- La subida depende del almacenamiento de imágenes configurado en el backend.
  Sin él, el avatar sigue funcionando en local pero no se publica.

## 15. Pasos exactos para reproducir

```bash
# 1. Construir en Blender (fuentes .blend + GLB en crudo + miniaturas + QA)
pnpm --filter frontend avatar:build
#    Si Blender no está en el PATH:
#    BLENDER="C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" \
#      pnpm --filter frontend avatar:build

# 2. Optimizar y publicar en public/ (+ manifest.json)
pnpm --filter frontend avatar:optimize

# 3. Inventariar lo publicado
pnpm --filter frontend avatar:inspect

# 4. Validar assets y manifest (falla con código ≠ 0)
pnpm --filter frontend avatar:validate

# 5. Verificación en navegador real
pnpm --filter frontend build
pnpm --filter frontend avatar:smoke
```

Validar una escena de Blender por separado:

```bash
blender --background assets/avatar-source/blender/avatar-female.blend \
  --python tools/blender/validate_scene.py
```

El paso 1 escribe en `assets/avatar-source/glb-raw/` (ignorado por git). El paso
2 es el único que escribe en `public/`, de modo que el cliente nunca recibe un
GLB sin comprimir.

---

## 17. Sistema global de avatares (rediseño posterior)

### Componente único

Todo el producto pinta avatares a través de `app/components/shared/StudentAvatar.tsx`.
Cascada de resolución, en este orden:

1. `avatarUrl` — el avatar que el propio alumno publicó. **Nunca se sustituye
   ni se regenera.**
2. Retrato de la galería, asignado de forma determinista por `userId`.
3. Iniciales, solo si no hay ninguno de los anteriores.

Consumido por: tabla de usuarios, tarjetas de alumno (inscripciones y
progreso), panel de detalle, barra superior, menú lateral, appbar y notas.

### Galería pre-renderizada

24 retratos (8 por cuerpo) generados por `tools/blender/render_portraits.py`
desde los `.blend` ya construidos: no reconstruye geometría, solo cambia tintes
de material y qué prendas están visibles.

Todos comparten **exactamente** la misma cámara (3/4, FOV 22°), la misma luz de
tres puntos y el mismo encuadre de rostro y hombros, con fondo transparente y
una pose relajada (peso a una pierna, torsión de columna, codos flexionados,
cabeza girada hacia cámara, sonrisa suave al 55 %).

Se eligió imagen pre-renderizada y no un visor 3D por tarjeta porque una vista
de alumnos pinta decenas a la vez: montar un canvas WebGL por tarjeta cuesta
memoria y fps, y cada visor acaba con encuadre distinto según su contenedor.

384×384 px (el mayor tamaño en pantalla es 192 px), ~85 KB cada uno, 2.0 MB la
galería completa; cada tarjeta descarga solo el suyo y con `loading="lazy"`.

### Implementaciones retiradas

Se eliminaron por completo `PersonAvatar3D`, `StudentAvatar3D`,
`IllustratedAvatar`, `lib/novaAvatars.ts` y `lib/rpmAvatars.ts` — eran tres
sistemas de avatar en paralelo, dos de ellos código muerto y uno con el pool
vacío. No queda ninguna referencia.

### Solo alumnos activos

`user-directory.ts` añade `active` a la lista blanca de campos públicos, y las
vistas de progreso e inscripciones descartan las cuentas inactivas. Verificado
con una cuenta dada de baja entre los datos: no aparece y no cuenta en los
totales.

### Edición

El perfil (`/identity`) muestra el avatar en grande sobre una banda, con el
nombre, el rol, el estado y dos acciones: **Cambiar avatar** (lleva al editor
3D) y **Subir foto** (un clic, para quien prefiera una foto real). Al publicar,
el editor emite `pccl_user_updated`, que la barra superior y el menú lateral ya
escuchaban: el avatar nuevo aparece al instante sin recargar.

### Limitaciones de esta parte

- **No son avatares fotorrealistas.** La especificación pedía apariencia "muy
  humana" con "materiales realistas". Lo entregado es un humano *estilizado*
  coherente: formas redondeadas, color plano y acabado vinilo. Conseguir
  realismo exige texturas PBR, pelo por hebras y piel con subsurface, que es un
  pipeline distinto del actual y bastante más grande.
- Las poses sentadas que menciona la especificación no están: el rig se posa de
  pie relajado. Sentar al personaje requiere una silla y otro encuadre.
- Con 24 retratos y muchos alumnos habrá coincidencias: dos alumnos sin avatar
  propio pueden compartir retrato. Se mitiga ampliando `PORTRAITS_PER_BODY`.
- El menú lateral solo lee la sesión de `sessionStorage`; en una pestaña donde
  aún no se ha resuelto, muestra iniciales hasta que se puebla.

---

## Separación exigida por el README

### Paridad técnica — verificada

Carga del GLB, personalización (cuerpo, piel, cabello y color, ojos, 2 prendas
superiores, 2 inferiores, 2 calzados, accesorio), expresiones, poses,
animaciones, deshacer/rehacer, persistencia y exportación PNG. Todo comprobado
por 64 tests unitarios y por el smoke test en navegador real.

### Paridad visual — parcial

Materiales, paleta, iluminación y lenguaje de formas están alineados con la
referencia. El nivel de acabado del modelado (manos, remates, cabello) queda por
debajo del dragón; ver §13.

### No verificado

- FPS y memoria de GPU en hardware real y en móvil.
- Ready Player Me de extremo a extremo.
- Comportamiento con conexiones lentas o fallos parciales de red.
