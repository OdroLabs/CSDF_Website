"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/** Input names to post under, one per language. */
export interface FieldNames {
  en: string;
  si: string;
  ta: string;
}

/** Raw stored values, one per language. */
export interface FieldValues {
  en: string;
  si: string;
  ta: string;
}

type Lang = keyof FieldNames;

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
];

/** Strip the characters that would corrupt the stored line format. */
function clean(value: string): string {
  return value.replace(/::/g, ":").replace(/[\r\n]+/g, " ");
}

function splitLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* Shared row chrome                                                           */
/* -------------------------------------------------------------------------- */

function RowHeader({
  index,
  total,
  itemLabel,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  itemLabel: string;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        {itemLabel} {String(index + 1).padStart(2, "0")}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          title="Move up"
          aria-label="Move up"
          className="rounded-md border bg-white p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          title="Move down"
          aria-label="Move down"
          className="rounded-md border bg-white p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          title="Remove"
          aria-label="Remove"
          className="rounded-md border bg-white p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Title + description rows                                                    */
/* -------------------------------------------------------------------------- */

interface PairItem {
  left: Record<Lang, string>;
  right: Record<Lang, string>;
}

/** Parse the three language strings into aligned rows. */
function parsePairs(values: FieldValues): PairItem[] {
  const perLang: Record<Lang, { left: string; right: string }[]> = {
    en: [],
    si: [],
    ta: [],
  };
  for (const { code } of LANGS) {
    perLang[code] = splitLines(values[code]).map((line) => {
      const [left, ...rest] = line.split("::");
      return { left: left.trim(), right: rest.join("::").trim() };
    });
  }
  const count = Math.max(perLang.en.length, perLang.si.length, perLang.ta.length);
  return Array.from({ length: count }, (_, i) => ({
    left: {
      en: perLang.en[i]?.left ?? "",
      si: perLang.si[i]?.left ?? "",
      ta: perLang.ta[i]?.left ?? "",
    },
    right: {
      en: perLang.en[i]?.right ?? "",
      si: perLang.si[i]?.right ?? "",
      ta: perLang.ta[i]?.right ?? "",
    },
  }));
}

/** Rebuild one language's stored string from the rows. */
function serialisePairs(items: PairItem[], lang: Lang): string {
  return items
    .map((item) => {
      const left = item.left[lang].trim();
      const right = item.right[lang].trim();
      if (!left && !right) return "";
      return right ? `${left} :: ${right}` : left;
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Repeatable "heading + text" rows, stored as `Left :: Right` lines.
 *
 * Editing one row at a time keeps the three languages aligned by construction —
 * you cannot end up with four English items and three Tamil ones.
 */
export function PairListField({
  names,
  values,
  leftLabel = "Title",
  rightLabel = "Description",
  itemLabel = "Item",
  addLabel = "Add item",
  emptyHint = "No items yet. This section is hidden on the site until you add one.",
  multilineRight = true,
}: {
  names: FieldNames;
  values: FieldValues;
  leftLabel?: string;
  rightLabel?: string;
  itemLabel?: string;
  addLabel?: string;
  emptyHint?: string;
  multilineRight?: boolean;
}) {
  const [items, setItems] = useState<PairItem[]>(() => parsePairs(values));

  const update = (index: number, side: "left" | "right", lang: Lang, value: string) =>
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [side]: { ...item[side], [lang]: clean(value) } } : item
      )
    );

  const add = () =>
    setItems((prev) => [
      ...prev,
      { left: { en: "", si: "", ta: "" }, right: { en: "", si: "", ta: "" } },
    ]);

  const remove = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const move = (from: number, to: number) =>
    setItems((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });

  return (
    <div className="space-y-3">
      {LANGS.map(({ code }) => (
        <input key={code} type="hidden" name={names[code]} value={serialisePairs(items, code)} />
      ))}

      {items.length === 0 && <EmptyHint text={emptyHint} />}

      {items.map((item, index) => (
        <div key={index} className="rounded-xl border bg-muted/20 p-4">
          <RowHeader
            index={index}
            total={items.length}
            itemLabel={itemLabel}
            onMove={move}
            onRemove={remove}
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {LANGS.map(({ code, label }) => (
              <div key={code} className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <div className="space-y-1">
                  <label className="block text-[11px] text-muted-foreground">{leftLabel}</label>
                  <Input
                    value={item.left[code]}
                    onChange={(e) => update(index, "left", code, e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] text-muted-foreground">{rightLabel}</label>
                  {multilineRight ? (
                    <Textarea
                      rows={3}
                      value={item.right[code]}
                      onChange={(e) => update(index, "right", code, e.target.value)}
                      className="bg-white"
                    />
                  ) : (
                    <Input
                      value={item.right[code]}
                      onChange={(e) => update(index, "right", code, e.target.value)}
                      className="bg-white"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Simple one-per-line rows                                                    */
/* -------------------------------------------------------------------------- */

type LineItem = Record<Lang, string>;

function parseLines(values: FieldValues): LineItem[] {
  const perLang: Record<Lang, string[]> = {
    en: splitLines(values.en),
    si: splitLines(values.si),
    ta: splitLines(values.ta),
  };
  const count = Math.max(perLang.en.length, perLang.si.length, perLang.ta.length);
  return Array.from({ length: count }, (_, i) => ({
    en: perLang.en[i] ?? "",
    si: perLang.si[i] ?? "",
    ta: perLang.ta[i] ?? "",
  }));
}

/**
 * Repeatable single-value rows, stored one per line.
 *
 * Set `translated` to false for lists that are the same in every language
 * (donation amounts, for example) — then only one box per row is shown.
 */
export function LineListField({
  names,
  values,
  itemLabel = "Item",
  addLabel = "Add item",
  emptyHint = "No items yet. This part is hidden on the site until you add one.",
  translated = true,
  inputType = "text",
}: {
  names: FieldNames;
  values: FieldValues;
  itemLabel?: string;
  addLabel?: string;
  emptyHint?: string;
  translated?: boolean;
  inputType?: "text" | "number";
}) {
  const [items, setItems] = useState<LineItem[]>(() => parseLines(values));

  const langs = translated ? LANGS : LANGS.slice(0, 1);

  const update = (index: number, lang: Lang, value: string) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [lang]: clean(value) } : item))
    );

  const add = () => setItems((prev) => [...prev, { en: "", si: "", ta: "" }]);
  const remove = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const move = (from: number, to: number) =>
    setItems((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });

  const serialise = (lang: Lang) =>
    items
      .map((item) => item[lang].trim())
      .filter(Boolean)
      .join("\n");

  return (
    <div className="space-y-2.5">
      {LANGS.map(({ code }) => (
        <input key={code} type="hidden" name={names[code]} value={serialise(code)} />
      ))}

      {items.length === 0 && <EmptyHint text={emptyHint} />}

      {items.map((item, index) => (
        <div key={index} className="rounded-xl border bg-muted/20 p-3">
          <RowHeader
            index={index}
            total={items.length}
            itemLabel={itemLabel}
            onMove={move}
            onRemove={remove}
          />
          <div className={translated ? "grid gap-3 lg:grid-cols-3" : ""}>
            {langs.map(({ code, label }) => (
              <div key={code} className="space-y-1">
                {translated && (
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                )}
                <Input
                  type={inputType}
                  value={item[code]}
                  onChange={(e) => update(index, code, e.target.value)}
                  className="bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
