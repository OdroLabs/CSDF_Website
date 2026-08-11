import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sBool } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { GalleryGrid } from "@/components/site/gallery-grid";

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
  const galleryDescription = s(settings, "gallery_description", locale);
  const emptyText = s(settings, "events_empty_text", locale);
  const galleryEmptyText = s(settings, "gallery_empty_text", locale);
  const showGallery = sBool(settings, "show_gallery", true) && (gallery.length > 0 || !!galleryEmptyText);

  const EventCard = ({ event, isPast }: { event: (typeof upcoming)[number]; isPast?: boolean }) => {
    const daysLeft = isPast ? null : Math.ceil((event.startDate.getTime() - Date.now()) / 86400000);
    return (
      <Link
        href={`/${locale}/events/${event.slug ?? event.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
      >
        <div className="relative m-3 mb-0 aspect-[5/4] overflow-hidden rounded-2xl bg-muted">
          {event.image ? (
            <Image
              src={event.image}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <CalendarDays className="h-9 w-9 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                isPast ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              {isPast ? dict.common.past : dict.common.upcoming}
            </span>
            {daysLeft !== null && daysLeft > 0 && (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
                {daysLeft} {daysLeft === 1 ? "day" : "days"} left
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {loc(event, "title", locale)}
          </h3>

          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
              {formatDate(event.startDate, locale)}
              {event.endDate ? ` – ${formatDate(event.endDate, locale)}` : ""}
            </p>
            {loc(event, "location", locale) && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {loc(event, "location", locale)}
              </p>
            )}
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {loc(event, "description", locale)}
          </p>
        </div>
      </Link>
    );
  };

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
        <Section title={upcomingTitle}>
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
            {galleryDescription && (
              <p className="mb-8 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {galleryDescription}
              </p>
            )}
            {gallery.length === 0 ? (
              <EmptyState message={galleryEmptyText} />
            ) : (
              <GalleryGrid
                items={gallery.map((img) => ({
                  id: img.id,
                  image: img.image,
                  videoUrl: img.videoUrl,
                  caption: loc(img, "caption", locale),
                }))}
              />
            )}
          </Section>
        </section>
      )}
    </>
  );
}
