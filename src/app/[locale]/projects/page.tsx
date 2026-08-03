import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  const title = s(settings, "projects_hero_title", locale) || siteName || undefined;
  const description = s(settings, "projects_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function ProjectsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [settings, projects] = await Promise.all([
    getSettings(),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "projects_hero_title", locale)}
        intro={s(settings, "projects_hero_intro", locale)}
        image={s(settings, "projects_hero_image") || undefined}
      />
      <div className="container py-16 md:py-24">
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <Link
                href={`/${locale}/projects/${project.slug ?? project.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  {project.image ? (
                    <>
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FolderKanban className="h-9 w-9 text-muted-foreground/30" />
                    </div>
                  )}
                  <Badge
                    variant={project.status === "completed" ? "success" : "secondary"}
                    className="absolute left-4 top-4 border-0 capitalize"
                  >
                    {(dict.common as any)[project.status] ?? project.status}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  {project.startDate && (
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                      {formatDate(project.startDate, locale)}
                    </span>
                  )}
                  <h2 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {loc(project, "title", locale)}
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {loc(project, "description", locale)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                    {dict.common.readMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
          {projects.length === 0 && (
            <EmptyState message={s(settings, "projects_empty_text", locale)} />
          )}
        </Stagger>
      </div>
    </>
  );
}
