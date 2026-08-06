"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Shared Framer Motion primitives for the public site. Everything here
 * respects `prefers-reduced-motion` automatically via `useReducedMotion`.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * True inside the admin's section-preview iframe (`?adminPreview=1`). That
 * iframe forces layout changes (siblings hidden, ancestors collapsed to
 * `min-height: 0`, the whole frame CSS-scaled) so scroll-driven and
 * viewport-triggered animations can fight their own measurements and end up
 * visibly jittering. Every animation primitive below falls back to its
 * static render in this mode, the same way they do for `prefers-reduced-motion`.
 */
function useIsAdminPreview(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("adminPreview") === "1";
}

/** Fades + slides content in once, either immediately (hero) or on scroll. */
export function FadeIn({
  children,
  delay = 0,
  y = 22,
  duration = 0.7,
  immediate = false,
  className,
  as = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  /** Animate on mount instead of on scroll-into-view (use for above-the-fold hero content). */
  immediate?: boolean;
  className?: string;
  as?: "div" | "span";
  id?: string;
}) {
  const reduce = useReducedMotion() || useIsAdminPreview();
  const Comp = (as === "span" ? motion.span : motion.div) as typeof motion.div;

  if (reduce) {
    const Static = as === "span" ? "span" : "div";
    return (
      <Static id={id} className={className}>
        {children}
      </Static>
    );
  }

  return (
    <Comp
      id={id}
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

const wordContainer: Variants = {
  hidden: {},
  show: (delay: number) => ({ transition: { staggerChildren: 0.07, delayChildren: delay } }),
};

const wordItem: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.65, ease: EASE } },
};

/** Splits text into words that rise up into place, staggered — for hero headlines. */
export function TextReveal({
  text,
  className,
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2";
}) {
  const reduce = useReducedMotion() || useIsAdminPreview();
  const Comp = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{text}</Static>;
  }

  return (
    <Comp className={className} variants={wordContainer} initial="hidden" animate="show" custom={delay}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
          <motion.span variants={wordItem} className="inline-block">
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
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
  const reduce = useReducedMotion() || useIsAdminPreview();
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
  const reduce = useReducedMotion() || useIsAdminPreview();
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
  const reduce = useReducedMotion() || useIsAdminPreview();
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
