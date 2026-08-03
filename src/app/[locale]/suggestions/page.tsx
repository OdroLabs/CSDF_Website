import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { SuggestionForm } from "@/components/site/suggestion-form";
import { FadeIn } from "@/components/site/motion";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "suggestions_hero_title", locale) || siteName || undefined;
  const description = s(settings, "suggestions_hero_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function SuggestionsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "suggestions_hero_title", locale)}
        intro={s(settings, "suggestions_hero_intro", locale)}
        image={s(settings, "suggestions_hero_image") || undefined}
      />
      <div className="container max-w-2xl py-16 md:py-24">
        <FadeIn className="rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
          <SuggestionForm
            dict={dict}
            successMessage={s(settings, "suggestions_success_message", locale)}
          />
        </FadeIn>
      </div>
    </>
  );
}
