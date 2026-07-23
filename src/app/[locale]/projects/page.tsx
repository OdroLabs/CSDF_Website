import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";

export default async function ProjectsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <PageHero title={dict.nav.projects} eyebrow="CSDF" />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/${locale}/projects/${project.slug ?? project.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={project.image ?? `https://picsum.photos/seed/csdf-project-${i}/800/500`}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
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
        {projects.length === 0 && <p className="text-muted-foreground">—</p>}
      </div>
    </>
  );
}
