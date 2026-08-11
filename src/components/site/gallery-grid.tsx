"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import { extractYouTubeId } from "@/lib/utils";
import { Stagger, StaggerItem } from "./motion";

interface GalleryItem {
  id: number;
  image: string | null;
  videoUrl: string | null;
  caption: string;
}

/** Mixed-size bento grid of photos and videos. Videos show their own
 *  YouTube thumbnail with a play button and open in an inline lightbox
 *  instead of navigating away. */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  if (items.length === 0) return null;

  const open = items.find((i) => i.id === openId);
  const openYouTubeId = open ? extractYouTubeId(open.videoUrl) : "";

  return (
    <>
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:[grid-template-rows:repeat(2,minmax(0,1fr))] md:[grid-auto-flow:dense]">
        {items.map((item, i) => {
          const youTubeId = extractYouTubeId(item.videoUrl);
          const thumb = youTubeId
            ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
            : item.image;

          return (
            <StaggerItem key={item.id} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              {youTubeId ? (
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  aria-label={item.caption || "Play video"}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl border border-border shadow-card"
                >
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={item.caption}
                      className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 md:aspect-auto"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/40" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-primary shadow-pop transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-5 w-5 translate-x-0.5 fill-primary" />
                    </span>
                  </span>
                  {item.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-left text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {item.caption}
                    </span>
                  )}
                </button>
              ) : (
                item.image && (
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border shadow-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 md:aspect-auto"
                    />
                    {item.caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {item.caption}
                      </figcaption>
                    )}
                  </div>
                )
              )}
            </StaggerItem>
          );
        })}
      </Stagger>

      {open && openYouTubeId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <button
            type="button"
            onClick={() => setOpenId(null)}
            aria-label="Close video"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${openYouTubeId}?autoplay=1`}
              title={open?.caption || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
