"""Esqueleto humano compartido PCCL y utilidades de skinning.

El contrato de huesos es el del README (§7.3) y lo consume el frontend a través
de `CUSTOM_BONE_MAP`. Renombrar un hueso rompe poses guardadas, así que los
nombres son estables por diseño.

Ejecutable de forma independiente:

    blender --background --python tools/blender/build_rig.py
"""

from __future__ import annotations

import bpy


# Orden jerárquico. El frontend valida contra esta misma lista.
REQUIRED_BONES = [
    "Root", "Hips", "Spine", "Spine1", "Neck", "Head",
    "LeftShoulder", "LeftArm", "LeftForeArm", "LeftHand",
    "RightShoulder", "RightArm", "RightForeArm", "RightHand",
    "LeftUpLeg", "LeftLeg", "LeftFoot",
    "RightUpLeg", "RightLeg", "RightFoot",
]

RIG_ID = "pccl-human-rig-v1"


def build_skeleton(proportions) -> bpy.types.Object:
    """Crea la armadura en pose A.

    La pose A (brazos ~40° hacia abajo y afuera) es deliberada: separa la axila
    lo suficiente para que el remallado por vóxeles no fusione el brazo con el
    torso, y es la pose en la que el pesado automático por calor produce menos
    errores en el hombro.
    """
    p = proportions

    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    armature = bpy.context.object
    armature.name = "PCCL_CustomHuman_Rig"
    armature.data.name = "PCCL_CustomHuman_Skeleton"
    edit_bones = armature.data.edit_bones

    def bone(name, head, tail, parent=None, connect=False):
        b = edit_bones.get(name) or edit_bones.new(name)
        b.head = head
        b.tail = tail
        if parent is not None:
            b.parent = edit_bones[parent]
            b.use_connect = connect
        return b

    # El hueso por defecto se recicla como Root para no dejar basura en la escena.
    root = edit_bones[0]
    root.name = "Root"
    root.head = (0.0, 0.0, 0.0)
    root.tail = (0.0, 0.0, 0.10)

    bone("Hips", (0.0, 0.0, p.hip_z), (0.0, 0.0, p.hip_z + 0.10), "Root")
    bone("Spine", (0.0, 0.0, p.hip_z + 0.10), (0.0, 0.0, p.chest_z), "Hips", connect=True)
    bone("Spine1", (0.0, 0.0, p.chest_z), (0.0, 0.0, p.shoulder_z), "Spine", connect=True)
    bone("Neck", (0.0, 0.0, p.shoulder_z), (0.0, 0.0, p.neck_top_z), "Spine1", connect=True)
    bone("Head", (0.0, 0.0, p.neck_top_z), (0.0, 0.0, p.head_top_z), "Neck", connect=True)

    for side, sx in (("Left", 1.0), ("Right", -1.0)):
        # Brazos
        bone(f"{side}Shoulder",
             (sx * 0.035, 0.0, p.shoulder_z - 0.02),
             (sx * p.shoulder_half, 0.0, p.arm_root_z), "Spine1")
        bone(f"{side}Arm",
             (sx * p.shoulder_half, 0.0, p.arm_root_z),
             (sx * p.elbow_x, 0.0, p.elbow_z), f"{side}Shoulder", connect=True)
        bone(f"{side}ForeArm",
             (sx * p.elbow_x, 0.0, p.elbow_z),
             (sx * p.wrist_x, 0.0, p.wrist_z), f"{side}Arm", connect=True)
        bone(f"{side}Hand",
             (sx * p.wrist_x, 0.0, p.wrist_z),
             (sx * p.hand_x, 0.0, p.hand_z), f"{side}ForeArm", connect=True)
        # Piernas
        bone(f"{side}UpLeg",
             (sx * p.leg_x, 0.0, p.hip_z),
             (sx * p.knee_x, 0.0, p.knee_z), "Hips")
        bone(f"{side}Leg",
             (sx * p.knee_x, 0.0, p.knee_z),
             (sx * p.ankle_x, 0.0, p.ankle_z), f"{side}UpLeg", connect=True)
        bone(f"{side}Foot",
             (sx * p.ankle_x, 0.0, p.ankle_z),
             (sx * p.ankle_x, p.foot_len, 0.02), f"{side}Leg", connect=True)

    bpy.ops.object.mode_set(mode="OBJECT")

    missing = [name for name in REQUIRED_BONES if name not in armature.data.bones]
    if missing:
        raise RuntimeError(f"Faltan huesos obligatorios: {missing}")
    return armature


def bind_with_automatic_weights(meshes, armature) -> None:
    """Vincula mallas al esqueleto con pesos automáticos por calor.

    Esto es lo que separa un personaje que se deforma de uno que se parte: el
    pesado por calor reparte cada vértice entre varios huesos, de modo que codos
    y rodillas doblan de forma continua en vez de rotar como piezas rígidas.

    Después se limita a 4 influencias por vértice y se normaliza, que es el
    presupuesto que espera glTF y el que exige el README (§7.3).
    """
    bpy.ops.object.select_all(action="DESELECT")
    for mesh in meshes:
        mesh.select_set(True)
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature

    bpy.ops.object.parent_set(type="ARMATURE_AUTO")

    for mesh in meshes:
        bpy.ops.object.select_all(action="DESELECT")
        mesh.select_set(True)
        bpy.context.view_layer.objects.active = mesh
        bpy.ops.object.vertex_group_limit_total(limit=4)
        bpy.ops.object.vertex_group_normalize_all(lock_active=False)


def fallback_weight_unassigned(mesh, armature, bone_name: str) -> int:
    """Asigna al hueso indicado los vértices que quedaron sin peso.

    El pesado por calor puede dejar huérfanos vértices en cavidades (interior de
    la boca, hueco entre mechones). Un vértice sin peso colapsa al origen al
    animar, así que se rescatan aquí en lugar de dejar que reviente en el
    navegador.
    """
    group = mesh.vertex_groups.get(bone_name) or mesh.vertex_groups.new(name=bone_name)
    rescued = 0
    for vertex in mesh.data.vertices:
        total = sum(g.weight for g in vertex.groups)
        if total <= 1e-5:
            group.add([vertex.index], 1.0, "REPLACE")
            rescued += 1
    return rescued


if __name__ == "__main__":
    import sys
    from pathlib import Path

    sys.path.append(str(Path(__file__).resolve().parent))
    from proportions import PROPORTIONS  # noqa: E402

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    rig = build_skeleton(PROPORTIONS["neutral"])
    print(f"rig={RIG_ID} huesos={len(rig.data.bones)}")
    for b in rig.data.bones:
        print(f"  {b.name:16s} parent={b.parent.name if b.parent else '-'}")
