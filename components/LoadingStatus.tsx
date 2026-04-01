import { motion } from "framer-motion";

interface LoadingStatusProps {
  isLoading: boolean;
  status?: string;
  progress?: number;
}

export default function LoadingStatus({
  isLoading,
  status = "Processing...",
  progress,
}: LoadingStatusProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Modal card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative card max-w-md w-full mx-4 glass"
      >
        {/* Animated spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500"
            />
            {/* Middle ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 border-l-indigo-400"
            />
            {/* Center dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-lg font-semibold text-gradient mb-2"
        >
          {status}
        </motion.p>

        {/* Progress bar */}
        {progress !== undefined && (
          <motion.div className="space-y-3 mt-6">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
              />
            </div>
            <motion.p className="text-xs text-gray-400 text-right font-medium">
              {Math.round(progress)}% complete
            </motion.p>
          </motion.div>
        )}

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.span
              key={delay}
              initial={{ opacity: 0.4, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
