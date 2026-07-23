import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  HandHeart,
  CalendarDays,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { StatCounter } from "@/components/site/stat-counter";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1707409066859-a90674383d19?auto=format&fit=crop&w=1800&q=80";

function SectionTag({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.16em] ${
        light ? "text-white/90" : "text-primary"
      }`}
    >
      {children}
    </p>
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

  return (
    <>
      {/* Full-screen hero */}
      <section className="relative flex min-h-svh items-center overflow-hidden pb-20 pt-32 lg:pt-40">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/95 via-brand-600/85 to-brand-400/90" />
        <div className="container relative z-10 grid items-center gap-12 text-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.3)]" />
              {s(settings, "hero_badge", locale)}
            </span>
            <h1 className="mb-5 mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
              {s(settings, "hero_title", locale)}
            </h1>
            <p className="mb-8 max-w-xl text-white/90 md:text-lg">
              {s(settings, "hero_subtitle", locale)}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-accent px-7 font-bold text-accent-foreground shadow-lg hover:bg-accent/90"
              >
                <Link href={`/${locale}/contact`}>
                  <Heart className="h-4 w-4" /> {dict.home.getSupport}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/60 bg-transparent px-7 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href={`/${locale}/about`}>
                  {dict.common.learnMore} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Glass card */}
          <div className="animate-fade-up rounded-3xl border border-white/25 bg-white/10 p-7 shadow-2xl backdrop-blur-xl md:p-9 [animation-delay:200ms]">
            <ul className="grid gap-5">
              {heroPoints.map((point, i) => {
                const Icon = pointIcons[i % pointIcons.length];
                return (
                  <li key={i} className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20">
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="text-sm text-white/95 md:text-base">{point}</span>
                  </li>
                );
              })}
            </ul>
            {s(settings, "hero_footnote", locale) && (
              <p className="mt-7 border-t border-white/25 pt-5 text-center text-sm text-white/75">
                {s(settings, "hero_footnote", locale)}
              </p>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#who"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center text-sm text-white/85 md:flex"
        >
          Scroll to explore
          <ChevronDown className="h-5 w-5 animate-bounce-soft" />
        </a>
      </section>

      {/* Who we are */}
      <section id="who" className="container py-20 md:py-24">
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
      </section>

      {/* Impact stats */}
      {stats.length > 0 && (
        <section className="container pb-20 md:pb-24">
          <div className="mb-8 max-w-3xl space-y-3">
            <SectionTag>{dict.home.impact}</SectionTag>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-3xl bg-white p-7 text-center shadow-[0_16px_30px_rgba(44,44,44,0.08)]"
              >
                <p className="font-number text-3xl font-extrabold text-secondary md:text-4xl">
                  <StatCounter value={stat.value} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{loc(stat, "label", locale)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="container pb-20 md:pb-24">
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <SectionTag>{dict.home.ourServices}</SectionTag>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {dict.home.ourServices}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-3xl border-t-[6px] border-brand-500/60 bg-white p-7 shadow-[0_16px_30px_rgba(44,44,44,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,150,230,0.14)]"
            >
              <span className="mb-4 grid h-[52px] w-[52px] place-items-center rounded-2xl bg-brand-500/10 text-2xl">
                {service.icon ?? "❤️"}
              </span>
              <h3 className="mb-2 text-lg font-bold">{loc(service, "title", locale)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {loc(service, "description", locale)}
              </p>
            </div>
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
        <section className="container pb-20 md:pb-24">
          <div className="mb-10 max-w-3xl space-y-3">
            <SectionTag>{dict.nav.projects}</SectionTag>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {dict.home.featuredProjects}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_16px_30px_rgba(44,44,44,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,150,230,0.14)]"
              >
                <div className="relative aspect-[5/4]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
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
                  <h3 className="font-bold leading-snug">{loc(project, "title", locale)}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {loc(project, "description", locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href={`/${locale}/projects`}>{dict.common.viewAll}</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container pb-20 md:pb-24">
          <div className="grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-3">
              <SectionTag>{dict.home.testimonials}</SectionTag>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {dict.home.testimonials}
              </h2>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(44,44,44,0.08)]">
              <TestimonialCarousel
                items={testimonials.map((t) => ({
                  quote: loc(t, "quote", locale),
                  author: loc(t, "author", locale),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* News + Events */}
      <section className="container grid gap-12 pb-20 md:pb-24 lg:grid-cols-2">
        <div>
          <div className="mb-8 space-y-3">
            <SectionTag>{dict.home.latestNews}</SectionTag>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {dict.home.latestNews}
            </h2>
          </div>
          <div className="grid gap-5">
            {news.map((item) => (
              <Link key={item.id} href={`/${locale}/news/${item.id}`}>
                <Card className="rounded-3xl border-0 shadow-[0_16px_30px_rgba(44,44,44,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,150,230,0.14)]">
                  <CardContent className="pt-6">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground/70">
                      <span className="text-primary">{formatDate(item.publishedAt, locale)}</span>
                    </p>
                    <h3 className="line-clamp-2 font-bold">{loc(item, "title", locale)}</h3>
                    {item.image && (
                      <div
                        className="mt-4 h-36 w-full rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-8 space-y-3">
            <SectionTag>{dict.home.upcomingEvents}</SectionTag>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {dict.home.upcomingEvents}
            </h2>
          </div>
          <div className="space-y-5">
            {events.map((event) => (
              <Card
                key={event.id}
                className="rounded-3xl border-0 shadow-[0_16px_30px_rgba(44,44,44,0.08)]"
              >
                <CardContent className="flex gap-4 pt-6">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 text-white">
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
            ))}
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href={`/${locale}/events`}>
                <CalendarDays className="h-4 w-4" /> {dict.common.viewAll}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="container pb-20 md:pb-24">
          <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
            <SectionTag>{dict.home.partners}</SectionTag>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center rounded-2xl bg-white/90 px-4 py-5 text-center shadow-[0_16px_30px_rgba(44,44,44,0.06)]"
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
        </section>
      )}

      {/* Donate CTA */}
      <section className="container pb-20 md:pb-24">
        <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-400 p-10 text-white shadow-[0_24px_60px_rgba(0,150,230,0.25)] md:grid-cols-[1.2fr_auto] md:p-12">
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
      </section>
    </>
  );
}
