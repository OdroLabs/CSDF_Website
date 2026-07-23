import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CSDF — Community Strength Development Foundation",
    template: "%s | CSDF",
  },
  description:
    "CSDF improves health, safety, dignity, and rights through community-led support, advocacy, and education.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
