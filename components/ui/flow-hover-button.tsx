import React from 'react';
import { cn } from '@/lib/utils';

interface FlowHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const FlowHoverButton: React.FC<FlowHoverButtonProps> = ({ 
  icon, 
  children, 
  className,
  ...props 
}) => (
  <button
    className={cn(
      `relative cursor-pointer z-0 flex items-center justify-center gap-2 overflow-hidden rounded-lg 
      border border-purple-500/30 bg-purple-900/20 
      px-6 py-3 font-semibold text-purple-100 transition-all duration-500
      before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
      before:rounded-[100%] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:transition-transform before:duration-1000 before:content-[""]
      hover:scale-105 hover:text-white hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/50 hover:before:translate-x-[0%] hover:before:translate-y-[0%] 
      active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`,
      className
    )}
    {...props}
  >
    {icon && <span className="relative z-10">{icon}</span>}
    <span className="relative z-10">{children}</span>
  </button>
);

export default FlowHoverButton;
