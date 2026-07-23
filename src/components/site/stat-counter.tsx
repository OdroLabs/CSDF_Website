"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to the numeric part of `value` when scrolled into view (e.g. "1,200+" → animates 0→1200, keeps suffix). */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // Split the original value into prefix / number (may contain commas) / suffix
    const match = value.match(/^(\D*)([\d,]*\d)(.*)$/);
    if (!match || !ref.current) return;
    const [, prefix, num, suffix] = match;
    const target = parseInt(num.replace(/,/g, ""), 10);
    if (isNaN(target)) return;
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
