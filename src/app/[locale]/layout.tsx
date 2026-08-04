import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { buildNav } from "@/lib/nav";
import { getSettings, s, sBool } from "@/lib/settings";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { FloatingWhatsapp } from "@/components/site/floating-whatsapp";

export const dynamic = "force-dynamic";

/** Page title, description, favicon and share image all come from the admin. */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const settings = await getSettings();

  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "seo_title", locale) || siteName;
  const description =
    s(settings, "seo_description", locale) || s(settings, "site_tagline", locale);
  const keywords = s(settings, "seo_keywords");
  const favicon = s(settings, "favicon");
  const ogImage = s(settings, "og_image");

  return {
    title: title || undefined,
    description: description || undefined,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    icons: { icon: favicon || "/brand/icon-512.png", apple: "/brand/icon-180.png" },
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      siteName: siteName || undefined,
      images: [ogImage || "/brand/icon-512.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const nav = buildNav(settings, dict);

  const siteName = s(settings, "site_name", locale);
  const shortName = s(settings, "site_short_name");
  const logoImage = s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");
  const donateLabel = s(settings, "header_donate_label", locale);

  return (
    <div className="flex min-h-screen flex-col" data-locale={locale}>
      <ScrollProgress />
      <SiteHeader
        locale={locale}
        dict={dict}
        nav={nav}
        siteName={siteName}
        shortName={shortName}
        logoImage={logoImage || undefined}
        logoLetter={logoLetter}
        phones={[s(settings, "phone"), s(settings, "phone2")].filter(Boolean)}
        emails={[s(settings, "email"), s(settings, "email2")].filter(Boolean)}
        donateLabel={donateLabel}
        announceText={s(settings, "announce_text", locale) || undefined}
        announceLink={s(settings, "announce_link") || undefined}
        showTopbar={sBool(settings, "show_header_topbar", true)}
        showLangs={sBool(settings, "show_header_langs", true)}
        showDonate={sBool(settings, "show_header_donate", true)}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dict={dict} settings={settings} />
      {/* Fixed CTA — kept outside <main> and any transformed/animated parent */}
      {sBool(settings, "show_floating_whatsapp", true) && s(settings, "whatsapp") && (
        <FloatingWhatsapp
          phone={s(settings, "whatsapp").replace(/\D/g, "")}
          label="Chat on WhatsApp"
        />
      )}
    </div>
  );
}
