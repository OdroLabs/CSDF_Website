"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global GSAP + ScrollTrigger driver. Mounted once in the locale layout and
 * re-initialised on every route change.
 *
 * Declarative markers (usable from server components):
 *   data-hero            → entrance timeline on page load (staggered)
 *   data-animate         → fade-up when scrolled into view (data-delay="0.15" optional)
 *   data-stagger         → direct children fade-up with a stagger
 *   data-parallax="14"   → vertical parallax, number = yPercent travel
 *
 * Reduced motion: the `anim` class on <html> is only added when the user has
 * no reduced-motion preference (see root layout inline script). Here we use
 * gsap.matchMedia so animations are also reverted live if the OS setting
 * changes mid-session.
 */
export function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.documentElement.classList.add("anim");

      // Hero entrance — runs immediately on page load
      const heroEls = gsap.utils.toArray<HTMLElement>("[data-hero]");
      if (heroEls.length) {
        gsap.fromTo(
          heroEls,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.1,
            overwrite: "auto",
            clearProps: "transform",
          }
        );
      }

      // Single-element fade-up reveals
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: parseFloat(el.dataset.delay ?? "0"),
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // Staggered card grids
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.fromTo(
          Array.from(group.children),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.09,
            clearProps: "transform",
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          }
        );
      });

      // Image parallax (element should be slightly oversized to avoid gaps)
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const travel = parseFloat(el.dataset.parallax || "12");
        gsap.fromTo(
          el,
          { yPercent: -travel },
          {
            yPercent: travel,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      return () => {
        document.documentElement.classList.remove("anim");
      };
    });

    // Reduced motion: make sure nothing stays hidden
    mm.add("(prefers-reduced-motion: reduce)", () => {
      document.documentElement.classList.remove("anim");
    });

    // Recalculate trigger positions once images/fonts settle
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
