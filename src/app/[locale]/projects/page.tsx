import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";

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
      <div className="container grid gap-6 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${locale}/projects/${project.slug ?? project.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
          >
            {project.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center gap-2">
                <Badge
                  variant={project.status === "completed" ? "success" : "secondary"}
                  className="rounded-full capitalize"
                >
                  {(dict.common as any)[project.status] ?? project.status}
                </Badge>
                {project.startDate && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(project.startDate, locale)}
                  </span>
                )}
              </div>
              <h2 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                {loc(project, "title", locale)}
              </h2>
              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {loc(project, "description", locale)}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {dict.common.readMore}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <EmptyState
            message={s(settings, "projects_empty_text", locale)}
          />
        )}
      </div>
    </>
  );
}
