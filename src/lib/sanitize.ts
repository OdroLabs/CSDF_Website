import sanitizeHtml from "sanitize-html";

/**
 * Allowlist for admin-authored rich text.
 *
 * Anything not listed here is stripped: no <script>, no <style>, no inline
 * event handlers, no javascript: URLs. Applied when content is saved AND again
 * when it is rendered, so markup that reached the database by any other route
 * (a direct SQL edit, a seed script, an import) still cannot inject anything.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "code",
    "pre",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "figure",
    "figcaption",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    "*": ["style"],
  },
  // Only text-alignment survives from the style attribute.
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Relative uploads such as /uploads/photo.jpg must keep working.
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  transformTags: {
    // External links open in a new tab and cannot reach back into the page.
    a: (tagName: string, attribs: Record<string, string>) => {
      const href = attribs.href ?? "";
      const external = /^https?:\/\//i.test(href);
      return {
        tagName: "a",
        attribs: external
          ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
          : attribs,
      };
    },
    // Headings above h4 and below h2 are collapsed — h1 belongs to the page.
    h1: "h2",
    h5: "h4",
    h6: "h4",
  },
};

/** Clean a rich-text value. Returns "" when the result carries no content. */
export function sanitizeRichText(html: string): string {
  if (!html) return "";
  const clean = sanitizeHtml(html, OPTIONS).trim();
  return isBlankHtml(clean) ? "" : clean;
}

/**
 * True when markup has no visible content — the editor emits "<p></p>" for an
 * empty document, which must not count as content or sections would never hide.
 */
export function isBlankHtml(html: string): boolean {
  if (!html) return true;
  // Media and rules count as content even with no text.
  if (/<(img|hr|table|iframe)\b/i.test(html)) return false;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return text === "";
}

/** Heuristic: does this value already contain rich markup? */
export function looksLikeHtml(value: string): boolean {
  return /<(p|div|h[2-6]|ul|ol|li|img|blockquote|figure|table|br|strong|em|a)\b[^>]*>/i.test(value);
}

/**
 * Flatten rich text to a single line of plain text, for card previews and
 * meta descriptions where markup would show through as literal tags.
 */
export function toPlainText(value: string | null | undefined, maxLength?: number): string {
  if (!value) return "";
  const text = value
    // Treat block boundaries as spaces so words don't run together.
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
