"""Biblioteca de materiales PCCL.

Dirección artística tomada del dragón de referencia: colores sólidos y
saturados, acabado vinilo semibrillante (capa `Coat` baja pero presente) y
ausencia total de texturas fotográficas.

Los valores de Metallic/Roughness/Coat siguen la tabla del README
(§5.4). El color se declara en sRGB porque es como se elige a ojo, y se
convierte a lineal antes de escribirlo en el nodo: Blender espera lineal en
`Base Color`, y saltarse la conversión es la causa habitual de que un
personaje se vea lavado en el navegador.

Ejecutable de forma independiente para inspeccionar la paleta:

    blender --background --python tools/blender/create_materials.py
"""

from __future__ import annotations

import bpy


# ── Paleta extraída de la referencia del dragón ──────────────────────────────
# Muestreada sobre la imagen proporcionada por el equipo. Se conserva aquí
# porque es la única forma de que los humanos compartan universo visual con el
# dragón sin copiar su geometría.
DRAGON_REFERENCE = {
    "body_orange": "#E08A2E",
    "belly_cream": "#F5C87A",
    "spike_green": "#57C43A",
    "eye_ink": "#0A0A0F",
    "backdrop": "#131A2B",
}


def srgb_to_linear(component: float) -> float:
    """Convierte un canal sRGB [0,1] a lineal."""
    if component <= 0.04045:
        return component / 12.92
    return ((component + 0.055) / 1.055) ** 2.4


def hex_to_linear_rgba(value: str, alpha: float = 1.0) -> tuple[float, float, float, float]:
    """`#RRGGBB` → tupla RGBA lineal lista para `Base Color`."""
    value = value.lstrip("#")
    srgb = [int(value[i : i + 2], 16) / 255.0 for i in (0, 2, 4)]
    r, g, b = (srgb_to_linear(c) for c in srgb)
    return (r, g, b, alpha)


def make_material(
    name: str,
    hex_color: str,
    roughness: float,
    coat: float = 0.0,
    metallic: float = 0.0,
    specular: float = 0.5,
) -> bpy.types.Material:
    """Crea (o reutiliza) un material Principled BSDF con acabado vinilo."""
    existing = bpy.data.materials.get(name)
    if existing:
        return existing

    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")

    bsdf.inputs["Base Color"].default_value = hex_to_linear_rgba(hex_color)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    # `Coat Weight` es lo que da el brillo de vinilo del dragón. Se comprueba su
    # presencia porque el nombre del socket cambió entre versiones de Blender.
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = coat
        bsdf.inputs["Coat Roughness"].default_value = 0.18
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular

    # El viewport sólido y el exportador glTF leen estos campos, no el nodo.
    material.diffuse_color = hex_to_linear_rgba(hex_color)
    material.roughness = roughness
    material.metallic = metallic
    return material


# ── Tonos de piel ────────────────────────────────────────────────────────────
# Cálidos y saturados para convivir con el naranja del dragón. No son tonos
# fotográficos a propósito: el lenguaje es de juguete de vinilo.
SKIN_TONES = {
    "porcelain": "#F2C6A0",
    "sand": "#E0A578",
    "amber": "#C8814E",
    "umber": "#8E5632",
    "espresso": "#5E3620",
}

HAIR_TONES = {
    "ink": "#1B1614",
    "chestnut": "#4A2A18",
    "auburn": "#8A3E1C",
    "sand": "#C9974A",
    "ash": "#6E6A66",
}


def build_material_library(skin_tone: str = "sand", hair_tone: str = "chestnut") -> dict[str, bpy.types.Material]:
    """Conjunto completo de materiales que consume `build_avatar.py`."""
    return {
        # Piel: rugosidad media-alta y coat mínimo. Subir el coat aquí es lo que
        # produce el aspecto de "piel mojada" que el README prohíbe.
        "skin": make_material("PCCL_Skin", SKIN_TONES[skin_tone], roughness=0.48, coat=0.06),
        "hair": make_material("PCCL_Hair", HAIR_TONES[hair_tone], roughness=0.38, coat=0.09),
        "eye_white": make_material("PCCL_EyeWhite", "#F7F3EC", roughness=0.22, coat=0.30),
        "eye_iris": make_material("PCCL_EyeIris", "#3A6B52", roughness=0.20, coat=0.35),
        "eye_pupil": make_material("PCCL_EyePupil", DRAGON_REFERENCE["eye_ink"], roughness=0.18, coat=0.35),
        "mouth": make_material("PCCL_Mouth", "#8C4038", roughness=0.45, coat=0.05),
        # Ropa: algodón mate arriba, vinilo brillante en calzado y detalles, tal
        # y como se comporta la superficie del dragón.
        "top_a": make_material("PCCL_TopA", "#2F6E8F", roughness=0.68),
        "top_b": make_material("PCCL_TopB", DRAGON_REFERENCE["spike_green"], roughness=0.66),
        "bottom_a": make_material("PCCL_BottomA", "#2B3242", roughness=0.72),
        "bottom_b": make_material("PCCL_BottomB", "#6B5330", roughness=0.70),
        "shoe_a": make_material("PCCL_ShoeA", "#F0EDE6", roughness=0.34, coat=0.14),
        "shoe_b": make_material("PCCL_ShoeB", DRAGON_REFERENCE["body_orange"], roughness=0.32, coat=0.16),
        "accent": make_material("PCCL_Accent", DRAGON_REFERENCE["body_orange"], roughness=0.30, coat=0.16),
        "metal": make_material("PCCL_Metal", "#C9CDD4", roughness=0.28, metallic=0.9),
    }


if __name__ == "__main__":
    library = build_material_library()
    for key, material in sorted(library.items()):
        bsdf = material.node_tree.nodes.get("Principled BSDF")
        color = tuple(round(c, 4) for c in bsdf.inputs["Base Color"].default_value[:3])
        print(f"{key:12s} {material.name:16s} linear={color} rough={bsdf.inputs['Roughness'].default_value:.2f}")
