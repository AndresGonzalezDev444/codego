import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'bordered' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hover?: boolean;
}

const variantStyles = {
  default: 'bg-[--bg-surface] border border-[--border-default]',
  elevated: 'bg-[--bg-elevated] border border-white/5',
  glass: 'glass border border-white/5',
  bordered: 'bg-[--bg-surface] border border-cyan-500/30',
  glow: 'bg-[--bg-elevated] border border-cyan-500/30 glow-cyan',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'rounded-2xl shadow-[--shadow-card] transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover:border-cyan-500/50 hover:-translate-y-0.5 cursor-pointer hover:shadow-[--shadow-elevated]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
