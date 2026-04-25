"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type AnimatedRevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function AnimatedReveal({
  children,
  delay = 0,
  y = 16,
  className,
}: AnimatedRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
