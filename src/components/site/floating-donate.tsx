import Link from "next/link";
import { Heart } from "lucide-react";

/**
 * Global floating "Donate Now" call to action.
 *
 * Rendered directly in the locale layout — outside <main>, the header and any
 * GSAP-animated or transformed container — so `position: fixed` always
 * resolves against the viewport. z-index sits above the header (z-40) and the
 * mobile menu, below only the scroll progress bar (z-90).
 */
export function FloatingDonate({ locale, label }: { locale: string; label: string }) {
  return (
    <div
      className="pointer-events-none fixed right-4 z-[80] md:bottom-6 md:right-6"
      style={{ bottom: "max(1rem, calc(0.75rem + env(safe-area-inset-bottom)))" }}
    >
      <Link
        href={`/${locale}/donate`}
        aria-label={label}
        className="group pointer-events-auto relative flex items-center gap-2.5 rounded-full bg-destructive py-3 pl-4 pr-5 text-sm font-bold text-white shadow-xl shadow-destructive/35 ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-2xl hover:shadow-destructive/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-safe:active:scale-95"
      >
        <span className="relative grid h-6 w-6 place-items-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 motion-safe:animate-ping [animation-duration:2.2s]" />
          <Heart className="relative h-4 w-4 fill-current" />
        </span>
        {label}
      </Link>
    </div>
  );
}
