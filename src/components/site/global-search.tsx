"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  FolderKanban,
  Wrench,
  CalendarDays,
  Newspaper,
  BookOpen,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/lib/dictionaries";
import type { SearchResult } from "@/app/api/search/route";

const TYPE_ICONS: Record<SearchResult["type"], typeof Search> = {
  project: FolderKanban,
  service: Wrench,
  event: CalendarDays,
  news: Newspaper,
  publication: BookOpen,
  product: ShoppingBag,
};

export function GlobalSearch({ locale, dict }: { locale: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const typeLabels: Record<SearchResult["type"], string> = useMemo(
    () => ({
      project: dict.nav.projects,
      service: dict.nav.services,
      event: dict.nav.events,
      news: dict.nav.news,
      publication: dict.nav.publications,
      product: dict.nav.business,
    }),
    [dict]
  );

  // Cmd/Ctrl+K opens search from anywhere on the site.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else {
      setQuery("");
      setResults(null);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        // Aborted or network error — leave previous results as-is.
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, locale]);

  const grouped = useMemo(() => {
    if (!results) return [];
    const order: SearchResult["type"][] = ["project", "service", "event", "news", "publication", "product"];
    return order
      .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.search.label}
        className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          hideClose
          className="top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
        >
          <DialogTitle className="sr-only">{dict.search.label}</DialogTitle>
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.search.placeholder}
              className="h-auto border-0 p-0 shadow-none focus-visible:ring-0"
            />
            {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim().length < 2 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">{dict.search.startTyping}</p>
            ) : grouped.length === 0 && !loading ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">{dict.search.noResults}</p>
            ) : (
              <div className="space-y-1">
                {grouped.map((group) => {
                  const Icon = TYPE_ICONS[group.type];
                  return (
                    <div key={group.type} className="mb-2">
                      <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {typeLabels[group.type]}
                      </p>
                      {group.items.map((item, i) => (
                        <Link
                          key={`${group.type}-${i}`}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
