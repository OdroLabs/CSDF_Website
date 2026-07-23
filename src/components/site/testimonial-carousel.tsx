"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Quote className="mx-auto mb-4 h-10 w-10 text-primary/30" />
      <blockquote className="mb-4 text-lg leading-relaxed text-foreground/90 md:text-xl">
        “{item.quote}”
      </blockquote>
      <p className="mb-6 text-sm font-semibold text-primary">{item.author}</p>
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIndex((index - 1 + items.length) % items.length)}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {index + 1} / {items.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIndex((index + 1) % items.length)}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
