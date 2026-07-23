import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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
      <PageHero title={dict.nav.news} />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Link key={item.id} href={`/${locale}/news/${item.id}`}>
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              {item.image && (
                <div className="relative h-44 w-full">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
              )}
              <CardContent className="pt-5">
                <p className="mb-1 text-xs text-muted-foreground">{formatDate(item.publishedAt, locale)}</p>
                <h2 className="mb-2 font-bold leading-snug">{loc(item, "title", locale)}</h2>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {loc(item, "excerpt", locale) || loc(item, "content", locale)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
