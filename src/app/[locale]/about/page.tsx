import type { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  Target,
  Users,
  History,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Globe2,
  Quote,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sPairs } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion";
import { StatCounter } from "@/components/site/stat-counter";
import { DarkTestimonialCarousel } from "@/components/site/dark-testimonial-carousel";
import { Timeline } from "@/components/site/timeline";
import { LogoMarquee } from "@/components/site/logo-marquee";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "about_hero_title", locale) || siteName || undefined;
  const description = s(settings, "about_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

/** Bold numbered section label, e.g. "01 — Overview" — an editorial touch used throughout. */
function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="font-number text-sm font-bold text-primary/40">{n}</span>
      <span className="h-px w-8 bg-primary/30" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {children}
      </span>
    </div>
  );
}

const STAT_ICONS = [HeartHandshake, Users, TrendingUp, Globe2];

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [settings, stats, testimonials, partners, galleryImages] = await Promise.all([
    getSettings(),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
    prisma.galleryImage.findMany({ orderBy: { order: "asc" }, take: 6 }),
  ]);
  const dict = getLabels(locale, settings);

  const overviewTitle = s(settings, "about_overview_title", locale);
  const overview = s(settings, "about_overview", locale);
  const overviewImage = s(settings, "about_overview_image");
  const overviewImage2 = s(settings, "about_overview_image2");

  const visionTitle = s(settings, "about_vision_title", locale);
  const vision = s(settings, "about_vision", locale);
  const missionTitle = s(settings, "about_mission_title", locale);
  const mission = s(settings, "about_mission", locale);

  const valuesTitle = s(settings, "about_values_title", locale);
  const values = sPairs(settings, "about_values", locale);

  const communityTitle = s(settings, "about_community_title", locale);
  const community = s(settings, "about_community", locale);

  const historyTitle = s(settings, "about_history_title", locale);
  const history = s(settings, "about_history", locale);

  const galleryTitle = s(settings, "about_gallery_title", locale) || dict.common.gallery;
  const testimonialsTitle = s(settings, "about_testimonials_title", locale);
  const partnersTitle = s(settings, "about_partners_title", locale);

  const extraTitle = s(settings, "about_extra_title", locale);
  const extraText = s(settings, "about_extra_text", locale);

  const checklist = [
    { icon: Eye, title: visionTitle, text: vision },
    { icon: Target, title: missionTitle, text: mission },
  ].filter((b) => b.text);

  const timelineItems = [
    { icon: Users, title: communityTitle, text: community },
    { icon: History, title: historyTitle, text: history },
  ].filter((b) => b.text);

  const showOverview = Boolean(overview);
  const showStats = stats.length > 0;
  const showVisionMission = checklist.length > 0;
  const showFeatures = values.length > 0;
  const showTimeline = timelineItems.length > 0;
  const showGallery = galleryImages.length > 0;
  const showTestimonials = testimonials.length > 0;
  const showPartners = partners.length > 0;
  const featureCards = values.slice(0, 3);

  return (
    <>
      <PageHero
        title={s(settings, "about_hero_title", locale)}
        intro={s(settings, "about_hero_intro", locale)}
        image={s(settings, "about_hero_image") || undefined}
      />

      {/* Overview — overlapping image collage + text/CTA */}
      {showOverview && (
        <section id="sec-overview" className="container py-16 md:py-24">
          <div className={`grid items-center gap-16 ${overviewImage ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
            {overviewImage && (
              <FadeIn className="relative mx-auto w-full max-w-md lg:mx-0">
                <div className="relative aspect-[4/5] w-[78%]">
                  <div className="overflow-hidden rounded-3xl border border-border shadow-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={overviewImage}
                      alt={overviewTitle}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 aspect-square w-[46%] overflow-hidden rounded-3xl border-4 border-white shadow-pop">
                  {overviewImage2 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={overviewImage2} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-white">
                      <HeartHandshake className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
              </FadeIn>
            )}
            <FadeIn delay={overviewImage ? 0.1 : 0}>
              <SectionLabel n="01">{dict.nav.about}</SectionLabel>
              {overviewTitle && (
                <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                  {overviewTitle}
                </h2>
              )}
              <p className="max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">{overview}</p>
              <Button asChild className="mt-6">
                <Link href={`/${locale}/services`}>
                  {dict.nav.services} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Bento block — Vision/Mission, photo, stats and feature cards woven into one mosaic */}
      {(showVisionMission || showStats || showFeatures) && (
        <section id="sec-visionmission" className="relative overflow-hidden bg-muted/40 py-16 md:py-24">
          <div className="container relative">
            <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
              <SectionLabel n="02">{dict.nav.about}</SectionLabel>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                {visionTitle || missionTitle || valuesTitle}
              </h2>
            </FadeIn>

            {showVisionMission && (
              <div className="mb-6 grid gap-6 lg:grid-cols-4">
                {checklist.map((item, i) => (
                  <FadeIn
                    key={i}
                    delay={i * 0.08}
                    className={`rounded-3xl p-8 shadow-pop lg:col-span-2 ${
                      i === 0 ? "bg-primary text-white" : "bg-secondary text-white"
                    }`}
                  >
                    <item.icon className="mb-4 h-8 w-8 text-white/70" />
                    <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-white/80">{item.text}</p>
                  </FadeIn>
                ))}
              </div>
            )}

            {showStats && (
              <Stagger className="mb-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {stats.map((stat, i) => {
                  const Icon = STAT_ICONS[i % STAT_ICONS.length];
                  return (
                    <StaggerItem key={stat.id}>
                      <div className="rounded-3xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                        <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="font-number text-2xl font-bold text-foreground md:text-3xl">
                          <StatCounter value={stat.value} />
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{loc(stat, "label", locale)}</p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            )}

            {showFeatures && (
              <Stagger className="grid gap-6 md:grid-cols-3">
                {featureCards.map((value, i) => (
                  <StaggerItem key={i}>
                    <div className="h-full rounded-3xl border border-border bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover">
                      <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
                        <span className="font-number text-sm font-bold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <h3 className="mb-2 font-bold text-foreground">{value.left}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{value.right}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </section>
      )}

      {/* Communities we serve + Our story — alternating timeline */}
      {showTimeline && (
        <section id="sec-community" className="container py-16 md:py-24">
          <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
            <SectionLabel n="03">{dict.nav.about}</SectionLabel>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              {communityTitle || historyTitle}
            </h2>
          </FadeIn>
          <Timeline items={timelineItems} />
        </section>
      )}

      {/* Our Gallery — mixed-size bento grid */}
      {showGallery && (
        <section id="sec-gallery" className="relative overflow-hidden bg-muted/40 py-16 md:py-24">
          <div className="container relative">
            <FadeIn className="mx-auto mb-10 max-w-2xl text-center">
              <SectionLabel n="04">{dict.common.gallery}</SectionLabel>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                {galleryTitle}
              </h2>
            </FadeIn>
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:[grid-template-rows:repeat(2,minmax(0,1fr))] md:[grid-auto-flow:dense]">
              {galleryImages.map((img, i) => (
                <StaggerItem
                  key={img.id}
                  className={i === 0 ? "col-span-2 row-span-2" : ""}
                >
                  <div className="h-full overflow-hidden rounded-2xl border border-border shadow-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image}
                      alt={loc(img, "caption", locale)}
                      className="aspect-square h-full w-full object-cover transition-transform duration-500 hover:scale-105 md:aspect-auto"
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* What People Say — dark testimonial carousel with giant background quote */}
      {showTestimonials && (
        <section id="sec-testimonials" className="relative overflow-hidden bg-secondary py-16 text-white md:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <Quote className="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 text-white/[0.04]" />
          <div className="container relative">
            <FadeIn className="mx-auto mb-10 max-w-2xl text-center">
              <SectionLabel n="05">{dict.nav.about}</SectionLabel>
              {testimonialsTitle && (
                <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{testimonialsTitle}</h2>
              )}
            </FadeIn>
            <DarkTestimonialCarousel
              items={testimonials.map((t) => ({
                quote: loc(t, "quote", locale),
                author: loc(t, "author", locale),
              }))}
            />
          </div>
        </section>
      )}

      {/* Partners — infinite logo marquee */}
      {showPartners && (
        <section id="sec-partners" className="py-16 md:py-24">
          {partnersTitle && (
            <FadeIn className="container mx-auto mb-10 max-w-2xl text-center">
              <SectionLabel n="06">{dict.nav.about}</SectionLabel>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                {partnersTitle}
              </h2>
            </FadeIn>
          )}
          <div className="container">
            <LogoMarquee items={partners} />
          </div>
        </section>
      )}

      {/* Closing CTA */}
      {extraText && (
        <section className="container pb-16 md:pb-24">
          <FadeIn as="div" className="relative overflow-hidden rounded-3xl bg-secondary p-10 text-white shadow-pop md:p-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
            <section id="sec-extra" className="relative">
              {extraTitle && <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{extraTitle}</h2>}
              <p className="mt-3 max-w-3xl whitespace-pre-line leading-relaxed text-white/80">{extraText}</p>
            </section>
          </FadeIn>
        </section>
      )}
    </>
  );
}
