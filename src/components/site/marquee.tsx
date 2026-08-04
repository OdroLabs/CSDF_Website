"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";

/** Infinite horizontal ticker — duplicates its items so the loop is seamless. */
export function Marquee({
  items,
  className,
  speed = 28,
}: {
  items: string[];
  className?: string;
  /** Seconds per full loop. */
  speed?: number;
}) {
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  const track = (repeatKey: number) => (
    <Fragment key={repeatKey}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap px-4 text-[13px] font-semibold uppercase tracking-[0.12em]">
            {item}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-current opacity-40" />
        </Fragment>
      ))}
    </Fragment>
  );

  if (reduce) {
    return (
      <div className={className}>
        <div className="flex items-center overflow-x-auto">{track(0)}</div>
      </div>
    );
  }

  // Short item lists can end up narrower than the viewport, which leaves a
  // visible gap of empty track before the loop repeats. Render enough copies
  // that the strip always comfortably out-runs even an ultra-wide screen,
  // and scale the loop distance to match so the seam stays seamless.
  const copies = Math.max(2, Math.ceil(16 / items.length));

  return (
    <div className={className}>
      <motion.div
        className="flex w-max items-center"
        animate={{ x: [`0%`, `-${100 / copies}%`] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: copies }, (_, i) => track(i))}
      </motion.div>
    </div>
  );
}
