import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  MapPin,
  PhoneCall,
  Mail,
  Sparkles,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sList, sNum, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DarkTestimonialCarousel } from "@/components/site/dark-testimonial-carousel";
import { StatCounter } from "@/components/site/stat-counter";
import { FadeIn, Stagger, StaggerItem, Parallax, TextReveal } from "@/components/site/motion";
import { Marquee } from "@/components/site/marquee";

function SectionTag({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] ${
        light ? "text-accent" : "text-primary"
      }`}
    >
      <span className={`block h-0.5 w-8 rounded-full ${light ? "bg-accent" : "bg-primary"}`} />
      {children}
    </p>
  );
}

/** Turn an admin-entered link into a locale-aware href. */
function link(locale: string, value: string): string {
  const target = value || "/";
  if (/^(https?:)?\/\//.test(target) || target.startsWith("mailto:") || target.startsWith("tel:"))
    return target;
  return `/${locale}${target.startsWith("/") ? target : `/${target}`}`;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = params.locale;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "hero_title", locale) || siteName || undefined;
  const description =
    s(settings, "hero_subtitle", locale) || s(settings, "site_tagline", locale) || undefined;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  // How many items each list section shows is configurable in the admin.
  const servicesCount = sNum(settings, "home_services_count", 6);
  const projectsCount = sNum(settings, "home_projects_count", 4);
  const newsCount = sNum(settings, "home_news_count", 3);
  const eventsCount = sNum(settings, "home_events_count", 2);

  const [stats, services, projects, news, events, testimonials, partners] = await Promise.all([
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: servicesCount,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: projectsCount,
    }),
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: newsCount,
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: eventsCount,
    }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
  ]);

  /* ------------------------------- Content ------------------------------- */
  const siteName = s(settings, "site_name", locale);
  const phone = s(settings, "phone");
  const email = s(settings, "email");
  const address = s(settings, "address", locale);

  const heroImage = s(settings, "hero_image");
  const heroTitle = s(settings, "hero_title", locale);
  const heroBadge = s(settings, "hero_badge", locale);
  const heroSubtitle = s(settings, "hero_subtitle", locale);
  const heroCta1 = s(settings, "hero_cta1_label", locale);
  const heroCta2 = s(settings, "hero_cta2_label", locale);

  const aboutTitle = s(settings, "home_about_title", locale) || siteName;
  const aboutText = s(settings, "home_about_text", locale) || s(settings, "about_overview", locale);
  const aboutImage = s(settings, "home_about_image");
  const aboutCaption = s(settings, "home_about_caption", locale);
  const aboutLinkLabel = s(settings, "home_about_link_label", locale);
  const aboutEyebrow = s(settings, "home_about_eyebrow", locale);
  const aboutBadge = s(settings, "home_about_badge", locale);

  const statsTitle = s(settings, "home_stats_title", locale);
  const statsImage = s(settings, "home_stats_image");

  const servicesTitle = s(settings, "home_services_title", locale);
  const servicesText = s(settings, "home_services_text", locale);
  const servicesLinkLabel = s(settings, "home_services_link_label", locale);
  const servicesEyebrow = s(settings, "home_services_eyebrow", locale);

  const projectsTitle = s(settings, "home_projects_title", locale);
  const projectsText = s(settings, "home_projects_text", locale);
  const projectsLinkLabel = s(settings, "home_projects_link_label", locale);
  const projectsEyebrow = s(settings, "home_projects_eyebrow", locale);

  const contactTitle = s(settings, "home_contact_title", locale);
  const contactText = s(settings, "home_contact_text", locale);
  const contactCardTitle = s(settings, "home_contact_card_title", locale);
  const contactImage = s(settings, "home_contact_image");
  const contactButton = s(settings, "home_contact_button", locale);

  const testimonialsTitle = s(settings, "home_testimonials_title", locale);
  const testimonialsEyebrow = s(settings, "home_testimonials_eyebrow", locale);
  const newsTitle = s(settings, "home_news_title", locale);
  const newsEyebrow = s(settings, "home_news_eyebrow", locale);
  const eventsTitle = s(settings, "home_events_title", locale);
  const eventsEyebrow = s(settings, "home_events_eyebrow", locale);
  const eventsLinkLabel = s(settings, "home_events_link_label", locale);
  const partnersTitle = s(settings, "home_partners_title", locale);
  const partnersEyebrow = s(settings, "home_partners_eyebrow", locale);

  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);
  const donateButton = s(settings, "home_donate_button", locale);
  const donateButton2 = s(settings, "home_donate_button2", locale);
  const donateEyebrow = s(settings, "home_donate_eyebrow", locale);

  /* ---------------------- Which sections actually render ------------------ */
  const showHero = Boolean(heroTitle || heroSubtitle || heroBadge);
  const showAbout = show(settings, "show_home_about", aboutText, aboutImage);
  const showStats = show(settings, "show_home_stats", stats);
  const showServices = show(settings, "show_home_services", services);
  const showProjects = show(settings, "show_home_projects", projects);
  const showContact = show(settings, "show_home_contact", contactTitle, contactText, phone, email);
  const showTestimonials = show(settings, "show_home_testimonials", testimonials);
  const showNews = show(settings, "show_home_news", news);
  const showEvents = show(settings, "show_home_events", events);
  const showPartners = show(settings, "show_home_partners", partners);
  const showDonate = show(settings, "show_home_donate", donateTitle, donateText);

  const highlightTints = [
    "bg-primary text-white",
    "bg-secondary text-white",
    "bg-accent/90 text-white",
    "bg-primary text-white",
  ];
  const trustBullets = sList(settings, "home_about_points", locale);
  const compactServices = services.slice(0, 4);
  const tickerItems = sList(settings, "home_marquee_items", locale);
  const showTicker = show(settings, "show_home_marquee", tickerItems);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      {showHero && (
        <section
          id="sec-hero"
          className="relative flex min-h-[92vh] flex-col overflow-hidden bg-secondary text-white md:min-h-[86vh]"
        >
          {heroImage && (
            <div className="absolute inset-0 overflow-hidden">
              <Parallax travel={26} className="h-full w-full scale-110">
                <div
                  className="h-full w-full bg-cover bg-center opacity-45"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              </Parallax>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/40" />
            </div>
          )}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-primary/25 blur-3xl" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 py-28 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-2xl">
              {heroBadge && (
                <FadeIn immediate>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                    {heroBadge}
                  </span>
                </FadeIn>
              )}
              {heroTitle && (
                <TextReveal
                  as="h1"
                  text={heroTitle}
                  delay={0.08}
                  className="mb-6 mt-6 block text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
                />
              )}
              {heroSubtitle && (
                <FadeIn immediate delay={0.2}>
                  <p className="max-w-lg whitespace-pre-line leading-relaxed text-white/70">
                    {heroSubtitle}
                  </p>
                </FadeIn>
              )}
              {(heroCta1 || heroCta2) && (
                <FadeIn immediate delay={0.3} className="mt-9 flex flex-wrap items-center gap-6">
                  {heroCta1 && (
                    <Button asChild size="lg" className="rounded-full bg-primary px-8 hover:bg-primary/90">
                      <Link href={link(locale, s(settings, "hero_cta1_link"))}>
                        {heroCta1} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {heroCta2 && (
                    <Link
                      href={link(locale, s(settings, "hero_cta2_link"))}
                      className="text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
                    >
                      {heroCta2}
                    </Link>
                  )}
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Trust bar — scrolling marquee                                       */}
      {/* ------------------------------------------------------------------ */}
      {showTicker && (
        <section id="sec-hero-marquee" className="overflow-hidden border-b border-border bg-secondary py-3 text-white">
          <Marquee items={tickerItems} className="text-white/70" />
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Quick highlights strip                                              */}
      {/* ------------------------------------------------------------------ */}
      {showServices && services.length > 0 && (
        <section id="sec-highlights" className="border-b border-border bg-muted/40">
          <div className="container">
            <Stagger className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {services.slice(0, 3).map((service) => (
                <StaggerItem key={service.id}>
                  <Link
                    href={`/${locale}/services/${service.slug ?? service.id}`}
                    className="group flex items-center gap-4 px-2 py-6 transition-colors duration-300 hover:text-primary sm:px-8"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-xl text-primary transition-transform duration-300 group-hover:scale-105">
                      {service.icon || <ShieldCheck className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {loc(service, "title", locale)}
                      </h3>
                      <p className="line-clamp-1 text-sm leading-relaxed text-muted-foreground">
                        {loc(service, "description", locale)}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Trusted non-profit — split with photo badges                        */}
      {/* ------------------------------------------------------------------ */}
      {showAbout && (
        <section id="sec-about" className="container py-20 md:py-28">
          <div className={`grid items-center gap-14 ${aboutImage ? "lg:grid-cols-[0.9fr_1.1fr]" : ""}`}>
            {aboutImage && (
              <FadeIn className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-card">
                  <div className="aspect-[4/5] overflow-hidden">
                    <Parallax travel={22} className="h-full w-full scale-110">
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${aboutImage})` }}
                      />
                    </Parallax>
                  </div>
                </div>
                {aboutCaption && (
                  <div className="glass-light absolute -bottom-6 left-6 right-10 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-pop sm:right-auto sm:w-72">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{aboutCaption}</p>
                  </div>
                )}
                {aboutBadge && (
                  <div className="glass-light absolute -top-5 right-6 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-pop">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Heart className="h-4 w-4" />
                    </span>
                    <p className="max-w-[9rem] text-xs font-semibold leading-snug text-foreground">
                      {aboutBadge}
                    </p>
                  </div>
                )}
              </FadeIn>
            )}

            <FadeIn delay={0.1}>
              <div className="mb-6 space-y-3">
                {aboutEyebrow && <SectionTag light>{aboutEyebrow}</SectionTag>}
                {aboutTitle && (
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {aboutTitle}
                  </h2>
                )}
              </div>
              {aboutText && (
                <p className="max-w-xl whitespace-pre-line leading-relaxed text-muted-foreground">
                  {aboutText}
                </p>
              )}
              {trustBullets.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {trustBullets.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm font-medium leading-relaxed text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
              {aboutLinkLabel && (
                <Button asChild className="mt-8 rounded-full bg-primary px-8 hover:bg-primary/90">
                  <Link href={`/${locale}/about`}>
                    {aboutLinkLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </FadeIn>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Impact stats                                                        */}
      {/* ------------------------------------------------------------------ */}
      {showStats && (
        <section id="sec-stats" className="relative overflow-hidden bg-secondary py-20 text-white md:py-28">
          {statsImage && (
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <Parallax travel={26} className="h-full w-full scale-110">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${statsImage})` }}
                />
              </Parallax>
            </div>
          )}

          <div className="container relative">
            {statsTitle && (
              <FadeIn className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{statsTitle}</h2>
              </FadeIn>
            )}
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {stats.map((stat) => (
                <StaggerItem key={stat.id}>
                  <div className="glass-dark rounded-2xl p-7 text-center transition-colors duration-300 hover:bg-white/[0.08]">
                    <p className="font-number text-3xl font-bold md:text-4xl">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-2.5 text-sm text-white/60">{loc(stat, "label", locale)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Compact services grid — "Helping The Poor" style                    */}
      {/* ------------------------------------------------------------------ */}
      {compactServices.length > 0 && (
        <section id="sec-services" className="bg-brand-50/60 py-20 md:py-28">
          <div className="container">
            <FadeIn className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
              {servicesEyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {servicesEyebrow}
                </p>
              )}
              {servicesTitle && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {servicesTitle}
                </h2>
              )}
            </FadeIn>
            <Stagger className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {compactServices.map((service, i) => (
                <StaggerItem key={service.id}>
                  <Link
                    href={`/${locale}/services/${service.slug ?? service.id}`}
                    className="group flex h-full flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full text-2xl transition-transform duration-300 group-hover:scale-105 ${highlightTints[i % highlightTints.length]}`}
                    >
                      {service.icon || <ShieldCheck className="h-6 w-6" />}
                    </span>
                    <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {loc(service, "title", locale)}
                    </h3>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
            {servicesLinkLabel && (
              <FadeIn className="mt-14 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full bg-white px-8">
                  <Link href={`/${locale}/services`}>{servicesLinkLabel}</Link>
                </Button>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Causes — featured projects, no fabricated progress data             */}
      {/* ------------------------------------------------------------------ */}
      {showProjects && (
        <section id="sec-projects" className="container py-20 md:py-28">
          <FadeIn className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
            {projectsEyebrow && <SectionTag>{projectsEyebrow}</SectionTag>}
            {projectsTitle && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {projectsTitle}
              </h2>
            )}
            {projectsText && <p className="leading-relaxed text-muted-foreground">{projectsText}</p>}
          </FadeIn>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <StaggerItem key={project.id} className="h-full">
                <Link
                  href={`/${locale}/projects/${project.slug ?? project.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.image ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${project.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FolderKanban className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge className="absolute left-4 top-4 border-0 bg-primary font-medium capitalize text-white">
                      {(dict.common as any)[project.status] ?? project.status}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {loc(project, "title", locale)}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {loc(project, "description", locale)}
                    </p>
                    <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-primary/90">
                      {dict.common.readMore}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          {projectsLinkLabel && (
            <FadeIn className="mt-14 text-center">
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href={`/${locale}/projects`}>{projectsLinkLabel}</Link>
              </Button>
            </FadeIn>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CTA banner                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showDonate && (donateButton2 || donateButton) && (
        <section id="sec-donate" className="container pb-20 md:pb-28">
          <FadeIn className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-8 py-10 text-center text-white shadow-pop sm:flex-row sm:justify-between sm:text-left md:px-14">
            {donateEyebrow && (
              <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-white/70 sm:block">
                {donateEyebrow}
              </p>
            )}
            <h2 className="max-w-xl text-2xl font-bold leading-tight md:text-3xl">{donateTitle}</h2>
            {donateButton2 && (
              <Button asChild size="lg" className="shrink-0 rounded-full bg-secondary px-8 hover:bg-secondary/90">
                <Link href={`/${locale}/contact`}>
                  {donateButton2} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </FadeIn>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Dark video / contact-donate section                                 */}
      {/* ------------------------------------------------------------------ */}
      {showContact && (
        <section id="sec-contact" className="relative overflow-hidden bg-secondary py-24 text-white md:py-32">
          {contactImage && (
            <div className="absolute inset-0 overflow-hidden">
              <Parallax travel={26} className="h-full w-full scale-110">
                <div
                  className="h-full w-full bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${contactImage})` }}
                />
              </Parallax>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary via-secondary/85 to-primary/40 mix-blend-multiply" />
            </div>
          )}

          <div className="container relative flex flex-col items-center gap-8 text-center">
            <div className="max-w-2xl space-y-4">
              {contactCardTitle && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {contactCardTitle}
                </p>
              )}
              {contactTitle && <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{contactTitle}</h2>}
              {contactText && (
                <p className="whitespace-pre-line leading-relaxed text-white/70">{contactText}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {contactButton && (
                <Button asChild size="lg" className="rounded-full bg-primary px-8 hover:bg-primary/90">
                  <Link href={`/${locale}/contact`}>
                    <Heart className="h-4 w-4" /> {contactButton}
                  </Link>
                </Button>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
                >
                  <PhoneCall className="h-4 w-4 text-primary" /> {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
                >
                  <Mail className="h-4 w-4 text-primary" /> {email}
                </a>
              )}
            </div>
            {address && <p className="whitespace-pre-line text-xs text-white/50">{address}</p>}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Partners — static row                                               */}
      {/* ------------------------------------------------------------------ */}
      {showPartners && (
        <section id="sec-partners" className="container py-16 md:py-20">
          {partnersTitle && (
            <FadeIn className="mx-auto mb-10 max-w-2xl text-center">
              {partnersEyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {partnersEyebrow}
                </p>
              )}
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {partnersTitle}
              </h2>
            </FadeIn>
          )}
          <Stagger className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-5">
            {partners.map((partner) => (
              <StaggerItem key={partner.id}>
                <div className="flex h-14 items-center justify-center">
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-full w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">{partner.name}</span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Upcoming events + donation card                                     */}
      {/* ------------------------------------------------------------------ */}
      {showEvents && (
        <section id="sec-events" className="bg-muted/60 py-20 md:py-28">
          <div className="container grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <FadeIn className="mb-8 space-y-3">
                {eventsEyebrow && <SectionTag>{eventsEyebrow}</SectionTag>}
                {eventsTitle && (
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{eventsTitle}</h2>
                )}
              </FadeIn>
              <Stagger className="space-y-5">
                {events.map((event) => (
                  <StaggerItem key={event.id}>
                    <Link
                      href={`/${locale}/events/${event.slug ?? event.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover sm:p-6"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
                        <span className="font-number text-xl font-bold leading-none">
                          {new Date(event.startDate).getDate()}
                        </span>
                        <span className="mt-0.5 text-[10px] uppercase">
                          {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                          {loc(event, "title", locale)}
                        </h3>
                        {event.location && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 text-primary" /> {event.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
                {eventsLinkLabel && (
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link href={`/${locale}/events`}>
                      <CalendarDays className="h-4 w-4" /> {eventsLinkLabel}
                    </Link>
                  </Button>
                )}
              </Stagger>
            </div>

            {donateTitle && (
              <FadeIn delay={0.1} className="relative overflow-hidden rounded-3xl bg-secondary p-8 text-white shadow-pop">
                <Sparkles className="mb-5 h-8 w-8 text-accent" />
                <h3 className="text-xl font-bold leading-tight">{donateTitle}</h3>
                {donateText && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70">{donateText}</p>
                )}
                {donateButton && (
                  <Button asChild className="mt-6 w-full rounded-full bg-primary hover:bg-primary/90">
                    <Link href={`/${locale}/donate`}>
                      {donateButton} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Testimonials — dark, centered, no star ratings                      */}
      {/* ------------------------------------------------------------------ */}
      {showTestimonials && (
        <section id="sec-testimonials" className="bg-secondary py-20 text-white md:py-28">
          <div className="container">
            <FadeIn className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
              {testimonialsEyebrow && (
                <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  <span className="h-px w-8 bg-white/25" />
                  {testimonialsEyebrow}
                  <span className="h-px w-8 bg-white/25" />
                </p>
              )}
              {testimonialsTitle && (
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{testimonialsTitle}</h2>
              )}
            </FadeIn>
            <div className="relative mx-auto max-w-3xl">
              <DarkTestimonialCarousel
                edgeArrows
                items={testimonials.map((t) => ({
                  quote: loc(t, "quote", locale),
                  author: loc(t, "author", locale),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* News & insights                                                     */}
      {/* ------------------------------------------------------------------ */}
      {showNews && (
        <section id="sec-news" className="bg-muted/60 py-20 md:py-28">
          <div className="container">
            <FadeIn className="mb-14 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
              <div className="space-y-3">
                {newsEyebrow && <SectionTag>{newsEyebrow}</SectionTag>}
                {newsTitle && (
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{newsTitle}</h2>
                )}
              </div>
              <Button asChild variant="outline" className="rounded-full bg-white px-6">
                <Link href={`/${locale}/news`}>{dict.common.readMore}</Link>
              </Button>
            </FadeIn>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <StaggerItem key={item.id} className="h-full">
                  <Link
                    href={`/${locale}/news/${item.slug ?? item.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {item.image ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                        {formatDate(item.publishedAt, locale)}
                      </p>
                      <h3 className="line-clamp-2 font-bold text-foreground transition-colors group-hover:text-primary">
                        {loc(item, "title", locale)}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                        {dict.common.readMore}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
