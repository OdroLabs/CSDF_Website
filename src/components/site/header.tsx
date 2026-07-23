"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";

export function SiteHeader({
  locale,
  dict,
  siteName,
  phone,
  email,
}: {
  locale: string;
  dict: Dictionary;
  siteName: string;
  phone?: string;
  email?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* Dark top strip */}
      <div className="hidden bg-brand-950 text-white md:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2 text-xs md:px-6">
          <div className="flex items-center gap-6 text-white/80">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5 text-accent" /> {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-accent" /> {email}
              </a>
            )}
          </div>
          <LocaleSwitcher current={locale} dark />
        </div>
      </div>

      {/* Solid white sticky bar */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white transition-shadow",
          scrolled && "shadow-md shadow-brand-950/5"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 py-3 md:px-6">
          <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-500 text-lg font-bold text-white shadow-sm">
              C
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-brand-800">
                CSDF
              </span>
              <span className="block max-w-[220px] truncate text-[10px] text-muted-foreground">
                {siteName}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cn(
                  "relative py-1.5 text-[13px] font-bold transition-colors hover:text-primary",
                  isActive(link.href)
                    ? "text-primary after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-foreground/75"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="hidden rounded-md bg-destructive px-5 font-bold hover:bg-destructive/90 md:inline-flex"
            >
              <Link href={`/${locale}/donate`}>
                <Heart className="h-4 w-4" /> {dict.nav.donate}
              </Link>
            </Button>
            <button
              className="xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible menu below xl */}
        {open && (
          <nav className="border-t bg-white xl:hidden">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-3 md:px-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:bg-muted hover:text-primary",
                    isActive(link.href) ? "text-primary" : "text-foreground/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-3 border-t px-2 pt-3">
                <LocaleSwitcher current={locale} />
                <Button
                  asChild
                  size="sm"
                  className="rounded-md bg-destructive px-5 font-bold hover:bg-destructive/90 md:hidden"
                >
                  <Link href={`/${locale}/donate`} onClick={() => setOpen(false)}>
                    <Heart className="h-4 w-4" /> {dict.nav.donate}
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
