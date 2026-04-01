import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'bordered' | 'glass';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-white/5 backdrop-blur-xl border border-white/10',
  gradient: 'bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent backdrop-blur-xl border border-white/10',
  bordered: 'bg-transparent border-2 border-white/20',
  glass: 'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08]',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  variant = 'default',
  hover = true,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl shadow-lg transition-all duration-300',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:bg-white/[0.07] hover:border-white/20 hover:shadow-glow hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
