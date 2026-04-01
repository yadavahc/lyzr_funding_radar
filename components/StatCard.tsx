import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  loading?: boolean;
  trend?: number;
  highlight?: boolean;
  isTrending?: boolean;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
  trend,
  highlight = false,
  isTrending = false,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden rounded-2xl 
        bg-white/5 backdrop-blur-xl border border-white/10
        p-6 shadow-lg transition-all duration-300 group
        hover:bg-white/[0.07] hover:border-white/20 hover:shadow-glow hover:-translate-y-1
        ${highlight ? "ring-2 ring-violet-500/50 shadow-violet-500/20" : ""}
      `}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {title}
            </p>
            {isTrending && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Zap className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>
          
          {Icon && (
            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-105">
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Main Value */}
        <motion.div
          key={`${value}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          {loading ? (
            <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
          ) : (
            <p className="text-3xl lg:text-4xl font-bold text-white">
              {value}
            </p>
          )}
        </motion.div>

        {/* Subtitle & Trend */}
        <div className="flex items-center gap-3 flex-wrap">
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
          
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold
                ${
                  trend >= 0
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }
              `}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend >= 0 ? "+" : ""}{trend}%</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
