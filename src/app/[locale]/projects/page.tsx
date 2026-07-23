import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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
      <PageHero title={dict.nav.projects} />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {project.image && (
              <div className="relative h-48 w-full">
                <Image src={project.image} alt="" fill className="object-cover" />
              </div>
            )}
            <CardContent className="pt-5">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={project.status === "completed" ? "success" : "secondary"} className="capitalize">
                  {(dict.common as any)[project.status] ?? project.status}
                </Badge>
                {project.startDate && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(project.startDate, locale)}
                    {project.endDate ? ` – ${formatDate(project.endDate, locale)}` : ""}
                  </span>
                )}
              </div>
              <h2 className="mb-2 text-lg font-bold leading-snug">{loc(project, "title", locale)}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {loc(project, "description", locale)}
              </p>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && <p className="text-muted-foreground">—</p>}
      </div>
    </>
  );
}
