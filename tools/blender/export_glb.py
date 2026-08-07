"""Reexporta un `.blend` ya construido a GLB, sin reconstruirlo.

`build_avatar.py` ya exporta durante la construcción; esto sirve para volver a
sacar un GLB de un fuente guardado (por ejemplo tras un retoque manual) con
exactamente los mismos flags, de modo que el resultado sea comparable.

    blender --background assets/avatar-source/blender/avatar-female.blend \
      --python tools/blender/export_glb.py -- \
      --output assets/avatar-source/glb-raw/bodies/female-base.glb
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import bpy


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument(
        "--only",
        nargs="*",
        default=None,
        help="Nombres de objeto a exportar. Por omisión, todas las mallas y la armadura.",
    )
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return parser.parse_args(argv)


def main() -> None:
    args = parse_args()
    output = Path(args.output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    # Selección explícita: el exportador debe llevar mallas, skinning, materiales
    # y clips, y dejar fuera cámaras, luces y objetos de trabajo.
    bpy.ops.object.select_all(action="DESELECT")
    selected = []
    for obj in bpy.context.scene.objects:
        if obj.type not in {"MESH", "ARMATURE"}:
            continue
        if args.only and obj.name not in args.only:
            continue
        obj.hide_set(False)
        obj.hide_viewport = False
        obj.select_set(True)
        selected.append(obj)

    if not selected:
        raise SystemExit("No hay objetos exportables en la escena.")
    bpy.context.view_layer.objects.active = selected[0]

    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_skins=True,
        export_morph=True,
        export_morph_normal=False,
        export_animations=True,
        export_nla_strips=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_extras=False,
    )
    print(f"exportado {output} ({output.stat().st_size} bytes, {len(selected)} objetos)")


if __name__ == "__main__":
    main()
