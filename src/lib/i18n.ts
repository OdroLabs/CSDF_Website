export const locales = ["en", "si", "ta"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Pick a localized field from a DB record with English fallback.
 * loc(record, "title", "si") -> record.titleSi || record.titleEn
 */
export function loc<T extends Record<string, any>>(
  record: T,
  field: string,
  locale: string
): string {
  const suffix = locale === "si" ? "Si" : locale === "ta" ? "Ta" : "En";
  return record[`${field}${suffix}`] || record[`${field}En`] || "";
}
