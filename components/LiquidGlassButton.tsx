import React from "react";
import { motion, MotionProps } from "framer-motion";

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  icon?: React.ReactNode;
  motionProps?: Partial<MotionProps>;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  default:
    "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/40 hover:to-purple-500/40 text-white border border-indigo-400/30 hover:border-indigo-400/60",
  secondary:
    "bg-gradient-to-r from-slate-500/20 to-slate-600/20 hover:from-slate-500/40 hover:to-slate-600/40 text-gray-100 border border-slate-400/20 hover:border-slate-400/40",
  accent:
    "bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/40 hover:to-rose-500/40 text-white border border-pink-400/30 hover:border-pink-400/60",
};

const sizeStyles = {
  sm: "px-3 py-2 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-3",
  xl: "px-10 py-5 text-xl gap-3",
};

export default function LiquidGlassButton({
  children,
  variant = "default",
  size = "md",
  isLoading = false,
  icon,
  motionProps = {},
  className = "",
  disabled,
  onClick,
}: LiquidGlassButtonProps) {
  return (
    <motion.button
      {...motionProps}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`relative group flex items-center justify-center font-semibold rounded-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 bg-white transition-opacity duration-300" />

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-shimmer" />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
      </div>
    </motion.button>
  );
}
