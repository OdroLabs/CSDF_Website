import type { Metadata } from "next";
import { Eye, Target, Users, BookOpen, Sparkles, History } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sPairs } from "@/lib/settings";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion";

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

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
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

  // Each card only appears when it has text.
  const blocks = [
    { icon: Eye, title: visionTitle, text: vision, color: "bg-primary" },
    { icon: Target, title: missionTitle, text: mission, color: "bg-teal-600" },
  ].filter((b) => b.text);

  /** Heading + prose block, rendered only when there is text. */
  const TextBlock = ({
    id,
    icon: Icon,
    title,
    text,
    image,
  }: {
    id: string;
    icon: typeof Eye;
    title: string;
    text: string;
    image?: string;
  }) => {
    if (!text) return null;
    return (
      <section
        id={id}
        className={`grid items-start gap-8 ${image ? "lg:grid-cols-2" : "max-w-3xl"}`}
      >
        <FadeIn>
          {title && (
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Icon className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            </div>
          )}
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{text}</p>
        </FadeIn>
        {image && (
          <FadeIn delay={0.12} className="overflow-hidden rounded-3xl border border-border shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
          </FadeIn>
        )}
      </section>
    );
  };

  return (
    <>
      <PageHero
        title={s(settings, "about_hero_title", locale)}
        intro={s(settings, "about_hero_intro", locale)}
        image={s(settings, "about_hero_image") || undefined}
      />

      <div className="container space-y-12 py-12 md:space-y-16 md:py-16">
        <TextBlock
          id="sec-overview"
          icon={BookOpen}
          title={overviewTitle}
          text={overview}
          image={overviewImage || undefined}
        />

        {blocks.length > 0 && (
          <div id="sec-visionmission">
            <Stagger className="grid gap-6 md:grid-cols-2">
              {blocks.map((block) => (
                <StaggerItem key={block.title || block.text}>
                  <Card className="overflow-hidden rounded-2xl border border-border shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover">
                    <CardContent className="pt-6">
                      <div
                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${block.color} text-white`}
                      >
                        <block.icon className="h-6 w-6" />
                      </div>
                      {block.title && <h3 className="mb-2 text-lg font-bold tracking-tight">{block.title}</h3>}
                      <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                        {block.text}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}

        {values.length > 0 && (
          <section id="sec-values">
            {valuesTitle && (
              <FadeIn className="mb-5 flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-xl font-bold tracking-tight">{valuesTitle}</h2>
              </FadeIn>
            )}
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover">
                    <span className="font-number text-sm font-bold text-primary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-bold tracking-tight text-foreground">{value.left}</h3>
                    {value.right && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {value.right}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}

        <TextBlock id="sec-community" icon={Users} title={communityTitle} text={community} />

        <TextBlock
          id="sec-history"
          icon={History}
          title={historyTitle}
          text={history}
          image={historyImage || undefined}
        />

        {extraText && (
          <FadeIn
            as="div"
            className="rounded-3xl bg-secondary p-10 text-white shadow-pop md:p-14"
          >
            <section id="sec-extra">
              {extraTitle && <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{extraTitle}</h2>}
              <p className="mt-3 max-w-3xl whitespace-pre-line leading-relaxed text-white/80">
                {extraText}
              </p>
            </section>
          </FadeIn>
        )}
      </div>
    </>
  );
}
