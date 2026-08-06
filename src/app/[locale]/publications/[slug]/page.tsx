import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, ChevronRight, Download, FileText, Home, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FadeIn, TextReveal } from "@/components/site/motion";
import { HeroBackdrop } from "@/components/site/hero-backdrop";

const categoryLabels: Record<string, string> = {
  research: "Research",
  report: "Report",
  annual: "Annual Report",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const param = decodeURIComponent(params.slug);
  const item = await prisma.publication.findFirst({ where: { slug: param } });

  if (!item) return { title: siteName || undefined };

  const title = loc(item, "title", locale) || undefined;
  const description = loc(item, "description", locale) || undefined;

  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: {
      title,
      description,
      images: item.coverImage ? [item.coverImage] : undefined,
    },
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const param = decodeURIComponent(params.slug);

  let item = await prisma.publication.findFirst({ where: { slug: param } });
  if (!item && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    item = await prisma.publication.findUnique({ where: { id: Number(param) } });
    if (item?.slug) redirect(`/${locale}/publications/${item.slug}`);
  }
  if (!item || !item.published) notFound();

  const others = await prisma.publication.findMany({
    where: { published: true, id: { not: item.id } },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  const description = loc(item, "description", locale);
  const category = categoryLabels[item.category] ?? item.category;
  const fileExt = item.fileUrl?.split(".").pop()?.toUpperCase().slice(0, 4) || "PDF";

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden text-white">
        <HeroBackdrop image={item.coverImage || undefined} />

        <div className="container relative pb-20 pt-20 md:pb-28 md:pt-28">
          <FadeIn immediate>
            <nav className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Link href={`/${locale}`} className="flex items-center gap-1.5 text-white hover:text-white/80">
                <Home className="h-4 w-4" /> {dict.nav.home}
              </Link>
              <ChevronRight className="h-4 w-4 text-white/50" />
              <Link href={`/${locale}/publications`} className="text-white/80 hover:text-white">
                {dict.nav.publications}
              </Link>
            </nav>
          </FadeIn>

          <FadeIn immediate delay={0.06}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {category}
            </span>
          </FadeIn>

          <TextReveal
            as="h1"
            text={loc(item, "title", locale)}
            delay={0.12}
            className="hero-title mt-5 block max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl"
          />

          <FadeIn immediate delay={0.2}>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> {formatDate(item.publishedAt, locale)}
              </span>
              {item.fileUrl && (
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> {fileExt} document
                </span>
              )}
            </div>
          </FadeIn>

          <FadeIn immediate delay={0.26}>
            <span className="mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-white to-white/30" />
          </FadeIn>
        </div>
      </section>

      <article className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {item.coverImage ? (
            <FadeIn>
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-card">
                <Image src={item.coverImage} alt="" fill className="object-cover" />
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="mb-10 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-brand-50 to-accent/10">
                <FileText className="h-16 w-16 text-primary/30" />
              </div>
            </FadeIn>
          )}

          {description ? (
            <FadeIn delay={0.06}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Overview
              </h2>
              <p className="mb-10 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </FadeIn>
          ) : (
            <div className="mb-10 h-px w-full bg-border" />
          )}

          {/* Mobile-only download CTA — the sidebar card covers this on lg+ */}
          {item.fileUrl && (
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 lg:hidden">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{loc(item, "title", locale)}</p>
                  <p className="text-xs text-muted-foreground">{fileExt}</p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4" /> {dict.common.download}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {item.fileUrl && (
            <div className="hidden overflow-hidden rounded-2xl border border-border shadow-card lg:block">
              <div className="flex items-center gap-3 bg-secondary p-5 text-white">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <FileText className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold">{loc(item, "title", locale)}</p>
                  <p className="text-xs text-white/60">{fileExt} document</p>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </span>
                  <span className="font-medium">{category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> Published
                  </span>
                  <span className="font-medium">{formatDate(item.publishedAt, locale)}</span>
                </div>
                <Button asChild size="lg" className="mt-2 w-full">
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4" /> {dict.common.download}
                  </a>
                </Button>
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold">{dict.nav.publications}</h3>
              <ul className="space-y-2.5">
                {others.map((pub) => (
                  <li key={pub.id}>
                    <Link
                      href={`/${locale}/publications/${pub.slug ?? pub.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:text-primary"
                    >
                      {pub.coverImage ? (
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                          <Image src={pub.coverImage} alt="" fill className="object-cover" />
                        </span>
                      ) : (
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-primary">
                          <FileText className="h-4 w-4" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2">{loc(pub, "title", locale)}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                          {formatDate(pub.publishedAt, locale)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </>
  );
}
