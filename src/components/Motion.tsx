import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  y = 22,
  once = true,
  transition,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-90px" }}
      transition={
        transition ?? {
          duration: 0.62,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const softHover = {
  y: -8,
  scale: 1.015,
  transition: { type: "spring", stiffness: 260, damping: 22 },
};
