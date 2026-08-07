"""Galería de retratos de alumno, renderizada desde los `.blend` ya construidos.

Por qué pre-renderizar y no montar un visor 3D por tarjeta
──────────────────────────────────────────────────────────
Una vista de alumnos muestra decenas de avatares a la vez. Montar un canvas
WebGL por tarjeta cuesta memoria y fps, y además cada visor acaba con
iluminación y encuadre ligeramente distintos según su tamaño. Un retrato
renderizado aquí garantiza que TODOS los avatares de la aplicación compartan
exactamente la misma cámara, luz, escala y perspectiva — que es justo lo que
pide la especificación — y que pintarlos cueste lo mismo que una imagen.

No reconstruye geometría: abre el `.blend` que produjo `build_avatar.py` y solo
cambia tintes de material y qué prendas están visibles. Por eso es rápido y por
eso todos los retratos son el mismo personaje bien hecho, no variantes sueltas.

    blender --background assets/avatar-source/blender/avatar-female.blend \
      --python tools/blender/render_portraits.py -- \
      --out-dir assets/avatar-source/glb-raw/portraits \
      --body-id female-base --variants 4 --start-index 0
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.append(str(Path(__file__).resolve().parent))

from create_materials import hex_to_linear_rgba  # noqa: E402

# Paletas: deben coincidir con las que ofrece el editor en `lib/avatar/custom.ts`,
# para que un retrato de la galería sea alcanzable también personalizándose.
SKIN_TONES = ["#F2C6A0", "#E0A578", "#C8814E", "#8E5632", "#5E3620"]
HAIR_TONES = ["#1B1614", "#4A2A18", "#8A3E1C", "#C9974A", "#6E6A66"]
# Prendas: paleta deliberadamente sin naranjas ni tostados. Sobre un tono de
# piel cálido, una camiseta naranja se funde con la piel y el personaje parece
# ir sin camiseta. El naranja del dragón se reserva para calzado y detalles.
GARMENT_TONES = ["#2F6E8F", "#3E8E5A", "#6B3F63", "#2B3242", "#9E3B47"]

# Prendas y peinados alternativos que trae cada `.blend`.
HAIR_MESHES = ["Hair_chunky-short", "Hair_layered-bob"]
TOP_MESHES = ["Top_A", "Top_B"]
BOTTOM_MESHES = ["Bottom_A", "Bottom_B"]
SHOE_MESHES = ["Shoes_A", "Shoes_B"]

ALWAYS_VISIBLE = {"Body_Skin", "Head_Face"}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--body-id", required=True)
    parser.add_argument("--variants", type=int, default=4)
    parser.add_argument("--start-index", type=int, default=0)
    parser.add_argument("--resolution", type=int, default=384)
    parser.add_argument("--manifest", default="")
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return parser.parse_args(argv)


def tint(material_name: str, hex_color: str) -> None:
    material = bpy.data.materials.get(material_name)
    if not material or not material.use_nodes:
        return
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = hex_to_linear_rgba(hex_color)
    material.diffuse_color = hex_to_linear_rgba(hex_color)


def set_visible(names: set[str]) -> None:
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.hide_render = obj.name not in names


def relaxed_pose(armature) -> None:
    """Pose natural: peso a un lado, brazos descansando, ligera torsión.

    La pose A del rig es de trabajo, no de presentación: brazos rectos y
    simétricos leen como maniquí. Aquí se rompe la simetría y se cierran algo
    los brazos, que es lo que da lectura de persona relajada.
    """
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode="POSE")

    # Las pistas NLA imponen la animación; se silencian para partir de reposo.
    if armature.animation_data:
        for track in armature.animation_data.nla_tracks:
            track.mute = True

    r = math.radians
    pose = {
        # Torsión suave de columna y cadera: rompe la simetría del maniquí.
        "Hips": (0.0, r(-6.0), r(1.5)),
        "Spine": (r(1.5), r(-3.0), r(-1.0)),
        "Spine1": (r(-1.0), r(-2.0), r(1.0)),
        # Cabeza ligeramente girada hacia cámara y apenas inclinada.
        "Neck": (r(1.0), r(4.0), r(1.0)),
        "Head": (r(-2.0), r(7.0), r(-1.5)),
        # Brazos: bajan contra el cuerpo y flexionan el codo hacia adelante.
        #
        # Los signos están medidos sobre este rig, no deducidos: en `RightArm`
        # el +Z LEVANTA el brazo, así que para cerrarlo contra el torso hace
        # falta -Z (y +Z en el izquierdo, que es especular). En el antebrazo,
        # -X lleva la mano hacia adelante, que es la flexión natural del codo.
        # Con los signos invertidos el personaje queda en cruz, que es
        # exactamente la pose rígida que hay que evitar.
        "LeftShoulder": (0.0, 0.0, r(4.0)),
        "LeftArm": (r(2.0), 0.0, r(24.0)),
        "LeftForeArm": (r(-22.0), 0.0, r(6.0)),
        "LeftHand": (0.0, 0.0, r(4.0)),
        "RightShoulder": (0.0, 0.0, r(-4.0)),
        "RightArm": (r(2.0), 0.0, r(-21.0)),
        "RightForeArm": (r(-26.0), 0.0, r(-7.0)),
        "RightHand": (0.0, 0.0, r(-5.0)),
        # Peso sobre una pierna.
        "LeftUpLeg": (r(-2.0), 0.0, r(-2.0)),
        "RightUpLeg": (r(3.0), 0.0, r(2.5)),
        "RightLeg": (r(-4.0), 0.0, 0.0),
    }
    for bone_name, rotation in pose.items():
        bone = armature.pose.bones.get(bone_name)
        if not bone:
            continue
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = rotation

    bpy.ops.object.mode_set(mode="OBJECT")


def smile(face) -> None:
    """Expresión amable de base. Sin esto la cara queda inexpresiva."""
    keys = face.data.shape_keys
    if not keys:
        return
    for name, value in (("smile", 0.55), ("browUp", 0.12)):
        block = keys.key_blocks.get(name)
        if block:
            block.value = value


def setup_studio(resolution: int):
    """Cámara y luz de estudio. Idénticas para todos los retratos, a propósito."""
    scene = bpy.context.scene

    camera_data = bpy.data.cameras.new("PortraitCam")
    camera_data.lens_unit = "FOV"
    # FOV estrecho: comprime la perspectiva y evita la nariz agrandada del
    # primer plano con gran angular.
    camera_data.angle = math.radians(22.0)
    camera = bpy.data.objects.new("PortraitCam", camera_data)
    scene.collection.objects.link(camera)
    # Tres cuartos a la altura de los ojos. Se apunta al punto entre cabeza y
    # pecho para que el retrato encuadre rostro y hombros; más abajo entran los
    # brazos por las esquinas y la composición se ensucia.
    aim = Vector((0.0, 0.0, 1.33))
    camera.location = Vector((0.92, -2.44, 1.50))
    camera.rotation_euler = (camera.location - aim).to_track_quat("Z", "Y").to_euler()
    scene.camera = camera

    lights = []
    for name, location, energy, size, color in (
        ("Key",  (1.9, -2.0, 2.5), 420.0, 2.2, (1.0, 0.96, 0.90)),
        ("Fill", (-2.1, -1.5, 1.5), 150.0, 3.0, (0.88, 0.93, 1.0)),
        ("Rim",  (-0.6, 2.2, 2.2), 260.0, 1.6, (1.0, 1.0, 1.0)),
    ):
        light_data = bpy.data.lights.new(f"Portrait{name}", type="AREA")
        light_data.energy = energy
        light_data.size = size
        light_data.color = color
        light = bpy.data.objects.new(f"Portrait{name}", light_data)
        light.location = Vector(location)
        # Se orientan al rostro para que la caída de luz sea suave y repetible.
        light.rotation_euler = (light.location - Vector((0.0, 0.0, 1.40))).to_track_quat("Z", "Y").to_euler()
        scene.collection.objects.link(light)
        lights.append(light)

    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = resolution
    scene.render.resolution_y = resolution
    # Fondo transparente: cada vista de la app pone el suyo y así el retrato
    # encaja igual sobre tarjeta clara u oscura.
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 90
    scene.view_settings.view_transform = "AgX"
    if hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = 64
    return camera, lights


def main() -> None:
    args = parse_args()
    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    armature = next(o for o in bpy.context.scene.objects if o.type == "ARMATURE")
    face = bpy.data.objects.get("Head_Face")

    relaxed_pose(armature)
    if face:
        smile(face)
    setup_studio(args.resolution)

    written = []
    for offset in range(args.variants):
        index = args.start_index + offset
        # Índices desfasados por número primo: recorre combinaciones distintas
        # en vez de repetir el mismo patrón entre cuerpos.
        skin = SKIN_TONES[(index * 3) % len(SKIN_TONES)]
        hair_color = HAIR_TONES[(index * 2) % len(HAIR_TONES)]
        top_color = GARMENT_TONES[index % len(GARMENT_TONES)]
        bottom_color = GARMENT_TONES[(index * 4 + 1) % len(GARMENT_TONES)]

        hair_mesh = HAIR_MESHES[index % len(HAIR_MESHES)]
        top_mesh = TOP_MESHES[(index // 2) % len(TOP_MESHES)]
        bottom_mesh = BOTTOM_MESHES[index % len(BOTTOM_MESHES)]
        shoe_mesh = SHOE_MESHES[(index // 2) % len(SHOE_MESHES)]

        tint("PCCL_Skin", skin)
        tint("PCCL_Hair", hair_color)
        tint("PCCL_TopA", top_color)
        tint("PCCL_TopB", top_color)
        tint("PCCL_BottomA", bottom_color)
        tint("PCCL_BottomB", bottom_color)

        set_visible(ALWAYS_VISIBLE | {hair_mesh, top_mesh, bottom_mesh, shoe_mesh})

        name = f"{args.body_id}-{index:02d}.png"
        bpy.context.scene.render.filepath = str(out_dir / name)
        bpy.ops.render.render(write_still=True)
        written.append({
            "id": f"{args.body_id}-{index:02d}",
            "file": name,
            "bodyId": args.body_id,
            "skin": skin,
            "hair": hair_color,
            "top": top_color,
            "hairMesh": hair_mesh,
            "topMesh": top_mesh,
        })

    if args.manifest:
        Path(args.manifest).parent.mkdir(parents=True, exist_ok=True)
        Path(args.manifest).write_text(json.dumps(written, indent=2), encoding="utf-8")
    print(json.dumps({"rendered": len(written), "outDir": str(out_dir)}, indent=2))


if __name__ == "__main__":
    main()
