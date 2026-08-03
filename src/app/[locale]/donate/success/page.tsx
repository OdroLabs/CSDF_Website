import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { Button } from "@/components/ui/button";
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
  const title = dict.donate.successTitle || siteName || undefined;
  const description = dict.donate.successText || undefined;
  return {
    title: siteName ? `${title} | ${siteName}` : title,
    description,
    openGraph: { title, description },
  };
}

export default async function DonateSuccessPage({ params }: { params: { locale: Locale } }) {
  const settings = await getSettings();
  const dict = getLabels(params.locale, settings);
  return (
    <div className="container flex flex-col items-center py-24 text-center md:py-32">
      <FadeIn immediate className="flex flex-col items-center">
        <span className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-teal-50">
          <CheckCircle2 className="h-10 w-10 text-teal-600" />
        </span>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">{dict.donate.successTitle}</h1>
        <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">{dict.donate.successText}</p>
        <Button asChild size="lg" className="px-8">
          <Link href={`/${params.locale}`}>{dict.common.backHome}</Link>
        </Button>
      </FadeIn>
    </div>
  );
}
