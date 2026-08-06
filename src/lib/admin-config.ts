export type FieldType =
  | "text"
  | "textarea"
  /** Full HTML editor — formatting, links, inline images. */
  | "richtext"
  | "image"
  | "file"
  | "number"
  | "date"
  | "datetime"
  | "boolean"
  | "select"
  /** Repeatable rows of "heading + text", stored as `Left :: Right` lines. */
  | "pairs"
  /** Repeatable single-value rows, stored one per line. */
  | "lines";

export interface FieldDef {
  name: string; // base name; i18n fields become nameEn/nameSi/nameTa
  label: string;
  type: FieldType;
  i18n?: boolean;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  /** For "pairs": label of the first box. Default "Title". */
  leftLabel?: string;
  /** For "pairs": label of the second box. Default "Description". */
  rightLabel?: string;
  /** Noun used for each row, e.g. "Objective". Default "Item". */
  itemLabel?: string;
  /** Text on the add button. */
  addLabel?: string;
}

export interface EntityDef {
  slug: string;
  model: string; // prisma delegate name
  title: string;
  titleSingular: string;
  description: string;
  fields: FieldDef[];
  listFields: { name: string; label: string; type?: "date" | "boolean" | "money" | "image" }[];
  readOnly?: boolean; // inbox-style: list + view + delete only
  orderBy: Record<string, "asc" | "desc">;
}

export const entities: EntityDef[] = [
  {
    slug: "projects",
    model: "project",
    title: "Projects",
    titleSingular: "Project",
    description: "Ongoing and completed projects shown on the Projects page.",
    orderBy: { order: "asc" },
    fields: [
      { name: "title", label: "Title", type: "text", i18n: true, required: true },
      { name: "slug", label: "URL slug", type: "text", help: "Used in the page URL. Leave empty to auto-generate from the English title." },
      {
        name: "description",
        label: "Short description",
        type: "textarea",
        i18n: true,
        required: true,
        help: "Shown on cards (home page and projects list).",
      },
      { name: "image", label: "Main image", type: "image" },
      {
        name: "content",
        label: "Detail page content",
        type: "richtext",
        i18n: true,
        help: "Long write-up shown on the project page. Add headings, lists, links and images.",
      },
      {
        name: "objectives",
        label: "Objectives",
        type: "lines",
        i18n: true,
        itemLabel: "Objective",
        addLabel: "Add an objective",
        help: "Shown as a two-column checklist with tick icons.",
      },
      {
        name: "outcomes",
        label: "Key outcomes",
        type: "pairs",
        i18n: true,
        leftLabel: "Outcome",
        rightLabel: "Detail",
        itemLabel: "Outcome",
        addLabel: "Add an outcome",
        help: "Each one becomes a numbered card on the project page.",
      },
      { name: "location", label: "Location / districts", type: "text" },
      { name: "beneficiaries", label: "Beneficiaries", type: "text", i18n: true, help: "e.g. 1,200 women across 6 districts" },
      { name: "image2", label: "Gallery image 1", type: "image" },
      { name: "image3", label: "Gallery image 2", type: "image" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "ongoing", label: "Ongoing" },
          { value: "completed", label: "Completed" },
          { value: "upcoming", label: "Upcoming" },
        ],
      },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "End date", type: "date" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "image", label: "", type: "image" },
      { name: "titleEn", label: "Title" },
      { name: "status", label: "Status" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "services",
    model: "service",
    title: "Services",
    titleSingular: "Service",
    description: "Services listed on the Our Services page and home page.",
    orderBy: { order: "asc" },
    fields: [
      { name: "title", label: "Title", type: "text", i18n: true, required: true },
      { name: "slug", label: "URL slug", type: "text", help: "Used in the page URL. Leave empty to auto-generate from the English title." },
      {
        name: "description",
        label: "Short description",
        type: "textarea",
        i18n: true,
        required: true,
        help: "Shown on cards (home page and services list).",
      },
      { name: "icon", label: "Icon (emoji)", type: "text", help: "e.g. ❤️ 🩺 ⚖️ 📚" },
      { name: "image", label: "Main image", type: "image" },
      {
        name: "content",
        label: "Detail page content",
        type: "richtext",
        i18n: true,
        help: "Long write-up shown on the service page. Add headings, lists, links and images.",
      },
      {
        name: "features",
        label: "Key features",
        type: "lines",
        i18n: true,
        itemLabel: "Feature",
        addLabel: "Add a feature",
        help: "Shown as a two-column checklist with tick icons.",
      },
      {
        name: "benefits",
        label: "Benefits",
        type: "pairs",
        i18n: true,
        leftLabel: "Benefit",
        rightLabel: "Detail",
        itemLabel: "Benefit",
        addLabel: "Add a benefit",
        help: "Each one becomes a numbered card on the service page.",
      },
      {
        name: "faqs",
        label: "FAQs",
        type: "pairs",
        i18n: true,
        leftLabel: "Question",
        rightLabel: "Answer",
        itemLabel: "Question",
        addLabel: "Add a question",
      },
      { name: "image2", label: "Gallery image 1", type: "image" },
      { name: "image3", label: "Gallery image 2", type: "image" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "icon", label: "" },
      { name: "titleEn", label: "Title" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "publications",
    model: "publication",
    title: "Publications",
    titleSingular: "Publication",
    description: "Research publications and reports (PDF downloads).",
    orderBy: { publishedAt: "desc" },
    fields: [
      { name: "title", label: "Title", type: "text", i18n: true, required: true },
      { name: "slug", label: "URL slug", type: "text", help: "Used in the page URL. Leave empty to auto-generate from the English title." },
      { name: "description", label: "Description", type: "textarea", i18n: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "research", label: "Research Publication" },
          { value: "report", label: "Report" },
          { value: "annual", label: "Annual Report" },
          { value: "other", label: "Other" },
        ],
      },
      { name: "fileUrl", label: "File (PDF)", type: "file" },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "publishedAt", label: "Published date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "titleEn", label: "Title" },
      { name: "category", label: "Category" },
      { name: "publishedAt", label: "Date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "news",
    model: "news",
    title: "News",
    titleSingular: "News Article",
    description: "News articles shown on the News page.",
    orderBy: { publishedAt: "desc" },
    fields: [
      { name: "title", label: "Title", type: "text", i18n: true, required: true },
      { name: "slug", label: "URL slug", type: "text", help: "Used in the page URL. Leave empty to auto-generate from the English title." },
      { name: "excerpt", label: "Excerpt", type: "textarea", i18n: true },
      {
        name: "content",
        label: "Content",
        type: "richtext",
        i18n: true,
        required: true,
        help: "The article body. Add headings, lists, links, quotes and images.",
      },
      { name: "image", label: "Main image", type: "image" },
      {
        name: "highlights",
        label: "Key points",
        type: "lines",
        i18n: true,
        itemLabel: "Point",
        addLabel: "Add a key point",
        help: "Shown as a highlighted key-points box on the article.",
      },
      {
        name: "quote",
        label: "Pull quote",
        type: "textarea",
        i18n: true,
        help: "Optional. Format: Quote :: Attribution (attribution is optional).",
      },
      { name: "image2", label: "Gallery image 1", type: "image" },
      { name: "image3", label: "Gallery image 2", type: "image" },
      { name: "publishedAt", label: "Published date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "image", label: "", type: "image" },
      { name: "titleEn", label: "Title" },
      { name: "publishedAt", label: "Date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "events",
    model: "event",
    title: "Events",
    titleSingular: "Event",
    description: "Upcoming and past events.",
    orderBy: { startDate: "desc" },
    fields: [
      { name: "title", label: "Title", type: "text", i18n: true, required: true },
      { name: "slug", label: "URL slug", type: "text", help: "Used in the page URL. Leave empty to auto-generate from the English title." },
      {
        name: "description",
        label: "Short description",
        type: "textarea",
        i18n: true,
        required: true,
        help: "Shown on cards (home page and events list).",
      },
      { name: "location", label: "Location", type: "text" },
      { name: "image", label: "Main image", type: "image" },
      {
        name: "content",
        label: "Detail page content",
        type: "richtext",
        i18n: true,
        help: "Long write-up shown on the event page. Add headings, lists, links and images.",
      },
      {
        name: "highlights",
        label: "What to expect",
        type: "lines",
        i18n: true,
        itemLabel: "Point",
        addLabel: "Add a point",
        help: "Shown as a two-column checklist with tick icons.",
      },
      {
        name: "agenda",
        label: "Agenda / schedule",
        type: "pairs",
        i18n: true,
        leftLabel: "Time",
        rightLabel: "What happens",
        itemLabel: "Slot",
        addLabel: "Add a time slot",
        help: "Shown as a timeline, e.g. 9.00 am / Registration.",
      },
      { name: "image2", label: "Gallery image 1", type: "image" },
      { name: "image3", label: "Gallery image 2", type: "image" },
      { name: "startDate", label: "Start date & time", type: "datetime", required: true },
      { name: "endDate", label: "End date & time", type: "datetime" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "titleEn", label: "Title" },
      { name: "location", label: "Location" },
      { name: "startDate", label: "Date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "gallery",
    model: "galleryImage",
    title: "Gallery",
    titleSingular: "Gallery Image",
    description: "Photos shown in the gallery.",
    orderBy: { order: "asc" },
    fields: [
      { name: "image", label: "Image", type: "image", required: true },
      { name: "caption", label: "Caption", type: "text", i18n: true },
      { name: "order", label: "Sort order", type: "number" },
    ],
    listFields: [
      { name: "image", label: "", type: "image" },
      { name: "captionEn", label: "Caption" },
    ],
  },
  {
    slug: "products",
    model: "product",
    title: "Products",
    titleSingular: "Product",
    description: "Community-based business products.",
    orderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", i18n: true, required: true },
      { name: "description", label: "Description", type: "textarea", i18n: true, required: true },
      { name: "price", label: "Price (LKR)", type: "number" },
      { name: "image", label: "Image", type: "image" },
      { name: "inStock", label: "In stock", type: "boolean" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "image", label: "", type: "image" },
      { name: "nameEn", label: "Name" },
      { name: "price", label: "Price", type: "money" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "testimonials",
    model: "testimonial",
    title: "Testimonials",
    titleSingular: "Testimonial",
    description: "Community voices / success stories.",
    orderBy: { order: "asc" },
    fields: [
      { name: "quote", label: "Quote", type: "textarea", i18n: true, required: true },
      { name: "author", label: "Author / attribution", type: "text", i18n: true, required: true },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    listFields: [
      { name: "authorEn", label: "Author" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "partners",
    model: "partner",
    title: "Partners",
    titleSingular: "Partner",
    description: "Partner organizations shown on the home page.",
    orderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image" },
      { name: "url", label: "Website URL", type: "text" },
      { name: "order", label: "Sort order", type: "number" },
    ],
    listFields: [
      { name: "logo", label: "", type: "image" },
      { name: "name", label: "Name" },
    ],
  },
  {
    slug: "stats",
    model: "stat",
    title: "Impact Stats",
    titleSingular: "Stat",
    description: "Impact numbers shown on the home page.",
    orderBy: { order: "asc" },
    fields: [
      { name: "label", label: "Label", type: "text", i18n: true, required: true },
      { name: "value", label: "Value (e.g. 5,000+)", type: "text", required: true },
      { name: "order", label: "Sort order", type: "number" },
    ],
    listFields: [
      { name: "labelEn", label: "Label" },
      { name: "value", label: "Value" },
    ],
  },
  {
    slug: "donations",
    model: "donation",
    title: "Donations",
    titleSingular: "Donation",
    description: "Donation records from PayHere.",
    readOnly: true,
    orderBy: { createdAt: "desc" },
    fields: [],
    listFields: [
      { name: "createdAt", label: "Date", type: "date" },
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "amount", label: "Amount", type: "money" },
      { name: "status", label: "Status" },
    ],
  },
  {
    slug: "suggestions",
    model: "suggestion",
    title: "Suggestions",
    titleSingular: "Suggestion",
    description: "Suggestions submitted by visitors.",
    readOnly: true,
    orderBy: { createdAt: "desc" },
    fields: [],
    listFields: [
      { name: "createdAt", label: "Date", type: "date" },
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "message", label: "Message" },
    ],
  },
  {
    slug: "messages",
    model: "contactMessage",
    title: "Contact Messages",
    titleSingular: "Message",
    description: "Messages from the contact form.",
    readOnly: true,
    orderBy: { createdAt: "desc" },
    fields: [],
    listFields: [
      { name: "createdAt", label: "Date", type: "date" },
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "subject", label: "Subject" },
      { name: "message", label: "Message" },
    ],
  },
  {
    slug: "subscribers",
    model: "subscriber",
    title: "Subscribers",
    titleSingular: "Subscriber",
    description: "Newsletter subscribers.",
    readOnly: true,
    orderBy: { createdAt: "desc" },
    fields: [],
    listFields: [
      { name: "createdAt", label: "Date", type: "date" },
      { name: "email", label: "Email" },
    ],
  },
];

export function getEntity(slug: string): EntityDef | undefined {
  return entities.find((e) => e.slug === slug);
}
