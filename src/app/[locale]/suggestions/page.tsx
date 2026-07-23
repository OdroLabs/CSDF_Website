import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { PageHero } from "@/components/site/page-hero";
import { SuggestionForm } from "@/components/site/suggestion-form";

export default function SuggestionsPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  return (
    <>
      <PageHero title={dict.suggestions.title} intro={dict.suggestions.intro} />
      <div className="container max-w-2xl py-12">
        <SuggestionForm dict={dict} />
      </div>
    </>
  );
}
