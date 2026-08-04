import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined, locale = "en") {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const map: Record<string, string> = { en: "en-GB", si: "si-LK", ta: "ta-LK" };
  return d.toLocaleDateString(map[locale] ?? "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMoney(amount: number | string, currency = "LKR") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${currency} ${n.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

/**
 * Local saves often resolve in well under a second, which makes loading
 * spinners flash too briefly to register. Pad the promise out to a minimum
 * visible duration so the "Saving…" state always reads as real feedback.
 */
export async function withMinDelay<T>(promise: Promise<T>, ms = 500): Promise<T> {
  const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
  return result;
}

/**
 * Admins often paste the whole `<iframe src="..." ...></iframe>` snippet
 * Google Maps gives them, rather than just the src URL the field actually
 * wants. Accept either: if it looks like markup, pull the src attribute out;
 * otherwise use the value as-is (trimmed).
 */
export function extractIframeSrc(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed.includes("<iframe")) return trimmed;
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : "";
}
