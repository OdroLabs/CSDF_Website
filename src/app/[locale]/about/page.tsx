import { Eye, Target, Users, BookOpen } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getSettings, s } from "@/lib/settings";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const settings = await getSettings();

  const blocks = [
    { icon: Eye, title: dict.about.vision, text: s(settings, "about_vision", locale), color: "bg-primary" },
    { icon: Target, title: dict.about.mission, text: s(settings, "about_mission", locale), color: "bg-teal-600" },
  ];

  return (
    <>
      <PageHero title={dict.nav.about} intro={s(settings, "site_tagline", locale)} />
      <div className="container py-12 md:py-16">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-bold">{dict.about.overview}</h2>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {s(settings, "about_overview", locale)}
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {blocks.map((block) => (
            <Card key={block.title} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${block.color} text-white`}>
                  <block.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{block.title}</h3>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{block.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-bold">{dict.about.community}</h2>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {s(settings, "about_community", locale)}
          </p>
        </div>
      </div>
    </>
  );
}
