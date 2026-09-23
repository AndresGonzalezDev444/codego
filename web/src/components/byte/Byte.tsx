import { motion, AnimatePresence } from 'framer-motion';
import type { ByteMood, ByteSize } from '@/types';

// ============================================
// BYTE — Mascota oficial de CodeGo!
// Robot felino pequeño, blanco con detalles cyan y violeta
// ============================================

interface ByteProps {
  mood?: ByteMood;
  size?: ByteSize;
  message?: string | null;
  showMessage?: boolean;
  className?: string;
  animate?: boolean;
}

const SIZES: Record<ByteSize, number> = {
  xs: 48,
  sm: 72,
  md: 100,
  lg: 140,
  xl: 200,
};

export function Byte({
  mood = 'idle',
  size = 'md',
  message,
  showMessage = false,
  className = '',
  animate = true,
}: ByteProps) {
  const px = SIZES[size];

  const containerVariants = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      y: [0, -8, 0, -6, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -14, 0, -10, 0],
      rotate: [0, -5, 5, -3, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
    sad: {
      y: [0, -1, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
    sleeping: {
      y: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [0, -2, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    excited: {
      y: [0, -10, 0, -8, 0],
      rotate: [0, 4, -4, 2, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    error: {
      x: [0, -4, 4, -3, 3, 0],
      transition: { duration: 0.5, repeat: 2 },
    },
    welcome: {
      y: [0, -8, 0],
      transition: { duration: 1, repeat: 3, ease: 'easeOut' },
    },
    default: {
      y: [0, -3, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const getVariant = () => {
    if (!animate) return {};
    return containerVariants[mood as keyof typeof containerVariants] ?? containerVariants.default;
  };

  return (
    <div className={`relative inline-flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        animate={getVariant()}
        style={{ width: px, height: px }}
      >
        <ByteSVG mood={mood} size={px} />
      </motion.div>

      {/* Speech bubble con mensaje */}
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="relative px-3 py-2 rounded-xl text-xs font-medium text-white max-w-48 text-center"
              style={{
                background: 'linear-gradient(135deg, #141830, #1a2040)',
                border: '1px solid rgba(0,212,255,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(0,212,255,0.15)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message}
              {/* Flecha del speech bubble */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '7px solid #141830',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partículas de celebración */}
      <AnimatePresence>
        {mood === 'celebrating' && <CelebrationParticles />}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SVG de Byte — Robot felino con expresiones
// ============================================

function ByteSVG({ mood, size }: { mood: ByteMood; size: number }) {
  // Expresiones de ojos según estado
  const eyes = getEyeExpression(mood);
  const ears = getEarExpression(mood);
  const body = getBodyExpression(mood);
  const extras = getExtras(mood);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f0f4ff" />
          <stop offset="100%" stopColor="#d4dcf0" />
        </radialGradient>
        <radialGradient id="headGrad" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8eeff" />
        </radialGradient>
        <radialGradient id="visorGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1a2040" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sombra base */}
      <ellipse cx="50" cy="97" rx="22" ry="4" fill="rgba(0,0,0,0.2)" />

      {/* OREJAS */}
      {ears}

      {/* CUERPO */}
      <g transform={`translate(0, ${body.offsetY ?? 0})`}>
        {/* Cuerpo principal */}
        <rect
          x="28" y="60" width="44" height="34"
          rx="12"
          fill="url(#bodyGrad)"
          stroke="#c8d0e8"
          strokeWidth="0.5"
        />

        {/* Detalle pecho — panel de circuitos */}
        <rect
          x="35" y="67" width="30" height="20"
          rx="6"
          fill="#1a2040"
          stroke="#00d4ff"
          strokeWidth="0.8"
          opacity="0.9"
        />

        {/* Luces del pecho */}
        <circle cx="41" cy="74" r="2" fill="#00d4ff" filter="url(#glow)" opacity="0.9" />
        <circle cx="50" cy="74" r="2" fill="#7c3aed" filter="url(#glow)" opacity="0.9" />
        <circle cx="59" cy="74" r="2" fill="#00d4ff" filter="url(#glow)" opacity="0.9" />

        {/* Línea circuito */}
        <line x1="41" y1="79" x2="59" y2="79" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" />

        {/* BRAZOS */}
        {body.arms}

        {/* Pies */}
        <rect x="33" y="88" width="13" height="7" rx="4" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" />
        <rect x="54" y="88" width="13" height="7" rx="4" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" />
      </g>

      {/* CABEZA */}
      <g transform={`translate(0, ${body.offsetY ?? 0})`}>
        {/* Cabeza */}
        <ellipse cx="50" cy="44" rx="26" ry="24" fill="url(#headGrad)" stroke="#c8d0e8" strokeWidth="0.5" />

        {/* Detalle detrás de la oreja derecha */}
        <circle cx="72" cy="30" r="3" fill="#00d4ff" opacity="0.3" filter="url(#glow)" />

        {/* VISOR */}
        <rect
          x="26" y="36" width="48" height="22"
          rx="11"
          fill="url(#visorGrad)"
          stroke="#00d4ff"
          strokeWidth="0.8"
        />

        {/* Reflejo visor */}
        <rect
          x="29" y="38" width="20" height="4"
          rx="2"
          fill="white"
          opacity="0.06"
        />

        {/* OJOS */}
        {eyes}

        {/* Antena */}
        <line x1="50" y1="20" x2="50" y2="26" stroke="#c8d0e8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="50" cy="18" r="3" fill="#00d4ff" filter="url(#glow)" />
        <circle cx="50" cy="18" r="1.5" fill="white" opacity="0.8" />

        {/* Detalles laterales de cabeza */}
        <circle cx="24" cy="44" r="3" fill="#c8d0e8" />
        <circle cx="76" cy="44" r="3" fill="#c8d0e8" />
        <circle cx="24" cy="44" r="1.5" fill="#00d4ff" opacity="0.5" />
        <circle cx="76" cy="44" r="1.5" fill="#7c3aed" opacity="0.5" />
      </g>

      {/* Elementos extra según mood */}
      {extras}
    </svg>
  );
}

// ============================================
// EXPRESIONES POR MOOD
// ============================================

function getEyeExpression(mood: ByteMood) {
  switch (mood) {
    case 'happy':
    case 'excited':
    case 'welcome':
      // Ojos curvados hacia arriba (feliz)
      return (
        <g filter="url(#glow)">
          <path d="M 33 48 Q 37 44 41 48" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 59 48 Q 63 44 67 48" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="37" cy="46" r="1" fill="#00d4ff" opacity="0.6" />
          <circle cx="63" cy="46" r="1" fill="#00d4ff" opacity="0.6" />
        </g>
      );

    case 'celebrating':
    case 'proud':
      return (
        <g filter="url(#glow)">
          <path d="M 32 48 Q 37 43 42 48" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 58 48 Q 63 43 68 48" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* brillos */}
          <circle cx="35" cy="44" r="1.5" fill="white" opacity="0.9" />
          <circle cx="61" cy="44" r="1.5" fill="white" opacity="0.9" />
        </g>
      );

    case 'sad':
    case 'tired':
      // Ojos caídos
      return (
        <g>
          <path d="M 33 46 Q 37 50 41 46" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 59 46 Q 63 50 67 46" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Lágrima */}
          <ellipse cx="34" cy="51" rx="1.5" ry="2.5" fill="#3b82f6" opacity="0.6" />
        </g>
      );

    case 'thinking':
    case 'confused':
      // Un ojo entrecerrado
      return (
        <g>
          <circle cx="37" cy="47" r="4" fill="#141830" />
          <circle cx="37" cy="47" r="2.5" fill="#00d4ff" filter="url(#glow)" />
          <circle cx="38.5" cy="45.5" r="1" fill="white" />
          {/* Ojo entrecerrado */}
          <line x1="59" y1="47" x2="67" y2="47" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'sleeping':
      // Ojos cerrados (líneas)
      return (
        <g>
          <line x1="33" y1="47" x2="41" y2="47" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="59" y1="47" x2="67" y2="47" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'angry':
      // Cejas fruncidas + ojos naranjas
      return (
        <g>
          <circle cx="37" cy="47" r="4" fill="#141830" />
          <circle cx="37" cy="47" r="2.5" fill="#f97316" filter="url(#glow)" />
          <circle cx="63" cy="47" r="4" fill="#141830" />
          <circle cx="63" cy="47" r="2.5" fill="#f97316" filter="url(#glow)" />
          {/* Cejas */}
          <line x1="33" y1="40" x2="42" y2="43" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
          <line x1="67" y1="40" x2="58" y2="43" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'surprised':
      // Ojos muy abiertos
      return (
        <g filter="url(#glow)">
          <circle cx="37" cy="47" r="5" fill="#141830" />
          <circle cx="37" cy="47" r="3.5" fill="#00d4ff" />
          <circle cx="63" cy="47" r="5" fill="#141830" />
          <circle cx="63" cy="47" r="3.5" fill="#00d4ff" />
          <circle cx="38.5" cy="45.5" r="1.2" fill="white" />
          <circle cx="64.5" cy="45.5" r="1.2" fill="white" />
        </g>
      );

    case 'error':
      // Ojos con X
      return (
        <g>
          <line x1="33" y1="44" x2="41" y2="50" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="41" y1="44" x2="33" y2="50" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="59" y1="44" x2="67" y2="50" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="67" y1="44" x2="59" y2="50" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    case 'encouraging':
      // Ojos de guiño
      return (
        <g filter="url(#glow)">
          <path d="M 33 48 Q 37 44 41 48" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Guiño */}
          <line x1="59" y1="47" x2="67" y2="47" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'explorer':
      // Ojos normales con brillo de aventura
      return (
        <g filter="url(#glow)">
          <circle cx="37" cy="47" r="4" fill="#141830" />
          <circle cx="37" cy="47" r="2.5" fill="#00d4ff" />
          <circle cx="63" cy="47" r="4" fill="#141830" />
          <circle cx="63" cy="47" r="2.5" fill="#7c3aed" />
          <circle cx="38.5" cy="45.5" r="1" fill="white" />
          <circle cx="64.5" cy="45.5" r="1" fill="white" />
        </g>
      );

    // idle y default
    default:
      return (
        <g filter="url(#glow)">
          <circle cx="37" cy="47" r="4" fill="#141830" />
          <circle cx="37" cy="47" r="2.5" fill="#00d4ff" />
          <circle cx="63" cy="47" r="4" fill="#141830" />
          <circle cx="63" cy="47" r="2.5" fill="#00d4ff" />
          <circle cx="38.5" cy="45.5" r="1" fill="white" />
          <circle cx="64.5" cy="45.5" r="1" fill="white" />
        </g>
      );
  }
}

function getEarExpression(mood: ByteMood) {
  const earDown = mood === 'sad' || mood === 'tired' || mood === 'sleeping';
  const earAlert = mood === 'surprised' || mood === 'excited' || mood === 'celebrating';

  if (earDown) {
    return (
      <g>
        <polygon points="23,30 17,45 30,40" fill="#e8eeff" stroke="#c8d0e8" strokeWidth="0.5" />
        <polygon points="77,30 83,45 70,40" fill="#e8eeff" stroke="#c8d0e8" strokeWidth="0.5" />
        <polygon points="24,32 19,43 29,39" fill="#00d4ff" opacity="0.2" />
        <polygon points="76,32 81,43 71,39" fill="#7c3aed" opacity="0.2" />
      </g>
    );
  }

  if (earAlert) {
    return (
      <g>
        <polygon points="22,20 16,35 28,28" fill="#e8eeff" stroke="#c8d0e8" strokeWidth="0.5" />
        <polygon points="78,20 84,35 72,28" fill="#e8eeff" stroke="#c8d0e8" strokeWidth="0.5" />
        <polygon points="23,22 18,33 27,27" fill="#00d4ff" opacity="0.3" />
        <polygon points="77,22 82,33 73,27" fill="#7c3aed" opacity="0.3" />
      </g>
    );
  }

  // Default ears
  return (
    <g>
      <polygon points="22,22 16,38 29,32" fill="#e8eeff" stroke="#c8d0e8" strokeWidth="0.5" />
      <polygon points="78,22 84,38 71,32" fill="#e8eeff" stroke="#c8d0e8" strokeWidth="0.5" />
      <polygon points="23,24 18,36 28,31" fill="#00d4ff" opacity="0.25" />
      <polygon points="77,24 82,36 72,31" fill="#7c3aed" opacity="0.25" />
    </g>
  );
}

function getBodyExpression(mood: ByteMood): { offsetY: number; arms: React.ReactNode } {
  switch (mood) {
    case 'celebrating':
    case 'excited':
      return {
        offsetY: 0,
        arms: (
          <g>
            {/* Brazos arriba */}
            <rect x="14" y="56" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(-45 22 59)" />
            <rect x="70" y="56" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(45 78 59)" />
          </g>
        ),
      };

    case 'thinking':
    case 'confused':
      return {
        offsetY: 0,
        arms: (
          <g>
            {/* Brazo en mentón */}
            <rect x="14" y="65" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" />
            <rect x="70" y="65" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(-25 78 68)" />
            <circle cx="27" cy="59" r="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" />
          </g>
        ),
      };

    case 'sad':
    case 'tired':
      return {
        offsetY: 2,
        arms: (
          <g>
            {/* Brazos caídos */}
            <rect x="14" y="70" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(15 22 73)" />
            <rect x="70" y="70" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(-15 78 73)" />
          </g>
        ),
      };

    case 'happy':
    case 'proud':
    case 'welcome':
      return {
        offsetY: 0,
        arms: (
          <g>
            {/* Brazos ligeramente levantados */}
            <rect x="14" y="62" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(-20 22 65)" />
            <rect x="70" y="62" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" transform="rotate(20 78 65)" />
          </g>
        ),
      };

    default:
      return {
        offsetY: 0,
        arms: (
          <g>
            <rect x="14" y="67" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" />
            <rect x="70" y="67" width="16" height="6" rx="3" fill="#d4dcf0" stroke="#c8d0e8" strokeWidth="0.5" />
          </g>
        ),
      };
  }
}

function getExtras(mood: ByteMood): React.ReactNode {
  switch (mood) {
    case 'sleeping':
      return (
        <g>
          <motion.text
            x="68" y="30"
            fontSize="10" fill="#94a3b8"
            fontWeight="bold"
            animate={{ opacity: [0, 1, 1, 0], y: [30, 24, 18, 12] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >z</motion.text>
          <motion.text
            x="75" y="22"
            fontSize="7" fill="#94a3b8"
            fontWeight="bold"
            animate={{ opacity: [0, 1, 1, 0], y: [22, 16, 12, 6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >z</motion.text>
        </g>
      );

    case 'thinking':
    case 'confused':
      return (
        <g>
          <circle cx="72" cy="28" r="4" fill="#141830" stroke="#00d4ff" strokeWidth="0.8" opacity="0.8" />
          <text x="70" y="31" fontSize="5" fill="#00d4ff">?</text>
        </g>
      );

    case 'angry':
      return (
        <g>
          {/* Vapor de enojo */}
          <motion.path
            d="M 68 30 Q 72 26 70 22"
            stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" fill="none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.path
            d="M 72 28 Q 76 24 74 20"
            stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" fill="none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </g>
      );

    case 'explorer':
      return (
        <g>
          {/* Mochilita */}
          <rect x="60" y="62" width="12" height="14" rx="3" fill="#7c3aed" opacity="0.8" />
          <rect x="62" y="65" width="8" height="5" rx="1" fill="#00d4ff" opacity="0.5" />
          <line x1="63" y1="62" x2="63" y2="60" stroke="#c8d0e8" strokeWidth="1" />
          <line x1="69" y1="62" x2="69" y2="60" stroke="#c8d0e8" strokeWidth="1" />
        </g>
      );

    default:
      return null;
  }
}

// ============================================
// PARTÍCULAS DE CELEBRACIÓN
// ============================================

function CelebrationParticles() {
  const particles = [
    { x: -20, color: '#00d4ff', delay: 0 },
    { x: 20, color: '#7c3aed', delay: 0.1 },
    { x: -30, color: '#f97316', delay: 0.2 },
    { x: 30, color: '#22c55e', delay: 0.15 },
    { x: -10, color: '#facc15', delay: 0.05 },
    { x: 10, color: '#f472b6', delay: 0.25 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            background: p.color,
            left: `calc(50% + ${p.x}px)`,
            top: '40%',
          }}
          animate={{
            y: [-10, -50, -80],
            x: [0, p.x * 0.5, p.x],
            opacity: [1, 0.8, 0],
            scale: [1, 0.8, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
