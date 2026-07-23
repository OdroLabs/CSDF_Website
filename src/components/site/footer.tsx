import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
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

  return (
    <footer className="bg-[#1d1f34] text-white/90">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 font-bold">C</span>
            <span className="text-lg font-bold">CSDF</span>
          </div>
          <p className="mb-4 text-sm text-white/70">{s(settings, "site_tagline", locale)}</p>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="whitespace-pre-line">{s(settings, "address", locale)}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              {s(settings, "phone")}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              {s(settings, "email")}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{dict.footer.explore}</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {explore.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-white" href={`/${locale}${l.href}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{dict.footer.getInvolved}</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {involved.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-white" href={`/${locale}${l.href}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{dict.home.newsletter}</h4>
          <NewsletterForm dict={dict} />
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {year} CSDF. {dict.footer.rights}
      </div>
    </footer>
  );
}
