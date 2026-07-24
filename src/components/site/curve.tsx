import { cn } from "@/lib/utils";

/**
 * Curved section divider. Renders in currentColor — set the text color to the
 * color of the band it belongs to (e.g. `text-navy-950` above a navy band).
 */
export function Curve({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block h-10 w-full fill-current md:h-[72px]", flip && "rotate-180", className)}
    >
      <path d="M0,72 L0,40 C240,4 480,0 720,14 C960,28 1200,64 1440,30 L1440,72 Z" />
    </svg>
  );
}
