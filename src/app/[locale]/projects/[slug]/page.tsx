import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function parsePairs(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("::");
      return { title: title.trim(), text: rest.join("::").trim() };
    });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const param = decodeURIComponent(params.slug);
  let project = await prisma.project.findFirst({ where: { slug: param } });
  if (!project && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    project = await prisma.project.findUnique({ where: { id: Number(param) } });
    if (project?.slug) redirect(`/${locale}/projects/${project.slug}`);
  }
  if (!project || !project.published) notFound();

  const others = await prisma.project.findMany({
    where: { published: true, id: { not: project.id } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 4,
  });

  const title = loc(project, "title", locale);
  const content = loc(project, "content", locale) || loc(project, "description", locale);
  const objectives = loc(project, "objectives", locale).split("\n").map((o) => o.trim()).filter(Boolean);
  const outcomes = parsePairs(loc(project, "outcomes", locale));
  const beneficiaries = loc(project, "beneficiaries", locale);
  const statusLabel = (dict.common as any)[project.status] ?? project.status;

  const facts = [
    {
      icon: CalendarDays,
      label: dict.common.date,
      value: project.startDate
        ? `${formatDate(project.startDate, locale)}${
            project.endDate ? ` – ${formatDate(project.endDate, locale)}` : ""
          }`
        : null,
    },
    { icon: MapPin, label: dict.common.location, value: project.location },
    { icon: Users, label: dict.home.impact, value: beneficiaries || null },
  ].filter((f) => f.value);

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-16 text-white md:py-20">
        {project.image && (
          <>
            <Image src={project.image} alt="" fill className="object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-brand-900/40" />
          </>
        )}
        <div className="container relative">
          <nav className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href={`/${locale}/projects`} className="text-white/80 hover:text-white">
              {dict.nav.projects}
            </Link>
          </nav>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-accent capitalize text-accent-foreground hover:bg-accent">
              {statusLabel}
            </Badge>
            {project.startDate && (
              <span className="flex items-center gap-1.5 text-sm text-white/80">
                <CalendarDays className="h-4 w-4" />
                {formatDate(project.startDate, locale)}
                {project.endDate ? ` – ${formatDate(project.endDate, locale)}` : ""}
              </span>
            )}
            {project.location && (
              <span className="flex items-center gap-1.5 text-sm text-white/80">
                <MapPin className="h-4 w-4" /> {project.location}
              </span>
            )}
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {title}
          </h1>
        </div>
      </section>

      <article className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div>
          {project.image && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
              <Image src={project.image} alt="" fill className="object-cover" />
            </div>
          )}

          <div className="prose-basic max-w-none whitespace-pre-line leading-relaxed text-muted-foreground">
            {content}
          </div>

          {/* Objectives checklist */}
          {objectives.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {o}
                </li>
              ))}
            </ul>
          )}

          {/* Gallery images */}
          {(project.image2 || project.image3) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[project.image2, project.image3].filter(Boolean).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Numbered outcome cards */}
          {outcomes.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-6 text-xl font-extrabold tracking-tight md:text-2xl">
                {dict.home.impact}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {outcomes.map((o, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
                  >
                    <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mb-2 font-bold leading-snug">{o.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{o.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Project facts */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-bold">{dict.nav.projects}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-between gap-4 border-b pb-3">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" className="rounded-full capitalize">
                  {statusLabel}
                </Badge>
              </li>
              {facts.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="block text-xs text-muted-foreground">{f.label}</span>
                    <span className="font-medium">{f.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Donate card */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 p-7 text-white">
            <h3 className="text-xl font-extrabold leading-tight">{dict.home.supportUs}</h3>
            <p className="mt-2 text-sm text-white/75">{dict.home.supportText}</p>
            <Button asChild className="mt-5 w-full rounded-full bg-accent font-bold text-accent-foreground hover:bg-accent/90">
              <Link href={`/${locale}/donate`}>
                <Heart className="h-4 w-4" /> {dict.home.makeDonation}
              </Link>
            </Button>
          </div>

          {/* Other projects */}
          {others.length > 0 && (
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold">{dict.home.featuredProjects}</h3>
              <ul className="space-y-2.5">
                {others.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/${locale}/projects/${p.slug ?? p.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3.5 text-sm font-semibold shadow-sm transition-all hover:border-primary/40 hover:text-primary"
                    >
                      <span className="line-clamp-2">{loc(p, "title", locale)}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </>
  );
}
