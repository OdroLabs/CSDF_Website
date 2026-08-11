import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { Stagger, StaggerItem } from "@/components/site/motion";

const categoryLabels: Record<string, string> = {
  research: "Research",
  report: "Report",
  annual: "Annual Report",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "publications_hero_title", locale) || siteName || undefined;
  const description = s(settings, "publications_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function PublicationsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [settings, publications] = await Promise.all([
    getSettings(),
    prisma.publication.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "publications_hero_title", locale)}
        intro={s(settings, "publications_hero_intro", locale)}
        image={s(settings, "publications_hero_image") || undefined}
      />
      <Stagger className="container grid gap-6 py-16 sm:grid-cols-2 md:py-24 lg:grid-cols-3">
        {publications.map((pub) => {
          const href = `/${locale}/publications/${pub.slug ?? pub.id}`;
          return (
            <StaggerItem key={pub.id} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <Link href={href} className="relative m-3 mb-0 block aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {pub.coverImage ? (
                    <Image
                      src={pub.coverImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h2 className="font-bold leading-snug tracking-tight text-foreground">
                      <Link href={href} className="transition-colors hover:text-primary">
                        {loc(pub, "title", locale)}
                      </Link>
                    </h2>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground">
                      {categoryLabels[pub.category] ?? pub.category}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">{formatDate(pub.publishedAt, locale)}</p>
                  <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {loc(pub, "description", locale)}
                  </p>
                </div>
                <Link
                  href={href}
                  className="block bg-secondary py-4 text-center text-sm font-semibold text-white transition-colors group-hover:bg-secondary/90"
                >
                  {dict.common.readMore}
                </Link>
              </div>
            </StaggerItem>
          );
        })}
        {publications.length === 0 && (
          <EmptyState
            message={s(settings, "publications_empty_text", locale)}
          />
        )}
      </Stagger>
    </>
  );
}
