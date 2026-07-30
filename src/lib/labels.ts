import { dictionaries, type Dictionary } from "./dictionaries";
import type { Locale } from "./i18n";
import type { SettingsMap } from "./settings";

/**
 * Interface labels are stored as Setting rows keyed `label.<group>.<name>`
 * (e.g. `label.nav.about`). A blank value falls back to the built-in default
 * from `dictionaries.ts`, so the site never renders an empty label.
 */
export const LABEL_PREFIX = "label.";

export interface LabelDef {
  /** Dot path within the dictionary, e.g. "nav.about". */
  path: string;
  /** Setting key, e.g. "label.nav.about". */
  key: string;
  /** Human-friendly field label. */
  label: string;
  /** Built-in English default. */
  defaultEn: string;
  multiline: boolean;
}

export interface LabelGroup {
  group: string;
  title: string;
  description: string;
  items: LabelDef[];
}

const GROUP_META: Record<string, { title: string; description: string }> = {
  nav: {
    title: "Navigation",
    description: "Menu item names in the header, footer and mobile menu.",
  },
  common: {
    title: "Buttons & Shared Words",
    description: "Buttons, form field names and small words reused across the site.",
  },
  home: {
    title: "Home & Newsletter",
    description: "Buttons and the newsletter sign-up wording.",
  },
  donate: {
    title: "Donation Form",
    description: "Labels and messages inside the donation form and payment result pages.",
  },
  contact: {
    title: "Contact Details",
    description: "Field names used in the contact details panel.",
  },
  footer: {
    title: "Footer",
    description: "Footer column headings.",
  },
};

/** "getInvolved" -> "Get involved" */
function humanize(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/** Every editable label, grouped for the admin UI. Derived from the English dictionary. */
export const labelGroups: LabelGroup[] = Object.entries(dictionaries.en).map(
  ([group, values]) => {
    const meta = GROUP_META[group] ?? { title: humanize(group), description: "" };
    return {
      group,
      title: meta.title,
      description: meta.description,
      items: Object.entries(values as Record<string, string>).map(([name, defaultEn]) => ({
        path: `${group}.${name}`,
        key: `${LABEL_PREFIX}${group}.${name}`,
        label: humanize(name),
        defaultEn,
        multiline: defaultEn.length > 60,
      })),
    };
  }
);

export const allLabelDefs: LabelDef[] = labelGroups.flatMap((g) => g.items);

function suffixFor(locale: string): "valueEn" | "valueSi" | "valueTa" {
  return locale === "si" ? "valueSi" : locale === "ta" ? "valueTa" : "valueEn";
}

/**
 * Labels for a locale with admin overrides applied.
 *
 * Resolution order per label: override in the requested language → override in
 * English → built-in translation for the requested language → built-in English.
 */
export function getLabels(locale: Locale, settings: SettingsMap): Dictionary {
  const base = dictionaries[locale] ?? dictionaries.en;
  // Shallow-clone each group so we never mutate the module-level dictionary.
  const out = Object.fromEntries(
    Object.entries(base).map(([group, values]) => [group, { ...(values as object) }])
  ) as unknown as Dictionary;

  for (const def of allLabelDefs) {
    const row = settings[def.key];
    if (!row) continue;
    const override = (row[suffixFor(locale)] ?? "").trim() || (row.valueEn ?? "").trim();
    if (!override) continue;
    const [group, name] = def.path.split(".");
    (out as any)[group][name] = override;
  }
  return out;
}
