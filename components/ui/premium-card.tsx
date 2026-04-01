import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow' | 'bordered';
  hover?: boolean;
  delay?: number;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  delay = 0,
}) => {
  const variants = {
    default: 'bg-white/5 border-white/10',
    gradient: 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border-purple-500/20',
    glow: 'bg-white/5 border-purple-500/30 shadow-lg shadow-purple-500/20',
    bordered: 'bg-transparent border-purple-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        'relative rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300',
        variants[variant],
        hover && 'hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/30',
        className
      )}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default PremiumCard;
