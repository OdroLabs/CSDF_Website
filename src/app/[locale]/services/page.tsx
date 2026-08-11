import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
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

  return (
    <>
      <PageHero
        title={s(settings, "services_hero_title", locale)}
        intro={s(settings, "services_hero_intro", locale)}
        image={s(settings, "services_hero_image") || undefined}
      />
      <Stagger className="container grid gap-6 py-16 sm:grid-cols-2 md:py-24 lg:grid-cols-4">
        {services.map((service) => (
          <StaggerItem key={service.id} className="h-full">
            <Link
              href={`/${locale}/services/${service.slug ?? service.id}`}
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              {service.image ? (
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />

              {/* Top row — icon badge and a link-out affordance, like a floating app card */}
              <div className="relative flex items-center justify-between p-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg text-white ring-1 ring-white/20 backdrop-blur-md">
                  {service.icon || <Sparkles className="h-5 w-5" />}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-secondary transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              {/* Bottom text */}
              <div className="relative mt-auto flex flex-col gap-1.5 p-6 text-white">
                <h2 className="text-lg font-bold leading-snug md:text-xl">
                  {loc(service, "title", locale)}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-white/75">
                  {loc(service, "description", locale)}
                </p>
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
