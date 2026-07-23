"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to the numeric part of `value` when scrolled into view (e.g. "1,200+" → animates 0→1200, keeps suffix). */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.replace(/,/g, "").match(/(\d+)/);
    if (!match || !ref.current) return;
    const target = parseInt(match[1], 10);
    const prefix = value.slice(0, value.indexOf(match[1]));
    const suffix = value.slice(value.indexOf(match[1]) + match[1].length);
    setDisplay(`${prefix}0${suffix}`);

    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(`${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
