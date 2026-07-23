"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = { en: "English", si: "සිංහල", ta: "தமிழ்" };

export function LocaleSwitcher({ current, dark }: { current: string; dark?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: string) {
    const parts = pathname.split("/");
    parts[1] = locale;
    router.push(parts.join("/") || `/${locale}`);
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && (
            <span className={dark ? "text-white/30" : "text-muted-foreground/50"}>|</span>
          )}
          <button
            onClick={() => switchTo(l)}
            className={cn(
              "rounded px-1.5 py-0.5 transition-colors",
              dark
                ? cn("hover:text-white", current === l ? "font-bold text-accent" : "text-white/70")
                : cn(
                    "hover:text-primary",
                    current === l ? "font-bold text-primary" : "text-muted-foreground"
                  )
            )}
          >
            {labels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
