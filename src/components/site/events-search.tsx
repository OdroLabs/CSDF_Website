"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Section } from "./section";
import { EmptyState } from "./empty-state";
import { Stagger, StaggerItem } from "./motion";

export interface SearchableEvent {
  id: string;
  href: string;
  title: string;
  description: string;
  location?: string;
  image?: string;
  dateLabel: string;
  isPast: boolean;
}

export function EventsSearch({
  events,
  upcomingTitle,
  emptyText,
  labels,
}: {
  events: SearchableEvent[];
  upcomingTitle?: string;
  emptyText?: string;
  labels: {
    searchPlaceholder: string;
    upcoming: string;
    past: string;
    readMore: string;
    noResults: string;
  };
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q)
    );
  }, [events, query]);

  const upcoming = filtered.filter((e) => !e.isPast);
  const past = filtered.filter((e) => e.isPast);
  const isSearching = query.trim().length > 0;

  const EventCard = ({ event }: { event: SearchableEvent }) => (
    <Link
      href={event.href}
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
          <Badge variant={event.isPast ? "outline" : "secondary"} className="absolute left-4 top-4 border-0">
            {event.isPast ? labels.past : labels.upcoming}
          </Badge>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          <CalendarDays className="h-3 w-3" /> {event.dateLabel}
        </span>
        <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        {event.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" /> {event.location}
          </p>
        )}
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
          {labels.readMore}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );

  return (
    <>
      <Section className="pb-0">
        <div className="relative mx-auto max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="h-12 rounded-full pl-11 pr-11"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Section>

      {(upcoming.length > 0 || (!isSearching && emptyText)) && (
        <Section title={upcoming.length > 0 ? (isSearching ? labels.upcoming : upcomingTitle) : undefined}>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <StaggerItem key={event.id} className="h-full">
                <EventCard event={event} />
              </StaggerItem>
            ))}
            {upcoming.length === 0 && !isSearching && <EmptyState message={emptyText ?? ""} />}
          </Stagger>
        </Section>
      )}

      {past.length > 0 && (
        <Section title={labels.past} className={upcoming.length > 0 ? "pt-0" : ""}>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <StaggerItem key={event.id} className="h-full">
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      {isSearching && filtered.length === 0 && (
        <Section>
          <EmptyState message={labels.noResults} />
        </Section>
      )}
    </>
  );
}
