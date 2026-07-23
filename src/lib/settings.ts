import { prisma } from "./prisma";
import { loc } from "./i18n";

export type SettingsMap = Record<
  string,
  { valueEn: string | null; valueSi: string | null; valueTa: string | null }
>;

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.setting.findMany();
  const map: SettingsMap = {};
  for (const r of rows) {
    map[r.key] = { valueEn: r.valueEn, valueSi: r.valueSi, valueTa: r.valueTa };
  }
  return map;
}

/** Get a localized setting value with English fallback. */
export function s(map: SettingsMap, key: string, locale = "en"): string {
  const row = map[key];
  if (!row) return "";
  return loc(row, "value", locale);
}

// Definition of all editable settings, grouped for the admin UI.
export interface SettingDef {
  key: string;
  label: string;
  type: "text" | "textarea";
  i18n: boolean; // translated per language?
}

export const settingGroups: { group: string; items: SettingDef[] }[] = [
  {
    group: "General",
    items: [
      { key: "site_name", label: "Site name", type: "text", i18n: true },
      { key: "site_tagline", label: "Tagline", type: "text", i18n: true },
      { key: "address", label: "Address", type: "textarea", i18n: true },
      { key: "phone", label: "Phone", type: "text", i18n: false },
      { key: "email", label: "Email", type: "text", i18n: false },
      { key: "whatsapp", label: "WhatsApp number (intl. format, e.g. 94112534838)", type: "text", i18n: false },
      { key: "office_hours", label: "Office hours", type: "text", i18n: true },
      { key: "facebook", label: "Facebook URL", type: "text", i18n: false },
      { key: "youtube", label: "YouTube URL", type: "text", i18n: false },
      { key: "instagram", label: "Instagram URL", type: "text", i18n: false },
      { key: "map_embed", label: "Google Maps embed URL", type: "textarea", i18n: false },
    ],
  },
  {
    group: "Home page",
    items: [
      { key: "hero_badge", label: "Hero badge line", type: "text", i18n: true },
      { key: "hero_title", label: "Hero title", type: "text", i18n: true },
      { key: "hero_subtitle", label: "Hero subtitle", type: "textarea", i18n: true },
      { key: "hero_points", label: "Hero bullet points (one per line)", type: "textarea", i18n: true },
      { key: "hero_footnote", label: "Hero footnote", type: "text", i18n: true },
    ],
  },
  {
    group: "About Us",
    items: [
      { key: "about_overview", label: "Overview", type: "textarea", i18n: true },
      { key: "about_vision", label: "Vision", type: "textarea", i18n: true },
      { key: "about_mission", label: "Mission", type: "textarea", i18n: true },
      { key: "about_community", label: "Communities we serve", type: "textarea", i18n: true },
    ],
  },
  {
    group: "Donation page",
    items: [
      { key: "donate_intro", label: "Donation page intro", type: "textarea", i18n: true },
      { key: "bank_details", label: "Bank transfer details", type: "textarea", i18n: false },
    ],
  },
];
