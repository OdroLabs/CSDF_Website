import { prisma } from "./prisma";

/** "Women's Health Program" -> "womens-health-program" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Returns `base` (or a numbered variant) that is unique for `model`,
 * ignoring the record with `excludeId` (when updating).
 */
export async function uniqueSlug(
  model: "project" | "service" | "news" | "event",
  base: string,
  excludeId?: number | null
): Promise<string> {
  const delegate = (prisma as any)[model];
  let candidate = base || "item";
  for (let i = 2; ; i++) {
    const existing = await delegate.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${i}`;
  }
}
