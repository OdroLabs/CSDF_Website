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
import { Curve } from "@/components/site/curve";

function SectionTag({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] ${
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

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      {showHero && (
        <section id="sec-hero" className="relative flex min-h-[82svh] items-center overflow-hidden bg-navy-950 pb-24 pt-16 text-white md:pb-32 md:pt-24">
          {/* Photo with parallax, fading in from the right */}
          {heroImage && (
            <div className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-3/4">
              <div
                data-parallax="8"
                className="absolute -inset-y-[12%] inset-x-0 scale-110 bg-cover bg-center opacity-30 lg:opacity-60"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-900/35" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          {/* Cyan glow */}
          <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

          <div
            className={`container relative z-10 grid items-center gap-12 ${
              heroPoints.length > 0 ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
            }`}
          >
            <div>
              {heroBadge && (
                <p
                  data-hero
                  className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-accent"
                >
                  <span className="block h-0.5 w-10 bg-gradient-to-r from-accent to-brand-400" />
                  {heroBadge}
                </p>
              )}
              {heroTitle && (
                <h1
                  data-hero
                  className="mb-6 mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl"
                >
                  {heroTitle}
                </h1>
              )}
              {heroSubtitle && (
                <p
                  data-hero
                  className="mb-9 max-w-xl whitespace-pre-line leading-relaxed text-white/75 md:text-lg"
                >
                  {heroSubtitle}
                </p>
              )}
              {(heroCta1 || heroCta2) && (
                <div data-hero className="flex flex-wrap gap-4">
                  {heroCta1 && (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-accent px-8 font-bold text-navy-950 shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
                    >
                      <Link href={link(locale, s(settings, "hero_cta1_link"))}>
                        {heroCta1} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {heroCta2 && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/30 bg-white/5 px-8 font-semibold text-white backdrop-blur hover:border-white/50 hover:bg-white/15 hover:text-white"
                    >
                      <Link href={link(locale, s(settings, "hero_cta2_link"))}>
                        {heroCta2}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Commitment card — hidden when no highlight points are set */}
            {heroPoints.length > 0 && (
              <div data-hero className="glass-dark rounded-3xl p-8 shadow-glow md:p-9">
                <ul className="grid gap-5">
                  {heroPoints.map((point, i) => {
                    const Icon = pointIcons[i % pointIcons.length];
                    return (
                      <li key={i} className="flex items-center gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500/30 to-accent/20 ring-1 ring-white/15">
                          <Icon className="h-5 w-5 text-accent" />
                        </span>
                        <span className="text-sm font-medium text-white md:text-base">{point}</span>
                      </li>
                    );
                  })}
                </ul>
                {heroFootnote && (
                  <p className="mt-7 border-t border-white/15 pt-5 text-center text-sm text-white/60">
                    {heroFootnote}
                  </p>
                )}
              </div>
            )}
          </div>

          <Curve className="absolute inset-x-0 -bottom-px z-10 text-background" />
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Who we are                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showAbout && (
        <section id="sec-about" className="container py-20 md:py-28">
          <div
            className={`grid items-center gap-12 ${
              aboutImage ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
            }`}
          >
            <div data-animate>
              <div className="mb-6 space-y-3">
                {s(settings, "home_about_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_about_eyebrow", locale)}</SectionTag>
                )}
                {aboutTitle && (
                  <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
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
                <Button asChild variant="link" className="mt-4 px-0 font-bold">
                  <Link href={`/${locale}/about`}>
                    {aboutLinkLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {aboutImage && (
              <div data-animate data-delay="0.15" className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-100 via-transparent to-accent/10" />
                <div className="relative overflow-hidden rounded-3xl shadow-card-hover">
                  <div className="aspect-[4/3] overflow-hidden">
                    <div
                      data-parallax="7"
                      className="h-full w-full scale-110 bg-cover bg-center"
                      style={{ backgroundImage: `url(${aboutImage})` }}
                    />
                  </div>
                  {aboutCaption && (
                    <div className="glass-light absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl px-5 py-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent text-white">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-bold text-navy-900">{aboutCaption}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Impact stats — navy band with curves                                */}
      {/* ------------------------------------------------------------------ */}
      {showStats && (
        <section id="sec-stats">
          <Curve className="-mb-px text-navy-950" />
          <div className="relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
            {statsImage && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  data-parallax="10"
                  className="absolute -inset-y-[14%] inset-x-0 scale-110 bg-cover bg-center opacity-15"
                  style={{ backgroundImage: `url(${statsImage})` }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-transparent to-navy-950/70" />
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="container relative">
              {(statsTitle || s(settings, "home_stats_eyebrow", locale)) && (
                <div data-animate className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
                  {s(settings, "home_stats_eyebrow", locale) && (
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                      {s(settings, "home_stats_eyebrow", locale)}
                    </p>
                  )}
                  {statsTitle && (
                    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                      {statsTitle}
                    </h2>
                  )}
                  <span className="mx-auto block h-1 w-16 rounded-full bg-gradient-to-r from-accent to-brand-400" />
                </div>
              )}
              <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="glass-dark group rounded-3xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                  >
                    <p className="font-number text-3xl font-extrabold text-gradient md:text-4xl">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-2.5 text-sm text-white/70">{loc(stat, "label", locale)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Curve flip className="-mt-px text-navy-950" />
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Services                                                            */}
      {/* ------------------------------------------------------------------ */}
      {showServices && (
        <section id="sec-services" className="container py-16 md:py-24">
          {(servicesTitle || servicesText || s(settings, "home_services_eyebrow", locale)) && (
            <div data-animate className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              {s(settings, "home_services_eyebrow", locale) && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {s(settings, "home_services_eyebrow", locale)}
                </p>
              )}
              {servicesTitle && (
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
                  {servicesTitle}
                </h2>
              )}
              {servicesText && (
                <p className="leading-relaxed text-muted-foreground">{servicesText}</p>
              )}
              <span className="mx-auto block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
          )}
          <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/${locale}/services/${service.slug ?? service.id}`}
                className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-card-hover"
              >
                {/* Top accent that grows on hover */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />
                {service.icon && (
                  <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-2xl ring-1 ring-brand-100 transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </span>
                )}
                <h3 className="mb-2 text-lg font-bold text-navy-900 transition-colors group-hover:text-primary">
                  {loc(service, "title", locale)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {loc(service, "description", locale)}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {dict.common.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
            ))}
          </div>
          {servicesLinkLabel && (
            <div data-animate className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold">
                <Link href={`/${locale}/services`}>{servicesLinkLabel}</Link>
              </Button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Featured projects                                                   */}
      {/* ------------------------------------------------------------------ */}
      {showProjects && (
        <section id="sec-projects" className="relative overflow-hidden bg-muted/60 py-16 md:py-24">
          <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="container relative">
            {(projectsTitle || projectsText || s(settings, "home_projects_eyebrow", locale)) && (
              <div data-animate className="mb-12 max-w-3xl space-y-3">
                {s(settings, "home_projects_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_projects_eyebrow", locale)}</SectionTag>
                )}
                {projectsTitle && (
                  <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
                    {projectsTitle}
                  </h2>
                )}
                {projectsText && (
                  <p className="leading-relaxed text-muted-foreground">{projectsText}</p>
                )}
              </div>
            )}
            <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.slug ?? project.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  {project.image && (
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-navy-950/10 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                      <Badge className="glass-light absolute left-4 top-4 rounded-full border-0 font-semibold capitalize text-navy-900 shadow-sm hover:bg-white/80">
                        {(dict.common as any)[project.status] ?? project.status}
                      </Badge>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h3 className="font-bold leading-snug text-navy-900 transition-colors group-hover:text-primary">
                      {loc(project, "title", locale)}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {loc(project, "description", locale)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-primary">
                      {dict.common.readMore}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {projectsLinkLabel && (
              <div data-animate className="mt-12 text-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white px-8 font-semibold"
                >
                  <Link href={`/${locale}/projects`}>{projectsLinkLabel}</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Get in touch — navy band                                            */}
      {/* ------------------------------------------------------------------ */}
      {showContact && (
        <section id="sec-contact">
          <Curve className={`-mb-px text-navy-950 ${showProjects ? "bg-muted/60" : ""}`} />
          <div className="relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
            {contactImage && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  data-parallax="10"
                  className="absolute -inset-y-[14%] inset-x-0 scale-110 bg-cover bg-center opacity-15"
                  style={{ backgroundImage: `url(${contactImage})` }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-transparent to-navy-950/70" />

            <div className="container relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div data-animate>
                <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-destructive to-red-700 p-10 text-center shadow-glow ring-1 ring-white/15">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-2 ring-white/30">
                    <PhoneCall className="h-6 w-6" />
                  </span>
                  {contactCardTitle && (
                    <h3 className="text-2xl font-extrabold">{contactCardTitle}</h3>
                  )}
                  <span className="mx-auto my-4 block h-0.5 w-8 rounded-full bg-white/50" />
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
              </div>
              <div data-animate data-delay="0.15">
                {s(settings, "home_contact_eyebrow", locale) && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                    {s(settings, "home_contact_eyebrow", locale)}
                  </p>
                )}
                {contactTitle && (
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                    {contactTitle}
                  </h2>
                )}
                <span className="mt-4 flex gap-1.5">
                  <span className="block h-1 w-8 rounded-full bg-destructive" />
                  <span className="block h-1 w-4 rounded-full bg-destructive/60" />
                </span>
                {contactText && (
                  <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-white/75">
                    {contactText}
                  </p>
                )}
                {contactButton && (
                  <Button
                    asChild
                    size="lg"
                    className="mt-8 rounded-full bg-destructive px-8 font-bold shadow-lg shadow-destructive/30 hover:bg-destructive/90"
                  >
                    <Link href={`/${locale}/contact`}>
                      {contactButton} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Curve flip className="-mt-px text-navy-950" />
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Testimonials                                                        */}
      {/* ------------------------------------------------------------------ */}
      {showTestimonials && (
        <section id="sec-testimonials" className="container py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div data-animate className="space-y-3">
              {s(settings, "home_testimonials_eyebrow", locale) && (
                <SectionTag>{s(settings, "home_testimonials_eyebrow", locale)}</SectionTag>
              )}
              {testimonialsTitle && (
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
                  {testimonialsTitle}
                </h2>
              )}
            </div>
            <div data-animate data-delay="0.15" className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-50 via-transparent to-accent/10" />
              <div className="relative rounded-3xl border border-border bg-white p-8 shadow-card md:p-10">
                <TestimonialCarousel
                  items={testimonials.map((t) => ({
                    quote: loc(t, "quote", locale),
                    author: loc(t, "author", locale),
                  }))}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* News + Events                                                       */}
      {/* ------------------------------------------------------------------ */}
      {showNewsEvents && (
        <section
          className={`container grid gap-12 pb-16 md:pb-24 ${
            showNews && showEvents ? "lg:grid-cols-2" : ""
          }`}
        >
          {showNews && (
            <div id="sec-news" data-animate>
              <div className="mb-8 space-y-3">
                {s(settings, "home_news_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_news_eyebrow", locale)}</SectionTag>
                )}
                {newsTitle && (
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">
                    {newsTitle}
                  </h2>
                )}
              </div>
              <div className="grid gap-5">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.slug ?? item.id}`}
                    className="group block rounded-3xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
                  >
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      {formatDate(item.publishedAt, locale)}
                    </p>
                    <h3 className="line-clamp-2 font-bold text-navy-900 transition-colors group-hover:text-primary">
                      {loc(item, "title", locale)}
                    </h3>
                    {item.image && (
                      <div className="mt-4 h-36 w-full overflow-hidden rounded-2xl">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {showEvents && (
            <div id="sec-events" data-animate data-delay="0.12">
              <div className="mb-8 space-y-3">
                {s(settings, "home_events_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_events_eyebrow", locale)}</SectionTag>
                )}
                {eventsTitle && (
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">
                    {eventsTitle}
                  </h2>
                )}
              </div>
              <div className="space-y-5">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/${locale}/events/${event.slug ?? event.id}`}
                    className="group flex gap-4 rounded-3xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
                  >
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-accent text-white shadow-md shadow-brand-600/20">
                      <span className="font-number text-xl font-bold leading-none">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="mt-0.5 text-[10px] uppercase">
                        {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold leading-snug text-navy-900 transition-colors group-hover:text-primary">
                        {loc(event, "title", locale)}
                      </h3>
                      {event.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" /> {event.location}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                {eventsLinkLabel && (
                  <Button asChild variant="outline" className="w-full rounded-full font-semibold">
                    <Link href={`/${locale}/events`}>
                      <CalendarDays className="h-4 w-4" /> {eventsLinkLabel}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Partners                                                            */}
      {/* ------------------------------------------------------------------ */}
      {showPartners && (
        <section id="sec-partners" className="container pb-16 md:pb-24">
          {(partnersTitle || s(settings, "home_partners_eyebrow", locale)) && (
            <div data-animate className="mx-auto mb-10 max-w-2xl text-center">
              {s(settings, "home_partners_eyebrow", locale) && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {s(settings, "home_partners_eyebrow", locale)}
                </p>
              )}
              {partnersTitle && (
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">
                  {partnersTitle}
                </h2>
              )}
              <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
          )}
          <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center rounded-2xl border border-border bg-white px-4 py-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
              >
                {partner.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-semibold text-navy-800">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Donate CTA                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showDonate && (
        <section id="sec-donate" className="container pb-20 md:pb-28">
          <div
            data-animate
            className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 p-10 text-white shadow-glow md:grid-cols-[1.2fr_auto] md:p-14"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-destructive/15 blur-3xl" />
            <div className="relative">
              {s(settings, "home_donate_eyebrow", locale) && (
                <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  <span className="block h-0.5 w-8 rounded-full bg-accent" />
                  {s(settings, "home_donate_eyebrow", locale)}
                </p>
              )}
              {donateTitle && (
                <h2 className="mt-4 max-w-2xl text-2xl font-extrabold md:text-4xl">
                  {donateTitle}
                </h2>
              )}
              {donateText && (
                <p className="mt-3 max-w-xl whitespace-pre-line leading-relaxed text-white/80">
                  {donateText}
                </p>
              )}
            </div>
            {(donateButton || donateButton2) && (
              <div className="relative flex flex-wrap gap-3">
                {donateButton && (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-white px-8 font-bold text-brand-700 shadow-xl shadow-navy-950/20 hover:bg-white/90"
                  >
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
                    className="rounded-full border-white/50 bg-transparent px-8 font-semibold text-white hover:border-white hover:bg-white/15 hover:text-white"
                  >
                    <Link href={`/${locale}/contact`}>{donateButton2}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
