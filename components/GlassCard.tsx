import React from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "gradient" | "bordered";
  motionProps?: Partial<MotionProps>;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  variant = "default",
  motionProps = {},
}: GlassCardProps) {
  const baseStyles = "relative rounded-2xl backdrop-blur-xl border p-6 overflow-hidden transition-all duration-300 group";
  
  const variantStyles = {
    default: "bg-white/5 border-white/10",
    gradient: "bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border-white/10",
    bordered: "bg-transparent border-white/20 border-2",
  };

  const hoverStyles = hover 
    ? "hover:bg-white/[0.07] hover:border-white/20 hover:shadow-glow hover:-translate-y-1" 
    : "";

  return (
    <motion.div
      {...motionProps}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
