import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { buildSocials } from "@/lib/nav";
import { getSettings, s, show } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const mapEmbed = s(settings, "map_embed");
  const socials = buildSocials(settings);

  // Blank values drop out of the details panel entirely.
  const items = [
    { icon: MapPin, label: dict.contact.address, value: s(settings, "address", locale) },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone") },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone2") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email2") },
    { icon: Clock, label: dict.contact.hours, value: s(settings, "office_hours", locale) },
  ].filter((item) => item.value);

  const detailsTitle = s(settings, "contact_details_title", locale);
  const formTitle = s(settings, "contact_form_title", locale);
  const formNote = s(settings, "contact_form_note", locale);
  const successMessage = s(settings, "contact_success_message", locale);

  const showDetails = show(settings, "show_contact_details", items, socials);
  const showForm = show(settings, "show_contact_form");
  const showMap = show(settings, "show_contact_map", mapEmbed);

  return (
    <>
      <PageHero
        title={s(settings, "contact_hero_title", locale)}
        intro={s(settings, "contact_hero_intro", locale)}
        image={s(settings, "contact_hero_image") || undefined}
      />

      {(showDetails || showForm) && (
        <div
          className={`container grid gap-10 py-12 ${
            showDetails && showForm ? "lg:grid-cols-5" : ""
          }`}
        >
          {showDetails && (
            <div id="sec-details" className={`space-y-4 ${showForm ? "lg:col-span-2" : "max-w-xl"}`}>
              {detailsTitle && <h2 className="text-xl font-bold text-navy-900">{detailsTitle}</h2>}
              {items.map((item, i) => (
                <Card key={`${item.label}-${i}`}>
                  <CardContent className="flex items-start gap-3 pt-5">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">
                        {item.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {socials.length > 0 && (
                <Card>
                  <CardContent className="pt-5">
                    <p className="mb-2 text-sm font-semibold">{dict.contact.followUs}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {socials.map((social) => (
                        <a
                          key={social.key}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {showForm && (
            <div id="sec-form" className={showDetails ? "lg:col-span-3" : "mx-auto w-full max-w-2xl"}>
              {formTitle && <h2 className="mb-2 text-xl font-bold text-navy-900">{formTitle}</h2>}
              {formNote && (
                <p className="mb-4 whitespace-pre-line text-sm text-muted-foreground">{formNote}</p>
              )}
              <ContactForm dict={dict} successMessage={successMessage} />
            </div>
          )}
        </div>
      )}

      {showMap && (
        <div id="sec-map" className="container pb-12">
          <iframe
            src={mapEmbed}
            className="h-80 w-full rounded-xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          />
        </div>
      )}
    </>
  );
}
