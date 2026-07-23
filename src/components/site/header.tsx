"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";

export function SiteHeader({
  locale,
  dict,
  siteName,
}: {
  locale: string;
  dict: Dictionary;
  siteName: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent over the hero only on the homepage before scrolling (and while menu closed)
  const transparent = isHome && !scrolled && !open;

  const links = [
    { href: "", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/projects", label: dict.nav.projects },
    { href: "/services", label: dict.nav.services },
    { href: "/publications", label: dict.nav.publications },
    { href: "/news", label: dict.nav.news },
    { href: "/events", label: dict.nav.events },
    { href: "/business", label: dict.nav.business },
    { href: "/suggestions", label: dict.nav.suggestions },
    { href: "/contact", label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return href === "" ? pathname === `/${locale}` : pathname.startsWith(full);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-300",
          transparent
            ? "border-transparent bg-transparent"
            : "border-b bg-white/95 shadow-sm backdrop-blur"
        )}
      >
        <div className="container flex items-center justify-between py-2">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 text-lg font-bold text-white shadow-md">
              C
            </span>
            <span className="leading-tight">
              <span
                className={cn(
                  "block text-lg font-extrabold tracking-tight",
                  transparent ? "text-white" : "text-primary"
                )}
              >
                CSDF
              </span>
              <span
                className={cn(
                  "block text-[11px]",
                  transparent ? "text-white/75" : "text-muted-foreground"
                )}
              >
                {siteName}
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-4 lg:flex">
            <LocaleSwitcher current={locale} />
            <Button asChild size="sm" className="rounded-full bg-destructive hover:bg-destructive/90">
              <Link href={`/${locale}/donate`}>
                <Heart className="h-4 w-4" /> {dict.nav.donate}
              </Link>
            </Button>
          </div>
          <button
            className={cn("lg:hidden", transparent && "text-white")}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <nav
          className={cn(
            "lg:block",
            open ? "block border-t bg-white" : "hidden",
            !transparent && "lg:border-t lg:bg-transparent",
            transparent ? "lg:border-t lg:border-white/15" : ""
          )}
        >
          <div className="container flex flex-col gap-1 py-2 lg:flex-row lg:items-center lg:gap-5 lg:py-0">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-2 text-sm font-semibold transition-colors lg:border-b-2 lg:py-3",
                  transparent
                    ? cn(
                        "lg:hover:text-white",
                        isActive(link.href)
                          ? "text-primary lg:border-accent lg:text-white"
                          : "text-foreground/80 lg:border-transparent lg:text-white/80"
                      )
                    : cn(
                        "hover:text-primary",
                        isActive(link.href)
                          ? "text-primary lg:border-primary"
                          : "text-foreground/80 lg:border-transparent"
                      )
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 py-2 lg:hidden">
              <LocaleSwitcher current={locale} />
              <Button asChild size="sm" className="rounded-full bg-destructive hover:bg-destructive/90">
                <Link href={`/${locale}/donate`}>{dict.nav.donate}</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>
      {/* Spacer keeps content below the fixed header on non-home pages */}
      {!isHome && <div className="h-[57px] lg:h-[103px]" />}
    </>
  );
}
