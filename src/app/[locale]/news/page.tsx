import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";

export default async function NewsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero title={dict.nav.news} eyebrow="CSDF" />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-3">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}/news/${item.slug ?? item.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
          >
            {item.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(item.publishedAt, locale)}
              </p>
              <h2 className="mb-2 font-bold leading-snug transition-colors group-hover:text-primary">
                {loc(item, "title", locale)}
              </h2>
              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {loc(item, "excerpt", locale) || loc(item, "content", locale)}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {dict.common.readMore}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
