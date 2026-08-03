import Image from "next/image";
import type { Metadata } from "next";
import { FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        {publications.map((pub) => (
          <StaggerItem key={pub.id} className="h-full">
            <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-border shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover">
              {pub.coverImage ? (
                <div className="relative h-44 w-full">
                  <Image src={pub.coverImage} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center bg-muted">
                  <FileText className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}
              <CardContent className="flex flex-1 flex-col pt-5">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">{categoryLabels[pub.category] ?? pub.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(pub.publishedAt, locale)}
                  </span>
                </div>
                <h2 className="mb-2 font-bold leading-snug tracking-tight">{loc(pub, "title", locale)}</h2>
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {loc(pub, "description", locale)}
                </p>
                {pub.fileUrl && (
                  <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                    <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" /> {dict.common.download}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
        {publications.length === 0 && (
          <EmptyState
            message={s(settings, "publications_empty_text", locale)}
          />
        )}
      </Stagger>
    </>
  );
}
