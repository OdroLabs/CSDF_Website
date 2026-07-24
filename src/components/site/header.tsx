"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; items: NavLink[] };

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

  // Close the menu on route change and lock body scroll while open
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const primary: NavLink[] = [
    { href: "", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/projects", label: dict.nav.projects },
    { href: "/services", label: dict.nav.services },
  ];
  const groups: NavGroup[] = [
    {
      label: dict.nav.media,
      items: [
        { href: "/publications", label: dict.nav.publications },
        { href: "/news", label: dict.nav.news },
        { href: "/events", label: dict.nav.events },
      ],
    },
    {
      label: dict.footer.getInvolved,
      items: [
        { href: "/business", label: dict.nav.business },
        { href: "/suggestions", label: dict.nav.suggestions },
      ],
    },
  ];
  const contactLink: NavLink = { href: "/contact", label: dict.nav.contact };

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return href === "" ? pathname === `/${locale}` : pathname.startsWith(full);
  };
  const isGroupActive = (group: NavGroup) => group.items.some((i) => isActive(i.href));

  const pillClass = (active: boolean) =>
    cn(
      "relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors duration-200",
      active ? "bg-brand-50 text-primary" : "text-foreground/70 hover:bg-muted hover:text-primary"
    );

  const pillUnderline = (active: boolean) => (
    <span
      className={cn(
        "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-primary to-accent transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0"
      )}
    />
  );

  const mobileLink = (link: NavLink) => {
    const active = isActive(link.href);
    return (
      <Link
        key={link.href}
        href={`/${locale}${link.href}`}
        onClick={() => setOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
          active
            ? "bg-brand-50 text-primary"
            : "text-foreground/80 hover:bg-muted hover:text-primary"
        )}
      >
        {link.label}
        {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
      </Link>
    );
  };

  return (
    <>
      {/* Utility strip */}
      <div className="hidden bg-navy-950 text-white md:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2 text-xs md:px-6">
          <div className="flex items-center gap-6 text-white/75">
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

      {/* Sticky glass nav */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-border/80 bg-white/85 shadow-lg shadow-navy-950/[0.06] backdrop-blur-xl supports-[backdrop-filter]:bg-white/75"
            : "border-transparent bg-white"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 transition-[padding] duration-300 md:px-6",
            scrolled ? "py-2" : "py-3"
          )}
        >
          <Link href={`/${locale}`} className="group flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent text-lg font-bold text-white shadow-md shadow-brand-600/25 transition-transform duration-300 group-hover:scale-105">
              C
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-navy-900">
                CSDF
              </span>
              <span className="block max-w-[220px] truncate text-[10px] text-muted-foreground">
                {siteName}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {primary.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  aria-current={active ? "page" : undefined}
                  className={pillClass(active)}
                >
                  {link.label}
                  {pillUnderline(active)}
                </Link>
              );
            })}

            {/* Dropdown groups */}
            {groups.map((group) => {
              const active = isGroupActive(group);
              return (
                <div key={group.label} className="group/nav relative">
                  <button type="button" aria-haspopup="true" className={pillClass(active)}>
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover/nav:rotate-180" />
                    {pillUnderline(active)}
                  </button>
                  {/* pt-2 bridges the hover gap between pill and panel */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                    <div className="min-w-[230px] overflow-hidden rounded-2xl border border-border bg-white/95 p-2 shadow-xl shadow-navy-950/10 backdrop-blur-xl">
                      {group.items.map((item) => {
                        const itemActive = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={`/${locale}${item.href}`}
                            aria-current={itemActive ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
                              itemActive
                                ? "bg-brand-50 text-primary"
                                : "text-foreground/75 hover:bg-muted hover:text-primary"
                            )}
                          >
                            {item.label}
                            {itemActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              href={`/${locale}${contactLink.href}`}
              aria-current={isActive(contactLink.href) ? "page" : undefined}
              className={pillClass(isActive(contactLink.href))}
            >
              {contactLink.label}
              {pillUnderline(isActive(contactLink.href))}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="hidden rounded-full bg-destructive px-5 font-bold hover:bg-destructive/90 md:inline-flex"
            >
              <Link href={`/${locale}/donate`}>
                <Heart className="h-4 w-4 fill-current" /> {dict.nav.donate}
              </Link>
            </Button>
            <button
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-muted lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — overlay panel anchored below the sticky bar */}
        <div
          className={cn(
            "absolute inset-x-0 top-full lg:hidden",
            open ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          {/* Backdrop (starts at the bottom edge of the header) */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className={cn(
              "absolute inset-x-0 top-0 h-screen bg-navy-950/45 backdrop-blur-sm transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Panel */}
          <nav
            aria-label="Mobile"
            className={cn(
              "relative max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-b-3xl border-b border-border bg-white shadow-2xl shadow-navy-950/20 transition-all duration-300 ease-out",
              open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            )}
          >
            <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
              <div className="grid gap-1 sm:grid-cols-2">
                {[...primary, contactLink].map(mobileLink)}
              </div>

              {groups.map((group) => (
                <div key={group.label} className="mt-3 border-t pt-3">
                  <p className="px-4 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="grid gap-1 sm:grid-cols-2">{group.items.map(mobileLink)}</div>
                </div>
              ))}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <LocaleSwitcher current={locale} />
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-destructive px-6 font-bold hover:bg-destructive/90"
                >
                  <Link href={`/${locale}/donate`} onClick={() => setOpen(false)}>
                    <Heart className="h-4 w-4 fill-current" /> {dict.nav.donate}
                  </Link>
                </Button>
              </div>
              {(phone || email) && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
                  {phone && (
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-primary">
                      <Phone className="h-3.5 w-3.5 text-primary" /> {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-primary">
                      <Mail className="h-3.5 w-3.5 text-primary" /> {email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
