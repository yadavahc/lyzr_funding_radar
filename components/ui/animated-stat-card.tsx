import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedStatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number | React.ReactNode;
  trend?: number;
  trendLabel?: string;
  description?: string;
  delay?: number;
  gradient?: 'purple' | 'pink' | 'blue' | 'green';
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  icon: Icon,
  title,
  value,
  trend,
  trendLabel,
  description,
  delay = 0,
  gradient = 'purple',
}) => {
  const gradients = {
    purple: 'from-violet-500/20 to-purple-500/10',
    pink: 'from-pink-500/20 to-rose-500/10',
    blue: 'from-sky-500/20 to-cyan-500/10',
    green: 'from-emerald-500/20 to-teal-500/10',
  };

  const iconColors = {
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    blue: 'text-blue-400',
    green: 'text-emerald-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <div className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 group-hover:border-violet-400/40 group-hover:shadow-violet-500/10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br',
              gradients[gradient]
            )}
          >
            <Icon className={cn('h-5 w-5', iconColors[gradient])} />
          </div>

          {trend !== undefined && (
            <div
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                trend >= 0 
                  ? 'bg-emerald-500/15 text-emerald-300' 
                  : 'bg-red-500/15 text-red-300'
              )}
            >
              {trend >= 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>

        <h3 className="text-sm font-medium text-zinc-400">
          {title}
        </h3>

        <div className="mt-2 text-3xl font-bold tracking-tight text-white">
          {value}
        </div>

        {description && (
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        )}

        {trendLabel && (
          <p className="mt-auto pt-4 text-xs text-zinc-500">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
};

export default AnimatedStatCard;
