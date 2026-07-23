import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const settings = await getSettings();
  const mapEmbed = s(settings, "map_embed");

  const items = [
    { icon: MapPin, label: dict.contact.address, value: s(settings, "address", locale) },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email") },
    { icon: Clock, label: dict.contact.hours, value: s(settings, "office_hours", locale) },
  ];

  return (
    <>
      <PageHero title={dict.contact.title} intro={dict.contact.intro} />
      <div className="container grid gap-10 py-12 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {items.map(
            (item) =>
              item.value && (
                <Card key={item.label}>
                  <CardContent className="flex items-start gap-3 pt-5">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              )
          )}
        </div>
        <div className="lg:col-span-3">
          <ContactForm dict={dict} />
        </div>
      </div>
      {mapEmbed && (
        <div className="container pb-12">
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
