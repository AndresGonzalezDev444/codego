import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-cyan-500 to-violet-500
    hover:from-cyan-400 hover:to-violet-400
    text-white font-semibold
    shadow-lg shadow-cyan-500/20
    border border-transparent
  `,
  secondary: `
    bg-[--bg-elevated]
    hover:bg-[--bg-hover]
    text-white
    border border-[--border-default]
    hover:border-[--border-accent]
  `,
  ghost: `
    bg-transparent
    hover:bg-[--bg-elevated]
    text-[--text-secondary]
    hover:text-white
    border border-transparent
  `,
  danger: `
    bg-gradient-to-r from-red-500 to-red-600
    hover:from-red-400 hover:to-red-500
    text-white font-semibold
    shadow-lg shadow-red-500/20
    border border-transparent
  `,
  success: `
    bg-gradient-to-r from-green-500 to-emerald-500
    hover:from-green-400 hover:to-emerald-400
    text-white font-semibold
    shadow-lg shadow-green-500/20
    border border-transparent
  `,
  outline: `
    bg-transparent
    text-cyan-400
    border border-cyan-500/50
    hover:border-cyan-400
    hover:bg-cyan-500/10
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1',
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2',
  xl: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center',
        'font-medium transition-all duration-150',
        'cursor-pointer select-none active:scale-95',
        'focus-visible:outline-2 focus-visible:outline-cyan-400',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Wrapper de motion para animaciones
export const MotionButton = motion.create(Button);
