import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, TextReveal } from "@/components/site/motion";
import { HeroBackdrop } from "@/components/site/hero-backdrop";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const param = decodeURIComponent(params.slug);
  const event = await prisma.event.findFirst({ where: { slug: param } });

  if (!event) {
    return { title: siteName || undefined };
  }

  const title = loc(event, "title", locale) || undefined;
  const description = loc(event, "description", locale) || undefined;

  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: {
      title,
      description,
      images: event.image ? [event.image] : undefined,
    },
  };
}

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

export default async function EventDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const param = decodeURIComponent(params.slug);
  let event = await prisma.event.findFirst({ where: { slug: param } });
  if (!event && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    event = await prisma.event.findUnique({ where: { id: Number(param) } });
    if (event?.slug) redirect(`/${locale}/events/${event.slug}`);
  }
  if (!event || !event.published) notFound();

  const isPast = new Date(event.startDate) < new Date();
  const upcoming = await prisma.event.findMany({
    where: { published: true, id: { not: event.id }, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
    take: 3,
  });

  const title = loc(event, "title", locale);
  const content = loc(event, "content", locale) || loc(event, "description", locale);
  const highlights = loc(event, "highlights", locale).split("\n").map((h) => h.trim()).filter(Boolean);
  const agenda = parsePairs(loc(event, "agenda", locale));
  const dateText = `${formatDate(event.startDate, locale)}${
    event.endDate ? ` – ${formatDate(event.endDate, locale)}` : ""
  }`;
  const timeText = new Date(event.startDate).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden text-white">
        <HeroBackdrop image={event.image || undefined} />

        <div className="container relative pb-20 pt-20 md:pb-28 md:pt-28">
          <FadeIn immediate>
            <nav className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Link href={`/${locale}`} className="flex items-center gap-1.5 text-white hover:text-white/80">
                <Home className="h-4 w-4" /> {dict.nav.home}
              </Link>
              <ChevronRight className="h-4 w-4 text-white/50" />
              <Link href={`/${locale}/events`} className="text-white/80 hover:text-white">
                {dict.nav.events}
              </Link>
            </nav>
          </FadeIn>
          <FadeIn immediate delay={0.06}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge className="bg-white text-primary hover:bg-white">
                {isPast ? dict.common.past : dict.common.upcoming}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/80">
                <CalendarDays className="h-4 w-4" /> {dateText}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" /> {event.location}
                </span>
              )}
            </div>
          </FadeIn>
          <TextReveal
            as="h1"
            text={title}
            delay={0.12}
            className="hero-title mt-1 block max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl"
          />
          <FadeIn immediate delay={0.2}>
            <span className="mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-white to-white/30" />
          </FadeIn>
        </div>
      </section>

      <article className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div>
          {event.image && (
            <FadeIn>
              <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
                <Image src={event.image} alt="" fill className="object-cover" />
              </div>
            </FadeIn>
          )}

          <RichText value={content} />

          {/* What to expect */}
          {highlights.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-5 text-xl font-bold tracking-tight md:text-2xl">
                {dict.common.whatToExpect}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Agenda timeline */}
          {agenda.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-5 text-xl font-bold tracking-tight md:text-2xl">
                {dict.common.agenda}
              </h3>
              <ol className="relative space-y-0 border-l-2 border-primary/25 pl-0">
                {agenda.map((a, i) => (
                  <li key={i} className="relative flex gap-4 pb-6 pl-8 last:pb-0">
                    <span className="absolute -left-[9px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-white" />
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        <Clock className="h-3 w-3" /> {a.title}
                      </span>
                      <p className="mt-1.5 text-sm font-medium">{a.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Gallery images */}
          {(event.image2 || event.image3) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[event.image2, event.image3].filter(Boolean).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Event facts */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h3 className="mb-4 font-bold">{dict.nav.events}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs text-muted-foreground">{dict.common.date}</span>
                  <span className="font-medium">{dateText}</span>
                  <span className="block text-xs text-muted-foreground">{timeText}</span>
                </span>
              </li>
              {event.location && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      {dict.common.location}
                    </span>
                    <span className="font-medium">{event.location}</span>
                  </span>
                </li>
              )}
            </ul>
            <Button asChild className="mt-5 w-full">
              <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
            </Button>
          </div>

          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold">
                {s(settings, "home_events_title", locale)}
              </h3>
              <ul className="space-y-2.5">
                {upcoming.map((ev) => (
                  <li key={ev.id}>
                    <Link
                      href={`/${locale}/events/${ev.slug ?? ev.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:text-primary"
                    >
                      <span>
                        <span className="line-clamp-2">{loc(ev, "title", locale)}</span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {formatDate(ev.startDate, locale)}
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
      </article>
    </>
  );
}
