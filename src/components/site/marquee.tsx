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

  const track = (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap px-4 text-[13px] font-semibold uppercase tracking-[0.12em]">
            {item}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-current opacity-40" />
        </Fragment>
      ))}
    </>
  );

  if (reduce) {
    return (
      <div className={className}>
        <div className="flex items-center overflow-x-auto">{track}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {track}
        {track}
      </motion.div>
    </div>
  );
}
