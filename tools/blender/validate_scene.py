"""Validación de una escena `.blend` de avatar PCCL.

Falla con código distinto de cero ante cualquiera de los problemas que enumera
el README (§8). Está pensado para correr sobre el `.blend` guardado, antes de
que nada llegue al exportador:

    blender --background assets/avatar-source/blender/avatar-female.blend \
      --python tools/blender/validate_scene.py

Comprueba nombres, transformaciones aplicadas, normales invertidas, geometría
non-manifold, texturas, huesos obligatorios, pesos, morph targets, animaciones y
presupuesto de triángulos.
"""

from __future__ import annotations

import json
import sys

import bmesh
import bpy

REQUIRED_BONES = {
    "Root", "Hips", "Spine", "Spine1", "Neck", "Head",
    "LeftShoulder", "LeftArm", "LeftForeArm", "LeftHand",
    "RightShoulder", "RightArm", "RightForeArm", "RightHand",
    "LeftUpLeg", "LeftLeg", "LeftFoot", "RightUpLeg", "RightLeg", "RightFoot",
}
REQUIRED_MORPHS = {"blinkLeft", "blinkRight", "smile", "mouthOpen", "browUp", "surprised", "sad"}
REQUIRED_ANIMATIONS = {"Idle", "Breathing", "Wave", "Presentation"}

# El presupuesto es del conjunto que se ve a la vez, no de todo el guardarropa:
# la escena contiene además las prendas alternativas, que nunca coexisten.
DEFAULT_LOOK = {"Body_Skin", "Head_Face", "Top_A", "Bottom_A", "Shoes_A", "Hair_chunky-short"}
TRIANGLE_LIMIT = 60_000
TEXTURE_LIMIT = 2048
# Tolerancia de non-manifold: el remallado y el decimado pueden dejar unas pocas
# aristas sueltas sin consecuencia visible. Un porcentaje alto sí indica una
# malla rota.
NON_MANIFOLD_RATIO = 0.005


def triangles_of(obj) -> int:
    return sum(max(0, len(polygon.vertices) - 2) for polygon in obj.data.polygons)


def mesh_diagnostics(obj) -> dict:
    """Volumen con signo y aristas non-manifold de una malla."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()

    non_manifold = sum(1 for edge in bm.edges if not edge.is_manifold)
    total_edges = len(bm.edges)

    # El volumen con signo de una superficie cerrada es negativo si las normales
    # apuntan hacia dentro. Es la forma barata de detectar normales invertidas
    # sin inspeccionar cara por cara.
    volume = bm.calc_volume(signed=True)

    bm.free()
    return {
        "nonManifoldEdges": non_manifold,
        "edges": total_edges,
        "signedVolume": volume,
        "closed": non_manifold == 0,
    }


def main() -> None:
    errors: list[str] = []
    warnings: list[str] = []

    objects = list(bpy.context.scene.objects)
    names = [obj.name for obj in objects]
    if len(names) != len(set(names)):
        errors.append("hay nombres de objeto duplicados")
    for name in names:
        if not name.strip():
            errors.append("hay un objeto sin nombre")

    bones: set[str] = set()
    morphs: set[str] = set()
    triangles_total = 0
    triangles_visible = 0
    weighted_meshes = 0
    per_object: dict[str, int] = {}

    for obj in objects:
        if obj.type == "ARMATURE":
            bones.update(bone.name for bone in obj.data.bones)
            continue
        if obj.type != "MESH":
            continue

        # Escala aplicada. Exportar con escala distinta de 1 descoloca el
        # skinning y rompe la equivalencia de unidades con glTF.
        if any(abs(component - 1.0) > 1e-4 for component in obj.scale):
            errors.append(f"{obj.name}: escala sin aplicar {tuple(round(c, 4) for c in obj.scale)}")

        count = triangles_of(obj)
        triangles_total += count
        per_object[obj.name] = count
        if obj.name in DEFAULT_LOOK:
            triangles_visible += count

        diagnostics = mesh_diagnostics(obj)
        if diagnostics["edges"] > 0:
            ratio = diagnostics["nonManifoldEdges"] / diagnostics["edges"]
            if ratio > NON_MANIFOLD_RATIO:
                errors.append(
                    f"{obj.name}: geometría non-manifold relevante "
                    f"({diagnostics['nonManifoldEdges']}/{diagnostics['edges']} aristas)"
                )
            elif diagnostics["nonManifoldEdges"] > 0:
                warnings.append(
                    f"{obj.name}: {diagnostics['nonManifoldEdges']} aristas non-manifold (dentro de tolerancia)"
                )
        # Solo tiene sentido en mallas cerradas: en una abierta el volumen con
        # signo no significa nada.
        if diagnostics["closed"] and diagnostics["signedVolume"] < 0:
            errors.append(f"{obj.name}: normales invertidas (volumen con signo negativo)")

        if obj.data.shape_keys:
            morphs.update(
                key.name for key in obj.data.shape_keys.key_blocks if key.name != "Basis"
            )

        if not obj.vertex_groups:
            errors.append(f"{obj.name}: malla sin grupos de vértices (no se deformará)")
            continue
        weighted_meshes += 1

        unweighted = 0
        unnormalised = 0
        over_four = 0
        for vertex in obj.data.vertices:
            weights = [group.weight for group in vertex.groups if group.weight > 0.0]
            total = sum(weights)
            if total <= 1e-5:
                unweighted += 1
            elif abs(total - 1.0) > 1e-3:
                unnormalised += 1
            if len(weights) > 4:
                over_four += 1
        if unweighted:
            errors.append(f"{obj.name}: {unweighted} vértices sin peso")
        if unnormalised:
            errors.append(f"{obj.name}: {unnormalised} vértices con pesos sin normalizar")
        if over_four:
            errors.append(f"{obj.name}: {over_four} vértices con más de 4 influencias")

    # Texturas: se comprueba que existan en disco y que no excedan presupuesto.
    textures: list[dict] = []
    for image in bpy.data.images:
        if image.name in {"Render Result", "Viewer Node"}:
            continue
        width, height = image.size
        textures.append({"name": image.name, "size": [width, height]})
        if image.source == "FILE" and not image.has_data:
            errors.append(f"textura faltante: {image.name} ({image.filepath})")
        if max(width, height) > TEXTURE_LIMIT:
            errors.append(f"textura fuera de presupuesto: {image.name} {width}x{height}")

    animations = {action.name for action in bpy.data.actions}

    for missing in sorted(REQUIRED_BONES - bones):
        errors.append(f"falta el hueso obligatorio {missing}")
    for missing in sorted(REQUIRED_MORPHS - morphs):
        errors.append(f"falta el morph target {missing}")
    for missing in sorted(REQUIRED_ANIMATIONS - animations):
        errors.append(f"falta la animación {missing}")

    if triangles_visible == 0:
        errors.append("no se identificó el conjunto visible por defecto en la escena")
    elif triangles_visible > TRIANGLE_LIMIT:
        errors.append(f"presupuesto de triángulos superado: {triangles_visible} > {TRIANGLE_LIMIT}")
    if weighted_meshes == 0:
        errors.append("ninguna malla tiene pesos")

    report = {
        "trianglesVisible": triangles_visible,
        "trianglesTotal": triangles_total,
        "trianglesByObject": per_object,
        "bones": sorted(bones),
        "morphTargets": sorted(morphs),
        "animations": sorted(animations),
        "textures": textures,
        "warnings": warnings,
        "errors": errors,
    }
    print(json.dumps(report, indent=2))
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
