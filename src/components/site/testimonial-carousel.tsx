"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestimonialCarousel({
  items,
}: {
  items: { quote: string; author: string }[];
}) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;
  const item = items[index];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
        <Quote className="h-5 w-5 text-primary" />
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote className="mb-4 text-lg leading-relaxed text-foreground/90 md:text-xl">
            “{item.quote}”
          </blockquote>
          <p className="mb-6 text-sm font-semibold text-primary">{item.author}</p>
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIndex((index - 1 + items.length) % items.length)}
            aria-label="Previous"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white shadow-xs transition-all hover:border-primary/30 hover:text-primary hover:shadow-soft motion-safe:active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5" aria-hidden>
            {items.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-border"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((index + 1) % items.length)}
            aria-label="Next"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white shadow-xs transition-all hover:border-primary/30 hover:text-primary hover:shadow-soft motion-safe:active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
