import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function NewsDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const id = Number(params.id);
  if (isNaN(id)) notFound();
  const item = await prisma.news.findUnique({ where: { id } });
  if (!item || !item.published) notFound();

  return (
    <article className="container max-w-3xl py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href={`/${locale}/news`}>
          <ArrowLeft className="h-4 w-4" /> {dict.nav.news}
        </Link>
      </Button>
      <p className="mb-2 text-sm text-muted-foreground">{formatDate(item.publishedAt, locale)}</p>
      <h1 className="mb-6 text-3xl font-extrabold leading-tight">{loc(item, "title", locale)}</h1>
      {item.image && (
        <div className="relative mb-8 h-72 w-full overflow-hidden rounded-xl md:h-96">
          <Image src={item.image} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="prose-basic whitespace-pre-line leading-relaxed text-foreground/90">
        {loc(item, "content", locale)}
      </div>
    </article>
  );
}
