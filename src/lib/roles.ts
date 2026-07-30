/**
 * Two roles, deliberately few:
 *
 *   owner  — everything, including managing users and site settings
 *   editor — content and the inbox only
 *
 * Kept free of Prisma imports so client components can use the labels too.
 */
export const ROLES = ["owner", "editor"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  editor: "Editor",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full access — content, site settings, and managing admin users.",
  editor: "Can add and edit content and read the inbox. Cannot change settings or users.",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Unknown or legacy values fall back to the least privileged role. */
export function toRole(value: unknown): Role {
  return isRole(value) ? value : "editor";
}

export function isOwner(role: unknown): boolean {
  return toRole(role) === "owner";
}
