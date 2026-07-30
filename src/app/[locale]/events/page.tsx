import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";

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
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
    >
      {event.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={event.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={isPast ? "outline" : "secondary"} className="rounded-full">
            {isPast ? dict.common.past : dict.common.upcoming}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" /> {formatDate(event.startDate, locale)}
          </span>
        </div>
        <h3 className="mb-1 font-bold leading-snug transition-colors group-hover:text-primary">
          {loc(event, "title", locale)}
        </h3>
        {event.location && (
          <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {event.location}
          </p>
        )}
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
          {loc(event, "description", locale)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {dict.common.readMore}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {upcoming.length === 0 && <EmptyState message={emptyText} />}
          </div>
        </Section>
      )}

      {past.length > 0 && (
        <Section title={dict.common.past} className={upcoming.length > 0 || emptyText ? "pt-0" : ""}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </Section>
      )}

      {showGallery && (
        <section className="bg-muted">
          <Section title={galleryTitle}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((img) => {
                const caption = loc(img, "caption", locale);
                return (
                  <figure
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-xl"
                  >
                    <Image
                      src={img.image}
                      alt={caption}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </Section>
        </section>
      )}
    </>
  );
}
