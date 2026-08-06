import type { LucideIcon } from "lucide-react";
import { FadeIn } from "./motion";

/** Alternating left/right story timeline with a connecting vertical line —
 *  used for "Communities We Serve" + "Our Story" instead of two flat,
 *  disconnected text blocks. */
export function Timeline({
  items,
}: {
  items: { icon: LucideIcon; title: string; text: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-border md:left-1/2" />
      <div className="space-y-10">
        {items.map((item, i) => {
          const Icon = item.icon;
          const rightSide = i % 2 === 1;
          const card = (
            <FadeIn
              className={`ml-12 rounded-3xl border border-border bg-white p-6 shadow-card md:ml-0 md:p-8 ${
                rightSide ? "" : "md:text-right"
              }`}
            >
              <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </FadeIn>
          );
          return (
            <div key={i} className="relative grid gap-2 md:grid-cols-2 md:gap-x-16">
              <span className="absolute left-4 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-white shadow-card md:left-1/2">
                <Icon className="h-3.5 w-3.5" />
              </span>
              {rightSide ? (
                <>
                  <div className="hidden md:block" />
                  {card}
                </>
              ) : (
                <>
                  {card}
                  <div className="hidden md:block" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
