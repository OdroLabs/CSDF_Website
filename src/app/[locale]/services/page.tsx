import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";

export default async function ServicesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHero title={dict.nav.services} />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            {service.image && (
              <div className="relative h-44 w-full">
                <Image src={service.image} alt="" fill className="object-cover" />
              </div>
            )}
            <CardContent className="pt-6">
              {service.icon && <div className="mb-3 text-3xl">{service.icon}</div>}
              <h2 className="mb-2 text-lg font-bold">{loc(service, "title", locale)}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {loc(service, "description", locale)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
