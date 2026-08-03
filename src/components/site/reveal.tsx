"use client";

import { FadeIn } from "./motion";

/** Fades + slides content in when it scrolls into view. Thin wrapper kept for
 *  call-site compatibility across the inner pages. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn delay={delay / 1000} className={className}>
      {children}
    </FadeIn>
  );
}
