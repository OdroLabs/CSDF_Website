import { Parallax } from "./motion";

/**
 * Shared visual layer behind every page-header banner — the same recipe as
 * the homepage hero (bg-secondary base, duotone gradient, accent/primary
 * glow blobs) plus a curved wave along the bottom edge so the page content
 * below flows out of the header instead of just stopping. Used by PageHero
 * and the article/publication detail banners so every header on the site
 * matches the homepage.
 */
export function HeroBackdrop({ image }: { image?: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-secondary" />

      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <Parallax travel={24} className="h-full w-full scale-110">
            <div
              className="h-full w-full bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${image})` }}
            />
          </Parallax>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary via-secondary/85 to-primary/50 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-secondary/25" />
        </div>
      )}

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />

      {/* Wave divider into the page content below */}
      <svg
        className="absolute bottom-0 left-0 h-10 w-full text-background md:h-16"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,40 C360,140 1080,-20 1440,60 L1440,120 L0,120 Z" />
      </svg>
    </>
  );
}
