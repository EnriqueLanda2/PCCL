"""Construye un humano estilizado PCCL completo y lo exporta a glTF.

Estrategia de modelado
──────────────────────
El cuerpo NO se ensambla con cápsulas sueltas. Se construye un blockout con
cadenas de elipsoides a lo largo de los ejes del esqueleto, se unen en un solo
objeto y se **remalla por vóxeles**. El remallado funde todo en una única
superficie manifold y continua: hombros, codos y rodillas quedan resueltos como
transiciones orgánicas, no como piezas que se solapan. Después se suaviza y se
decima al presupuesto de triángulos.

Esa continuidad es también lo que permite el segundo punto importante: el
pesado automático por calor (`ARMATURE_AUTO`) necesita una malla cerrada para
repartir cada vértice entre varios huesos. Con piezas sueltas el resultado es
rígido y las articulaciones se parten al animar.

La ropa se deriva de la propia malla del cuerpo ya pesada: se duplica, se
recorta la región y se le da grosor hacia fuera. Así encaja por construcción
(no puede haber clipping con el cuerpo) y hereda los pesos correctos gratis.

Uso
───
    blender --background --python tools/blender/build_avatar.py -- \
      --variant feminine --body-id female-base \
      --blend assets/avatar-source/blender/avatar-female.blend \
      --out-dir apps/frontend/web-shell/public/avatars/custom \
      --report apps/frontend/web-shell/public/avatars/custom/reports/female-base.json
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

sys.path.append(str(Path(__file__).resolve().parent))

from build_rig import (  # noqa: E402
    REQUIRED_BONES,
    RIG_ID,
    bind_with_automatic_weights,
    build_skeleton,
    fallback_weight_unassigned,
)
from create_materials import build_material_library  # noqa: E402
from proportions import PROPORTIONS  # noqa: E402

REQUIRED_MORPHS = ["blinkLeft", "blinkRight", "smile", "mouthOpen", "browUp", "surprised", "sad"]
REQUIRED_ANIMATIONS = ["Idle", "Breathing", "Wave", "Presentation"]

# Presupuestos de triángulos (README §7.1). El cuerpo se remalla muy denso y se
# decima hasta aquí; es más barato que intentar acertar la densidad del vóxel.
BUDGET_BODY = 23000
BUDGET_HAIR = 4500
BUDGET_TOP = 6500
BUDGET_BOTTOM = 6500
BUDGET_SHOES = 3200


# ── Utilidades ───────────────────────────────────────────────────────────────

def clean_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.armatures, bpy.data.actions):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def activate(obj) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def smoothstep(edge: float) -> float:
    """Interpolación suave 0→1 usada en todos los falloffs de modelado."""
    t = min(1.0, max(0.0, edge))
    return t * t * (3.0 - 2.0 * t)


def falloff(distance: float, radius: float) -> float:
    """1 en el centro, 0 a partir de `radius`, con derivada continua."""
    if radius <= 0.0 or distance >= radius:
        return 0.0
    return smoothstep(1.0 - distance / radius)


def triangle_count(obj) -> int:
    return sum(len(polygon.vertices) - 2 for polygon in obj.data.polygons)


def decimate_to(obj, target_triangles: int) -> None:
    """Colapsa la malla hasta el presupuesto. No hace nada si ya cabe."""
    current = triangle_count(obj)
    if current <= target_triangles:
        return
    activate(obj)
    modifier = obj.modifiers.new("PCCL_Budget", "DECIMATE")
    modifier.decimate_type = "COLLAPSE"
    modifier.ratio = target_triangles / current
    bpy.ops.object.modifier_apply(modifier=modifier.name)


def unwrap(obj) -> None:
    """UVs por proyección inteligente.

    No hay texturas de imagen en esta entrega (el color va por tinte de
    material, §7.2), pero exportar UVs deja los assets listos para texturizar
    sin rehacer el pipeline.
    """
    activate(obj)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.02)
    bpy.ops.object.mode_set(mode="OBJECT")


def clean_mesh(obj, merge_distance: float = 0.0004) -> None:
    """Suelda vértices coincidentes, borra sueltos y recalcula normales.

    Recortar caras y aplicar Solidify deja geometría degenerada (vértices
    huérfanos, caras de área cero) que el exportador glTF marca como malla no
    válida. Limpiarla aquí evita normales invertidas en el navegador.
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=merge_distance)
    loose = [v for v in bm.verts if not v.link_faces]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context="VERTS")
    degenerate = [f for f in bm.faces if f.calc_area() < 1e-9]
    if degenerate:
        bmesh.ops.delete(bm, geom=degenerate, context="FACES")
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()


def limit_influences(obj) -> None:
    """Reimpone el techo de 4 influencias por vértice y normaliza.

    Hay que repetirlo después de decimar: al colapsar aristas se fusionan los
    pesos de los vértices originales y el conteo puede volver a subir de 4, que
    es el máximo que admite glTF sin extensiones.
    """
    if not obj.vertex_groups:
        return
    activate(obj)
    bpy.ops.object.vertex_group_limit_total(limit=4)
    bpy.ops.object.vertex_group_normalize_all(lock_active=False)


def trim_faces(obj, keep) -> None:
    """Borra las caras cuyo centro no cumple `keep(centro)`."""
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    doomed = [f for f in bm.faces if not keep(f.calc_center_median())]
    bmesh.ops.delete(bm, geom=doomed, context="FACES")
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()


# ── Blockout por cadenas de elipsoides ───────────────────────────────────────

def add_ellipsoid(location, radii, segments=16, rings=10):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1.0, location=location)
    obj = bpy.context.object
    obj.scale = radii
    # Se hornea la transformación completa para que las coordenadas locales de la
    # malla coincidan con las del mundo. Todo el modelado posterior (recortes de
    # ropa, regiones faciales) razona en coordenadas de mundo, y arrastrar un
    # origen desplazado es una fuente de errores silenciosos.
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return obj


def blob_chain(control_points, steps: int = 14, segments: int = 16, rings: int = 10):
    """Cadena de elipsoides interpolada entre puntos de control.

    `control_points` es una lista de `(Vector posición, (rx, ry, rz))`. Se
    interpola linealmente con suficiente densidad para que la unión de las
    elipsoides sea continua; el remallado posterior se encarga del resto.
    """
    created = []
    for index in range(len(control_points) - 1):
        (p0, r0), (p1, r1) = control_points[index], control_points[index + 1]
        for step in range(steps + 1):
            # Se salta el primer punto de los tramos intermedios para no apilar
            # dos elipsoides idénticas en cada junta.
            if index > 0 and step == 0:
                continue
            t = step / steps
            position = p0.lerp(p1, t)
            radii = tuple(r0[axis] + (r1[axis] - r0[axis]) * t for axis in range(3))
            created.append(add_ellipsoid(position, radii, segments, rings))
    return created


def join_objects(objects, name: str):
    activate(objects[0])
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    joined = bpy.context.object
    joined.name = name
    # `join` deja el resultado con la transformación del objeto activo. Se
    # hornea para devolver el objeto a identidad y mantener local == mundo.
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return joined


def fuse(obj, voxel_size: float, smooth_iterations: int = 6, smooth_factor: float = 0.55):
    """Remalla por vóxeles y suaviza.

    El remallado deja un escalonado propio de la rejilla; el modificador Smooth
    lo elimina. Se aplica con factor moderado porque un suavizado agresivo come
    volumen y adelgaza dedos, tobillos y nariz.
    """
    activate(obj)
    obj.data.remesh_voxel_size = voxel_size
    obj.data.remesh_voxel_adaptivity = 0.0
    bpy.ops.object.voxel_remesh()

    modifier = obj.modifiers.new("PCCL_Relax", "SMOOTH")
    modifier.factor = smooth_factor
    modifier.iterations = smooth_iterations
    bpy.ops.object.modifier_apply(modifier=modifier.name)

    bpy.ops.object.shade_smooth()
    return obj


# ── Cuerpo ───────────────────────────────────────────────────────────────────

def torso_profile(p):
    """Perfil (z, semiancho, semiprofundidad) del torso, de cadera a hombros.

    Vive fuera de `build_body` porque la ropa lo reutiliza: una prenda se
    construye inflando este mismo perfil, y así encaja por construcción sin
    depender de la malla ya remallada.
    """
    return [
        (p.hip_z - 0.040, p.hip_half * 0.92, p.torso_depth * 0.90),
        (p.hip_z + 0.020, p.hip_half, p.torso_depth * 0.95),
        (p.hip_z + 0.090, p.hip_half * 0.94, p.torso_depth * 0.90),
        (p.hip_z + 0.160, p.waist_half, p.torso_depth * 0.85),
        (p.chest_z - 0.025, p.chest_half * 0.96, p.torso_depth * 0.97),
        (p.chest_z + 0.030, p.chest_half, p.torso_depth),
        (p.shoulder_z - 0.050, p.shoulder_half * 0.95, p.torso_depth * 0.98),
        (p.shoulder_z - 0.005, p.shoulder_half * 0.93, p.torso_depth * 0.92),
        (p.shoulder_z + 0.025, p.shoulder_half * 0.62, p.torso_depth * 0.68),
    ]


def sample_torso(p, z: float) -> tuple[float, float]:
    """Interpola el perfil del torso a una altura arbitraria."""
    profile = torso_profile(p)
    if z <= profile[0][0]:
        return profile[0][1], profile[0][2]
    if z >= profile[-1][0]:
        return profile[-1][1], profile[-1][2]
    for index in range(len(profile) - 1):
        z0, rx0, ry0 = profile[index]
        z1, rx1, ry1 = profile[index + 1]
        if z0 <= z <= z1:
            t = (z - z0) / (z1 - z0)
            return rx0 + (rx1 - rx0) * t, ry0 + (ry1 - ry0) * t
    return profile[-1][1], profile[-1][2]


def torso_slices(p, z_min: float, z_max: float, inflate: float = 1.0,
                 pad: float = 0.0, step: float = 0.011, thickness: float = 0.055):
    """Lonchas elipsoidales del torso entre dos alturas, opcionalmente infladas."""
    slices = []
    z = z_min
    while z <= z_max + 1e-6:
        rx, ry = sample_torso(p, z)
        slices.append(((0.0, 0.0, z), (rx * inflate + pad, ry * inflate + pad, thickness)))
        z += step
    return slices


def build_body(p):
    """Blockout completo del cuerpo (cuello abajo) fundido en una sola malla."""
    parts = []

    # Torso: lonchas elipsoidales con paso corto. La unión de lonchas produce un
    # loft limpio; una sola primitiva estirada daría un tubo sin cintura.
    #
    # El torso termina por DEBAJO del cuello de la prenda (que llega a
    # shoulder_z + 0.028). Si ambos acaban a la misma altura, la cima del hombro
    # coincide con la de la tela y la piel asoma como un punto en el hombro. El
    # hueco lo rellena la cadena del cuello, que arranca más abajo.
    for location, radii in torso_slices(p, p.hip_z - 0.040, p.shoulder_z + 0.002):
        parts.append(add_ellipsoid(location, radii, 26, 12))

    # Cuello: entra dentro del cráneo para que no haya costura visible.
    parts += blob_chain([
        (Vector((0.0, 0.004, p.shoulder_z - 0.025)), (0.060, 0.060, 0.048)),
        (Vector((0.0, 0.004, p.neck_top_z + 0.020)), (0.053, 0.055, 0.048)),
    ], steps=7)

    for sign in (1.0, -1.0):
        # Brazo: deltoides marcado, codo algo más fino, muñeca estrecha.
        parts += blob_chain([
            (Vector((sign * p.shoulder_half * 0.72, 0.0, p.arm_root_z + 0.030)),
             (p.upper_arm_r * 1.34, p.upper_arm_r * 1.34, p.upper_arm_r * 1.20)),
            (Vector((sign * p.shoulder_half * 1.02, 0.0, p.arm_root_z - 0.010)),
             (p.upper_arm_r * 1.22, p.upper_arm_r * 1.22, p.upper_arm_r * 1.22)),
            (Vector((sign * p.elbow_x, 0.0, p.elbow_z)),
             (p.upper_arm_r * 0.86,) * 3),
            (Vector((sign * p.wrist_x, 0.0, p.wrist_z)),
             (p.fore_arm_r * 0.70,) * 3),
        ], steps=12)

        # Mano: paleta redondeada con pulgar insinuado. Los dedos no se separan
        # a propósito — a esta escala se leerían como ruido y multiplicarían los
        # triángulos sin mejorar la silueta (README §5.1: manos simplificadas).
        hand_dir = Vector((p.hand_x - p.wrist_x, 0.0, p.hand_z - p.wrist_z)).normalized()
        palm = Vector((sign * p.wrist_x, 0.0, p.wrist_z)) + Vector((sign * hand_dir.x, 0.0, hand_dir.z)) * 0.055
        parts.append(add_ellipsoid(palm, (p.hand_r * 0.95, p.hand_r * 0.52, p.hand_r * 1.15), 20, 12))
        finger_tip = palm + Vector((sign * hand_dir.x, 0.0, hand_dir.z)) * 0.052
        parts.append(add_ellipsoid(finger_tip, (p.hand_r * 0.80, p.hand_r * 0.44, p.hand_r * 0.72), 18, 10))
        thumb = palm + Vector((0.0, -p.hand_r * 0.80, 0.012))
        parts.append(add_ellipsoid(thumb, (p.hand_r * 0.34, p.hand_r * 0.40, p.hand_r * 0.46), 14, 8))

        # Pierna: muslo, rodilla, pantorrilla y tobillo.
        parts += blob_chain([
            (Vector((sign * p.leg_x, 0.0, p.hip_z - 0.010)), (p.thigh_r * 1.05,) * 3),
            (Vector((sign * (p.leg_x + p.knee_x) * 0.5, 0.0, (p.hip_z + p.knee_z) * 0.5)),
             (p.thigh_r * 0.92,) * 3),
            (Vector((sign * p.knee_x, 0.0, p.knee_z)), (p.calf_r * 1.06,) * 3),
            (Vector((sign * p.knee_x, -0.004, p.knee_z - 0.080)), (p.calf_r * 1.02,) * 3),
            (Vector((sign * p.ankle_x, 0.0, p.ankle_z + 0.030)), (p.calf_r * 0.60,) * 3),
        ], steps=12)

        # Pie: cuña redondeada hacia -Y (el personaje mira a -Y).
        parts.append(add_ellipsoid(
            (sign * p.ankle_x, p.foot_len * 0.34, p.foot_height * 0.80),
            (p.foot_width, abs(p.foot_len) * 0.55, p.foot_height), 20, 12))
        parts.append(add_ellipsoid(
            (sign * p.ankle_x, p.foot_len * 0.86, p.foot_height * 0.62),
            (p.foot_width * 0.86, abs(p.foot_len) * 0.26, p.foot_height * 0.70), 18, 10))

    body = join_objects(parts, "Body_Skin")
    # 0.0085 da ~70-90k triángulos antes de decimar: suficiente para que codos y
    # tobillos no se acartonen, y el decimado posterior lo baja al presupuesto.
    fuse(body, voxel_size=0.0085, smooth_iterations=7, smooth_factor=0.6)
    decimate_to(body, BUDGET_BODY)
    clean_mesh(body)
    activate(body)
    bpy.ops.object.shade_smooth()
    return body


# ── Cabeza ───────────────────────────────────────────────────────────────────

def build_head(p, materials):
    """Cráneo, rostro y orejas con topología limpia de esfera UV.

    Se mantiene la topología de esfera UV (y no se remalla) porque los morph
    targets necesitan una malla estable y con anillos regulares alrededor de
    ojos y boca.
    """
    bpy.ops.mesh.primitive_uv_sphere_add(segments=72, ring_count=44, radius=1.0, location=(0.0, 0.0, 0.0))
    head = bpy.context.object
    head.name = "Head_Face"

    rx, ry, rz = p.head_rx, p.head_ry, p.head_rz
    eye_local_z = p.eye_z - p.head_center_z
    nose_local_z = p.nose_z - p.head_center_z
    mouth_local_z = p.mouth_z - p.head_center_z

    for vertex in head.data.vertices:
        co = vertex.co
        # Esfera unidad → elipsoide del cráneo.
        co.x *= rx
        co.y *= ry
        co.z *= rz

        v, w = co.y / ry, co.z / rz  # normalizados [-1, 1]

        # Mandíbula: afina la mitad inferior. Es el rasgo que más distingue las
        # variantes (`jaw_taper`).
        if w < 0.0:
            taper = 1.0 - p.jaw_taper * 0.42 * (abs(w) ** 1.7)
            co.x *= taper
            co.y *= taper

        # Occipital: la esfera pura da una nuca demasiado abombada.
        if v > 0.35:
            co.y -= ry * 0.10 * smoothstep((v - 0.35) / 0.65)

        # Mentón: pequeño avance hacia -Y en la barbilla.
        chin = falloff((Vector((co.x, co.y - (-ry * 0.55), co.z - (-rz * 0.86))) * Vector((1.6, 1.0, 1.0))).length, rx * 0.62)
        co.y -= ry * 0.10 * chin
        co.z -= rz * 0.035 * chin

        # Arco superciliar: leve saliente sobre los ojos, da lectura al perfil.
        brow = falloff(Vector((abs(co.x) - p.eye_x * 0.85, co.y - (-ry * 0.80), co.z - (eye_local_z + rz * 0.20))).length, rx * 0.50)
        co.y -= ry * 0.040 * brow

        # Pómulos.
        cheek = falloff(Vector((abs(co.x) - rx * 0.62, co.y - (-ry * 0.55), co.z - (mouth_local_z + rz * 0.12))).length, rx * 0.46)
        co.y -= ry * 0.045 * cheek
        co.x += math.copysign(rx * 0.035 * cheek, co.x if co.x != 0 else 1.0)

        # Nariz: un botón pequeño y redondeado. El desplazamiento es deliberadamente
        # corto — con valores altos la caída elíptica se convierte en un pico y el
        # personaje deja de leerse como humano estilizado.
        nose = falloff(Vector((co.x * 3.4, (co.y + ry) * 0.8, (co.z - nose_local_z) * 2.2)).length, rx * 0.30)
        co.y -= ry * 0.085 * nose

        # Cuenca ocular: hundido suave donde se alojan los globos oculares.
        for side in (1.0, -1.0):
            socket = falloff(Vector((co.x - side * p.eye_x, (co.y + ry) * 0.55, (co.z - eye_local_z) * 1.25)).length, p.eye_r * 1.55)
            co.y += ry * 0.085 * socket

        # Surco de la boca.
        mouth = falloff(Vector((co.x * 1.5, (co.y + ry) * 0.6, (co.z - mouth_local_z) * 2.6)).length, rx * 0.34)
        co.y += ry * 0.045 * mouth

    # Orejas: elipsoides aplastadas, unidas antes de crear los morph targets
    # (una vez añadidas las shape keys la topología queda congelada).
    ears = []
    for side in (1.0, -1.0):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, radius=1.0,
                                             location=(side * rx * 1.02, ry * 0.12, p.ear_z - p.head_center_z))
        ear = bpy.context.object
        ear.scale = (rx * 0.09, ry * 0.20, rz * 0.26)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        ears.append(ear)

    head = join_objects([head] + ears, "Head_Face")
    head.location = (0.0, 0.0, p.head_center_z)
    activate(head)
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)
    head.data.materials.append(materials["skin"])
    bpy.ops.object.shade_smooth()
    return head


def build_eyes(p, materials):
    """Globo, iris y pupila por ojo. Se unen en una malla por lado.

    El ojo es un casquete achatado, no una esfera completa: una esfera del
    tamaño necesario para leerse sobresale de la cuenca y produce la mirada
    saltona de muñeco barato. Achatado en Y se apoya en la cuenca y solo asoma
    unos milímetros, que es lo que da el brillo.
    """
    created = []
    for side, label in ((1.0, "Left"), (-1.0, "Right")):
        depth = -p.head_ry * 0.760
        centre = Vector((side * p.eye_x, depth, p.eye_z))

        bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=18, radius=1.0, location=centre)
        white = bpy.context.object
        white.scale = (p.eye_r * 1.02, p.eye_r * 0.34, p.eye_r * 0.94)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        white.data.materials.append(materials["eye_white"])

        # Iris y pupila se escalonan hacia -Y con separación suficiente para que
        # no se entierren mutuamente al aplanar el ojo. Sin este escalonado la
        # mirada se pierde y el rostro queda inexpresivo a tamaño de editor.
        iris_centre = Vector((side * p.eye_x, depth - p.eye_r * 0.24, p.eye_z))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=14, radius=1.0, location=iris_centre)
        iris = bpy.context.object
        iris.scale = (p.eye_r * 0.64, p.eye_r * 0.18, p.eye_r * 0.64)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        iris.data.materials.append(materials["eye_iris"])

        pupil_centre = Vector((side * p.eye_x, depth - p.eye_r * 0.34, p.eye_z))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=18, ring_count=12, radius=1.0, location=pupil_centre)
        pupil = bpy.context.object
        pupil.scale = (p.eye_r * 0.35, p.eye_r * 0.14, p.eye_r * 0.35)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        pupil.data.materials.append(materials["eye_pupil"])

        eye = join_objects([white, iris, pupil], f"Eye_{label}")
        bpy.ops.object.shade_smooth()
        created.append(eye)
    return created


def build_mouth(p, materials):
    """Boca como pieza propia.

    El hundido del labio por sí solo no se lee: sin una superficie de color
    distinto el personaje aparece sin boca desde la distancia de encuadre del
    editor.
    """
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=28, ring_count=14, radius=1.0,
        location=(0.0, -p.head_ry * 0.715, p.mouth_z))
    mouth = bpy.context.object
    mouth.name = "Mouth"
    mouth.scale = (p.head_rx * 0.30, p.head_ry * 0.075, p.head_rz * 0.045)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mouth.data.materials.append(materials["mouth"])
    bpy.ops.object.shade_smooth()
    return mouth


def build_brows(p, materials):
    """Cejas como barras redondeadas; se leen mejor que una textura a esta escala."""
    created = []
    for side, label in ((1.0, "Left"), (-1.0, "Right")):
        # La ceja se apoya sobre el arco superciliar, que ya sobresale: hay que
        # colocarla por delante de la piel o queda enterrada y el rostro pierde
        # toda su expresión.
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=18, ring_count=10, radius=1.0,
            location=(side * p.eye_x, -p.head_ry * 0.915, p.eye_z + p.eye_r * 1.42))
        brow = bpy.context.object
        brow.name = f"Brow_{label}"
        brow.scale = (p.eye_r * 0.98, p.eye_r * 0.15, p.eye_r * 0.21)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        brow.rotation_euler = (0.0, math.radians(-7.0 * side), 0.0)
        brow.data.materials.append(materials["hair"])
        bpy.ops.object.shade_smooth()
        created.append(brow)
    return created


# ── Morph targets ────────────────────────────────────────────────────────────

def add_face_morphs(face, p) -> None:
    """Crea los 7 morph targets canónicos sobre la malla facial ya unida.

    Los nombres son los del contrato propio (README §7.4). `provider.ts` traduce
    desde ARKit u otras convenciones, así que aquí no aparece ningún nombre de
    Ready Player Me.
    """
    activate(face)
    face.shape_key_add(name="Basis", from_mix=False)

    rx, ry, rz = p.head_rx, p.head_ry, p.head_rz
    eye_centres = [Vector((side * p.eye_x, -ry * 0.80, p.eye_z)) for side in (1.0, -1.0)]
    mouth_centre = Vector((0.0, -ry * 0.86, p.mouth_z))

    def eye_region(co, centre):
        # Escalado anisótropo: el ojo es más ancho que alto, y sin corregirlo el
        # parpadeo arrastraría media mejilla.
        delta = Vector(((co.x - centre.x) * 1.0, (co.y - centre.y) * 0.5, (co.z - centre.z) * 1.15))
        return falloff(delta.length, p.eye_r * 2.0)

    def mouth_region(co, radius_scale=1.0):
        delta = Vector(((co.x - mouth_centre.x) * 1.0, (co.y - mouth_centre.y) * 0.5, (co.z - mouth_centre.z) * 1.5))
        return falloff(delta.length, rx * 0.55 * radius_scale)

    def brow_region(co, side):
        centre = Vector((side * p.eye_x, -ry * 0.84, p.eye_z + p.eye_r * 1.5))
        delta = Vector(((co.x - centre.x) * 0.8, (co.y - centre.y) * 0.5, (co.z - centre.z) * 1.1))
        return falloff(delta.length, rx * 0.52)

    def make(name: str, displace) -> None:
        key = face.shape_key_add(name=name, from_mix=False)
        basis = face.data.shape_keys.key_blocks["Basis"]
        for index, point in enumerate(key.data):
            point.co = basis.data[index].co + displace(basis.data[index].co)

    def blink(target_side):
        def displace(co):
            centre = eye_centres[0] if target_side > 0 else eye_centres[1]
            weight = eye_region(co, centre)
            if weight <= 0.0:
                return Vector((0.0, 0.0, 0.0))
            # El párpado se cierra colapsando el ojo hacia su centro en Z: a
            # esta escala lee como un parpadeo limpio y no necesita geometría de
            # párpado independiente.
            return Vector((0.0, 0.0, (centre.z - co.z) * 0.92 * weight))
        return displace

    make("blinkLeft", blink(1.0))
    make("blinkRight", blink(-1.0))

    def smile(co):
        weight = mouth_region(co, 1.35)
        if weight <= 0.0:
            return Vector((0.0, 0.0, 0.0))
        # Las comisuras suben y se abren; el centro apenas se mueve.
        corner = min(1.0, abs(co.x) / (rx * 0.42))
        return Vector((math.copysign(rx * 0.030 * weight * corner, co.x or 1.0),
                       -ry * 0.012 * weight,
                       rz * 0.055 * weight * (0.35 + 0.65 * corner)))

    make("smile", smile)

    def mouth_open(co):
        weight = mouth_region(co, 1.5)
        below = smoothstep((p.mouth_z + rz * 0.10 - co.z) / (rz * 0.55))
        if weight <= 0.0 and below <= 0.0:
            return Vector((0.0, 0.0, 0.0))
        # Baja la mandíbula entera, no solo el labio: si no, la cara se rompe.
        return Vector((0.0, ry * 0.012 * weight, -rz * (0.075 * weight + 0.055 * below)))

    make("mouthOpen", mouth_open)

    def brow_up(co):
        weight = max(brow_region(co, 1.0), brow_region(co, -1.0))
        return Vector((0.0, 0.0, rz * 0.075 * weight)) if weight > 0.0 else Vector((0.0, 0.0, 0.0))

    make("browUp", brow_up)

    def surprised(co):
        vector = brow_up(co) * 1.15 + mouth_open(co) * 0.85
        for centre in eye_centres:
            weight = eye_region(co, centre)
            if weight > 0.0:
                # Ojos ligeramente más abiertos: escala radial pequeña.
                vector += Vector((0.0, 0.0, (co.z - centre.z) * 0.16 * weight))
        return vector

    make("surprised", surprised)

    def sad(co):
        vector = Vector((0.0, 0.0, 0.0))
        for side in (1.0, -1.0):
            weight = brow_region(co, side)
            if weight <= 0.0:
                continue
            # Ceja interna arriba y externa abajo: es lo que produce la lectura
            # de tristeza, no la boca.
            inner = smoothstep(1.0 - abs(co.x) / (p.eye_x * 1.6))
            vector += Vector((0.0, 0.0, rz * (0.045 * inner - 0.035 * (1.0 - inner)) * weight))
        weight = mouth_region(co, 1.3)
        if weight > 0.0:
            corner = min(1.0, abs(co.x) / (rx * 0.42))
            vector += Vector((0.0, 0.0, -rz * 0.040 * weight * corner))
        return vector

    make("sad", sad)

    missing = [name for name in REQUIRED_MORPHS if name not in face.data.shape_keys.key_blocks]
    if missing:
        raise RuntimeError(f"Faltan morph targets: {missing}")


# ── Cabello ──────────────────────────────────────────────────────────────────

def build_hair(style: str, p, materials):
    """Cabello por mechones geométricos grandes, fundidos en una pieza.

    Nada de hair cards con alpha: el README pide masas geométricas, y además el
    alpha ordenado por profundidad es un problema en móvil.
    """
    rx, ry, rz = p.head_rx, p.head_ry, p.head_rz
    centre_z = p.head_center_z
    parts = []

    # Casquete: elipsoide CERRADO desplazado hacia atrás y arriba respecto al
    # cráneo. Lo que queda dentro de la cabeza es invisible, y la intersección
    # con la piel dibuja sola la línea del pelo. No se recorta nada: recortar
    # caras por umbral deja un borde dentado que se ve desde cualquier ángulo.
    # El casquete cubre con holgura por arriba: el suavizado y el decimado
    # encogen la masa, y si queda justo el cráneo asoma por la coronilla como
    # manchas de piel entre el pelo. Por los lados se mantiene contenido para
    # que las orejas sigan asomando.
    parts.append(add_ellipsoid(
        (0.0, ry * 0.10, centre_z + rz * 0.13),
        (rx * 1.062, ry * 1.035, rz * 0.985), 44, 26))

    if style == "chunky-short":
        # Flequillo: mechones por delante de la frente.
        for index in range(7):
            t = index / 6.0
            x = (t - 0.5) * rx * 1.45
            parts.append(add_ellipsoid(
                (x, -ry * 0.60 - abs(t - 0.5) * ry * 0.10, centre_z + rz * 0.56 - abs(t - 0.5) * rz * 0.16),
                (rx * 0.26, ry * 0.30, rz * 0.24), 16, 10))
        # Mechones de coronilla: aportan un relieve suave a la silueta. Anchos y
        # bajos a propósito — si sobresalen se leen como moños, no como pelo.
        for index in range(5):
            t = index / 4.0
            parts.append(add_ellipsoid(
                ((t - 0.5) * rx * 1.00, ry * 0.15, centre_z + rz * 0.80),
                (rx * 0.34, ry * 0.40, rz * 0.16), 16, 10))
        # Nuca corta.
        for index in range(5):
            x = (index / 4.0 - 0.5) * rx * 1.10
            parts.append(add_ellipsoid((x, ry * 0.72, centre_z - rz * 0.20),
                                       (rx * 0.28, ry * 0.24, rz * 0.26), 16, 10))
    else:  # layered-bob
        # Melena por capas: masas laterales que caen a los lados del rostro.
        for index in range(9):
            t = index / 8.0
            angle = math.pi * (0.10 + 0.80 * t)
            x = math.cos(angle) * rx * 1.02
            y = math.sin(angle) * ry * 0.98 + ry * 0.06
            for level, (drop, scale) in enumerate(((0.30, 1.00), (0.78, 0.94), (1.20, 0.78))):
                parts.append(add_ellipsoid(
                    (x * (1.0 + level * 0.03), y * (1.0 + level * 0.03), centre_z + rz * 0.30 - rz * drop),
                    (rx * 0.23 * scale, ry * 0.23 * scale, rz * 0.32 * scale), 16, 10))
        # Flequillo lateral con raya desplazada.
        for index in range(6):
            t = index / 5.0
            parts.append(add_ellipsoid(
                (rx * (-0.58 + t * 1.16), -ry * 0.62, centre_z + rz * 0.54 - t * rz * 0.26),
                (rx * 0.27, ry * 0.30, rz * 0.24), 16, 10))

    hair = join_objects(parts, f"Hair_{style}")
    # Vóxel más grueso que el cuerpo: el cabello debe leerse como masas, no como
    # pelo fino, y así se mantiene barato.
    fuse(hair, voxel_size=0.0105, smooth_iterations=5, smooth_factor=0.5)
    decimate_to(hair, BUDGET_HAIR)
    clean_mesh(hair)
    hair.data.materials.clear()
    hair.data.materials.append(materials["hair"])
    bpy.ops.object.shade_smooth()
    return hair


def build_goatee(p, materials):
    parts = [
        add_ellipsoid((0.0, -p.head_ry * 0.72, p.mouth_z - p.head_rz * 0.22),
                      (p.head_rx * 0.26, p.head_ry * 0.16, p.head_rz * 0.16), 18, 10),
        add_ellipsoid((0.0, -p.head_ry * 0.80, p.mouth_z + p.head_rz * 0.11),
                      (p.head_rx * 0.20, p.head_ry * 0.10, p.head_rz * 0.05), 16, 8),
    ]
    goatee = join_objects(parts, "FacialHair_Goatee")
    fuse(goatee, voxel_size=0.006, smooth_iterations=4, smooth_factor=0.5)
    clean_mesh(goatee)
    goatee.data.materials.clear()
    goatee.data.materials.append(materials["hair"])
    bpy.ops.object.shade_smooth()
    return goatee


# ── Ropa derivada del cuerpo ─────────────────────────────────────────────────

def garment_volume(name: str, blobs, material, budget: int, voxel: float = 0.009):
    """Construye una prenda como volumen cerrado inflado sobre el cuerpo.

    Cada prenda es una masa cerrada, no una cáscara recortada. Es la decisión de
    diseño que más afecta al resultado visual: una cáscara necesita un borde, y
    cualquier borde generado por umbral sobre malla decimada sale dentado. Un
    volumen cerrado no tiene borde — el cuello, las muñecas y los tobillos
    emergen atravesando la superficie, que es exactamente el lenguaje de masas
    sólidas del dragón de referencia.

    Como el volumen se genera inflando el mismo perfil que el cuerpo, envuelve
    la piel por construcción y no puede haber clipping.
    """
    parts = [add_ellipsoid(location, radii, segments, rings)
             for location, radii, segments, rings in blobs]
    garment = join_objects(parts, name)
    # Suavizado más insistente que en el cuerpo: la unión de lonchas deja un
    # rizado horizontal muy visible sobre una superficie de color plano como es
    # una prenda, mientras que en la piel queda enmascarado por el sombreado.
    fuse(garment, voxel_size=voxel, smooth_iterations=10, smooth_factor=0.62)
    decimate_to(garment, budget)
    clean_mesh(garment)
    garment.data.materials.clear()
    garment.data.materials.append(material)
    activate(garment)
    bpy.ops.object.shade_smooth()
    return garment


def _sleeve(p, sign: float, end_z: float, radius_scale: float, pad: float):
    """Manga: cadena a lo largo del brazo hasta la altura pedida."""
    start = Vector((sign * p.shoulder_half * 0.58, 0.0, p.arm_root_z + 0.038))
    elbow = Vector((sign * p.elbow_x, 0.0, p.elbow_z))
    wrist = Vector((sign * p.wrist_x, 0.0, p.wrist_z))
    # La manga arranca más adentro y más gruesa que el deltoides del cuerpo. Es
    # el punto donde antes asomaba la piel: al levantar el brazo el hombro gira
    # bajo la tela y, si la manga solo iguala al deltoides, lo atraviesa.
    path = [(start, p.upper_arm_r * 1.88 * radius_scale + pad),
            (elbow, p.upper_arm_r * 0.90 * radius_scale + pad),
            (wrist, p.fore_arm_r * 0.74 * radius_scale + pad)]
    blobs = []
    for index in range(len(path) - 1):
        (p0, r0), (p1, r1) = path[index], path[index + 1]
        for step in range(13):
            t = step / 12.0
            position = p0.lerp(p1, t)
            if position.z < end_z:
                continue
            radius = r0 + (r1 - r0) * t
            blobs.append((tuple(position), (radius, radius, radius), 16, 10))
    return blobs


def _trouser_leg(p, sign: float, end_z: float, radius_scale: float, pad: float):
    """Pernera: cadena de cadera a la altura de corte."""
    path = [
        (Vector((sign * p.leg_x, 0.0, p.hip_z + 0.010)), p.thigh_r * 1.10 * radius_scale + pad),
        (Vector((sign * (p.leg_x + p.knee_x) * 0.5, 0.0, (p.hip_z + p.knee_z) * 0.5)),
         p.thigh_r * 0.98 * radius_scale + pad),
        (Vector((sign * p.knee_x, 0.0, p.knee_z)), p.calf_r * 1.12 * radius_scale + pad),
        (Vector((sign * p.ankle_x, 0.0, p.ankle_z + 0.045)), p.calf_r * 0.80 * radius_scale + pad),
    ]
    blobs = []
    for index in range(len(path) - 1):
        (p0, r0), (p1, r1) = path[index], path[index + 1]
        for step in range(15):
            t = step / 14.0
            position = p0.lerp(p1, t)
            if position.z < end_z:
                continue
            radius = r0 + (r1 - r0) * t
            blobs.append((tuple(position), (radius, radius, radius), 16, 10))
    return blobs


def _shoe(p, sign: float, collar_z: float, pad: float):
    """Calzado: pie envuelto más caña hasta `collar_z`."""
    blobs = [
        ((sign * p.ankle_x, p.foot_len * 0.34, p.foot_height * 0.80),
         (p.foot_width + pad, abs(p.foot_len) * 0.55 + pad, p.foot_height + pad * 0.7), 22, 12),
        ((sign * p.ankle_x, p.foot_len * 0.88, p.foot_height * 0.62),
         (p.foot_width * 0.88 + pad, abs(p.foot_len) * 0.27 + pad, p.foot_height * 0.72 + pad * 0.7), 20, 10),
    ]
    z = p.foot_height * 0.9
    while z <= collar_z:
        blobs.append(((sign * p.ankle_x, p.foot_len * 0.06, z),
                      (p.calf_r * 0.74 + pad, p.calf_r * 0.80 + pad, 0.030), 18, 10))
        z += 0.014
    return blobs


def build_wardrobe(p, materials):
    """Dos prendas superiores, dos inferiores y dos calzados por cuerpo."""

    def top(name, hem_z, collar_z, sleeve_end_z, pad, material):
        blobs = [(location, radii, 26, 12)
                 for location, radii in torso_slices(p, hem_z, collar_z, inflate=1.0, pad=pad)]
        for sign in (1.0, -1.0):
            blobs += _sleeve(p, sign, sleeve_end_z, radius_scale=1.0, pad=pad)
        return garment_volume(name, blobs, material, BUDGET_TOP)

    def bottom(name, waist_z, hem_z, pad, material):
        blobs = [(location, radii, 26, 12)
                 for location, radii in torso_slices(p, p.hip_z - 0.050, waist_z, inflate=1.0, pad=pad)]
        for sign in (1.0, -1.0):
            blobs += _trouser_leg(p, sign, hem_z, radius_scale=1.0, pad=pad)
        return garment_volume(name, blobs, material, BUDGET_BOTTOM)

    def shoes(name, collar_z, pad, material):
        blobs = []
        for sign in (1.0, -1.0):
            blobs += _shoe(p, sign, collar_z, pad)
        return garment_volume(name, blobs, material, BUDGET_SHOES, voxel=0.0065)

    return {
        # Sudadera holgada de manga hasta el codo. El `pad` es generoso a
        # propósito: al animar o posar, el hombro gira bajo la tela y con
        # márgenes justos el deltoides asoma como un punto de piel.
        "top_a": top("Top_A", p.hip_z + 0.075, p.shoulder_z + 0.028,
                     p.elbow_z - 0.010, pad=0.022, material=materials["top_a"]),
        # Polo ceñido de manga corta.
        "top_b": top("Top_B", p.hip_z + 0.120, p.shoulder_z + 0.020,
                     p.arm_root_z - 0.085, pad=0.017, material=materials["top_b"]),
        # Pantalón largo hasta el tobillo.
        "bottom_a": bottom("Bottom_A", p.hip_z + 0.115, p.ankle_z + 0.050,
                           pad=0.017, material=materials["bottom_a"]),
        # Bermuda por encima de la rodilla.
        "bottom_b": bottom("Bottom_B", p.hip_z + 0.100, p.knee_z + 0.060,
                           pad=0.014, material=materials["bottom_b"]),
        "shoes_a": shoes("Shoes_A", collar_z=0.135, pad=0.020, material=materials["shoe_a"]),
        "shoes_b": shoes("Shoes_B", collar_z=0.095, pad=0.023, material=materials["shoe_b"]),
    }


# ── Animación ────────────────────────────────────────────────────────────────

def build_animations(armature) -> None:
    """Cuatro clips en pistas NLA, que es como el exportador glTF los separa.

    El personaje no se mueve del origen en ningún clip: el editor encuadra al
    avatar con una cámara fija y cualquier root motion lo sacaría de plano.
    """
    activate(armature)
    bpy.ops.object.mode_set(mode="POSE")
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 96

    armature.animation_data_create()

    def rest_pose():
        for bone in armature.pose.bones:
            bone.rotation_mode = "XYZ"
            bone.rotation_euler = (0.0, 0.0, 0.0)
            bone.location = (0.0, 0.0, 0.0)

    def make_action(name: str, keyframes):
        action = bpy.data.actions.new(name)
        armature.animation_data.action = action
        touched = sorted({bone for _, pose in keyframes for bone in pose})
        for frame, pose in keyframes:
            scene.frame_set(frame)
            rest_pose()
            for bone_name, rotation in pose.items():
                pose_bone = armature.pose.bones.get(bone_name)
                if pose_bone:
                    pose_bone.rotation_euler = rotation
            # Se keyframean todos los huesos implicados en cada pose clave,
            # incluidos los que vuelven a reposo: si no, el clip hereda la pose
            # del clip anterior y las animaciones se contaminan entre sí.
            for bone_name in touched:
                pose_bone = armature.pose.bones.get(bone_name)
                if pose_bone:
                    pose_bone.keyframe_insert(data_path="rotation_euler", frame=frame)
        track = armature.animation_data.nla_tracks.new()
        track.name = name
        track.strips.new(name, 1, action)
        armature.animation_data.action = None
        return action

    r = math.radians

    # Idle: balanceo mínimo con desplazamiento de peso. Casi imperceptible a
    # propósito; un idle marcado cansa en un editor donde se pasa tiempo.
    make_action("Idle", [
        (1,  {"Spine": (r(1.2), 0, 0), "Spine1": (0, 0, r(0.8)), "Head": (0, 0, r(-0.6))}),
        (32, {"Spine": (r(2.0), 0, r(0.7)), "Spine1": (0, r(1.4), r(-0.5)), "Head": (r(-1.0), r(-1.6), 0)}),
        (64, {"Spine": (r(1.4), 0, r(-0.7)), "Spine1": (0, r(-1.4), r(0.9)), "Head": (r(0.8), r(1.6), 0)}),
        (96, {"Spine": (r(1.2), 0, 0), "Spine1": (0, 0, r(0.8)), "Head": (0, 0, r(-0.6))}),
    ])

    # Breathing: expansión del pecho y acompañamiento de hombros.
    make_action("Breathing", [
        (1,  {"Spine": (r(1.0), 0, 0), "Spine1": (r(0.4), 0, 0), "LeftShoulder": (0, 0, 0), "RightShoulder": (0, 0, 0)}),
        (36, {"Spine": (r(3.4), 0, 0), "Spine1": (r(2.2), 0, 0), "LeftShoulder": (0, 0, r(-2.4)), "RightShoulder": (0, 0, r(2.4))}),
        (96, {"Spine": (r(1.0), 0, 0), "Spine1": (r(0.4), 0, 0), "LeftShoulder": (0, 0, 0), "RightShoulder": (0, 0, 0)}),
    ])

    # Wave: el brazo derecho sube y el antebrazo oscila.
    #
    # El signo se midió sobre el propio rig, no se dedujo: en la pose A el hueso
    # RightArm apunta hacia abajo y hacia -X, y rotarlo en Z POSITIVO es lo que
    # levanta la mano (z 0.65 → 1.21). El signo contrario la mete a través del
    # torso. Los lados son especulares: LEFT_RAISE = -Z, RIGHT_RAISE = +Z.
    make_action("Wave", [
        (1,  {"RightArm": (0, 0, 0),      "RightForeArm": (0, 0, 0),      "RightHand": (0, 0, 0),      "Spine1": (0, 0, 0)}),
        (18, {"RightArm": (0, 0, r(72)),  "RightForeArm": (0, 0, r(30)),  "RightHand": (0, 0, r(10)),  "Spine1": (0, 0, r(2))}),
        (36, {"RightArm": (0, 0, r(78)),  "RightForeArm": (0, 0, r(8)),   "RightHand": (0, 0, r(-12)), "Spine1": (0, 0, r(3))}),
        (54, {"RightArm": (0, 0, r(78)),  "RightForeArm": (0, 0, r(38)),  "RightHand": (0, 0, r(14)),  "Spine1": (0, 0, r(3))}),
        (72, {"RightArm": (0, 0, r(74)),  "RightForeArm": (0, 0, r(12)),  "RightHand": (0, 0, r(-10)), "Spine1": (0, 0, r(2))}),
        (96, {"RightArm": (0, 0, 0),      "RightForeArm": (0, 0, 0),      "RightHand": (0, 0, 0),      "Spine1": (0, 0, 0)}),
    ])

    # Presentation: apertura de brazos y ligera inclinación de presentación.
    make_action("Presentation", [
        (1,  {"LeftArm": (0, 0, 0), "RightArm": (0, 0, 0), "Spine1": (0, 0, 0), "Head": (0, 0, 0)}),
        (40, {"LeftArm": (0, r(14), r(-24)), "RightArm": (0, r(-14), r(24)),
              "Spine1": (r(-3), 0, 0), "Head": (r(-4), 0, 0)}),
        (64, {"LeftArm": (0, r(14), r(-22)), "RightArm": (0, r(-14), r(22)),
              "Spine1": (r(-2), 0, 0), "Head": (r(-2), 0, 0)}),
        (96, {"LeftArm": (0, 0, 0), "RightArm": (0, 0, 0), "Spine1": (0, 0, 0), "Head": (0, 0, 0)}),
    ])

    rest_pose()
    scene.frame_set(1)
    bpy.ops.object.mode_set(mode="OBJECT")

    missing = [name for name in REQUIRED_ANIMATIONS if name not in bpy.data.actions]
    if missing:
        raise RuntimeError(f"Faltan animaciones: {missing}")


# ── Ensamblado ───────────────────────────────────────────────────────────────

def assemble(variant: str, skin_tone: str, hair_tone: str):
    p = PROPORTIONS[variant]
    materials = build_material_library(skin_tone=skin_tone, hair_tone=hair_tone)

    armature = build_skeleton(p)

    body = build_body(p)
    body.data.materials.clear()
    body.data.materials.append(materials["skin"])

    head = build_head(p, materials)
    eyes = build_eyes(p, materials)
    brows = build_brows(p, materials)
    mouth = build_mouth(p, materials)
    # Ojos, cejas y boca se funden en la malla facial para que los morph targets
    # puedan cerrar el párpado, mover la ceja y abrir la boca en el mismo
    # blendshape, sin sincronizar varias mallas en el cliente.
    face = join_objects([head] + eyes + brows + [mouth], "Head_Face")
    # Se limpia ANTES de crear las shape keys: soldar vértices después cambiaría
    # el recuento y dejaría los morph targets desalineados.
    clean_mesh(face)
    unwrap(face)
    add_face_morphs(face, p)

    unwrap(body)

    wardrobe = build_wardrobe(p, materials)
    for piece in wardrobe.values():
        unwrap(piece)

    # Cuerpo y prendas comparten el pesado automático por calor. Las prendas son
    # volúmenes cerrados que envuelven al cuerpo, así que el reparto por hueso
    # les sale prácticamente igual y se deforman de forma solidaria con la piel.
    bind_with_automatic_weights([body] + list(wardrobe.values()), armature)
    rescued = fallback_weight_unassigned(body, armature, "Hips")
    for piece in wardrobe.values():
        rescued += fallback_weight_unassigned(piece, armature, "Hips")

    # El rostro va rígido al hueso Head: es lo correcto para una cabeza
    # estilizada y evita que el pesado por calor reparta la nariz entre Neck y
    # Head, que produce artefactos al girar la cabeza.
    activate(face)
    head_group = face.vertex_groups.new(name="Head")
    head_group.add(range(len(face.data.vertices)), 1.0, "REPLACE")
    face.modifiers.new("PCCL_Skeleton", "ARMATURE").object = armature
    face.parent = armature

    hair_pieces = {
        "chunky-short": build_hair("chunky-short", p, materials),
        "layered-bob": build_hair("layered-bob", p, materials),
    }
    accessories = {}
    if variant == "masculine":
        accessories["facial-hair-goatee"] = build_goatee(p, materials)

    for piece in list(hair_pieces.values()) + list(accessories.values()):
        activate(piece)
        unwrap(piece)
        group = piece.vertex_groups.new(name="Head")
        group.add(range(len(piece.data.vertices)), 1.0, "REPLACE")
        piece.modifiers.new("PCCL_Skeleton", "ARMATURE").object = armature
        piece.parent = armature

    build_animations(armature)

    # Nombres de datablock estables y únicos. El validador los exige (§8) y sin
    # esto el GLB se llena de "Sphere.227", que hace ilegible cualquier
    # inspección posterior.
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.data.name = f"{obj.name}_Mesh"

    return {
        "armature": armature,
        "body": body,
        "face": face,
        "wardrobe": wardrobe,
        "hair": hair_pieces,
        "accessories": accessories,
        "rescued_vertices": rescued,
    }


# ── Exportación ──────────────────────────────────────────────────────────────

def export_selection(objects, filepath: str, with_animation: bool) -> None:
    """Exporta exactamente los objetos indicados, sin cámaras ni luces."""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
        obj.hide_set(False)
        obj.hide_viewport = False
    bpy.context.view_layer.objects.active = objects[0]

    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_skins=True,
        export_morph=with_animation,
        export_morph_normal=False,
        export_animations=with_animation,
        export_nla_strips=with_animation,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_extras=False,
    )


def render_thumbnail(objects, filepath: str, resolution: int = 320) -> None:
    """Miniatura PNG renderizada en el pipeline, no en el navegador.

    El README es explícito: no se descarga un GLB en runtime solo para pintar un
    chip del catálogo.
    """
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene

    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.hide_render = obj not in objects

    camera_data = bpy.data.cameras.new("PCCL_ThumbCam")
    camera_data.lens_unit = "FOV"
    camera_data.angle = math.radians(32.0)
    camera = bpy.data.objects.new("PCCL_ThumbCam", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (1.55, -3.05, 1.55)
    camera.rotation_euler = (math.radians(80.0), 0.0, math.radians(27.0))
    scene.camera = camera

    lights = []
    for name, location, energy, color in (
        ("Key",  (2.4, -2.6, 3.2), 900.0, (1.0, 0.95, 0.88)),
        ("Fill", (-2.8, -1.4, 1.6), 320.0, (0.86, 0.92, 1.0)),
        ("Rim",  (0.0, 3.2, 2.2),   520.0, (1.0, 1.0, 1.0)),
    ):
        light_data = bpy.data.lights.new(f"PCCL_{name}", type="AREA")
        light_data.energy = energy
        light_data.size = 3.0
        light_data.color = color
        light = bpy.data.objects.new(f"PCCL_{name}", light_data)
        light.location = location
        scene.collection.objects.link(light)
        lights.append(light)

    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = resolution
    scene.render.resolution_y = resolution
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "AgX"
    scene.render.filepath = filepath
    bpy.ops.render.render(write_still=True)

    bpy.data.objects.remove(camera, do_unlink=True)
    for light in lights:
        bpy.data.objects.remove(light, do_unlink=True)
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.hide_render = False


def render_turnaround(objects, directory: str, body_id: str, resolution: int = 480) -> list[str]:
    """Frontal, perfil, tres cuartos y posterior — la revisión que pide §F."""
    Path(directory).mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.hide_render = obj not in objects

    camera_data = bpy.data.cameras.new("PCCL_QACam")
    camera_data.lens_unit = "FOV"
    camera_data.angle = math.radians(30.0)
    camera = bpy.data.objects.new("PCCL_QACam", camera_data)
    scene.collection.objects.link(camera)
    scene.camera = camera

    lights = []
    for name, location, energy in (("Key", (2.6, -2.8, 3.0), 900.0),
                                   ("Fill", (-3.0, -1.6, 1.8), 340.0),
                                   ("Rim", (0.0, 3.4, 2.4), 560.0)):
        light_data = bpy.data.lights.new(f"QA_{name}", type="AREA")
        light_data.energy = energy
        light_data.size = 3.2
        light = bpy.data.objects.new(f"QA_{name}", light_data)
        light.location = location
        scene.collection.objects.link(light)
        lights.append(light)

    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = resolution
    scene.render.resolution_y = int(resolution * 1.4)
    scene.render.film_transparent = False
    scene.world = bpy.data.worlds.new("QA_World") if not bpy.data.worlds else bpy.data.worlds[0]
    scene.world.use_nodes = True
    scene.world.node_tree.nodes["Background"].inputs[0].default_value = (0.05, 0.06, 0.10, 1.0)
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "AgX"

    written = []
    distance = 3.4
    for label, angle in (("front", 0.0), ("three-quarter", 35.0), ("side", 90.0), ("back", 180.0)):
        radians = math.radians(angle)
        camera.location = (math.sin(radians) * distance, -math.cos(radians) * distance, 1.15)
        camera.rotation_euler = (math.radians(86.0), 0.0, radians)
        path = str(Path(directory) / f"{body_id}-{label}.png")
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        written.append(path)

    bpy.data.objects.remove(camera, do_unlink=True)
    for light in lights:
        bpy.data.objects.remove(light, do_unlink=True)
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.hide_render = False
    return written


# ── CLI ──────────────────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(description="Construye un avatar humano PCCL.")
    parser.add_argument("--variant", choices=sorted(PROPORTIONS), required=True)
    parser.add_argument("--body-id", required=True)
    parser.add_argument("--blend", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--skin-tone", default="sand")
    parser.add_argument("--hair-tone", default="chestnut")
    parser.add_argument("--qa-dir", default="")
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return parser.parse_args(argv)


def main() -> None:
    args = parse_args()
    clean_scene()

    built = assemble(args.variant, args.skin_tone, args.hair_tone)
    armature = built["armature"]
    body, face = built["body"], built["face"]
    wardrobe, hair, accessories = built["wardrobe"], built["hair"], built["accessories"]

    # Rutas absolutas: Blender resuelve las relativas contra la ubicación del
    # .blend, no contra el directorio de trabajo, y los renders acababan en una
    # carpeta inventada en la raíz del disco.
    out = Path(args.out_dir).resolve()
    Path(args.blend).parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(Path(args.blend).resolve()))

    # El GLB base lleva puesto el conjunto por defecto para que el avatar se vea
    # terminado en la primera carga. Las alternativas viajan aparte y se
    # descargan solo si el usuario las elige.
    default_look = [armature, body, face, wardrobe["top_a"], wardrobe["bottom_a"],
                    wardrobe["shoes_a"], hair["chunky-short"]]
    body_glb = out / "bodies" / f"{args.body_id}.glb"
    export_selection(default_look, str(body_glb), with_animation=True)

    modular = {}
    for key, obj, folder, piece_id in (
        ("hair", hair["layered-bob"], "hair", "layered-bob"),
        ("top", wardrobe["top_b"], "clothing", "top-b"),
        ("bottom", wardrobe["bottom_b"], "clothing", "bottom-b"),
        ("shoes", wardrobe["shoes_b"], "clothing", "shoes-b"),
    ):
        path = out / folder / f"{args.body_id}__{piece_id}.glb"
        export_selection([armature, obj], str(path), with_animation=False)
        modular[piece_id] = {
            "url": f"/avatars/custom/{folder}/{path.name}",
            "triangles": triangle_count(obj),
            "bytes": path.stat().st_size,
        }

    for piece_id, obj in accessories.items():
        path = out / "accessories" / f"{args.body_id}__{piece_id}.glb"
        export_selection([armature, obj], str(path), with_animation=False)
        modular[piece_id] = {
            "url": f"/avatars/custom/accessories/{path.name}",
            "triangles": triangle_count(obj),
            "bytes": path.stat().st_size,
        }

    render_thumbnail(default_look, str(out / "thumbnails" / f"{args.body_id}.png"))
    qa_images = (render_turnaround(default_look, str(Path(args.qa_dir).resolve()), args.body_id)
                 if args.qa_dir else [])

    visible = [body, face, wardrobe["top_a"], wardrobe["bottom_a"], wardrobe["shoes_a"], hair["chunky-short"]]
    report = {
        "variant": args.variant,
        "bodyId": args.body_id,
        "rigId": RIG_ID,
        "blend": str(Path(args.blend).resolve()),
        "glb": f"/avatars/custom/bodies/{body_glb.name}",
        "bytes": body_glb.stat().st_size,
        "trianglesVisible": sum(triangle_count(obj) for obj in visible),
        "trianglesByObject": {obj.name: triangle_count(obj) for obj in visible},
        "bones": sorted(bone.name for bone in armature.data.bones),
        "morphTargets": sorted(
            key.name for key in face.data.shape_keys.key_blocks if key.name != "Basis"),
        "animations": sorted(action.name for action in bpy.data.actions),
        "modular": modular,
        "thumbnail": f"/avatars/custom/thumbnails/{args.body_id}.png",
        "qaImages": qa_images,
        "rescuedVertices": built["rescued_vertices"],
    }
    Path(args.report).parent.mkdir(parents=True, exist_ok=True)
    Path(args.report).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "qaImages"}, indent=2))


if __name__ == "__main__":
    main()
