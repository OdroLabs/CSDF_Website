import Image from "next/image";
import { FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";

const categoryLabels: Record<string, string> = {
  research: "Research",
  report: "Report",
  annual: "Annual Report",
  other: "Other",
};

export default async function PublicationsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const publications = await prisma.publication.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero title={dict.nav.publications} />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {publications.map((pub) => (
          <Card key={pub.id} className="flex flex-col overflow-hidden">
            {pub.coverImage ? (
              <div className="relative h-44 w-full">
                <Image src={pub.coverImage} alt="" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground/40" />
              </div>
            )}
            <CardContent className="flex flex-1 flex-col pt-5">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">{categoryLabels[pub.category] ?? pub.category}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(pub.publishedAt, locale)}</span>
              </div>
              <h2 className="mb-2 font-bold leading-snug">{loc(pub, "title", locale)}</h2>
              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {loc(pub, "description", locale)}
              </p>
              {pub.fileUrl && (
                <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                  <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" /> {dict.common.download}
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
