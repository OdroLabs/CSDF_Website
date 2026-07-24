import { Curve } from "./curve";

export function PageHero({
  title,
  intro,
  eyebrow,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* Deep navy → brand gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800" />
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Cyan glow accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />

      <div className="container relative pb-20 pt-16 md:pb-28 md:pt-20">
        {eyebrow && (
          <p data-hero className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 data-hero className="text-3xl font-extrabold tracking-tight md:text-5xl">
          {title}
        </h1>
        {intro && (
          <p data-hero className="mt-4 max-w-2xl leading-relaxed text-white/75 md:text-lg">
            {intro}
          </p>
        )}
        <span data-hero className="mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-accent to-brand-400" />
      </div>

      <Curve className="absolute inset-x-0 bottom-0 text-background" />
    </section>
  );
}
