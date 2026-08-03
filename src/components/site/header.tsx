"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { GlobalSearch } from "./global-search";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";
import type { NavConfig, NavGroup, NavItem } from "@/lib/nav";

export interface HeaderProps {
  locale: string;
  dict: Dictionary;
  nav: NavConfig;
  /** Full organisation name, shown small under the wordmark. */
  siteName: string;
  /** Abbreviation used as the wordmark, e.g. CSDF. */
  shortName: string;
  logoImage?: string;
  logoLetter: string;
  phones: string[];
  emails: string[];
  donateLabel: string;
  announceText?: string;
  announceLink?: string;
  showTopbar: boolean;
  showLangs: boolean;
  showDonate: boolean;
}

export function SiteHeader({
  locale,
  dict,
  nav,
  siteName,
  shortName,
  logoImage,
  logoLetter,
  phones,
  emails,
  donateLabel,
  announceText,
  announceLink,
  showTopbar,
  showLangs,
  showDonate,
}: HeaderProps) {
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

  const { primary, groups, contact } = nav;
  const hasContactStrip = phones.length > 0 || emails.length > 0;

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return href === "" ? pathname === `/${locale}` : pathname.startsWith(full);
  };
  const isGroupActive = (group: NavGroup) => group.items.some((i) => isActive(i.href));

  const pillClass = (active: boolean) =>
    cn(
      "relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200",
      active ? "bg-muted text-primary" : "text-foreground/65 hover:bg-muted hover:text-foreground"
    );

  const pillUnderline = (active: boolean) => (
    <span
      className={cn(
        "absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-primary transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0"
      )}
    />
  );

  const mobileLink = (link: NavItem) => {
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
            ? "bg-muted text-primary"
            : "text-foreground/75 hover:bg-muted hover:text-primary"
        )}
      >
        {link.label}
        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </Link>
    );
  };

  const mobileItems = contact ? [...primary, contact] : primary;

  return (
    <>
      {/* Announcement bar — hidden when no text is set in the admin */}
      {announceText && (
        <div id="sec-announce" className="bg-secondary text-white">
          <div className="mx-auto max-w-8xl px-4 py-2 text-center text-xs font-medium tracking-tight md:px-6">
            {announceLink ? (
              <Link href={announceLink} className="hover:underline">
                {announceText}
              </Link>
            ) : (
              announceText
            )}
          </div>
        </div>
      )}

      {/* Utility strip — hidden when switched off, or when there is nothing to show */}
      {showTopbar && (hasContactStrip || showLangs) && (
        <div id="sec-topbar" className="hidden bg-secondary text-white md:block">
          <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-2 text-xs md:px-6">
            <div className="flex items-center gap-6 text-white/70">
              {phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 text-accent" /> {phone}
                </a>
              ))}
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 text-accent" /> {email}
                </a>
              ))}
            </div>
            {showLangs && <LocaleSwitcher current={locale} dark />}
          </div>
        </div>
      )}

      {/* Sticky nav */}
      <header
        id="sec-header"
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-border bg-white/90 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/80"
            : "border-transparent bg-white"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-8xl items-center justify-between gap-6 px-4 transition-[padding] duration-300 md:px-6",
            scrolled ? "py-3" : "py-4"
          )}
        >
          <Link href={`/${locale}`} className="group flex shrink-0 items-center gap-2.5">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoImage}
                alt={siteName || shortName}
                className="h-9 w-auto max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              logoLetter && (
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-white transition-transform duration-300 group-hover:scale-105">
                  {logoLetter}
                </span>
              )
            )}
            {/* Wordmark text is redundant once an uploaded logo image already carries the brand name */}
            {!logoImage && (shortName || siteName) && (
              <span className="leading-tight">
                {shortName && (
                  <span className="block text-[15px] font-bold tracking-tight text-foreground">
                    {shortName}
                  </span>
                )}
                {siteName && (
                  <span className="block max-w-[220px] truncate text-[11px] text-muted-foreground">
                    {siteName}
                  </span>
                )}
              </span>
            )}
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
                    <div className="min-w-[230px] overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-card">
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
                                ? "bg-muted text-primary"
                                : "text-foreground/75 hover:bg-muted hover:text-primary"
                            )}
                          >
                            {item.label}
                            {itemActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {contact && (
              <Link
                href={`/${locale}${contact.href}`}
                aria-current={isActive(contact.href) ? "page" : undefined}
                className={pillClass(isActive(contact.href))}
              >
                {contact.label}
                {pillUnderline(isActive(contact.href))}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-3">
            <GlobalSearch locale={locale} dict={dict} />
            {showDonate && donateLabel && (
              <Button
                asChild
                size="sm"
                className="hidden bg-destructive px-5 hover:bg-destructive/90 md:inline-flex"
              >
                <Link href={`/${locale}/donate`}>
                  <Heart className="h-4 w-4 fill-current" /> {donateLabel}
                </Link>
              </Button>
            )}
            <button
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-muted lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={dict.nav.menu}
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
              "absolute inset-x-0 top-0 h-screen bg-foreground/40 transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Panel */}
          <nav
            aria-label="Mobile"
            className={cn(
              "relative max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-b-3xl border-b border-border bg-white shadow-pop transition-all duration-300 ease-out",
              open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            )}
          >
            <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
              <div className="grid gap-1 sm:grid-cols-2">{mobileItems.map(mobileLink)}</div>

              {groups.map((group) => (
                <div key={group.label} className="mt-3 border-t pt-3">
                  <p className="px-4 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="grid gap-1 sm:grid-cols-2">{group.items.map(mobileLink)}</div>
                </div>
              ))}

              {(showLangs || (showDonate && donateLabel)) && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  {showLangs && <LocaleSwitcher current={locale} />}
                  {showDonate && donateLabel && (
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-destructive px-6 font-bold hover:bg-destructive/90"
                    >
                      <Link href={`/${locale}/donate`} onClick={() => setOpen(false)}>
                        <Heart className="h-4 w-4 fill-current" /> {donateLabel}
                      </Link>
                    </Button>
                  )}
                </div>
              )}

              {hasContactStrip && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 hover:text-primary"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" /> {phone}
                    </a>
                  ))}
                  {emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="flex items-center gap-1.5 hover:text-primary"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary" /> {email}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
