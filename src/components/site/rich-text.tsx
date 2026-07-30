import { isBlankHtml, looksLikeHtml, sanitizeRichText } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

/**
 * Renders admin-authored content.
 *
 * Content written in the editor is stored as HTML and rendered as such, after
 * being sanitised a second time — the save-time pass is not treated as a
 * guarantee, so markup that arrived by any other route is still cleaned here.
 *
 * Anything saved before the editor existed is plain text, so it is split on
 * blank lines into paragraphs instead. That keeps existing articles readable
 * with no migration.
 */
export function RichText({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  const raw = (value ?? "").trim();
  if (!raw || isBlankHtml(raw)) return null;

  const classes = cn("prose-basic max-w-none leading-relaxed text-muted-foreground", className);

  if (looksLikeHtml(raw)) {
    const html = sanitizeRichText(raw);
    if (!html) return null;
    return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Legacy plain text: blank lines separate paragraphs.
  const paragraphs = raw.split(/\n\s*\n/).filter((p) => p.trim() !== "");
  return (
    <div className={classes}>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
