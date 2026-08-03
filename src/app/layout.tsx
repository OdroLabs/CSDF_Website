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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
