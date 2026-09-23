import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'violet' | 'orange' | 'green' | 'gradient';
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantStyles = {
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  gradient: 'bg-gradient-to-r from-cyan-500 to-violet-500',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'sm',
  variant = 'gradient',
  animated = true,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-[--text-secondary]">{label}</span>}
          {showValue && (
            <span className="text-xs font-medium text-[--text-secondary]">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          sizeStyles[size],
          'bg-[--bg-elevated]'
        )}
      >
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'h-full rounded-full',
            variantStyles[variant],
            animated && 'transition-all duration-700 ease-out'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// PROGRESS RING (circular)
// ============================================

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  children?: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'orange' | 'green';
  className?: string;
}

const ringColors = {
  cyan: '#00d4ff',
  violet: '#7c3aed',
  orange: '#f97316',
  green: '#22c55e',
};

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  children,
  variant = 'cyan',
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const dashOffset = circumference - (progress / 100) * circumference;
  const center = size / 2;
  const color = ringColors[variant];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="img"
      aria-label={`Progreso: ${progress}%${label ? ` de ${label}` : ''}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.7s ease-out', filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
