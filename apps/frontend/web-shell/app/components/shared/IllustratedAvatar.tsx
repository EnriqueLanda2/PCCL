/* ───────────────────────────────────────────
   IllustratedAvatar — personita plana de cuerpo
   completo, estilo cyberpunk (visor neón, cresta,
   traje oscuro con acento de color). Sin
   dependencias externas. Color de acento y tono
   de piel determinísticos por userId (mismo
   alumno → mismo avatar siempre).
   ─────────────────────────────────────────── */

const NEON_COLORS = ['#00F0FF', '#FF2E9A', '#B026FF', '#39FF14', '#FFD500', '#2D9CFF'];
const SKIN_TONES = ['#E3B48A', '#C48A5E', '#8D5A3B', '#4A2F22'];
const SUIT_DARK = '#12121A';

function hashString(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

interface IllustratedAvatarProps {
  userId: string;
  size?: number;
  glow?: boolean;
}

export function IllustratedAvatar({ userId, size = 88, glow = true }: IllustratedAvatarProps) {
  const hash = hashString(userId);
  const neon = NEON_COLORS[hash % NEON_COLORS.length];
  const skin = SKIN_TONES[Math.floor(hash / NEON_COLORS.length) % SKIN_TONES.length];
  const filterId = `neon-glow-${userId.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 96 120"
      aria-hidden
      focusable="false"
      style={glow ? { filter: `drop-shadow(0 0 6px ${neon}aa) drop-shadow(0 0 14px ${neon}55)` } : undefined}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`${filterId}-aura`} cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor={neon} stopOpacity="0.28" />
          <stop offset="100%" stopColor={neon} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* aura de fondo */}
      <circle cx="48" cy="42" r="46" fill={`url(#${filterId}-aura)`} />

      {/* piernas */}
      <rect x="34" y="86" width="12" height="30" rx="4" fill={SUIT_DARK} />
      <rect x="50" y="86" width="12" height="30" rx="4" fill={SUIT_DARK} />
      <rect x="34" y="108" width="12" height="4" rx="1.5" fill={neon} opacity="0.85" />
      <rect x="50" y="108" width="12" height="4" rx="1.5" fill={neon} opacity="0.85" />

      {/* brazos */}
      <rect x="14" y="52" width="14" height="34" rx="7" fill={SUIT_DARK} />
      <rect x="68" y="52" width="14" height="34" rx="7" fill={SUIT_DARK} />
      {/* manos */}
      <circle cx="21" cy="88" r="7" fill={skin} />
      <circle cx="75" cy="88" r="7" fill={skin} />

      {/* torso */}
      <rect x="26" y="46" width="44" height="46" rx="16" fill={SUIT_DARK} />
      {/* acento/circuito en el pecho */}
      <path d="M48 52v10m-6 6h12m-12 0-4 6m16-6 4 6" stroke={neon} strokeWidth="2" fill="none" strokeLinecap="round" filter={`url(#${filterId})`} />
      <circle cx="48" cy="52" r="3" fill={neon} filter={`url(#${filterId})`} />

      {/* cuello */}
      <rect x="42" y="34" width="12" height="14" fill={skin} />
      {/* cabeza */}
      <circle cx="48" cy="24" r="20" fill={skin} />

      {/* cresta / cabello */}
      <path d="M48 2c-3 0-5 6-5 10 3-2 4-2 5-2s2 0 5 2c0-4-2-10-5-10Z" fill={neon} filter={`url(#${filterId})`} />
      <path d="M30 16a18 18 0 0 1 36 0c-4-4-10-6-18-6s-14 2-18 6Z" fill="#1B1B24" />

      {/* visor neón en vez de ojos */}
      <rect x="36" y="21" width="24" height="6" rx="3" fill={neon} filter={`url(#${filterId})`} />
      <rect x="36" y="21" width="24" height="6" rx="3" fill="#fff" opacity="0.25" />

      {/* boca simple */}
      <path d="M41 33c3 2.5 11 2.5 14 0" stroke="#1B1B24" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
