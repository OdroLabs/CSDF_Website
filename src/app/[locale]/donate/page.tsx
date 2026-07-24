import { Landmark, Heart, HandHeart, ShieldCheck, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { DonationForm } from "@/components/site/donation-form";

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { cancelled?: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const settings = await getSettings();
  const bankDetails = s(settings, "bank_details");
  const intro = s(settings, "donate_intro", locale) || dict.donate.intro;

  return (
    <>
      <PageHero title={dict.donate.title} intro={intro} eyebrow={dict.home.supportUs} />

      <div className="container grid items-start gap-8 py-12 md:py-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Donation form */}
        <div data-animate className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-50 via-transparent to-destructive/5" />
          <div className="relative rounded-3xl border border-border bg-white p-7 shadow-card md:p-9">
            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-destructive to-red-700 text-white shadow-md shadow-destructive/25">
                <Heart className="h-5 w-5 fill-current" />
              </span>
              <h2 className="text-xl font-extrabold text-navy-900">{dict.donate.donateNow}</h2>
            </div>

            {searchParams.cancelled && (
              <p className="mb-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                {dict.donate.cancelledText}
              </p>
            )}

            <DonationForm locale={locale} dict={dict} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Why give */}
          <div
            data-animate
            data-delay="0.1"
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 p-8 text-white shadow-glow"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <h3 className="text-lg font-extrabold">{dict.home.supportUs}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{dict.home.supportText}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { Icon: HandHeart, label: dict.donate.purposeGeneral },
                { Icon: ShieldCheck, label: dict.donate.purposeHealth },
                { Icon: Users, label: dict.donate.purposeCommunity },
              ].map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                    <Icon className="h-4 w-4 text-accent" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Bank transfer */}
          {bankDetails && (
            <div
              data-animate
              data-delay="0.18"
              className="rounded-3xl border border-border bg-white p-7 shadow-card"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-primary ring-1 ring-brand-100">
                  <Landmark className="h-5 w-5" />
                </span>
                <h3 className="font-extrabold text-navy-900">{dict.donate.bankTitle}</h3>
              </div>
              <pre className="whitespace-pre-wrap rounded-2xl bg-muted p-5 font-sans text-sm leading-relaxed text-navy-900">
                {bankDetails}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
