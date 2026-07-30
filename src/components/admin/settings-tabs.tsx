"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SettingsTab {
  slug: string;
  title: string;
}

/**
 * Tabs are passed in from the server page rather than imported from
 * `@/lib/settings`, which reaches for Prisma and must not enter the browser
 * bundle.
 */
export function SettingsTabs({ tabs }: { tabs: SettingsTab[] }) {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-1.5 border-b pb-3">
      {tabs.map((tab) => {
        const href = `/admin/settings/${tab.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.title}
          </Link>
        );
      })}
    </nav>
  );
}
