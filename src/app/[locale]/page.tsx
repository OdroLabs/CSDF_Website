import type { Metadata } from "next";
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
  Mail,
  Sparkles,
  FolderKanban,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sList, sNum, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
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
  const heroPoints = sList(settings, "hero_points", locale);
  const heroFootnote = s(settings, "hero_footnote", locale);
  const heroCta1 = s(settings, "hero_cta1_label", locale);
  const heroCta2 = s(settings, "hero_cta2_label", locale);

  const aboutTitle = s(settings, "home_about_title", locale);
  const aboutText = s(settings, "home_about_text", locale);
  const aboutImage = s(settings, "home_about_image");
  const aboutCaption = s(settings, "home_about_caption", locale);
  const aboutLinkLabel = s(settings, "home_about_link_label", locale);

  const statsTitle = s(settings, "home_stats_title", locale);
  const statsImage = s(settings, "home_stats_image");

  const servicesTitle = s(settings, "home_services_title", locale);
  const servicesText = s(settings, "home_services_text", locale);
  const servicesLinkLabel = s(settings, "home_services_link_label", locale);

  const projectsTitle = s(settings, "home_projects_title", locale);
  const projectsText = s(settings, "home_projects_text", locale);
  const projectsLinkLabel = s(settings, "home_projects_link_label", locale);

  const contactTitle = s(settings, "home_contact_title", locale);
  const contactText = s(settings, "home_contact_text", locale);
  const contactCardTitle = s(settings, "home_contact_card_title", locale);
  const contactImage = s(settings, "home_contact_image");
  const contactButton = s(settings, "home_contact_button", locale);

  const testimonialsTitle = s(settings, "home_testimonials_title", locale);
  const newsTitle = s(settings, "home_news_title", locale);
  const eventsTitle = s(settings, "home_events_title", locale);
  const eventsLinkLabel = s(settings, "home_events_link_label", locale);
  const partnersTitle = s(settings, "home_partners_title", locale);

  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);
  const donateButton = s(settings, "home_donate_button", locale);
  const donateButton2 = s(settings, "home_donate_button2", locale);

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
  const showNewsEvents = showNews || showEvents;
  const showPartners = show(settings, "show_home_partners", partners);
  const showDonate = show(settings, "show_home_donate", donateTitle, donateText);

  const pointIcons = [ShieldCheck, Heart, Users, HandHeart];
  const avatarColors = ["bg-teal-500", "bg-indigo-500", "bg-violet-500", "bg-pink-500"];
  const heroAvatars = testimonials
    .map((t) => loc(t, "author", locale))
    .filter(Boolean)
    .slice(0, 4)
    .map((name) => name.trim().charAt(0).toUpperCase());
  const heroBlurbTitle = heroPoints[0];
  const heroChips = heroPoints.slice(1, 4);
  const heroStat = stats[0];
  const tickerItems = [aboutTitle, servicesTitle, projectsTitle, testimonialsTitle, donateTitle].filter(
    Boolean
  ) as string[];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero — full screen                                                  */}
      {/* ------------------------------------------------------------------ */}
      {showHero && (
        <section
          id="sec-hero"
          className="relative flex min-h-[100svh] flex-col overflow-hidden bg-secondary text-white md:h-[100svh] md:min-h-[720px]"
        >
          {/* Photo, layered with the brand duotone instead of a flat color wash */}
          {heroImage && (
            <div className="absolute inset-0 overflow-hidden">
              <Parallax travel={26} className="h-full w-full scale-110">
                <div
                  className="h-full w-full bg-cover bg-center opacity-40"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              </Parallax>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary via-secondary/85 to-primary/50 mix-blend-multiply" />
              <div className="pointer-events-none absolute inset-0 bg-secondary/25" />
            </div>
          )}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-primary/25 blur-3xl" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1680px] min-h-0 flex-1 flex-col justify-center gap-8 overflow-y-auto px-5 pb-10 pt-24 sm:px-8 md:gap-14 md:px-12 md:pt-32 lg:px-16">
            <div className="max-w-4xl">
              {heroBadge && (
                <FadeIn immediate>
                  <div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-5 backdrop-blur">
                    {heroAvatars.length > 0 && (
                      <span className="flex -space-x-2">
                        {heroAvatars.map((initial, i) => (
                          <span
                            key={i}
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-secondary ${
                              avatarColors[i % avatarColors.length]
                            }`}
                          >
                            {initial}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="text-xs font-semibold tracking-tight text-white/90 md:text-sm">
                      {heroBadge}
                    </span>
                  </div>
                </FadeIn>
              )}
              {heroTitle && (
                <TextReveal
                  as="h1"
                  text={heroTitle}
                  delay={0.08}
                  className="mb-8 mt-6 block text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-6xl lg:text-7xl"
                />
              )}
              {(heroCta1 || heroCta2) && (
                <FadeIn immediate delay={0.18} className="flex flex-wrap items-center gap-5">
                  {heroCta1 && (
                    <Link
                      href={link(locale, s(settings, "hero_cta1_link"))}
                      className="group inline-flex items-center rounded-full bg-white p-1.5 pl-6 text-secondary shadow-pop transition-transform duration-200 ease-premium hover:scale-[1.02]"
                    >
                      <span className="text-sm font-bold md:text-base">{heroCta1}</span>
                      <span className="ml-5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-200 group-hover:translate-x-0.5">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </Link>
                  )}
                  {heroCta2 && (
                    <Link
                      href={link(locale, s(settings, "hero_cta2_link"))}
                      className="text-sm font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline"
                    >
                      {heroCta2}
                    </Link>
                  )}
                </FadeIn>
              )}
            </div>

            {/* Bottom row: comprehensive-care blurb + floating stat/tag cards */}
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              {(heroBlurbTitle || heroSubtitle) && (
                <FadeIn immediate delay={0.28} className="max-w-lg">
                  {heroBlurbTitle && <h2 className="mb-2 text-lg font-bold text-white">{heroBlurbTitle}</h2>}
                  {heroSubtitle && (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                      {heroSubtitle}
                    </p>
                  )}
                </FadeIn>
              )}

              {(heroStat || heroChips.length > 0) && (
                <FadeIn
                  immediate
                  delay={0.36}
                  className="flex flex-wrap items-end justify-start gap-5 lg:justify-end"
                >
                  {heroChips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5 lg:w-[170px] lg:flex-col lg:items-stretch">
                      {heroChips.map((chip, i) => (
                        <span
                          key={i}
                          className={`rounded-full px-4 py-2 text-center text-xs font-semibold shadow-soft ${
                            i % 2 === 0
                              ? "bg-white text-secondary"
                              : "border border-white/25 bg-white/10 text-white backdrop-blur"
                          } ${i === 1 ? "lg:ml-6" : ""}`}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  {heroStat && (
                    <div className="w-[220px] max-w-full rounded-3xl bg-white p-6 text-secondary shadow-pop">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {loc(heroStat, "label", locale)}
                      </p>
                      <p className="mt-2 font-number text-4xl font-bold text-primary">
                        <StatCounter value={heroStat.value} />
                      </p>
                      {heroFootnote && (
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{heroFootnote}</p>
                      )}
                    </div>
                  )}
                </FadeIn>
              )}
            </div>
          </div>

          {/* Bottom ticker */}
          {tickerItems.length > 0 && (
            <div className="relative z-10 border-t border-white/10 bg-black/10 py-3">
              <Marquee items={tickerItems} className="text-white/70" />
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Who we are                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showAbout && (
        <section id="sec-about" className="container py-20 md:py-28">
          <div className={`grid items-center gap-12 ${aboutImage ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
            <FadeIn>
              <div className="mb-6 space-y-3">
                {s(settings, "home_about_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_about_eyebrow", locale)}</SectionTag>
                )}
                {aboutTitle && (
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {aboutTitle}
                  </h2>
                )}
              </div>
              {aboutText && (
                <p className="max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
                  {aboutText}
                </p>
              )}
              {aboutLinkLabel && (
                <Button asChild variant="link" className="mt-4 px-0 font-semibold">
                  <Link href={`/${locale}/about`}>
                    {aboutLinkLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </FadeIn>

            {aboutImage && (
              <FadeIn delay={0.12} className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-card">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Parallax travel={22} className="h-full w-full scale-110">
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${aboutImage})` }}
                      />
                    </Parallax>
                  </div>
                  {aboutCaption && (
                    <div className="glass-light absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl px-5 py-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{aboutCaption}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            )}
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
            {(statsTitle || s(settings, "home_stats_eyebrow", locale)) && (
              <FadeIn className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
                {s(settings, "home_stats_eyebrow", locale) && (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {s(settings, "home_stats_eyebrow", locale)}
                  </p>
                )}
                {statsTitle && <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{statsTitle}</h2>}
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
      {/* Services                                                            */}
      {/* ------------------------------------------------------------------ */}
      {showServices && (
        <section id="sec-services" className="container py-20 md:py-28">
          {(servicesTitle || servicesText || s(settings, "home_services_eyebrow", locale)) && (
            <FadeIn className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
              {s(settings, "home_services_eyebrow", locale) && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {s(settings, "home_services_eyebrow", locale)}
                </p>
              )}
              {servicesTitle && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {servicesTitle}
                </h2>
              )}
              {servicesText && <p className="leading-relaxed text-muted-foreground">{servicesText}</p>}
            </FadeIn>
          )}
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <Link
                  href={`/${locale}/services/${service.slug ?? service.id}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
                >
                  {service.icon && (
                    <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl bg-brand-50 text-2xl transition-transform duration-300 group-hover:scale-105">
                      {service.icon}
                    </span>
                  )}
                  <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {loc(service, "title", locale)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {loc(service, "description", locale)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {dict.common.readMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          {servicesLinkLabel && (
            <FadeIn className="mt-14 text-center">
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href={`/${locale}/services`}>{servicesLinkLabel}</Link>
              </Button>
            </FadeIn>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Featured projects                                                   */}
      {/* ------------------------------------------------------------------ */}
      {showProjects && (
        <section id="sec-projects" className="bg-muted/60 py-20 md:py-28">
          <div className="container">
            {(projectsTitle || projectsText || s(settings, "home_projects_eyebrow", locale)) && (
              <FadeIn className="mb-14 max-w-3xl space-y-3">
                {s(settings, "home_projects_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_projects_eyebrow", locale)}</SectionTag>
                )}
                {projectsTitle && (
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {projectsTitle}
                  </h2>
                )}
                {projectsText && <p className="leading-relaxed text-muted-foreground">{projectsText}</p>}
              </FadeIn>
            )}
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <StaggerItem key={project.id} className="h-full">
                  <Link
                    href={`/${locale}/projects/${project.slug ?? project.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
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
                      <Badge className="glass-light absolute left-4 top-4 border-0 font-medium capitalize text-foreground">
                        {(dict.common as any)[project.status] ?? project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-6">
                      <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {loc(project, "title", locale)}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {loc(project, "description", locale)}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
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
                <Button asChild variant="outline" size="lg" className="bg-white px-8">
                  <Link href={`/${locale}/projects`}>{projectsLinkLabel}</Link>
                </Button>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Get in touch                                                        */}
      {/* ------------------------------------------------------------------ */}
      {showContact && (
        <section id="sec-contact" className="relative overflow-hidden bg-secondary py-20 text-white md:py-28">
          {contactImage && (
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <Parallax travel={26} className="h-full w-full scale-110">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${contactImage})` }}
                />
              </Parallax>
            </div>
          )}

          <div className="container relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <FadeIn>
              <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-destructive p-10 text-center shadow-pop">
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-2 ring-white/25">
                  <PhoneCall className="h-6 w-6" />
                </span>
                {contactCardTitle && <h3 className="text-2xl font-bold">{contactCardTitle}</h3>}
                <span className="mx-auto my-4 block h-0.5 w-8 rounded-full bg-white/40" />
                {address && <p className="whitespace-pre-line text-sm text-white/90">{address}</p>}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="mt-4 block font-number text-xl font-bold hover:underline"
                  >
                    {phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/90 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" /> {email}
                  </a>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.12}>
              {s(settings, "home_contact_eyebrow", locale) && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  {s(settings, "home_contact_eyebrow", locale)}
                </p>
              )}
              {contactTitle && (
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{contactTitle}</h2>
              )}
              {contactText && (
                <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-white/70">{contactText}</p>
              )}
              {contactButton && (
                <Button asChild size="lg" className="mt-8 bg-destructive px-8 hover:bg-destructive/90">
                  <Link href={`/${locale}/contact`}>
                    {contactButton} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </FadeIn>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Testimonials                                                        */}
      {/* ------------------------------------------------------------------ */}
      {showTestimonials && (
        <section id="sec-testimonials" className="container py-20 md:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <FadeIn className="space-y-3">
              {s(settings, "home_testimonials_eyebrow", locale) && (
                <SectionTag>{s(settings, "home_testimonials_eyebrow", locale)}</SectionTag>
              )}
              {testimonialsTitle && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {testimonialsTitle}
                </h2>
              )}
            </FadeIn>
            <FadeIn delay={0.12}>
              <div className="rounded-3xl border border-border bg-white p-8 shadow-card md:p-10">
                <TestimonialCarousel
                  items={testimonials.map((t) => ({
                    quote: loc(t, "quote", locale),
                    author: loc(t, "author", locale),
                  }))}
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* News + Events                                                       */}
      {/* ------------------------------------------------------------------ */}
      {showNewsEvents && (
        <section
          className={`container grid gap-12 pb-20 md:pb-28 ${
            showNews && showEvents ? "lg:grid-cols-2" : ""
          }`}
        >
          {showNews && (
            <div id="sec-news">
              <FadeIn className="mb-8 space-y-3">
                {s(settings, "home_news_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_news_eyebrow", locale)}</SectionTag>
                )}
                {newsTitle && (
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{newsTitle}</h2>
                )}
              </FadeIn>
              <Stagger className="grid gap-5">
                {news.map((item) => (
                  <StaggerItem key={item.id}>
                    <Link
                      href={`/${locale}/news/${item.slug ?? item.id}`}
                      className="group flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
                    >
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {item.image ? (
                          <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Sparkles className="h-5 w-5 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 py-0.5">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                          {formatDate(item.publishedAt, locale)}
                        </p>
                        <h3 className="line-clamp-2 font-bold text-foreground transition-colors group-hover:text-primary">
                          {loc(item, "title", locale)}
                        </h3>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
          {showEvents && (
            <div id="sec-events">
              <FadeIn delay={0.1} className="mb-8 space-y-3">
                {s(settings, "home_events_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_events_eyebrow", locale)}</SectionTag>
                )}
                {eventsTitle && (
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{eventsTitle}</h2>
                )}
              </FadeIn>
              <Stagger className="space-y-5">
                {events.map((event) => (
                  <StaggerItem key={event.id}>
                    <Link
                      href={`/${locale}/events/${event.slug ?? event.id}`}
                      className="group flex gap-4 rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
                        <span className="font-number text-xl font-bold leading-none">
                          {new Date(event.startDate).getDate()}
                        </span>
                        <span className="mt-0.5 text-[10px] uppercase">
                          {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                        </span>
                      </div>
                      <div>
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
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/${locale}/events`}>
                      <CalendarDays className="h-4 w-4" /> {eventsLinkLabel}
                    </Link>
                  </Button>
                )}
              </Stagger>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Partners                                                            */}
      {/* ------------------------------------------------------------------ */}
      {showPartners && (
        <section id="sec-partners" className="container pb-20 md:pb-28">
          {(partnersTitle || s(settings, "home_partners_eyebrow", locale)) && (
            <FadeIn className="mx-auto mb-10 max-w-2xl text-center">
              {s(settings, "home_partners_eyebrow", locale) && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {s(settings, "home_partners_eyebrow", locale)}
                </p>
              )}
              {partnersTitle && (
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {partnersTitle}
                </h2>
              )}
            </FadeIn>
          )}
          <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <StaggerItem key={partner.id}>
                <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-white px-4 py-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-soft">
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-10 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground">{partner.name}</span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Donate CTA                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showDonate && (
        <section id="sec-donate" className="container pb-20 md:pb-28">
          <FadeIn
            className="relative grid items-center gap-8 overflow-hidden rounded-3xl bg-secondary p-10 text-white shadow-pop md:grid-cols-[1.2fr_auto] md:p-14"
          >
            <div className="relative">
              {s(settings, "home_donate_eyebrow", locale) && (
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  <span className="block h-0.5 w-8 rounded-full bg-accent" />
                  {s(settings, "home_donate_eyebrow", locale)}
                </p>
              )}
              {donateTitle && <h2 className="mt-4 max-w-2xl text-2xl font-bold md:text-4xl">{donateTitle}</h2>}
              {donateText && (
                <p className="mt-3 max-w-xl whitespace-pre-line leading-relaxed text-white/70">{donateText}</p>
              )}
            </div>
            {(donateButton || donateButton2) && (
              <div className="relative flex flex-wrap gap-3">
                {donateButton && (
                  <Button asChild size="lg" className="bg-white px-8 text-secondary hover:bg-white/90">
                    <Link href={`/${locale}/donate`}>
                      <Heart className="h-4 w-4 fill-destructive text-destructive" /> {donateButton}
                    </Link>
                  </Button>
                )}
                {donateButton2 && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <Link href={`/${locale}/contact`}>{donateButton2}</Link>
                  </Button>
                )}
              </div>
            )}
          </FadeIn>
        </section>
      )}
    </>
  );
}
