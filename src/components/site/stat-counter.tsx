"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts up to the numeric part of `value` when scrolled into view (e.g. "1,200+" → animates 0→1200, keeps suffix). */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    const match = value.match(/^(\D*)([\d,]*\d)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, num, suffix] = match;
    const target = parseInt(num.replace(/,/g, ""), 10);
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(`${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return <span ref={ref}>{display}</span>;
}
