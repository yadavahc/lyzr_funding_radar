import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  suffix = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0);

  useEffect(() => {
    if (typeof value === "string") {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = value;
    const increment = end / (duration * 60);

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
      {suffix}
    </motion.span>
  );
}
