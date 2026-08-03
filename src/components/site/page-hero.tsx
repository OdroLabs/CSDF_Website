import { FadeIn, Parallax, TextReveal } from "./motion";

export function PageHero({
  title,
  intro,
  eyebrow,
  image,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  /** Optional background photo set in Site Settings. */
  image?: string;
}) {
  // Nothing set in the admin for this page header — render nothing at all.
  if (!title && !intro && !eyebrow) return null;

  return (
    <section
      id="sec-page-header"
      className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-secondary to-secondary text-white [clip-path:polygon(0_0,100%_0,100%_100%,0_calc(100%-32px))]"
    >
      {/* Optional photo, blended into the gradient */}
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <Parallax travel={24} className="h-full w-full scale-110">
            <div
              className="h-full w-full bg-cover bg-center opacity-25 mix-blend-luminosity"
              style={{ backgroundImage: `url(${image})` }}
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700/80 via-secondary/85 to-secondary" />
        </div>
      )}

      {/* Decorative soft glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="container relative pb-24 pt-20 md:pb-32 md:pt-28">
        {eyebrow && (
          <FadeIn immediate>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {eyebrow}
            </span>
          </FadeIn>
        )}
        {title && (
          <TextReveal
            as="h1"
            text={title}
            delay={0.08}
            className="mt-5 block max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl"
          />
        )}
        {intro && (
          <FadeIn immediate delay={0.16}>
            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-relaxed text-white/70 md:text-lg">
              {intro}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
