import type { Dictionary } from "./dictionaries";
import { s, sBool, type SettingsMap } from "./settings";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavConfig {
  primary: NavItem[];
  groups: NavGroup[];
  contact: NavItem | null;
  /** Flat list, used by the footer columns. */
  explore: NavItem[];
  involved: NavItem[];
}

export interface SocialLink {
  key: string;
  label: string;
  url: string;
}

/**
 * Build the menu from the admin toggles. Anything switched off under
 * Site Settings → Header & Navigation disappears from the header, the mobile
 * menu and the footer columns.
 */
export function buildNav(settings: SettingsMap, dict: Dictionary): NavConfig {
  const on = (key: string) => sBool(settings, key, true);

  const primary: NavItem[] = [{ href: "", label: dict.nav.home }];
  if (on("nav_show_about")) primary.push({ href: "/about", label: dict.nav.about });
  if (on("nav_show_projects")) primary.push({ href: "/projects", label: dict.nav.projects });
  if (on("nav_show_services")) primary.push({ href: "/services", label: dict.nav.services });

  const mediaItems: NavItem[] = [];
  if (on("nav_show_publications"))
    mediaItems.push({ href: "/publications", label: dict.nav.publications });
  if (on("nav_show_news")) mediaItems.push({ href: "/news", label: dict.nav.news });
  if (on("nav_show_events")) mediaItems.push({ href: "/events", label: dict.nav.events });

  const involvedItems: NavItem[] = [];
  if (on("nav_show_business"))
    involvedItems.push({ href: "/business", label: dict.nav.business });
  if (on("nav_show_suggestions"))
    involvedItems.push({ href: "/suggestions", label: dict.nav.suggestions });

  const groups: NavGroup[] = [];
  if (mediaItems.length) groups.push({ label: dict.nav.media, items: mediaItems });
  if (involvedItems.length) groups.push({ label: dict.nav.getInvolved, items: involvedItems });

  const contact = on("nav_show_contact") ? { href: "/contact", label: dict.nav.contact } : null;

  // Footer columns reuse the same visibility rules.
  const explore: NavItem[] = [];
  if (on("nav_show_about")) explore.push({ href: "/about", label: dict.nav.about });
  if (on("nav_show_projects")) explore.push({ href: "/projects", label: dict.nav.projects });
  if (on("nav_show_services")) explore.push({ href: "/services", label: dict.nav.services });
  if (on("nav_show_publications"))
    explore.push({ href: "/publications", label: dict.nav.publications });

  const involved: NavItem[] = [];
  if (on("nav_show_events")) involved.push({ href: "/events", label: dict.nav.events });
  if (on("nav_show_business")) involved.push({ href: "/business", label: dict.nav.business });
  involved.push({ href: "/donate", label: dict.nav.donate });
  if (on("nav_show_contact")) involved.push({ href: "/contact", label: dict.nav.contact });

  return { primary, groups, contact, explore, involved };
}

const SOCIAL_KEYS = [
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "X" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
];

/** Social links that actually have a URL set. */
export function buildSocials(settings: SettingsMap): SocialLink[] {
  return SOCIAL_KEYS.map((item) => ({ ...item, url: s(settings, item.key) })).filter(
    (item) => item.url !== ""
  );
}
