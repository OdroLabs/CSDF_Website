"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

interface TestimonialSliderProps {
  /** Heading shown next to the big quote mark, e.g. "What people are saying". */
  title?: string;
  items: { quote: string; author: string; avatar?: string | null; rating?: number | null }[];
}

/** Light, multi-card testimonial slider — quote mark + heading + prev/next
 *  controls on the left, a horizontally scrollable row of cards on the
 *  right with the next card peeking in at the edge. Scroll position (not a
 *  fixed index) drives the arrows and progress bar, so the peek amount adapts
 *  naturally at every breakpoint. */
export function TestimonialSlider({ title, items }: TestimonialSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
    setProgress(max <= 0 ? 1 : el.scrollLeft / max);
  }, []);

  useEffect(() => {
    updateState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-center">
      <div>
        <Quote className="mb-5 h-10 w-10 text-muted-foreground/25" fill="currentColor" strokeWidth={0} />
        {title && (
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
        )}
        {items.length > 1 && (
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-300"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex items-start snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-2"
      >
        {items.map((item, i) => {
          const initial = item.author.trim().charAt(0).toUpperCase();
          const rating = Math.min(5, Math.max(0, item.rating ?? 5));
          return (
            <div
              key={i}
              data-card
              className="relative w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(38%-1rem)]"
            >
              <div className="rounded-3xl bg-white p-7 pb-9 shadow-card">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.quote}</p>
                <div className="mt-6 flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star
                      key={s}
                      className={s < rating ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4 text-border"}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 left-7 flex items-center gap-3">
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatar}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-4 ring-background"
                  />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white ring-4 ring-background">
                    {initial}
                  </span>
                )}
                <span className="text-sm font-semibold text-foreground">{item.author}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
