import { Landmark, Heart, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sList, sPairs, show } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { DonationForm } from "@/components/site/donation-form";
import { FadeIn } from "@/components/site/motion";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSettings();
  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "donate_hero_title", locale) || siteName || undefined;
  const description = s(settings, "donate_intro", locale) || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { cancelled?: string };
}) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const bankTitle = s(settings, "donate_bank_title", locale);
  const bankDetails = s(settings, "bank_details");
  const note = s(settings, "donate_note", locale);

  const impactTitle = s(settings, "donate_impact_title", locale);
  const impactItems = sPairs(settings, "donate_impact_items", locale);

  const presets = sList(settings, "donate_amounts")
    .map((line) => Number(line.replace(/[^\d.]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  const showOnline = show(settings, "show_donate_online");
  const showBank = Boolean(bankDetails);
  const showImpact = impactItems.length > 0;
  const hasSidebar = showBank || showImpact;

  return (
    <>
      <PageHero
        title={s(settings, "donate_hero_title", locale)}
        intro={s(settings, "donate_intro", locale)}
        image={s(settings, "donate_hero_image") || undefined}
      />

      <div
        className={`container grid items-start gap-8 py-16 md:py-24 ${
          showOnline && hasSidebar ? "lg:grid-cols-[1.15fr_0.85fr]" : ""
        }`}
      >
        {/* Donation form */}
        {showOnline && (
          <div id="sec-online">
            <FadeIn className="rounded-3xl border border-border bg-white p-7 shadow-card md:p-9">
              <div className="mb-7 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive text-white shadow-soft">
                  <Heart className="h-5 w-5 fill-current" />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-foreground">{dict.donate.donateNow}</h2>
              </div>

              {searchParams.cancelled && (
                <p className="mb-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                  {dict.donate.cancelledText}
                </p>
              )}

              <DonationForm locale={locale} dict={dict} presets={presets} />

              {note && (
                <p className="mt-5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                  {note}
                </p>
              )}
            </FadeIn>
          </div>
        )}

        {/* Sidebar */}
        {hasSidebar && (
          <div className="space-y-6">
            {/* Why give — hidden when no points are set in the admin */}
            {showImpact && (
              <div id="sec-impact">
                <FadeIn
                  delay={0.1}
                  className="relative overflow-hidden rounded-3xl bg-secondary p-8 text-white shadow-pop"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                  {impactTitle && <h3 className="text-lg font-bold tracking-tight">{impactTitle}</h3>}
                  <ul className="mt-5 space-y-4 text-sm">
                    {impactItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                          <Sparkles className="h-4 w-4 text-accent" />
                        </span>
                        <span>
                          <span className="block font-semibold">{item.left}</span>
                          {item.right && (
                            <span className="mt-0.5 block leading-relaxed text-white/75">
                              {item.right}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>
            )}

            {/* Bank transfer */}
            {showBank && (
              <div id="sec-bank">
                <FadeIn
                  delay={0.18}
                  className="rounded-3xl border border-border bg-white p-7 shadow-card"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-primary ring-1 ring-brand-100">
                      <Landmark className="h-5 w-5" />
                    </span>
                    {bankTitle && <h3 className="font-bold tracking-tight text-foreground">{bankTitle}</h3>}
                  </div>
                  <pre className="whitespace-pre-wrap rounded-2xl bg-muted p-5 font-sans text-sm leading-relaxed text-foreground">
                    {bankDetails}
                  </pre>
                </FadeIn>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
