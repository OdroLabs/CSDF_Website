import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Target, Users, BookOpen, History, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sPairs } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion";
import { StatCounter } from "@/components/site/stat-counter";
import { ValuesMarquee } from "@/components/site/values-marquee";

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

function Eyebrow({ icon: Icon, children }: { icon: typeof Eye; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-primary">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="text-xl font-bold tracking-tight text-foreground">{children}</h2>
    </div>
  );
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [settings, stats] = await Promise.all([
    getSettings(),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
  ]);
  const dict = getLabels(locale, settings);

  const overviewTitle = s(settings, "about_overview_title", locale);
  const overview = s(settings, "about_overview", locale);
  const overviewImage = s(settings, "about_overview_image");

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
  const historyImage = s(settings, "about_history_image");

  const extraTitle = s(settings, "about_extra_title", locale);
  const extraText = s(settings, "about_extra_text", locale);

  const checklist = [
    { icon: Eye, title: visionTitle, text: vision },
    { icon: Target, title: missionTitle, text: mission },
  ].filter((b) => b.text);

  const showOverview = Boolean(overview);
  const showStats = stats.length > 0;
  const showVisionMission = checklist.length > 0;
  const showValues = values.length > 0;
  const showCommunity = Boolean(community);
  const showHistory = Boolean(history);

  return (
    <>
      <PageHero
        title={s(settings, "about_hero_title", locale)}
        intro={s(settings, "about_hero_intro", locale)}
        image={s(settings, "about_hero_image") || undefined}
      />

      {/* Overview — photo with a decorative offset panel behind it, text alongside */}
      {showOverview && (
        <section id="sec-overview" className="container py-16 md:py-24">
          <div className={`grid items-center gap-12 ${overviewImage ? "lg:grid-cols-[1fr_1.05fr]" : ""}`}>
            {overviewImage && (
              <FadeIn className="relative">
                <div className="absolute -bottom-5 -left-5 -z-10 h-full w-full rounded-3xl bg-brand-50" />
                <div className="overflow-hidden rounded-3xl border border-border shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={overviewImage} alt={overviewTitle} className="aspect-[4/3] w-full object-cover" />
                </div>
              </FadeIn>
            )}
            <FadeIn delay={overviewImage ? 0.1 : 0}>
              {overviewTitle && <Eyebrow icon={BookOpen}>{overviewTitle}</Eyebrow>}
              <p className="max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">{overview}</p>
              <Button asChild variant="link" className="mt-2 px-0 font-semibold">
                <Link href={`/${locale}/services`}>
                  {dict.nav.services} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Stats bar */}
      {showStats && (
        <section className="border-y border-border bg-muted/50 py-10">
          <div className="container">
            <Stagger className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <StaggerItem key={stat.id} className="text-center">
                  <p className="font-number text-3xl font-bold text-primary md:text-4xl">
                    <StatCounter value={stat.value} />
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{loc(stat, "label", locale)}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Values — infinite scrolling row, same looping technique as the homepage ticker */}
      {showValues && (
        <section id="sec-values" className="py-16 md:py-24">
          {valuesTitle && (
            <FadeIn className="container mb-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{valuesTitle}</h2>
            </FadeIn>
          )}
          <FadeIn delay={0.1}>
            <ValuesMarquee values={values} />
          </FadeIn>
        </section>
      )}

      {/* Vision & Mission — dark checklist band */}
      {showVisionMission && (
        <section className="relative overflow-hidden bg-secondary py-16 text-white md:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="container relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <FadeIn>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {dict.nav.about}
              </p>
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
                {visionTitle || missionTitle}
              </h2>
            </FadeIn>
            <Stagger className="space-y-5">
              {checklist.map((item, i) => (
                <StaggerItem key={i} className="flex items-start gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    {item.title && <h3 className="font-bold">{item.title}</h3>}
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{item.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Communities we serve */}
      {showCommunity && (
        <section id="sec-community" className="relative overflow-hidden bg-muted/60 py-16 md:py-24">
          <HeartHandshake className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-primary/[0.06]" />
          <div className="container relative">
            <FadeIn className="max-w-2xl">
              <Eyebrow icon={Users}>{communityTitle}</Eyebrow>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{community}</p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Our story */}
      {showHistory && (
        <section id="sec-history" className="container py-16 md:py-24">
          <div className={`grid items-center gap-12 ${historyImage ? "lg:grid-cols-[0.95fr_1.05fr]" : "max-w-3xl"}`}>
            {historyImage && (
              <FadeIn className="order-last overflow-hidden rounded-3xl border border-border shadow-card lg:order-first">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={historyImage} alt={historyTitle} className="aspect-[4/3] w-full object-cover" />
              </FadeIn>
            )}
            <FadeIn delay={historyImage ? 0.12 : 0}>
              <Eyebrow icon={History}>{historyTitle}</Eyebrow>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{history}</p>
            </FadeIn>
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
