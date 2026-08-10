import Image from "next/image";
import type { Metadata } from "next";
import { ShoppingBag, CreditCard, Truck, RotateCcw, HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sList } from "@/lib/settings";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { RichText } from "@/components/site/rich-text";
import { BusinessOrderDialog } from "@/components/site/business-order-dialog";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "business_hero_title", locale) || siteName || undefined;
  const description = s(settings, "business_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function BusinessPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getSettings(),
  ]);
  const dict = getLabels(locale, settings);
  const orderingTitle = s(settings, "business_ordering_title", locale);
  const orderingSteps = sList(settings, "business_ordering_steps", locale);
  const infoSections = [
    { icon: CreditCard, title: s(settings, "business_payment_title", locale), text: s(settings, "business_payment_text", locale) },
    { icon: Truck, title: s(settings, "business_delivery_title", locale), text: s(settings, "business_delivery_text", locale) },
    { icon: RotateCcw, title: s(settings, "business_policy_title", locale), text: s(settings, "business_policy_text", locale) },
    { icon: HeartHandshake, title: s(settings, "business_impact_title", locale), text: s(settings, "business_impact_text", locale) },
  ].filter((section) => section.title || section.text);

  return (
    <>
      <PageHero
        title={s(settings, "business_hero_title", locale)}
        intro={s(settings, "business_hero_intro", locale)}
        image={s(settings, "business_hero_image") || undefined}
      />
      <Stagger className="container grid gap-6 py-16 sm:grid-cols-2 md:py-24 lg:grid-cols-3">
        {products.map((product) => {
          const name = loc(product, "name", locale);
          const category = loc(product, "category", locale);
          const content = loc(product, "content", locale);
          const availability = loc(product, "availability", locale);
          return (
            <StaggerItem key={product.id} className="h-full">
              <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-border shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover">
                {product.image ? (
                  <div className="relative h-52 w-full">
                    <Image src={product.image} alt={loc(product, "imageAlt", locale) || name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-muted">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col pt-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      {category && <p className="mb-1 text-xs font-semibold uppercase text-primary">{category}</p>}
                      <h2 className="font-bold leading-snug tracking-tight">{name}</h2>
                    </div>
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
                  {availability && <p className="mb-4 text-sm font-medium text-foreground">{availability}</p>}
                  {content && (
                    <details className="mb-4 text-sm">
                      <summary className="cursor-pointer font-semibold text-primary">{dict.common.readMore}</summary>
                      <div className="mt-3"><RichText value={content} /></div>
                    </details>
                  )}
                  {product.inStock && (
                    <BusinessOrderDialog
                      productId={product.id}
                      productName={name}
                      locale={locale}
                      dict={dict}
                    />
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
        {products.length === 0 && (
          <EmptyState
            message={s(settings, "business_empty_text", locale)}
          />
        )}
      </Stagger>

      {(orderingSteps.length > 0 || infoSections.length > 0) && (
        <section id="sec-business-info" className="border-t border-border bg-muted/50 py-16 md:py-24">
          <div className="container">
            {orderingSteps.length > 0 && (
              <div className="mb-14">
                {orderingTitle && <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{orderingTitle}</h2>}
                <ol className="grid gap-5 md:grid-cols-5">
                  {orderingSteps.map((step, index) => (
                    <li key={index} className="border-t-2 border-primary pt-4 text-sm leading-relaxed">
                      <span className="mb-2 block font-number text-lg font-bold text-primary">{index + 1}</span>
                      {step.replace(/^\d+[.)]\s*/, "")}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {infoSections.length > 0 && (
              <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                {infoSections.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-4 border-t border-border pt-5">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      {title && <h3 className="font-bold">{title}</h3>}
                      {text && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{text}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
