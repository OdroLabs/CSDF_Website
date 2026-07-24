import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CSDF — Community Strength Development Foundation",
    template: "%s | CSDF",
  },
  description:
    "CSDF improves health, safety, dignity, and rights through community-led support, advocacy, and education.",
};

export const viewport: Viewport = {
  themeColor: "#051225",
  viewportFit: "cover",
};

/**
 * Adds the `anim` class before first paint so GSAP-animated elements start
 * hidden without a flash — but only when JS runs and the user has not asked
 * for reduced motion. Without JS (or with reduced motion) content stays fully
 * visible.
 */
const animBootstrap = `try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("anim")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: animBootstrap }} />
        {children}
      </body>
    </html>
  );
}
