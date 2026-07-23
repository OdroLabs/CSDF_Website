import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";

export default async function EventsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const now = new Date();
  const [upcoming, past, gallery] = await Promise.all([
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
      <PageHero title={dict.nav.events} eyebrow="CSDF" />
      <Section title={dict.home.upcomingEvents}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {upcoming.length === 0 && <p className="text-muted-foreground">—</p>}
        </div>
      </Section>
      {past.length > 0 && (
        <Section title={`${dict.common.past} — ${dict.nav.events.split(" ")[0]}`} className="pt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </Section>
      )}
      {gallery.length > 0 && (
        <section className="bg-muted">
          <Section title="Gallery">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((img) => (
                <figure key={img.id} className="group relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={img.image}
                    alt={loc(img, "caption", locale)}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {loc(img, "caption", locale) && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {loc(img, "caption", locale)}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </Section>
        </section>
      )}
    </>
  );
}
