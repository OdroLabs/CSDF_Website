import Link from "next/link";
import { Phone, Mail, MapPin, Heart } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { SettingsMap } from "@/lib/settings";
import { s } from "@/lib/settings";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter({
  locale,
  dict,
  settings,
}: {
  locale: string;
  dict: Dictionary;
  settings: SettingsMap;
}) {
  const year = new Date().getFullYear();
  const explore = [
    { href: "/about", label: dict.nav.about },
    { href: "/projects", label: dict.nav.projects },
    { href: "/services", label: dict.nav.services },
    { href: "/publications", label: dict.nav.publications },
  ];
  const involved = [
    { href: "/events", label: dict.nav.events },
    { href: "/business", label: dict.nav.business },
    { href: "/donate", label: dict.nav.donate },
    { href: "/contact", label: dict.nav.contact },
  ];
  const phone = s(settings, "phone");
  const email = s(settings, "email");

  return (
    <footer className="relative bg-navy-950 text-white/90">
      {/* Brand gradient rule */}
      <div className="h-1 bg-gradient-to-r from-brand-600 via-accent to-destructive" />
      {/* Soft cyan glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent text-lg font-bold shadow-lg shadow-accent/20">
              C
            </span>
            <span className="text-xl font-extrabold tracking-tight">CSDF</span>
          </div>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-white/60">
            {s(settings, "site_tagline", locale)}
          </p>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="whitespace-pre-line">{s(settings, "address", locale)}</span>
            </li>
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" /> {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" /> {email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
            {dict.footer.explore}
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {explore.map((l) => (
              <li key={l.href}>
                <Link
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                  href={`/${locale}${l.href}`}
                >
                  <span className="h-px w-3 bg-accent/50" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
            {dict.footer.getInvolved}
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {involved.map((l) => (
              <li key={l.href}>
                <Link
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                  href={`/${locale}${l.href}`}
                >
                  <span className="h-px w-3 bg-accent/50" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
            {dict.home.newsletter}
          </h4>
          <NewsletterForm dict={dict} />
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5">
        <p className="container flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-white/50">
          © {year} CSDF. {dict.footer.rights}
          <Heart className="h-3 w-3 fill-destructive text-destructive" />
        </p>
      </div>
    </footer>
  );
}
