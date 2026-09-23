import { cn } from '@/lib/utils';
import type { AchievementRarity } from '@/types';

type BadgeVariant = 'cyan' | 'violet' | 'orange' | 'green' | 'red' | 'blue' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rarity?: AchievementRarity;
  icon?: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  violet: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  gray: 'bg-white/5 text-[--text-secondary] border-white/10',
};

const rarityStyles: Record<AchievementRarity, string> = {
  common: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  rare: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  epic: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
  legendary: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1 rounded-lg',
  md: 'text-xs px-2.5 py-1 gap-1.5 rounded-xl',
  lg: 'text-sm px-3 py-1.5 gap-2 rounded-xl',
};

export function Badge({
  children,
  variant = 'cyan',
  size = 'md',
  rarity,
  icon,
  className,
  glow = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border',
        rarity ? rarityStyles[rarity] : variantStyles[variant],
        sizeStyles[size],
        glow && 'shadow-sm',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
