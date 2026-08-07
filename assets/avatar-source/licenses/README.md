# Licencias y procedencia

## Origen de los assets

Los avatares `female-base`, `male-base` y `neutral-base` —y todas sus piezas de
cabello, ropa, calzado y accesorios— se generan de forma **procedural** con los
scripts de Blender incluidos en este repositorio (`tools/blender/`). No hay
ningún paso manual ni ningún archivo binario de partida: los `.blend` de
`assets/avatar-source/blender/` son *salida* del pipeline, no entrada.

No se incorporó ningún modelo, malla, textura, rig ni animación de terceros. En
particular, no se han usado assets de Ready Player Me, Xbox, Mixamo ni de
ninguna otra plataforma.

## Materiales

Todos los materiales son `Principled BSDF` con colores planos definidos en
`tools/blender/create_materials.py`. No hay texturas de imagen: el color se
resuelve por tinte de material, tanto en Blender como en el cliente. Por eso los
GLB publicados declaran cero texturas.

## Dependencias del pipeline

| Herramienta | Licencia | Uso |
|---|---|---|
| Blender | GPL-3.0 | Generación de malla, rig, morph targets y animación |
| `@gltf-transform/*` | MIT | dedup, prune, quantize y escritura del GLB |
| `meshoptimizer` | MIT | Reordenado y compresión `EXT_meshopt_compression` |

Ninguna de estas herramientas impone condiciones sobre los assets producidos:
Blender es GPL, pero la GPL cubre el programa, no su salida.

## Referencia artística del dragón

La dirección artística parte de una imagen de un dragón 3D proporcionada por el
equipo. Esa imagen es **referencia de estilo**, no material fuente: no se copió
su geometría, sus texturas ni ninguna parte de su malla.

Su paleta muestreada está documentada en
`assets/avatar-source/references/README.md` y codificada en
`create_materials.py` (`DRAGON_REFERENCE`). Si se añade el PNG al repositorio,
debe quedarse en `assets/avatar-source/references/`, que nunca se empaqueta para
el cliente.
