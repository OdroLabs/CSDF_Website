"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Shared Framer Motion primitives for the public site. Everything here
 * respects `prefers-reduced-motion` automatically via `useReducedMotion`.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades + slides content in once, either immediately (hero) or on scroll. */
export function FadeIn({
  children,
  delay = 0,
  y = 22,
  duration = 0.7,
  immediate = false,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  /** Animate on mount instead of on scroll-into-view (use for above-the-fold hero content). */
  immediate?: boolean;
  className?: string;
  as?: "div" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = (as === "span" ? motion.span : motion.div) as typeof motion.div;

  if (reduce) {
    const Static = as === "span" ? "span" : "div";
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Container that staggers the entrance of its direct `<StaggerItem>` children on scroll. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/** Gentle vertical parallax drift for background imagery. Wrap an oversized (scale-110) element; parent should have `overflow-hidden`. */
export function Parallax({
  children,
  travel = 40,
  className,
}: {
  children: ReactNode;
  travel?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ y, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}
