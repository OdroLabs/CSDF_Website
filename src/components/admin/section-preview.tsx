"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ExternalLink, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PreviewSection {
  /** Admin section heading, used as the panel label. */
  label: string;
  /** Public path without the locale prefix, e.g. "/donate". */
  path: string;
  /** Element id of the section to isolate on that page. */
  anchor?: string;
}

const DEVICES = {
  desktop: { width: 1280, label: "Desktop", icon: Monitor },
  mobile: { width: 420, label: "Mobile", icon: Smartphone },
} as const;

type Device = keyof typeof DEVICES;

const LANGS = [
  { code: "en", label: "EN" },
  { code: "si", label: "සි" },
  { code: "ta", label: "த" },
] as const;

/**
 * The iframe is never shorter than this. Sections sized in viewport units
 * (the hero uses `min-h-[82svh]`) need a realistic, stable viewport height or
 * they measure squashed — and a stable value keeps measurement idempotent.
 * Anything below the target section is clipped by the panel.
 */
const MEASURE_HEIGHT = 820;
/** Cap the visible panel; taller sections scroll the panel, never the iframe. */
const MAX_PANEL_HEIGHT = 720;

/**
 * Renders one section of the real public page, on its own.
 *
 * The page is loaded in a same-origin iframe, then every element that is not an
 * ancestor or descendant of the target section is hidden. The iframe is then
 * resized to the exact height of that section, so the frame has no scrollable
 * area of its own — wheel events pass straight through to the admin page
 * instead of being swallowed.
 */
export function SectionPreview({
  sections,
  activeIndex,
  /** Bumped by the parent after a save so the frame reloads. */
  reloadToken = 0,
}: {
  sections: PreviewSection[];
  activeIndex: number;
  reloadToken?: number;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [locale, setLocale] = useState<string>("en");
  const [nonce, setNonce] = useState(0);
  const [loading, setLoading] = useState(true);
  /** Height of the target section, and its distance from the top of the document. */
  const [box, setBox] = useState({ top: 0, height: 420 });
  const [panelWidth, setPanelWidth] = useState(0);
  const [notFound, setNotFound] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const active = sections[Math.min(activeIndex, sections.length - 1)] ?? sections[0];

  // Measure the panel so the scale factor is exact.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setPanelWidth(entry.contentRect.width));
    ro.observe(el);
    setPanelWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const frameWidth = DEVICES[device].width;
  const scale = panelWidth > 0 ? Math.min(1, panelWidth / frameWidth) : 1;

  /**
   * Hide everything except the target section, then report its height.
   * Runs inside the iframe document, which is same-origin.
   */
  const isolate = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc || !doc.body) return;

    const STYLE_ID = "admin-preview-isolate";
    if (!doc.getElementById(STYLE_ID)) {
      const style = doc.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        html, body { overflow: hidden !important; }
        [data-preview-hide] { display: none !important; }
        /* Stop full-height ancestors stretching the document. */
        [data-preview-keep] { min-height: 0 !important; }
      `;
      doc.head.appendChild(style);
    }

    // Clear any previous isolation so switching sections is clean.
    doc
      .querySelectorAll("[data-preview-hide]")
      .forEach((el) => el.removeAttribute("data-preview-hide"));
    doc
      .querySelectorAll("[data-preview-keep]")
      .forEach((el) => el.removeAttribute("data-preview-keep"));

    const target = active?.anchor ? doc.getElementById(active.anchor) : null;
    if (!target) {
      // Section is hidden on the live site (blank content, or switched off).
      setNotFound(true);
      setBox({ top: 0, height: 170 });
      return;
    }
    setNotFound(false);

    // Walk up to <body>, hiding every sibling along the way.
    let node: HTMLElement = target;
    while (node.parentElement && node !== doc.body) {
      const parent: HTMLElement = node.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (sibling !== node) sibling.setAttribute("data-preview-hide", "");
      }
      if (parent !== doc.body) parent.setAttribute("data-preview-keep", "");
      node = parent;
    }

    // Measure once the browser has applied the changes. Keeping the real offset
    // means ancestor padding and centring are left untouched — the frame is
    // simply shifted up so the section sits at the top of the panel.
    const rect = target.getBoundingClientRect();
    setBox({
      top: Math.max(0, Math.round(rect.top + (doc.documentElement.scrollTop || 0))),
      height: Math.max(80, Math.ceil(rect.height)),
    });
  }, [active]);

  const refresh = useCallback(() => {
    setLoading(true);
    setNonce((n) => n + 1);
  }, []);

  // Reload after the parent saves.
  useEffect(() => {
    if (reloadToken > 0) refresh();
  }, [reloadToken, refresh]);

  // Re-isolate when the selected section changes (no reload needed).
  useEffect(() => {
    if (!loading) isolate();
  }, [isolate, loading]);

  if (!active) return null;

  // Keyed on page + language only, so moving between sections of the same page
  // re-isolates instead of reloading.
  const src = `/${locale}${active.path}?adminPreview=1&v=${nonce}`;
  const frameKey = `${locale}|${active.path}|${nonce}`;
  const panelHeight = Math.min(MAX_PANEL_HEIGHT, Math.ceil(box.height * scale));

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Section preview
          </p>
          <p className="truncate text-sm font-semibold">{active.label}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex overflow-hidden rounded-lg border bg-white">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setLocale(l.code);
                }}
                className={cn(
                  "px-2 py-1 text-xs font-semibold transition-colors",
                  locale === l.code
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex overflow-hidden rounded-lg border bg-white">
            {(Object.keys(DEVICES) as Device[]).map((key) => {
              const Icon = DEVICES[key].icon;
              return (
                <button
                  key={key}
                  type="button"
                  title={DEVICES[key].label}
                  aria-label={DEVICES[key].label}
                  onClick={() => setDevice(key)}
                  className={cn(
                    "px-2 py-1.5 transition-colors",
                    device === key
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={refresh}
            title="Refresh preview"
            aria-label="Refresh preview"
            className="rounded-lg border bg-white p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>

          <a
            href={`/${locale}${active.path}${active.anchor ? `#${active.anchor}` : ""}`}
            target="_blank"
            rel="noreferrer"
            title="Open the full page in a new tab"
            aria-label="Open the full page in a new tab"
            className="rounded-lg border bg-white p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div
        ref={wrapRef}
        // Very tall sections scroll this container, not the iframe — the iframe
        // has pointer-events disabled so the wheel always reaches here.
        //
        // `overflow-y-scroll` (not `-auto`) always reserves the scrollbar's
        // width, even when the content is short enough not to need it. With
        // `-auto`, the scrollbar would appear and disappear as `panelHeight`
        // is recomputed from the live measurement below, each toggle nudging
        // the observed panel width and therefore the scale — a feedback loop
        // that visibly "blinks" the percentage shown under the frame.
        className="relative overflow-y-scroll overflow-x-hidden rounded-xl border bg-white shadow-sm transition-[height] duration-200"
        style={{ height: panelHeight, scrollbarGutter: "stable" }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white text-xs text-muted-foreground">
            Loading preview…
          </div>
        )}

        {notFound && !loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-muted/40 px-6 text-center">
            <p className="text-xs leading-relaxed text-muted-foreground">
              This section is currently hidden on the live site — its content is empty or its
              Show switch is off. Fill it in and save to see it here.
            </p>
          </div>
        )}

        <iframe
          ref={frameRef}
          key={frameKey}
          src={src}
          title={`Preview — ${active.label}`}
          onLoad={() => {
            isolate();
            setLoading(false);
          }}
          tabIndex={-1}
          scrolling="no"
          style={{
            position: "absolute",
            left: 0,
            // Shift the frame up so the target section starts at the top of the
            // panel. The frame is tall enough to lay the section out correctly
            // but has no scrollable overflow, so it can never steal the wheel.
            top: -Math.round(box.top * scale),
            width: frameWidth,
            height: Math.max(box.top + box.height, MEASURE_HEIGHT),
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: 0,
            pointerEvents: "none",
            display: "block",
          }}
        />
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Just this section of the real page, at {Math.round(scale * 100)}% of {frameWidth}px. Save to
        refresh, or open the full page in a new tab.
      </p>
    </div>
  );
}
