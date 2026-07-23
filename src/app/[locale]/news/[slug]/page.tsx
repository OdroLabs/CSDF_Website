import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Home,
  Quote,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";

export default async function NewsDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const param = decodeURIComponent(params.slug);
  let item = await prisma.news.findFirst({ where: { slug: param } });
  if (!item && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    item = await prisma.news.findUnique({ where: { id: Number(param) } });
    if (item?.slug) redirect(`/${locale}/news/${item.slug}`);
  }
  if (!item || !item.published) notFound();

  const latest = await prisma.news.findMany({
    where: { published: true, id: { not: item.id } },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  const highlights = loc(item, "highlights", locale).split("\n").map((h) => h.trim()).filter(Boolean);
  const rawQuote = loc(item, "quote", locale);
  const [quoteText, quoteAuthor] = rawQuote
    ? rawQuote.split("::").map((p) => p.trim())
    : ["", ""];

  // Split content into paragraphs so the pull quote can sit mid-article
  const paragraphs = loc(item, "content", locale).split(/\n\s*\n/).filter(Boolean);
  const quoteAfter = Math.min(1, Math.max(0, paragraphs.length - 1));

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-16 text-white md:py-20">
        {item.image && (
          <>
            <Image src={item.image} alt="" fill className="object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-brand-900/40" />
          </>
        )}
        <div className="container relative">
          <nav className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href={`/${locale}/news`} className="text-white/80 hover:text-white">
              {dict.nav.news}
            </Link>
          </nav>
          <p className="mb-4 flex items-center gap-1.5 text-sm text-white/80">
            <CalendarDays className="h-4 w-4" /> {formatDate(item.publishedAt, locale)}
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {loc(item, "title", locale)}
          </h1>
        </div>
      </section>

      <article className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_340px]">
        <div>
          {item.image && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
              <Image src={item.image} alt="" fill className="object-cover" />
            </div>
          )}

          {/* Key points box */}
          {highlights.length > 0 && (
            <div className="mb-8 rounded-2xl border border-brand-500/30 bg-brand-500/[0.04] p-6">
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-primary">
                {dict.common.keyPoints}
              </h3>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article body with pull quote woven in */}
          <div className="prose-basic max-w-none leading-relaxed text-muted-foreground">
            {paragraphs.map((p, i) => (
              <div key={i}>
                <p className="mb-4 whitespace-pre-line">{p}</p>
                {quoteText && i === quoteAfter && (
                  <blockquote className="relative my-8 rounded-2xl bg-brand-950 p-8 text-white">
                    <Quote className="absolute right-6 top-6 h-8 w-8 text-accent/40" />
                    <p className="max-w-2xl text-lg font-semibold leading-relaxed md:text-xl">
                      “{quoteText}”
                    </p>
                    {quoteAuthor && (
                      <footer className="mt-4 flex items-center gap-2 text-sm text-white/70">
                        <span className="block h-0.5 w-6 bg-accent" /> {quoteAuthor}
                      </footer>
                    )}
                  </blockquote>
                )}
              </div>
            ))}
          </div>

          {/* Gallery images */}
          {(item.image2 || item.image3) && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[item.image2, item.image3].filter(Boolean).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {latest.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold">{dict.home.latestNews}</h3>
              <ul className="space-y-2.5">
                {latest.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/${locale}/news/${n.slug ?? n.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3.5 text-sm font-semibold shadow-sm transition-all hover:border-primary/40 hover:text-primary"
                    >
                      <span>
                        <span className="line-clamp-2">{loc(n, "title", locale)}</span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {formatDate(n.publishedAt, locale)}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </article>
    </>
  );
}
