import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeIn, TextReveal } from "./motion";
import { HeroBackdrop } from "./hero-backdrop";

export function PageHero({
  title,
  intro,
  eyebrow,
  image,
  breadcrumb,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  /** Optional background photo set in Site Settings. */
  image?: string;
  /** Optional "Home / Current page" trail above the title. */
  breadcrumb?: { homeHref: string; homeLabel: string; currentLabel: string };
}) {
  // Nothing set in the admin for this page header — render nothing at all.
  if (!title && !intro && !eyebrow) return null;

  return (
    <section id="sec-page-header" className="relative overflow-hidden text-white">
      <HeroBackdrop image={image} />

      <div className="container relative pb-20 pt-20 md:pb-28 md:pt-28">
        {breadcrumb && (
          <FadeIn immediate>
            <nav className="mb-4 flex items-center gap-1.5 text-xs font-medium text-white/60">
              <Link href={breadcrumb.homeHref} className="hover:text-white">
                {breadcrumb.homeLabel}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/85">{breadcrumb.currentLabel}</span>
            </nav>
          </FadeIn>
        )}
        {eyebrow && (
          <FadeIn immediate>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {eyebrow}
            </span>
          </FadeIn>
        )}
        {title && (
          <TextReveal
            as="h1"
            text={title}
            delay={0.08}
            className="hero-title mt-5 block max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl"
          />
        )}
        {intro && (
          <FadeIn immediate delay={0.16}>
            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-relaxed text-white/80 md:text-lg">
              {intro}
            </p>
          </FadeIn>
        )}
        <FadeIn immediate delay={0.22}>
          <span className="mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-white to-white/30" />
        </FadeIn>
      </div>
    </section>
  );
}
