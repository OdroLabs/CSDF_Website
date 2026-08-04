"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, EyeOff, Loader2, Save } from "lucide-react";
import { saveSettingsPage } from "@/lib/actions";
import { useToast } from "./toast";
import type { SettingDef, SettingPage, SettingsMap } from "@/lib/settings";
import { cn, withMinDelay } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "./image-upload";
import { ToggleField } from "./toggle-field";
import { LineListField, PairListField } from "./repeater-field";
import { SectionPreview, type PreviewSection } from "./section-preview";

const langs = [
  { code: "en", suffix: "valueEn", label: "English" },
  { code: "si", suffix: "valueSi", label: "සිංහල (Sinhala)" },
  { code: "ta", suffix: "valueTa", label: "தமிழ் (Tamil)" },
] as const;

function valueFor(settings: SettingsMap, key: string, suffix: (typeof langs)[number]["suffix"]) {
  return settings[key]?.[suffix] ?? "";
}

function PlainInput({ item, name, value }: { item: SettingDef; name: string; value: string }) {
  if (item.type === "textarea") return <Textarea name={name} rows={4} defaultValue={value} />;
  if (item.type === "number")
    return <Input name={name} type="number" step="1" min="0" defaultValue={value} />;
  if (item.type === "password")
    return <Input name={name} type="password" autoComplete="new-password" defaultValue={value} />;
  return <Input name={name} defaultValue={value} />;
}

function SettingField({ item, settings }: { item: SettingDef; settings: SettingsMap }) {
  if (item.type === "boolean") {
    return (
      <ToggleField
        name={`${item.key}__en`}
        defaultValue={valueFor(settings, item.key, "valueEn")}
        label={item.label}
        help={item.help}
      />
    );
  }

  // Repeatable lists get their own editor — one row per item, so nobody has to
  // remember a "Title :: Description" line format.
  const names = {
    en: `${item.key}__en`,
    si: `${item.key}__si`,
    ta: `${item.key}__ta`,
  };
  const values = {
    en: valueFor(settings, item.key, "valueEn"),
    si: valueFor(settings, item.key, "valueSi"),
    ta: valueFor(settings, item.key, "valueTa"),
  };

  if (item.type === "pairs" || item.type === "lines") {
    return (
      <div>
        <Label className="mb-1.5 block text-sm font-semibold">{item.label}</Label>
        {item.help && <p className="mb-3 text-xs text-muted-foreground">{item.help}</p>}
        {item.type === "pairs" ? (
          <PairListField
            names={names}
            values={values}
            leftLabel={item.leftLabel}
            rightLabel={item.rightLabel}
            itemLabel={item.itemLabel}
            addLabel={item.addLabel}
          />
        ) : (
          <LineListField
            names={names}
            values={values}
            itemLabel={item.itemLabel}
            addLabel={item.addLabel}
            translated={item.i18n !== false}
            inputType={item.key === "donate_amounts" ? "number" : "text"}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <Label className="mb-1.5 block text-sm font-semibold">{item.label}</Label>
      {item.help && <p className="mb-2 text-xs text-muted-foreground">{item.help}</p>}

      {item.type === "image" || item.type === "file" ? (
        <FileUploadField
          name={`${item.key}__en`}
          defaultValue={valueFor(settings, item.key, "valueEn")}
          accept={item.type === "file" ? "application/pdf" : "image/*"}
          isImage={item.type === "image"}
        />
      ) : item.i18n ? (
        <div className="grid gap-3 xl:grid-cols-3">
          {langs.map((lang) => (
            <div key={lang.code} className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {lang.label}
              </p>
              <PlainInput
                item={item}
                name={`${item.key}__${lang.code}`}
                value={valueFor(settings, item.key, lang.suffix)}
              />
            </div>
          ))}
        </div>
      ) : (
        <PlainInput
          item={item}
          name={`${item.key}__en`}
          value={valueFor(settings, item.key, "valueEn")}
        />
      )}
    </div>
  );
}

export function SettingsForm({
  page,
  settings,
}: {
  page: SettingPage;
  settings: SettingsMap;
}) {
  const [saving, setSaving] = useState(false);
  /** Which child tab is open. Also decides what the preview panel shows. */
  const [activeIndex, setActiveIndex] = useState(0);
  /** Bumped on every successful save so the preview reloads. */
  const [savedCount, setSavedCount] = useState(0);
  const { toast, update } = useToast();
  const router = useRouter();

  async function handleSave(fd: FormData) {
    setSaving(true);
    const id = toast({
      title: `Saving ${page.title}…`,
      variant: "loading",
    });
    try {
      const result = await withMinDelay(saveSettingsPage(page.slug, fd));
      if (result.ok) {
        update(id, {
          title: "Saved",
          description: `${page.title} is live on the site.`,
          variant: "success",
        });
        setSavedCount((n) => n + 1);
        router.refresh();
      } else {
        update(id, { title: "Not saved", description: result.error, variant: "error" });
      }
    } catch {
      // Network drop, or the action never reached the server.
      update(id, {
        title: "Not saved",
        description: "Could not reach the server. Check your connection and try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  // Sections that map to somewhere on the public site get a preview.
  const previewable: { index: number; preview: PreviewSection }[] = page.sections
    .map((sec, index) =>
      sec.preview
        ? { index, preview: { label: sec.section, ...sec.preview } as PreviewSection }
        : null
    )
    .filter((x): x is { index: number; preview: PreviewSection } => x !== null);

  const previewSections = previewable.map((p) => p.preview);
  // Map a form section index onto its position in the preview list.
  const previewIndexFor = (sectionIndex: number) => {
    let best = 0;
    previewable.forEach((p, i) => {
      if (p.index <= sectionIndex) best = i;
    });
    return best;
  };

  const total = page.sections.length;
  const activeSection = page.sections[activeIndex];

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(new FormData(e.currentTarget));
        }}
        className="min-w-0 space-y-4"
      >
        {/* Child tabs — one per section of this page */}
        <nav
          aria-label={`${page.title} sections`}
          className="flex flex-wrap gap-1.5 rounded-xl border bg-white p-1.5"
        >
          {page.sections.map((section, index) => (
            <button
              key={section.section}
              type="button"
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
                activeIndex === index
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {section.section}
            </button>
          ))}
        </nav>

        {/*
          Every section stays mounted — inactive ones are only visually hidden.
          Fields inside a `display: none` container still submit, so one Save
          covers the whole page and no tab can wipe another's values.
        */}
        {page.sections.map((section, index) => (
          <Card key={section.section} className={activeIndex === index ? undefined : "hidden"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.section}</CardTitle>
              {section.hideNote && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {section.hideNote}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              {section.items.map((item) => (
                <SettingField key={item.key} item={item} settings={settings} />
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-3 border-t bg-muted/40 px-1 py-3 backdrop-blur">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : `Save ${page.title}`}
          </Button>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={activeIndex >= total - 1}
              onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Saving stores every section on this page, not just{" "}
            <span className="font-medium">{activeSection?.section}</span>.
          </p>
        </div>
      </form>

      {previewSections.length > 0 && (
        <div className="hidden min-w-0 xl:sticky xl:top-4 xl:block">
          <SectionPreview
            sections={previewSections}
            activeIndex={previewIndexFor(activeIndex)}
            reloadToken={savedCount}
          />
        </div>
      )}
    </div>
  );
}
