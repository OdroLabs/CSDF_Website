import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  HandHeart,
  CalendarDays,
  MapPin,
  PhoneCall,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { StatCounter } from "@/components/site/stat-counter";
import { Reveal } from "@/components/site/reveal";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1707409066859-a90674383d19?auto=format&fit=crop&w=1800&q=80";

function SectionTag({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.16em] ${
        light ? "text-accent" : "text-primary"
      }`}
    >
      {children}
    </p>
  );
}

/** Wavy divider. Renders in currentColor — set text color to the band color. */
function Wave({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block h-10 w-full fill-current md:h-16", flip && "rotate-180", className)}
    >
      <path d="M0,64 L0,34 C160,58 360,8 720,18 C1080,28 1280,56 1440,22 L1440,64 Z" />
    </svg>
  );
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const dict = getDictionary(locale);
  const [settings, stats, services, projects, news, events, testimonials, partners] =
    await Promise.all([
      getSettings(),
      prisma.stat.findMany({ orderBy: { order: "asc" } }),
      prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 6 }),
      prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 4 }),
      prisma.news.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
      prisma.event.findMany({
        where: { published: true, startDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
        take: 2,
      }),
      prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
    ]);

  const heroPoints = s(settings, "hero_points", locale).split("\n").filter(Boolean);
  const pointIcons = [ShieldCheck, Heart, Users, HandHeart];
  const phone = s(settings, "phone");
  const email = s(settings, "email");
  const address = s(settings, "address", locale);

  return (
    <>
      {/* Corporate hero */}
      <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-brand-950 py-16 text-white md:py-24">
        {/* Photo fading in from the right */}
        <div
          className="absolute inset-y-0 right-0 w-full bg-cover bg-center opacity-30 lg:w-3/4 lg:opacity-60"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/95 to-brand-900/40" />
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              <span className="block h-0.5 w-10 bg-accent" />
              {s(settings, "hero_badge", locale)}
            </p>
            <h1 className="mb-6 mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              {s(settings, "hero_title", locale)}
            </h1>
            <p className="mb-9 max-w-xl leading-relaxed text-white/80 md:text-lg">
              {s(settings, "hero_subtitle", locale)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-md bg-accent px-8 font-bold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
              >
                <Link href={`/${locale}/contact`}>
                  {dict.home.getSupport} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-md border-white/40 bg-transparent px-8 font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={`/${locale}/about`}>{dict.common.learnMore}</Link>
              </Button>
            </div>
          </div>

          {/* Commitment card */}
          <div className="animate-fade-up rounded-2xl bg-white p-8 text-foreground shadow-2xl shadow-black/30 md:p-9 [animation-delay:200ms]">
            <ul className="grid gap-5">
              {heroPoints.map((point, i) => {
                const Icon = pointIcons[i % pointIcons.length];
                return (
                  <li key={i} className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-500/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-sm font-medium md:text-base">{point}</span>
                  </li>
                );
              })}
            </ul>
            {s(settings, "hero_footnote", locale) && (
              <p className="mt-7 border-t pt-5 text-center text-sm text-muted-foreground">
                {s(settings, "hero_footnote", locale)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section id="who" className="container py-20 md:py-24">
        <Reveal>
          <div className="mb-8 max-w-3xl space-y-3">
            <SectionTag>{dict.home.whoWeAre}</SectionTag>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {s(settings, "site_name", locale)}
            </h2>
          </div>
          <p className="max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">
            {s(settings, "about_overview", locale)}
          </p>
          <Button asChild variant="link" className="mt-3 px-0">
            <Link href={`/${locale}/about`}>
              {dict.common.learnMore} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Impact stats — dark wave band */}
      {stats.length > 0 && (
        <section>
          <div className="text-brand-950">
            <Wave />
          </div>
          <div className="relative overflow-hidden bg-brand-950 py-16 text-white md:py-20">
            <div
              className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
            <div className="container relative">
              <Reveal>
                <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
                  <SectionTag light>{dict.home.impact}</SectionTag>
                  <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                    {dict.home.impact}
                  </h2>
                  <span className="mx-auto block h-1 w-16 rounded-full bg-accent" />
                </div>
              </Reveal>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                {stats.map((stat, i) => (
                  <Reveal key={stat.id} delay={i * 120}>
                    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-7 text-center backdrop-blur">
                      <p className="font-number text-3xl font-extrabold text-accent md:text-4xl">
                        <StatCounter value={stat.value} />
                      </p>
                      <p className="mt-2 text-sm text-white/75">{loc(stat, "label", locale)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
          <div className="text-brand-950">
            <Wave flip />
          </div>
        </section>
      )}

      {/* Services */}
      <section className="container py-16 md:py-20">
        <Reveal>
          <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
            <SectionTag>{dict.home.ourServices}</SectionTag>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {dict.home.ourServices}
            </h2>
            <span className="mx-auto block h-1 w-16 rounded-full bg-primary" />
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 120}>
              <Link
                href={`/${locale}/services/${service.slug ?? service.id}`}
                className="group block h-full rounded-2xl border border-border border-t-4 border-t-brand-500 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <span className="mb-4 grid h-[52px] w-[52px] place-items-center rounded-xl bg-brand-500/10 text-2xl">
                  {service.icon ?? "❤️"}
                </span>
                <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-primary">
                  {loc(service, "title", locale)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {loc(service, "description", locale)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {dict.common.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full px-7">
            <Link href={`/${locale}/services`}>{dict.common.viewAll}</Link>
          </Button>
        </div>
      </section>

      {/* Featured programs */}
      {projects.length > 0 && (
        <section className="container pb-16 md:pb-20">
          <Reveal>
            <div className="mb-10 max-w-3xl space-y-3">
              <SectionTag>{dict.nav.projects}</SectionTag>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {dict.home.featuredProjects}
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 4) * 100}>
                <Link
                  href={`/${locale}/projects/${project.slug ?? project.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-brand-500/10"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${
                          project.image ?? `https://picsum.photos/seed/csdf-program-${i}/800/640`
                        })`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-brand-700/40 mix-blend-multiply" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <Badge variant="secondary" className="w-fit rounded-full capitalize">
                      {(dict.common as any)[project.status] ?? project.status}
                    </Badge>
                    <h3 className="font-bold leading-snug transition-colors group-hover:text-primary">
                      {loc(project, "title", locale)}
                    </h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {loc(project, "description", locale)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href={`/${locale}/projects`}>{dict.common.viewAll}</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Get in touch — dark wave band */}
      <section>
        <div className="text-brand-950">
          <Wave />
        </div>
        <div className="relative overflow-hidden bg-brand-950 py-16 text-white md:py-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className="container relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <div className="mx-auto w-full max-w-sm rounded-2xl bg-destructive p-10 text-center shadow-2xl shadow-black/30">
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border-2 border-white/40">
                  <PhoneCall className="h-6 w-6" />
                </span>
                <h3 className="text-2xl font-extrabold">{dict.home.callUs}</h3>
                <span className="mx-auto my-4 block h-0.5 w-6 bg-white/60" />
                {address && <p className="whitespace-pre-line text-sm text-white/90">{address}</p>}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="mt-3 block text-lg font-bold hover:underline"
                  >
                    {phone}
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="mt-2 block text-sm text-white/90 hover:underline">
                    {email}
                  </a>
                )}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                {dict.home.getInTouch}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                {dict.home.contactHeading}
              </h2>
              <span className="mt-4 flex gap-1.5">
                <span className="block h-1 w-8 rounded-full bg-destructive" />
                <span className="block h-1 w-4 rounded-full bg-destructive" />
              </span>
              <p className="mt-6 max-w-xl leading-relaxed text-white/80">{dict.contact.intro}</p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-md bg-destructive px-8 font-bold hover:bg-destructive/90"
              >
                <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
              </Button>
            </Reveal>
          </div>
        </div>
        <div className="text-brand-950">
          <Wave flip />
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container py-16 md:py-20">
          <Reveal>
            <div className="grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="space-y-3">
                <SectionTag>{dict.home.testimonials}</SectionTag>
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  {dict.home.testimonials}
                </h2>
              </div>
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <TestimonialCarousel
                  items={testimonials.map((t) => ({
                    quote: loc(t, "quote", locale),
                    author: loc(t, "author", locale),
                  }))}
                />
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* News + Events */}
      <section className="container grid gap-12 pb-16 md:pb-20 lg:grid-cols-2">
        <Reveal>
          <div className="mb-8 space-y-3">
            <SectionTag>{dict.home.latestNews}</SectionTag>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {dict.home.latestNews}
            </h2>
          </div>
          <div className="grid gap-5">
            {news.map((item) => (
              <Link key={item.id} href={`/${locale}/news/${item.slug ?? item.id}`}>
                <Card className="rounded-2xl border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10">
                  <CardContent className="pt-6">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em]">
                      <span className="text-primary">{formatDate(item.publishedAt, locale)}</span>
                    </p>
                    <h3 className="line-clamp-2 font-bold">{loc(item, "title", locale)}</h3>
                    {item.image && (
                      <div
                        className="mt-4 h-36 w-full rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="mb-8 space-y-3">
            <SectionTag>{dict.home.upcomingEvents}</SectionTag>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {dict.home.upcomingEvents}
            </h2>
          </div>
          <div className="space-y-5">
            {events.map((event) => (
              <Link key={event.id} href={`/${locale}/events/${event.slug ?? event.id}`} className="block">
                <Card className="rounded-2xl border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10">
                  <CardContent className="flex gap-4 pt-6">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 text-white">
                      <span className="font-number text-xl font-bold leading-none">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="mt-0.5 text-[10px] uppercase">
                        {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold leading-snug">{loc(event, "title", locale)}</h3>
                      {event.location && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href={`/${locale}/events`}>
                <CalendarDays className="h-4 w-4" /> {dict.common.viewAll}
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="container pb-16 md:pb-20">
          <Reveal>
            <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
              <SectionTag>{dict.home.partners}</SectionTag>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-center rounded-2xl border border-border bg-white px-4 py-5 text-center shadow-sm"
                >
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-10 w-auto object-contain grayscale transition-all hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-secondary">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Donate CTA */}
      <section className="container pb-16 md:pb-20">
        <Reveal>
          <div className="grid items-center gap-8 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 p-10 text-white shadow-xl shadow-brand-600/20 md:grid-cols-[1.2fr_auto] md:p-12">
            <div>
              <SectionTag light>{dict.home.supportUs}</SectionTag>
              <h2 className="mt-3 max-w-2xl text-2xl font-extrabold md:text-3xl">
                {dict.home.supportUs}
              </h2>
              <p className="mt-3 max-w-xl text-white/90">{dict.home.supportText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-7 font-bold text-brand-600 hover:bg-white/90"
              >
                <Link href={`/${locale}/donate`}>
                  <Heart className="h-4 w-4" /> {dict.home.makeDonation}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/60 bg-transparent px-7 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
