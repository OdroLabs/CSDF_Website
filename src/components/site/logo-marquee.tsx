"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";

interface LogoItem {
  id: number;
  name: string;
  logo: string | null;
}

/** Infinite horizontal logo strip — same seamless-loop technique as Marquee,
 *  but rendering partner logos/names instead of plain text. */
export function LogoMarquee({ items, speed = 32 }: { items: LogoItem[]; speed?: number }) {
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  const tile = (item: LogoItem, key: string) => (
    <div
      key={key}
      className="group flex h-28 w-64 shrink-0 items-center justify-center rounded-3xl border border-border/60 bg-white px-10 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
    >
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt={item.name}
          className="h-11 w-full object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span className="text-sm font-semibold text-foreground">{item.name}</span>
      )}
    </div>
  );

  const track = (repeatKey: number) => (
    <Fragment key={repeatKey}>
      {items.map((item, i) => (
        <div key={i} className="mx-4">
          {tile(item, `${repeatKey}-${i}`)}
        </div>
      ))}
    </Fragment>
  );

  if (reduce) {
    return (
      <div className="flex items-center gap-4 overflow-x-auto">
        {items.map((item, i) => tile(item, `static-${i}`))}
      </div>
    );
  }

  const copies = Math.max(2, Math.ceil(10 / items.length));

  return (
    <div className="overflow-hidden rounded-3xl bg-muted/40 py-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
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
