"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLoader } from "./brand-loader";

const MIN_DISPLAY_MS = 2000;

/**
 * Branded splash shown for at least MIN_DISPLAY_MS on first load and on every
 * route change — independent of how fast the underlying data actually
 * resolves, so the loader is always visible instead of flashing by unseen.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <BrandLoader />
    </div>
  );
}
