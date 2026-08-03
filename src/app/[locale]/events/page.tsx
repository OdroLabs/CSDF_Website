import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
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
  const title = s(settings, "events_hero_title", locale) || siteName || undefined;
  const description = s(settings, "events_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function EventsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const now = new Date();
  const [settings, upcoming, past, gallery] = await Promise.all([
    getSettings(),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: now } },
      orderBy: { startDate: "asc" },
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { lt: now } },
      orderBy: { startDate: "desc" },
      take: 6,
    }),
    prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
  ]);
  const dict = getLabels(locale, settings);

  const upcomingTitle = s(settings, "home_events_title", locale);
  const galleryTitle = s(settings, "gallery_title", locale);
  const showGallery = show(settings, "show_gallery", gallery);
  const emptyText = s(settings, "events_empty_text", locale);

  const EventCard = ({ event, isPast }: { event: (typeof upcoming)[number]; isPast?: boolean }) => (
    <Link
      href={`/${locale}/events/${event.slug ?? event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
    >
      {event.image && (
        <div className="relative aspect-[5/4] w-full overflow-hidden">
          <Image
            src={event.image}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
          <Badge variant={isPast ? "outline" : "secondary"} className="absolute left-4 top-4 border-0">
            {isPast ? dict.common.past : dict.common.upcoming}
          </Badge>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          <CalendarDays className="h-3 w-3" /> {formatDate(event.startDate, locale)}
        </span>
        <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {loc(event, "title", locale)}
        </h3>
        {event.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" /> {event.location}
          </p>
        )}
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {loc(event, "description", locale)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
          {dict.common.readMore}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );

  return (
    <>
      <PageHero
        title={s(settings, "events_hero_title", locale)}
        intro={s(settings, "events_hero_intro", locale)}
        image={s(settings, "events_hero_image") || undefined}
      />

      {/* Upcoming — hidden entirely when there is nothing scheduled and no
          empty-state message has been set in the admin. */}
      {(upcoming.length > 0 || emptyText) && (
        <Section title={upcoming.length > 0 ? upcomingTitle : undefined}>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <StaggerItem key={event.id} className="h-full">
                <EventCard event={event} />
              </StaggerItem>
            ))}
            {upcoming.length === 0 && <EmptyState message={emptyText} />}
          </Stagger>
        </Section>
      )}

      {past.length > 0 && (
        <Section title={dict.common.past} className={upcoming.length > 0 || emptyText ? "pt-0" : ""}>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <StaggerItem key={event.id} className="h-full">
                <EventCard event={event} isPast />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      {showGallery && (
        <section className="bg-muted/60">
          <Section title={galleryTitle}>
            <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((img) => {
                const caption = loc(img, "caption", locale);
                return (
                  <StaggerItem key={img.id}>
                    <figure className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                      <Image
                        src={img.image}
                        alt={caption}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {caption && (
                        <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Section>
        </section>
      )}
    </>
  );
}
