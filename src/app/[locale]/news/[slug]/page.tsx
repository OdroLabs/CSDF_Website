import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  Home,
  MapPin,
  Quote,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { toPlainText } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/site/motion";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const param = decodeURIComponent(params.slug);
  const item = await prisma.news.findFirst({ where: { slug: param } });

  if (!item) {
    return { title: siteName || undefined };
  }

  const title = loc(item, "title", locale) || undefined;
  const description =
    loc(item, "excerpt", locale) || toPlainText(loc(item, "content", locale), 220) || undefined;

  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: {
      title,
      description,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const param = decodeURIComponent(params.slug);
  let item = await prisma.news.findFirst({ where: { slug: param } });
  if (!item && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    item = await prisma.news.findUnique({ where: { id: Number(param) } });
    if (item?.slug) redirect(`/${locale}/news/${item.slug}`);
  }
  if (!item || !item.published) notFound();

  const [latest, upcomingEvents, featuredProjects] = await Promise.all([
    prisma.news.findMany({
      where: { published: true, id: { not: item.id } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);

  const highlights = loc(item, "highlights", locale).split("\n").map((h) => h.trim()).filter(Boolean);
  const rawQuote = loc(item, "quote", locale);
  const [quoteText, quoteAuthor] = rawQuote
    ? rawQuote.split("::").map((p) => p.trim())
    : ["", ""];

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden bg-secondary py-16 text-white md:py-20">
        {item.image && (
          <>
            <Image src={item.image} alt="" fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-secondary/70" />
          </>
        )}
        <div className="container relative">
          <FadeIn immediate>
            <nav className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
                <Home className="h-4 w-4" /> {dict.nav.home}
              </Link>
              <ChevronRight className="h-4 w-4 text-white/50" />
              <Link href={`/${locale}/news`} className="text-white/80 hover:text-white">
                {dict.nav.news}
              </Link>
            </nav>
          </FadeIn>
          <FadeIn immediate delay={0.06}>
            <p className="mb-4 flex items-center gap-1.5 text-sm text-white/80">
              <CalendarDays className="h-4 w-4" /> {formatDate(item.publishedAt, locale)}
            </p>
          </FadeIn>
          <FadeIn immediate delay={0.12}>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              {loc(item, "title", locale)}
            </h1>
          </FadeIn>
        </div>
      </section>

      <article className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_340px]">
        <div>
          {item.image && (
            <FadeIn>
              <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
                <Image src={item.image} alt="" fill className="object-cover" />
              </div>
            </FadeIn>
          )}

          {/* Key points box */}
          {highlights.length > 0 && (
            <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
                {dict.common.keyPoints}
              </h3>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article body — written in the rich editor, so it may contain
              headings, lists, links and inline images. */}
          <RichText value={loc(item, "content", locale)} />

          {/* Optional pull quote, kept as its own field so it can be styled
              differently from a quote typed inside the editor. */}
          {quoteText && (
            <blockquote className="relative my-8 rounded-2xl bg-secondary p-8 text-white shadow-card">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-accent/40" />
              <p className="max-w-2xl text-lg font-semibold leading-relaxed md:text-xl">
                &ldquo;{quoteText}&rdquo;
              </p>
              {quoteAuthor && (
                <footer className="mt-4 flex items-center gap-2 text-sm text-white/70">
                  <span className="block h-0.5 w-6 bg-accent" /> {quoteAuthor}
                </footer>
              )}
            </blockquote>
          )}

          {/* Gallery images */}
          {(item.image2 || item.image3) && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[item.image2, item.image3].filter(Boolean).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {(latest.length > 0 || upcomingEvents.length > 0 || featuredProjects.length > 0) && (
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {latest.length > 0 && (
              <div className="rounded-2xl bg-muted p-5">
                <h3 className="mb-4 px-1 font-bold">
                  {s(settings, "home_news_title", locale)}
                </h3>
                <ul className="space-y-2.5">
                  {latest.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/${locale}/news/${n.slug ?? n.id}`}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:text-primary"
                      >
                        <span>
                          <span className="line-clamp-2">{loc(n, "title", locale)}</span>
                          <span className="block text-xs font-normal text-muted-foreground">
                            {formatDate(n.publishedAt, locale)}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div className="rounded-2xl bg-muted p-5">
                <h3 className="mb-4 px-1 font-bold">
                  {s(settings, "home_events_title", locale) || dict.nav.events}
                </h3>
                <ul className="space-y-2.5">
                  {upcomingEvents.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/${locale}/events/${event.slug ?? event.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:text-primary"
                      >
                        <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                          <span className="font-number text-base font-bold leading-none">
                            {new Date(event.startDate).getDate()}
                          </span>
                          <span className="mt-0.5 text-[9px] uppercase">
                            {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2">{loc(event, "title", locale)}</span>
                          {event.location && (
                            <span className="mt-0.5 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                              <MapPin className="h-3 w-3 text-primary" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          )}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {featuredProjects.length > 0 && (
              <div className="rounded-2xl bg-muted p-5">
                <h3 className="mb-4 px-1 font-bold">
                  {s(settings, "home_projects_title", locale) || dict.nav.projects}
                </h3>
                <ul className="space-y-2.5">
                  {featuredProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/${locale}/projects/${project.slug ?? project.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:text-primary"
                      >
                        {project.image ? (
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                            <Image src={project.image} alt="" fill className="object-cover" />
                          </span>
                        ) : (
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-primary">
                            <FolderKanban className="h-4 w-4" />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2">{loc(project, "title", locale)}</span>
                          <span className="mt-0.5 block text-xs font-normal capitalize text-muted-foreground">
                            {(dict.common as any)[project.status] ?? project.status}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </article>
    </>
  );
}
