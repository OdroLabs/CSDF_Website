import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { Stagger, StaggerItem } from "@/components/site/motion";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "services_hero_title", locale) || siteName || undefined;
  const description = s(settings, "services_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function ServicesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [settings, services] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "services_hero_title", locale)}
        intro={s(settings, "services_hero_intro", locale)}
        image={s(settings, "services_hero_image") || undefined}
      />
      <Stagger className="container grid gap-6 py-16 sm:grid-cols-2 md:py-24 lg:grid-cols-3">
        {services.map((service) => (
          <StaggerItem key={service.id} className="h-full">
            <Link
              href={`/${locale}/services/${service.slug ?? service.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
            >
              {service.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {service.icon && (
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">
                    {service.icon}
                  </span>
                )}
                <h2 className="mb-2 text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {loc(service, "title", locale)}
                </h2>
                <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {loc(service, "description", locale)}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {dict.common.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
        {services.length === 0 && (
          <EmptyState
            message={s(settings, "services_empty_text", locale)}
          />
        )}
      </Stagger>
    </>
  );
}
