"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A switch backed by a hidden input, so the value always posts ("1" or "0").
 * A plain checkbox posts nothing when unchecked, which would be read as
 * "unset" rather than "off".
 */
export function ToggleField({
  name,
  defaultValue,
  label,
  help,
  defaultOn = true,
}: {
  name: string;
  /** Raw stored value. Blank/undefined falls back to `defaultOn`. */
  defaultValue?: string | null;
  label: string;
  help?: string;
  /** What a blank/unset value should mean. Most toggles are "on unless turned off"; a few (e.g. Coming Soon) must default to off. */
  defaultOn?: boolean;
}) {
  const raw = (defaultValue ?? "").trim().toLowerCase();
  const initial = raw === "" ? defaultOn : ["1", "true", "on", "yes"].includes(raw);
  const [checked, setChecked] = useState(initial);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {help && <p className="mt-0.5 text-xs text-muted-foreground">{help}</p>}
      </div>
      <input type="hidden" name={name} value={checked ? "1" : "0"} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((c) => !c)}
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
