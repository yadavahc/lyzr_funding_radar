import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function Skeleton({ className = "w-full h-12", count = 1 }: SkeletonProps) {
  if (count === 1) {
    return (
      <motion.div
        className={`skeleton rounded-lg ${className}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`skeleton rounded-lg ${className}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <motion.div
      className="card space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-24 h-4" />
    </motion.div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-16 skeleton rounded-2xl"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
