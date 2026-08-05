import type { MetadataRoute } from "next";
import { getSettings, sBool } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Mirrors the per-page <meta name="robots"> toggle (Admin → Site Settings →
 * General → Search engines & sharing) so crawlers respect it at the
 * robots.txt level too, not just the meta tag. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const noindex = sBool(settings, "seo_noindex", true);

  if (noindex) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
  };
}
