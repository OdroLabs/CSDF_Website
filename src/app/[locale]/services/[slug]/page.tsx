import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Home,
  Phone,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { Button } from "@/components/ui/button";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion";

function parsePairs(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("::");
      return { title: title.trim(), text: rest.join("::").trim() };
    });
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { locale } = params;
  const param = decodeURIComponent(params.slug);
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);

  let service = await prisma.service.findFirst({ where: { slug: param } });
  if (!service && /^\d+$/.test(param)) {
    service = await prisma.service.findUnique({ where: { id: Number(param) } });
  }

  if (!service) {
    return {
      title: siteName || undefined,
      openGraph: { title: siteName || undefined },
    };
  }

  const title = loc(service, "title", locale) || siteName || undefined;
  const description = loc(service, "description", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const param = decodeURIComponent(params.slug);
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  let service = await prisma.service.findFirst({ where: { slug: param } });
  if (!service && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    service = await prisma.service.findUnique({ where: { id: Number(param) } });
    if (service?.slug) redirect(`/${locale}/services/${service.slug}`);
  }
  if (!service || !service.published) notFound();

  const others = await prisma.service.findMany({
    where: { published: true, id: { not: service.id } },
    orderBy: { order: "asc" },
  });

  const title = loc(service, "title", locale);
  const content = loc(service, "content", locale) || loc(service, "description", locale);
  const features = loc(service, "features", locale).split("\n").map((f) => f.trim()).filter(Boolean);
  const benefits = parsePairs(loc(service, "benefits", locale));
  const faqs = parsePairs(loc(service, "faqs", locale));
  const phone = s(settings, "phone");

  // Promo and CTA copy is shared with the home page settings.
  const contactPromoText = s(settings, "home_contact_text", locale);
  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden bg-secondary py-16 text-white md:py-24">
        {service.image && (
          <>
            <Image src={service.image} alt="" fill className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-secondary/80" />
          </>
        )}
        <div className="container relative text-center">
          <FadeIn immediate>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
          </FadeIn>
          <FadeIn immediate delay={0.08}>
            <nav className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
                <Home className="h-4 w-4" /> {dict.nav.home}
              </Link>
              <ChevronRight className="h-4 w-4 text-white/50" />
              <Link href={`/${locale}/services`} className="text-white/80 hover:text-white">
                {dict.nav.services}
              </Link>
            </nav>
          </FadeIn>
        </div>
      </section>

      <div className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <article>
          {service.image && (
            <FadeIn className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
              <Image src={service.image} alt="" fill className="object-cover" />
            </FadeIn>
          )}

          <FadeIn className="mb-4 flex items-center gap-3">
            {service.icon && (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl">
                {service.icon}
              </span>
            )}
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
          </FadeIn>

          <RichText value={content} />

          {/* Feature checklist */}
          {features.length > 0 && (
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((f, i) => (
                <StaggerItem key={i} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {f}
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {/* Gallery images */}
          {(service.image2 || service.image3) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[service.image2, service.image3].filter(Boolean).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Numbered benefit cards */}
          {benefits.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">
                {dict.common.benefits}
              </h3>
              <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((b, i) => (
                  <StaggerItem key={i}>
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover">
                      <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="mb-2 font-bold leading-snug">{b.title}</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          {/* FAQ accordion */}
          {faqs.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">FAQ</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    open={i === 0}
                    className="group overflow-hidden rounded-2xl border border-border bg-white open:border-primary/30 open:bg-primary/[0.03]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
                      {faq.title}
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform group-open:rotate-45">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.text}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          {others.length > 0 && (
            <div className="rounded-2xl border border-border bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold tracking-tight">{dict.nav.services}</h3>
              <ul className="space-y-2.5">
                {others.map((sv) => (
                  <li key={sv.id}>
                    <Link
                      href={`/${locale}/services/${sv.slug ?? sv.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:text-primary"
                    >
                      <span className="flex items-center gap-2.5">
                        {sv.icon && <span className="text-lg">{sv.icon}</span>}
                        {loc(sv, "title", locale)}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact promo card */}
          <div className="overflow-hidden rounded-2xl bg-secondary p-7 text-white shadow-card">
            <h3 className="text-2xl font-bold tracking-tight leading-tight">{dict.home.getSupport}</h3>
            {/* Body copy comes from Site Settings → Home Page → Get in touch band. */}
            {contactPromoText && (
              <p className="mt-2 text-sm text-white/75">{contactPromoText}</p>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
            )}
            <Button
              asChild
              variant="outline"
              className="mt-4 w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
            </Button>
          </div>
        </aside>
      </div>

      {/* CTA band */}
      <section className="container pb-16 md:pb-24">
        <FadeIn className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-secondary p-10 text-white shadow-pop md:p-12">
          <div>
            {donateTitle && (
              <h2 className="max-w-xl text-2xl font-bold tracking-tight md:text-3xl">{donateTitle}</h2>
            )}
            {donateText && <p className="mt-2 max-w-xl text-white/85">{donateText}</p>}
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white px-7 font-bold text-secondary hover:bg-white/90"
          >
            <Link href={`/${locale}/donate`}>
              {dict.home.makeDonation} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </section>
    </>
  );
}
