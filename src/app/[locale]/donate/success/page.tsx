import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";

export default async function DonateSuccessPage({ params }: { params: { locale: Locale } }) {
  const settings = await getSettings();
  const dict = getLabels(params.locale, settings);
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <CheckCircle2 className="mb-4 h-16 w-16 text-teal-600" />
      <h1 className="mb-2 text-3xl font-extrabold">{dict.donate.successTitle}</h1>
      <p className="mb-8 max-w-md text-muted-foreground">{dict.donate.successText}</p>
      <Button asChild>
        <Link href={`/${params.locale}`}>{dict.common.backHome}</Link>
      </Button>
    </div>
  );
}
