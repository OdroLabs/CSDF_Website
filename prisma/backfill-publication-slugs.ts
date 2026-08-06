/**
 * One-off data fix: Publications didn't have a `slug` column until now, so
 * every existing row has `slug = null` and the public site falls back to
 * showing `/publications/1` instead of a readable URL. This script generates
 * a unique slug from each row's English title, exactly the same way
 * `saveEntity` does for a normal admin save — it just does it for every
 * existing row in one pass instead of requiring someone to open and re-save
 * each publication by hand.
 *
 * Safe to re-run: rows that already have a slug are skipped.
 *
 * Run once with: npm run backfill:publication-slugs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId: number): Promise<string> {
  let candidate = base || "publication";
  for (let i = 2; ; i++) {
    const existing = await prisma.publication.findFirst({
      where: { slug: candidate, id: { not: excludeId } },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${i}`;
  }
}

async function main() {
  const rows = await prisma.publication.findMany({
    where: { OR: [{ slug: null }, { slug: "" }] },
  });

  if (rows.length === 0) {
    console.log("Nothing to do — every publication already has a slug.");
    return;
  }

  for (const row of rows) {
    const base = slugify(row.titleEn);
    const slug = await uniqueSlug(base, row.id);
    await prisma.publication.update({ where: { id: row.id }, data: { slug } });
    console.log(`#${row.id} "${row.titleEn}" -> /publications/${slug}`);
  }

  console.log(`Done — ${rows.length} publication(s) updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
