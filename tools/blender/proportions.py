"""Proporciones canónicas de los humanos PCCL.

Un único sitio donde vive el canon. El rig, la malla, la ropa y el cabello leen
de aquí, así que mover un valor mueve todo a la vez y las prendas siguen
encajando.

Convenciones de eje (Blender): Z arriba, el personaje mira hacia -Y. El
exportador glTF convierte a Y arriba / +Z al frente, que es lo que espera la
cámara de `AvatarStage`.

Canon estilizado: la cabeza ocupa ~30 % de la altura total (README §5.1). No es
una proporción realista a propósito — es la que comparte universo con el dragón
de referencia.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Proportions:
    """Todas las medidas en metros."""

    name: str

    # ── Columna ──
    total_height: float
    hip_z: float
    chest_z: float
    shoulder_z: float
    neck_top_z: float
    head_top_z: float

    # ── Cabeza ──
    head_center_z: float
    head_rx: float          # mitad del ancho
    head_ry: float          # mitad de la profundidad
    head_rz: float          # mitad de la altura del cráneo
    jaw_taper: float        # 0 = sin afinar, 1 = mandíbula muy estrecha

    # ── Torso ──
    shoulder_half: float
    chest_half: float
    waist_half: float
    hip_half: float
    torso_depth: float

    # ── Brazos (pose A) ──
    arm_root_z: float
    elbow_x: float
    elbow_z: float
    wrist_x: float
    wrist_z: float
    hand_x: float
    hand_z: float
    upper_arm_r: float
    fore_arm_r: float
    hand_r: float

    # ── Piernas ──
    leg_x: float
    knee_x: float
    knee_z: float
    ankle_x: float
    ankle_z: float
    thigh_r: float
    calf_r: float
    foot_len: float         # negativo = hacia adelante (-Y)
    foot_width: float
    foot_height: float

    # ── Rostro ──
    eye_z: float
    eye_x: float
    eye_r: float
    nose_z: float
    mouth_z: float
    ear_z: float


def _variant(name: str, *, shoulder_half: float, chest_half: float, waist_half: float,
             hip_half: float, torso_depth: float, head_rx: float, head_ry: float,
             head_rz: float, jaw_taper: float, upper_arm_r: float, fore_arm_r: float,
             thigh_r: float, calf_r: float, eye_r: float) -> Proportions:
    """Construye una variante sobre el esqueleto común.

    Lo que cambia entre variantes es el volumen, nunca la altura de las
    articulaciones: así una prenda o un peinado sirve para los tres cuerpos y el
    catálogo no se multiplica por género.
    """
    return Proportions(
        name=name,
        total_height=1.70,
        hip_z=0.710,
        chest_z=0.960,
        shoulder_z=1.100,
        neck_top_z=1.175,
        head_top_z=1.70,
        # Cabeza centrada en 1.415 con semialtura ~0.244: barbilla en 1.171 y
        # coronilla en 1.659, que con el cabello llega a 1.70. Da un 31 % de la
        # altura total, dentro del 28–33 % que pide el README.
        head_center_z=1.415,
        head_rx=head_rx,
        head_ry=head_ry,
        head_rz=head_rz,
        jaw_taper=jaw_taper,
        shoulder_half=shoulder_half,
        chest_half=chest_half,
        waist_half=waist_half,
        hip_half=hip_half,
        torso_depth=torso_depth,
        arm_root_z=1.045,
        elbow_x=0.300,
        elbow_z=0.860,
        wrist_x=0.452,
        wrist_z=0.706,
        hand_x=0.505,
        hand_z=0.652,
        upper_arm_r=upper_arm_r,
        fore_arm_r=fore_arm_r,
        hand_r=0.052,
        leg_x=0.082,
        knee_x=0.088,
        knee_z=0.365,
        ankle_x=0.093,
        ankle_z=0.072,
        thigh_r=thigh_r,
        calf_r=calf_r,
        foot_len=-0.165,
        foot_width=0.075,
        foot_height=0.055,
        eye_z=1.396,
        eye_x=0.082,
        eye_r=eye_r,
        nose_z=1.332,
        mouth_z=1.270,
        ear_z=1.396,
    )


PROPORTIONS: dict[str, Proportions] = {
    # Hombros algo más estrechos, cadera más marcada, mandíbula más suave.
    "feminine": _variant(
        "feminine",
        shoulder_half=0.148, chest_half=0.126, waist_half=0.104, hip_half=0.144,
        torso_depth=0.120, head_rx=0.190, head_ry=0.194, head_rz=0.232,
        jaw_taper=0.50, upper_arm_r=0.053, fore_arm_r=0.046,
        thigh_r=0.089, calf_r=0.066, eye_r=0.058,
    ),
    # Hombros más anchos y musculatura discreta; misma calidad y materiales.
    "masculine": _variant(
        "masculine",
        shoulder_half=0.185, chest_half=0.166, waist_half=0.140, hip_half=0.138,
        torso_depth=0.132, head_rx=0.198, head_ry=0.202, head_rz=0.240,
        jaw_taper=0.30, upper_arm_r=0.063, fore_arm_r=0.054,
        thigh_r=0.095, calf_r=0.071, eye_r=0.055,
    ),
    # Base intermedia: no restringe ropa por género.
    "androgynous": _variant(
        "androgynous",
        shoulder_half=0.164, chest_half=0.146, waist_half=0.120, hip_half=0.142,
        torso_depth=0.125, head_rx=0.194, head_ry=0.198, head_rz=0.236,
        jaw_taper=0.40, upper_arm_r=0.058, fore_arm_r=0.050,
        thigh_r=0.091, calf_r=0.068, eye_r=0.057,
    ),
}

# Alias por identificador de cuerpo del catálogo.
VARIANT_BY_BODY_ID = {
    "female-base": "feminine",
    "male-base": "masculine",
    "neutral-base": "androgynous",
}
