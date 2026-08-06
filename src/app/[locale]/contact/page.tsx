import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { buildSocials } from "@/lib/nav";
import { getSettings, s, show } from "@/lib/settings";
import { extractIframeSrc } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { FadeIn, Stagger, StaggerItem, Parallax } from "@/components/site/motion";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "contact_hero_title", locale) || siteName || undefined;
  const description = s(settings, "contact_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const address = s(settings, "address", locale);
  // A custom embed URL (from a Google Maps "Share > Embed a map" iframe) always
  // wins; otherwise fall back to a map generated straight from the address so
  // admins don't have to touch iframe HTML just to get a pin on the page.
  const customMapEmbed = extractIframeSrc(s(settings, "map_embed"));
  const mapEmbed = customMapEmbed || (address ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : "");
  const socials = buildSocials(settings);

  // Blank values drop out of the details panel entirely.
  const items = [
    { icon: MapPin, label: dict.contact.address, value: address },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone") },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone2") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email2") },
    { icon: Clock, label: dict.contact.hours, value: s(settings, "office_hours", locale) },
  ].filter((item) => item.value);

  const detailsTitle = s(settings, "contact_details_title", locale);
  const detailsText = s(settings, "contact_details_text", locale);
  const formTitle = s(settings, "contact_form_title", locale);
  const formNote = s(settings, "contact_form_note", locale);
  const successMessage = s(settings, "contact_success_message", locale);
  const bannerImage = s(settings, "contact_banner_image");

  const showDetails = show(settings, "show_contact_details", items, socials);
  const showForm = show(settings, "show_contact_form");
  const showMap = show(settings, "show_contact_map", mapEmbed);
  const showBanner = Boolean(bannerImage);

  return (
    <>
      <PageHero
        title={s(settings, "contact_hero_title", locale)}
        intro={s(settings, "contact_hero_intro", locale)}
        image={s(settings, "contact_hero_image") || undefined}
        breadcrumb={{ homeHref: `/${locale}`, homeLabel: dict.nav.home, currentLabel: dict.nav.contact }}
      />

      {(showDetails || showForm) && (
        <div
          className={`container grid gap-8 py-16 md:py-24 ${
            showDetails && showForm ? "lg:grid-cols-5" : ""
          }`}
        >
          {showDetails && (
            <FadeIn
              id="sec-details"
              className={`rounded-3xl bg-secondary p-8 text-white shadow-pop md:p-10 ${
                showForm ? "lg:col-span-2" : "max-w-xl"
              }`}
            >
              {detailsTitle && (
                <h2 className="text-2xl font-bold leading-tight">{detailsTitle}</h2>
              )}
              {detailsText && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70">
                  {detailsText}
                </p>
              )}
              <Stagger className="mt-8 space-y-5">
                {items.map((item, i) => (
                  <StaggerItem key={`${item.label}-${i}`}>
                    <div className="flex items-start gap-3">
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="whitespace-pre-line text-sm text-white/85">{item.value}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
              {socials.length > 0 && (
                <div className="mt-8 flex gap-3 border-t border-white/10 pt-6">
                  {socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.key] ?? Share2;
                    return (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </FadeIn>
          )}

          {showForm && (
            <div id="sec-form" className={showDetails ? "lg:col-span-3" : "mx-auto w-full max-w-2xl"}>
              <FadeIn delay={0.08} className="rounded-3xl border border-border bg-white p-6 shadow-card md:p-10">
                {formTitle && (
                  <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">{formTitle}</h2>
                )}
                {formNote && (
                  <p className="mb-6 whitespace-pre-line text-sm text-muted-foreground">{formNote}</p>
                )}
                <ContactForm dict={dict} successMessage={successMessage} />
              </FadeIn>
            </div>
          )}
        </div>
      )}

      {showMap && (
        <div id="sec-map" className="container pb-16 md:pb-24">
          <FadeIn className="overflow-hidden rounded-2xl border border-border shadow-card">
            <iframe
              src={mapEmbed}
              className="h-[28rem] w-full border-0 md:h-[36rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            />
          </FadeIn>
        </div>
      )}

      {showBanner && (
        <div id="sec-banner" className="container pb-16 md:pb-24">
          <FadeIn className="relative aspect-[21/9] overflow-hidden rounded-3xl shadow-card">
            <Parallax travel={20} className="h-full w-full scale-110">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerImage})` }}
              />
            </Parallax>
          </FadeIn>
        </div>
      )}
    </>
  );
}
