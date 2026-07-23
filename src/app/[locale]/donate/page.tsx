import { Landmark, ShieldCheck, Heart } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AmountField } from "@/components/site/amount-field";

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
      <PageHero title={dict.donate.title} intro={intro} />
      <div className="container grid gap-8 py-12 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-primary" /> {dict.donate.donateNow}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchParams.cancelled && (
              <p className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                {dict.donate.cancelledText}
              </p>
            )}
            <form action="/api/donate" method="POST" className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="d-name">{dict.common.name} *</Label>
                  <Input id="d-name" name="name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-email">{dict.common.email} *</Label>
                  <Input id="d-email" name="email" type="email" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-phone">
                  {dict.common.phone} <span className="text-muted-foreground">({dict.common.optional})</span>
                </Label>
                <Input id="d-phone" name="phone" />
              </div>
              <AmountField label={dict.donate.amount} />
              <div className="space-y-1.5">
                <Label htmlFor="d-message">
                  {dict.common.message} <span className="text-muted-foreground">({dict.common.optional})</span>
                </Label>
                <Textarea id="d-message" name="message" rows={3} />
              </div>
              <Button type="submit" size="lg" className="w-full">
                <Heart className="h-4 w-4" /> {dict.donate.donateNow}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> {dict.donate.securePayment}
              </p>
            </form>
          </CardContent>
        </Card>

        {bankDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Landmark className="h-5 w-5 text-secondary" /> {dict.donate.bankTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 font-sans text-sm leading-relaxed">
                {bankDetails}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
