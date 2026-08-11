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
  /** Bolder, full-width single-quote treatment — giant background quote
   *  mark, larger type, bigger avatar. Used for the home page's "spotlight"
   *  testimonial section. */
  spotlight = false,
}: {
  items: { quote: string; author: string }[];
  edgeArrows?: boolean;
  spotlight?: boolean;
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
        "grid shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:bg-white/15 motion-safe:active:scale-95",
        spotlight ? "h-12 w-12" : "h-10 w-10",
        edgeArrows && "absolute left-0 top-1/2 -translate-y-1/2"
      )}
    >
      <ChevronLeft className={spotlight ? "h-5 w-5" : "h-4 w-4"} />
    </button>
  );
  const nextBtn = (
    <button
      onClick={() => setIndex((index + 1) % items.length)}
      aria-label="Next"
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:bg-white/15 motion-safe:active:scale-95",
        spotlight ? "h-12 w-12" : "h-10 w-10",
        edgeArrows && "absolute right-0 top-1/2 -translate-y-1/2"
      )}
    >
      <ChevronRight className={spotlight ? "h-5 w-5" : "h-4 w-4"} />
    </button>
  );

  return (
    <div className={cn("relative mx-auto text-center", spotlight ? "max-w-4xl" : "max-w-2xl")}>
      {spotlight && (
        <Quote
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/3 text-white/[0.06] md:h-56 md:w-56"
          strokeWidth={1}
          fill="currentColor"
        />
      )}
      {edgeArrows && items.length > 1 && (
        <>
          {prevBtn}
          {nextBtn}
        </>
      )}
      {!spotlight && <Quote className="mx-auto mb-3 h-5 w-5 text-accent/70" strokeWidth={1.5} />}
      <span
        className={cn(
          "relative mx-auto grid place-items-center rounded-full bg-white/10 font-bold text-white ring-1 ring-accent/40",
          spotlight ? "mb-7 h-20 w-20 text-2xl" : "mb-5 h-16 w-16 text-xl"
        )}
      >
        {initial}
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <blockquote
            className={cn(
              "mb-5 leading-relaxed text-white/90",
              spotlight ? "text-2xl font-medium md:text-4xl" : "text-lg md:text-xl"
            )}
          >
            “{item.quote}”
          </blockquote>
          <p className={cn("mb-6 font-semibold text-accent", spotlight ? "text-base" : "text-sm")}>
            {item.author}
          </p>
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="relative flex items-center justify-center gap-4">
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
