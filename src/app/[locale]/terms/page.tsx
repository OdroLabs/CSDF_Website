import type { Metadata } from "next";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { type Locale } from "@/lib/i18n";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/site/rich-text";
import { FadeIn } from "@/components/site/motion";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "terms_title", locale) || dict.nav.terms;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
  };
}

export default async function TermsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const title = s(settings, "terms_title", locale) || dict.nav.terms;
  const content = s(settings, "terms_content", locale);

  return (
    <>
      <PageHero
        title={title}
        breadcrumb={{ homeHref: `/${locale}`, homeLabel: dict.nav.home, currentLabel: dict.nav.terms }}
      />
      <div id="sec-legal-body" className="container py-16 md:py-24">
        <FadeIn className="mx-auto max-w-5xl">
          <RichText value={content} />
        </FadeIn>
      </div>
    </>
  );
}
