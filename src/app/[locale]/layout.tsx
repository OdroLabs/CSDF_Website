import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ScrollFX } from "@/components/site/scroll-fx";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { FloatingDonate } from "@/components/site/floating-donate";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollFX />
      <ScrollProgress />
      <SiteHeader
        locale={params.locale}
        dict={dict}
        siteName={s(settings, "site_name", params.locale) || "Community Strength Development Foundation"}
        phone={s(settings, "phone")}
        email={s(settings, "email")}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={params.locale} dict={dict} settings={settings} />
      {/* Fixed CTA — kept outside <main> and any transformed/animated parent */}
      <FloatingDonate locale={params.locale} label={dict.donate.donateNow} />
    </div>
  );
}
