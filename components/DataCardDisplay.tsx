import React from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

export interface DataCardItem {
  id: string;
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendDirection?: "up" | "down" | "neutral";
  gradient?: "indigo" | "purple" | "pink" | "blue" | "green";
  onClick?: () => void;
}

interface DataCardDisplayProps {
  items: DataCardItem[];
  columns?: number;
  gap?: "small" | "medium" | "large";
  loading?: boolean;
}

const columnMap = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

const gapMap = {
  small: "gap-3",
  medium: "gap-4 sm:gap-6",
  large: "gap-6 sm:gap-8",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DataCardDisplay({
  items,
  columns = 4,
  gap = "medium",
  loading = false,
}: DataCardDisplayProps) {
  if (loading) {
    return (
      <div className={`grid ${columnMap[columns as keyof typeof columnMap]} ${gapMap[gap]}`}>
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} variant="gradient">
            <div className="h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-lg animate-pulse" />
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${columnMap[columns as keyof typeof columnMap]} ${gapMap[gap]}`}
    >
      {items.map((card) => (
        <motion.div key={card.id} variants={item}>
          <GlassCard
            variant={card.gradient ? "gradient" : "default"}
            motionProps={{
              whileHover: { scale: 1.02 },
            }}
            className={card.onClick ? "cursor-pointer" : ""}
          >
            <div className="space-y-3" onClick={card.onClick}>
              {/* Header with icon and trend */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {card.icon && (
                    <div className="text-3xl flex-shrink-0">{card.icon}</div>
                  )}
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      {card.title}
                    </p>
                  </div>
                </div>
                {card.trend && (
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      card.trendDirection === "up"
                        ? "bg-green-500/20 text-green-300"
                        : card.trendDirection === "down"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {card.trendDirection === "up" ? "↑" : card.trendDirection === "down" ? "↓" : "→"}{" "}
                    {card.trend}%
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="pt-1">
                <p className="text-2xl sm:text-3xl font-bold text-gradient">
                  {card.value}
                </p>
              </div>

              {/* Description */}
              {card.description && (
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  {card.description}
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
