import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loc, isLocale, defaultLocale } from "@/lib/i18n";

export interface SearchResult {
  type: "project" | "service" | "event" | "news" | "publication" | "product";
  title: string;
  description: string;
  href: string;
  image: string | null;
}

const PER_TYPE_LIMIT = 5;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const localeParam = searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;

  if (q.length < 2) return NextResponse.json({ results: [] });

  const insensitive = { contains: q, mode: "insensitive" as const };
  const textMatch = [
    { titleEn: insensitive },
    { titleSi: insensitive },
    { titleTa: insensitive },
  ];

  const [projects, services, events, news, publications, products] = await Promise.all([
    prisma.project.findMany({
      where: {
        published: true,
        OR: [...textMatch, { descriptionEn: insensitive }, { descriptionSi: insensitive }, { descriptionTa: insensitive }],
      },
      take: PER_TYPE_LIMIT,
      orderBy: { order: "asc" },
    }),
    prisma.service.findMany({
      where: {
        published: true,
        OR: [...textMatch, { descriptionEn: insensitive }, { descriptionSi: insensitive }, { descriptionTa: insensitive }],
      },
      take: PER_TYPE_LIMIT,
      orderBy: { order: "asc" },
    }),
    prisma.event.findMany({
      where: {
        published: true,
        OR: [...textMatch, { descriptionEn: insensitive }, { descriptionSi: insensitive }, { descriptionTa: insensitive }, { location: insensitive }],
      },
      take: PER_TYPE_LIMIT,
      orderBy: { startDate: "desc" },
    }),
    prisma.news.findMany({
      where: {
        published: true,
        OR: [...textMatch, { excerptEn: insensitive }, { excerptSi: insensitive }, { excerptTa: insensitive }],
      },
      take: PER_TYPE_LIMIT,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.publication.findMany({
      where: {
        published: true,
        OR: [...textMatch, { descriptionEn: insensitive }, { descriptionSi: insensitive }, { descriptionTa: insensitive }],
      },
      take: PER_TYPE_LIMIT,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { nameEn: insensitive },
          { nameSi: insensitive },
          { nameTa: insensitive },
          { descriptionEn: insensitive },
          { descriptionSi: insensitive },
          { descriptionTa: insensitive },
        ],
      },
      take: PER_TYPE_LIMIT,
      orderBy: { order: "asc" },
    }),
  ]);

  const results: SearchResult[] = [
    ...projects.map((p) => ({
      type: "project" as const,
      title: loc(p, "title", locale),
      description: loc(p, "description", locale),
      href: `/${locale}/projects/${p.slug ?? p.id}`,
      image: p.image,
    })),
    ...services.map((s) => ({
      type: "service" as const,
      title: loc(s, "title", locale),
      description: loc(s, "description", locale),
      href: `/${locale}/services/${s.slug ?? s.id}`,
      image: s.image,
    })),
    ...events.map((e) => ({
      type: "event" as const,
      title: loc(e, "title", locale),
      description: loc(e, "description", locale),
      href: `/${locale}/events/${e.slug ?? e.id}`,
      image: e.image,
    })),
    ...news.map((n) => ({
      type: "news" as const,
      title: loc(n, "title", locale),
      description: loc(n, "excerpt", locale),
      href: `/${locale}/news/${n.slug ?? n.id}`,
      image: n.image,
    })),
    ...publications.map((p) => ({
      type: "publication" as const,
      title: loc(p, "title", locale),
      description: loc(p, "description", locale),
      href: `/${locale}/publications`,
      image: p.coverImage,
    })),
    ...products.map((p) => ({
      type: "product" as const,
      title: loc(p, "name", locale),
      description: loc(p, "description", locale),
      href: `/${locale}/business`,
      image: p.image,
    })),
  ];

  return NextResponse.json({ results });
}
