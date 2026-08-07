# Referencia de estilo — dragón PCCL

Esta carpeta guarda la referencia de dirección artística. **Nunca se empaqueta
para el cliente**: no la importa ningún módulo de `apps/frontend/web-shell`, y
vive fuera de `public/`.

## Archivo esperado

```text
assets/avatar-source/references/dragon-style.png
```

El PNG del dragón todavía **no está en el repositorio**. La imagen se
proporcionó en la conversación de trabajo y se usó para muestrear la paleta y
fijar el lenguaje de formas, pero no pudo guardarse como archivo desde ese
canal. Colócalo en la ruta de arriba para dejar la referencia versionada junto
al resto de los fuentes.

Nada del pipeline depende de que el archivo exista: lo que se extrajo de la
imagen ya está codificado en `tools/blender/create_materials.py`.

## Lo que se extrajo de la referencia

### Paleta muestreada

Estos valores están en `create_materials.py` como `DRAGON_REFERENCE`:

| Zona | sRGB |
|---|---|
| Cuerpo (naranja saturado) | `#E08A2E` |
| Vientre / crema | `#F5C87A` |
| Púas (verde) | `#57C43A` |
| Ojo | `#0A0A0F` |
| Fondo del visor | `#131A2B` |

El naranja del cuerpo se reutiliza como color de acento (`PCCL_Accent`,
`PCCL_ShoeB`) y el verde de las púas como una de las opciones de prenda
(`PCCL_TopB`), de modo que los humanos comparten paleta con el dragón sin
copiarle nada.

### Lenguaje de formas aplicado a los humanos

- **Volúmenes cerrados y redondeados.** El dragón no tiene bordes finos ni
  cáscaras: es una sucesión de masas sólidas. Por eso la ropa de los avatares se
  construye como volumen cerrado inflado sobre el cuerpo y no como una
  superficie recortada — ver `garment_volume()` en `build_avatar.py`.
- **Silueta legible en miniatura.** Cabeza grande (~31 % de la altura), manos y
  pies simplificados, sin detalle que se pierda a tamaño de chip.
- **Acabado vinilo semibrillante.** `Coat Weight` bajo pero presente (0.06–0.16)
  sobre `Roughness` media. La piel se queda en el extremo bajo del coat para no
  parecer plástico mojado.
- **Color plano, sin textura fotográfica.** Cero mapas de imagen; el color va
  por tinte de material.
- **Ojo simple y oscuro con reflejo controlado**, sin iris fotorrealista.

### Lo que deliberadamente NO se copió

Geometría, proporciones de criatura, púas, cola, hocico y cualquier rasgo
reconocible del dragón. Los humanos son originales; lo compartido es la paleta y
el acabado.
