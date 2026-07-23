import Image from "next/image";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";

export default async function BusinessPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getSettings(),
  ]);
  const whatsapp = s(settings, "whatsapp").replace(/\D/g, "");

  return (
    <>
      <PageHero title={dict.nav.business} />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const name = loc(product, "name", locale);
          const waText = encodeURIComponent(`Hello, I would like to order: ${name}`);
          return (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              {product.image ? (
                <div className="relative h-52 w-full">
                  <Image src={product.image} alt={name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-muted">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}
              <CardContent className="flex flex-1 flex-col pt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="font-bold leading-snug">{name}</h2>
                  {!product.inStock && <Badge variant="outline">{dict.common.outOfStock}</Badge>}
                </div>
                {product.price != null && (
                  <p className="mb-2 font-bold text-primary">
                    {formatMoney(product.price.toString())}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {loc(product, "description", locale)}
                </p>
                {whatsapp && product.inStock && (
                  <Button asChild variant="secondary" size="sm" className="mt-auto w-fit">
                    <a
                      href={`https://wa.me/${whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> {dict.common.orderNow}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
