"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface ValueItem {
  left: string;
  right?: string;
}

/** Infinite horizontal scroll of value cards — same looping technique as the homepage ticker. */
export function ValuesMarquee({ values, speed = 34 }: { values: ValueItem[]; speed?: number }) {
  const reduce = useReducedMotion();
  if (values.length === 0) return null;

  const card = (v: ValueItem, key: string) => (
    <div
      key={key}
      className="mx-3 flex w-[280px] shrink-0 flex-col gap-2 rounded-2xl border border-border bg-white p-6 shadow-card"
    >
      <h3 className="font-bold tracking-tight text-foreground">{v.left}</h3>
      {v.right && <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{v.right}</p>}
    </div>
  );

  if (reduce) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {values.map((v, i) => card(v, `${i}`))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        className="flex w-max py-1"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {values.map((v, i) => card(v, `a-${i}`))}
        {values.map((v, i) => card(v, `b-${i}`))}
      </motion.div>
    </div>
  );
}
