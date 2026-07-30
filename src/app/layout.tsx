import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Bare fallback only. The public site's real title, description, favicon and
 * share image come from Site Settings → General and are applied in
 * `src/app/[locale]/layout.tsx`.
 */
export const metadata: Metadata = {
  title: "CSDF",
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
const animBootstrap = `try{var p=new URLSearchParams(location.search);if(!p.has("adminPreview")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("anim")}catch(e){}`;

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
