import Link from "next/link";
import { Phone, Mail, MapPin, Heart, Facebook, Youtube, Instagram, Twitter, Linkedin, Music2 } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { buildNav, buildSocials } from "@/lib/nav";
import { s, show, type SettingsMap } from "@/lib/settings";
import { NewsletterForm } from "./newsletter-form";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
};

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
  const nav = buildNav(settings, dict);
  const socials = buildSocials(settings);

  const shortName = s(settings, "site_short_name");
  const logoImage = s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");

  const about = s(settings, "footer_about", locale);
  const address = s(settings, "address", locale);
  const phones = [s(settings, "phone"), s(settings, "phone2")].filter(Boolean);
  const emails = [s(settings, "email"), s(settings, "email2")].filter(Boolean);

  const newsletterTitle = s(settings, "footer_newsletter_title", locale);
  const newsletterText = s(settings, "footer_newsletter_text", locale);
  const copyright = s(settings, "footer_copyright", locale);
  const credit = s(settings, "footer_credit", locale);

  const showExplore = show(settings, "show_footer_explore", nav.explore);
  const showInvolved = show(settings, "show_footer_involved", nav.involved);
  const showSocial = show(settings, "show_footer_social", socials);
  const showNewsletter = show(settings, "show_footer_newsletter", newsletterTitle);

  // Columns actually rendered — used to keep the grid balanced.
  const columnCount =
    1 + Number(showExplore) + Number(showInvolved) + Number(showNewsletter);

  return (
    <footer id="sec-footer" className="relative bg-navy-950 text-white/90">
      {/* Brand gradient rule */}
      <div className="h-1 bg-gradient-to-r from-brand-600 via-accent to-destructive" />
      {/* Soft cyan glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div
        className={`container relative grid gap-10 py-16 md:grid-cols-2 ${
          columnCount >= 4 ? "lg:grid-cols-4" : columnCount === 3 ? "lg:grid-cols-3" : ""
        }`}
      >
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoImage} alt={shortName} className="h-10 w-auto max-w-[170px] object-contain" />
            ) : (
              <>
                {logoLetter && (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent text-lg font-bold shadow-lg shadow-accent/20">
                    {logoLetter}
                  </span>
                )}
                {shortName && (
                  <span className="text-xl font-extrabold tracking-tight">{shortName}</span>
                )}
              </>
            )}
          </div>

          {about && (
            <p className="mb-5 max-w-xs whitespace-pre-line text-sm leading-relaxed text-white/60">
              {about}
            </p>
          )}

          {(address || phones.length > 0 || emails.length > 0) && (
            <ul className="space-y-3 text-sm text-white/75">
              {address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              )}
              {phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-accent" /> {phone}
                  </a>
                </li>
              ))}
              {emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-accent" /> {email}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {showSocial && (
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                {dict.contact.followUs}
              </p>
              <div className="flex flex-wrap gap-2">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.key] ?? Heart;
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-accent hover:text-navy-950"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {showExplore && (
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
              {dict.footer.explore}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {nav.explore.map((l) => (
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
        )}

        {showInvolved && (
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
              {dict.footer.getInvolved}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {nav.involved.map((l) => (
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
        )}

        {showNewsletter && (
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
              {newsletterTitle}
            </h4>
            {newsletterText && (
              <p className="mb-3 text-sm leading-relaxed text-white/60">{newsletterText}</p>
            )}
            <NewsletterForm dict={dict} />
          </div>
        )}
      </div>

      {(copyright || credit) && (
        <div id="sec-footer-bottom" className="relative border-t border-white/10 py-5">
          <div className="container space-y-1 text-center text-xs text-white/50">
            {copyright && (
              <p className="flex flex-wrap items-center justify-center gap-1.5">
                © {year} {copyright}
                <Heart className="h-3 w-3 fill-destructive text-destructive" />
              </p>
            )}
            {credit && <p>{credit}</p>}
          </div>
        </div>
      )}
    </footer>
  );
}
