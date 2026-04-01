import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'subtle' | 'dark';
}

const paddingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

const backgroundClasses = {
  none: '',
  subtle: 'bg-white/[0.02]',
  dark: 'bg-black/40',
};

export function Section({
  children,
  className,
  padding = 'md',
  background = 'none',
}: SectionProps) {
  return (
    <section
      className={cn(
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
}
