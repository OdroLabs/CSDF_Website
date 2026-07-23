import Image from "next/image";
import Link from "next/link";
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
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { Button } from "@/components/ui/button";

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

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const param = decodeURIComponent(params.slug);
  const settings = await getSettings();
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

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-16 text-white md:py-24">
        {service.image && (
          <>
            <Image src={service.image} alt="" fill className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 to-brand-900/50" />
          </>
        )}
        <div className="container relative text-center">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
          <nav className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href={`/${locale}/services`} className="text-white/80 hover:text-white">
              {dict.nav.services}
            </Link>
          </nav>
        </div>
      </section>

      <div className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <article>
          {service.image && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
              <Image src={service.image} alt="" fill className="object-cover" />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            {service.icon && (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-2xl">
                {service.icon}
              </span>
            )}
            <h2 className="text-2xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
          </div>

          <div className="prose-basic max-w-none whitespace-pre-line leading-relaxed text-muted-foreground">
            {content}
          </div>

          {/* Feature checklist */}
          {features.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Gallery images */}
          {(service.image2 || service.image3) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[service.image2, service.image3].filter(Boolean).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Numbered benefit cards */}
          {benefits.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-6 text-xl font-extrabold tracking-tight md:text-2xl">
                {dict.home.impact}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
                  >
                    <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mb-2 font-bold leading-snug">{b.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ accordion */}
          {faqs.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-6 text-xl font-extrabold tracking-tight md:text-2xl">FAQ</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    open={i === 0}
                    className="group overflow-hidden rounded-xl border bg-card open:border-primary/40 open:bg-primary/[0.03]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
                      {faq.title}
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border text-primary transition-transform group-open:rotate-45">
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
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold">{dict.nav.services}</h3>
              <ul className="space-y-2.5">
                {others.map((sv) => (
                  <li key={sv.id}>
                    <Link
                      href={`/${locale}/services/${sv.slug ?? sv.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3.5 text-sm font-semibold shadow-sm transition-all hover:border-primary/40 hover:text-primary"
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
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 p-7 text-white">
            <h3 className="text-2xl font-extrabold leading-tight">{dict.home.getSupport}</h3>
            <p className="mt-2 text-sm text-white/75">{dict.contact.intro}</p>
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
              className="mt-4 w-full rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
            </Button>
          </div>
        </aside>
      </div>

      {/* CTA band */}
      <section className="container pb-16">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 p-10 text-white shadow-xl shadow-brand-600/20 md:p-12">
          <div>
            <h2 className="max-w-xl text-2xl font-extrabold md:text-3xl">{dict.home.supportUs}</h2>
            <p className="mt-2 max-w-xl text-white/85">{dict.home.supportText}</p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-7 font-bold text-brand-700 hover:bg-white/90"
          >
            <Link href={`/${locale}/donate`}>
              {dict.home.makeDonation} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
