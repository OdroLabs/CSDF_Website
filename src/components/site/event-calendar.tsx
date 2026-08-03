"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "./motion";

export interface CalendarEvent {
  id: string;
  title: string;
  href: string;
  date: string; // ISO date
  location?: string;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function safeFormat(date: Date, locale: string, options: Intl.DateTimeFormatOptions) {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return new Intl.DateTimeFormat("en", options).format(date);
  }
}

export function EventCalendar({
  events,
  locale,
  emptyLabel,
}: {
  events: CalendarEvent[];
  locale: string;
  emptyLabel: string;
}) {
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = dateKey(new Date(e.date));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  const today = useMemo(() => new Date(), []);
  const initialMonth = useMemo(() => {
    // Default to the current month, or the nearest month that actually has an event.
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const hasThisMonth = events.some((e) => e.date.slice(0, 7) === todayKey);
    if (hasThisMonth || events.length === 0) return new Date(today.getFullYear(), today.getMonth(), 1);
    const upcoming = events
      .map((e) => new Date(e.date))
      .filter((d) => d.getTime() >= today.getTime())
      .sort((a, b) => a.getTime() - b.getTime());
    const next = upcoming[0] ?? new Date(events[0].date);
    return new Date(next.getFullYear(), next.getMonth(), 1);
  }, [events, today]);

  const [cursor, setCursor] = useState(initialMonth);
  const [selectedKey, setSelectedKey] = useState<string | null>(
    eventsByDay.has(dateKey(today)) ? dateKey(today) : null
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthStart = new Date(year, month, 1);
  const startDay = monthStart.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 7); // a Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return safeFormat(d, locale, { weekday: "short" });
    });
  }, [locale]);

  const monthLabel = safeFormat(cursor, locale, { month: "long", year: "numeric" });
  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) ?? [] : [];
  const todayKey = dateKey(today);

  return (
    <FadeIn className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="grid gap-0 sm:grid-cols-[1.2fr_1fr]">
        <div className="max-w-xs p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold capitalize tracking-tight text-foreground">{monthLabel}</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                className="grid h-6 w-6 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary/30 hover:text-primary"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                className="grid h-6 w-6 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary/30 hover:text-primary"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdayLabels.map((d, i) => (
              <span key={i} className="pb-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                {d.slice(0, 2)}
              </span>
            ))}
            {cells.map((date, i) => {
              if (!date) return <span key={i} />;
              const key = dateKey(date);
              const dayEvents = eventsByDay.get(key) ?? [];
              const hasEvents = dayEvents.length > 0;
              const isToday = key === todayKey;
              const isSelected = key === selectedKey;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!hasEvents}
                  onClick={() => setSelectedKey(isSelected ? null : key)}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md text-[11px] transition-colors",
                    hasEvents
                      ? isSelected
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "bg-brand-50 font-semibold text-primary hover:bg-brand-100"
                      : "text-foreground/60",
                    isToday && !isSelected && "ring-1 ring-primary/40"
                  )}
                >
                  {date.getDate()}
                  {hasEvents && (
                    <span
                      className={cn(
                        "h-0.5 w-0.5 rounded-full",
                        isSelected ? "bg-primary-foreground" : "bg-primary"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border bg-muted/40 p-4 md:border-l md:border-t-0 md:p-5">
          <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <CalendarDays className="h-3 w-3 text-primary" />
            {selectedKey
              ? safeFormat(new Date(selectedKey), locale, { day: "numeric", month: "short", year: "numeric" })
              : monthLabel}
          </p>

          {selectedEvents.length > 0 ? (
            <ul className="space-y-2">
              {selectedEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={e.href}
                    className="group flex items-start justify-between gap-2 rounded-xl border border-border bg-white p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-soft"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {e.title}
                      </p>
                      {e.location && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" /> {e.location}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">{emptyLabel}</p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
