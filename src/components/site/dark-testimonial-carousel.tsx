"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/** Same carousel behaviour as TestimonialCarousel, restyled for a dark
 *  section (avatar initial, light text, translucent controls) instead of
 *  the white-card version used elsewhere on the site. */
export function DarkTestimonialCarousel({
  items,
  /** Anchor the prev/next buttons to the far left/right edge of a `relative`
   *  ancestor instead of sitting next to the dots — used on the home page
   *  where the carousel sits inside a wider dark band. */
  edgeArrows = false,
}: {
  items: { quote: string; author: string }[];
  edgeArrows?: boolean;
}) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;
  const item = items[index];
  const initial = item.author.trim().charAt(0).toUpperCase();

  const prevBtn = (
    <button
      onClick={() => setIndex((index - 1 + items.length) % items.length)}
      aria-label="Previous"
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:bg-white/15 motion-safe:active:scale-95",
        edgeArrows && "absolute left-0 top-1/2 -translate-y-1/2"
      )}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
  const nextBtn = (
    <button
      onClick={() => setIndex((index + 1) % items.length)}
      aria-label="Next"
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:bg-white/15 motion-safe:active:scale-95",
        edgeArrows && "absolute right-0 top-1/2 -translate-y-1/2"
      )}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl text-center">
      {edgeArrows && items.length > 1 && (
        <>
          {prevBtn}
          {nextBtn}
        </>
      )}
      <Quote className="mx-auto mb-3 h-5 w-5 text-accent/70" strokeWidth={1.5} />
      <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white/10 text-xl font-bold text-white ring-1 ring-accent/40">
        {initial}
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote className="mb-4 text-lg leading-relaxed text-white/90 md:text-xl">
            “{item.quote}”
          </blockquote>
          <p className="mb-6 text-sm font-semibold text-accent">{item.author}</p>
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          {!edgeArrows && prevBtn}
          <div className="flex items-center gap-1.5" aria-hidden>
            {items.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-white/20"
                )}
              />
            ))}
          </div>
          {!edgeArrows && nextBtn}
        </div>
      )}
    </div>
  );
}
