"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveEntity } from "@/lib/actions";
import { useToast } from "./toast";
import { withMinDelay } from "@/lib/utils";
import type { EntityDef, FieldDef } from "@/lib/admin-config";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadField } from "./image-upload";
import { LineListField, PairListField } from "./repeater-field";
import { RichTextField } from "./rich-text-field";

const langs = [
  { suffix: "En", label: "English" },
  { suffix: "Si", label: "සිංහල (Sinhala)" },
  { suffix: "Ta", label: "தமிழ் (Tamil)" },
];

function toInputValue(field: FieldDef, value: any): string {
  if (value == null) return "";
  if (field.type === "date") return String(value).slice(0, 10);
  if (field.type === "datetime") return String(value).slice(0, 16);
  return String(value);
}

function SingleField({
  field,
  name,
  defaultValue,
  required,
  invalid,
}: {
  field: FieldDef;
  name: string;
  defaultValue: any;
  required?: boolean;
  invalid?: boolean;
}) {
  const errorClass = invalid ? "border-destructive ring-1 ring-destructive" : "";
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          name={name}
          rows={5}
          defaultValue={toInputValue(field, defaultValue)}
          required={required}
          className={errorClass}
        />
      );
    case "richtext":
      return <RichTextField name={name} defaultValue={defaultValue} />;
    case "image":
      return <FileUploadField name={name} defaultValue={defaultValue} />;
    case "file":
      return (
        <FileUploadField name={name} defaultValue={defaultValue} accept="application/pdf" isImage={false} />
      );
    case "number":
      return (
        <Input
          name={name}
          type="number"
          step="any"
          defaultValue={toInputValue(field, defaultValue)}
          required={required}
          className={errorClass}
        />
      );
    case "date":
      return (
        <Input
          name={name}
          type="date"
          defaultValue={toInputValue(field, defaultValue)}
          required={required}
          className={errorClass}
        />
      );
    case "datetime":
      return (
        <Input
          name={name}
          type="datetime-local"
          defaultValue={toInputValue(field, defaultValue)}
          required={required}
          className={errorClass}
        />
      );
    case "boolean":
      return (
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultValue == null ? true : Boolean(defaultValue)}
          className="h-4 w-4 accent-primary"
        />
      );
    case "select":
      return (
        <select
          name={name}
          defaultValue={toInputValue(field, defaultValue) || field.options?.[0]?.value}
          required={required}
          className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ${errorClass}`}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <Input
          name={name}
          defaultValue={toInputValue(field, defaultValue)}
          required={required}
          className={errorClass}
        />
      );
  }
}

/** True when a required field's value is missing — mirrors the server-side check in actions.ts. */
function isFieldEmpty(field: FieldDef, formData: FormData): boolean {
  const key = field.i18n ? `${field.name}En` : field.name;
  const raw = formData.get(key);
  const value = typeof raw === "string" ? raw.trim() : "";
  if (field.type === "richtext") return value.replace(/<[^>]*>/g, "").trim() === "";
  return value === "";
}

export function EntityForm({
  entity,
  record,
}: {
  entity: EntityDef;
  record: Record<string, any> | null;
}) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const { toast, update } = useToast();
  const router = useRouter();

  /** Client-side mirror of the server's required-field check (actions.ts),
   *  so richtext/image/select fields — which have no native browser
   *  validation — still get caught, and the admin sees every missing field
   *  at once instead of one at a time via a round trip to the server. */
  function validate(fd: FormData): boolean {
    const missing = new Set<string>();
    for (const field of entity.fields) {
      if (field.required && isFieldEmpty(field, fd)) missing.add(field.name);
    }
    setErrors(missing);
    return missing.size === 0;
  }

  async function handleSave(fd: FormData) {
    if (!validate(fd)) {
      toast({
        title: "Missing required fields",
        description: "Fix the highlighted fields below and try again.",
        variant: "error",
      });
      return;
    }
    setSaving(true);
    const id = toast({
      title: record ? "Saving changes…" : `Creating ${entity.titleSingular.toLowerCase()}…`,
      variant: "loading",
    });
    try {
      const result = await withMinDelay(saveEntity(entity.slug, record?.id ?? null, fd));
      if (result.ok) {
        update(id, {
          title: record ? "Changes saved" : `${entity.titleSingular} created`,
          description: "Live on the site now.",
          variant: "success",
        });
        // Only leave the form once the save actually succeeded.
        router.push(`/admin/content/${entity.slug}`);
      } else {
        update(id, {
          title: record ? "Not saved" : "Not created",
          description: result.error,
          variant: "error",
        });
      }
    } catch {
      update(id, {
        title: "Not saved",
        description: "Could not reach the server. Check your connection and try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave(new FormData(e.currentTarget));
      }}
      className="space-y-5"
    >
      {entity.fields.map((field) => {
        const invalid = errors.has(field.name);
        return (
        <Card key={field.name} className={invalid ? "border-destructive" : undefined}>
          <CardContent className="pt-5">
            <Label className="mb-3 block font-semibold">
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            {field.help && <p className="-mt-2 mb-3 text-xs text-muted-foreground">{field.help}</p>}
            {invalid && (
              <p className="-mt-2 mb-3 text-xs font-medium text-destructive">
                This field is required.
              </p>
            )}
            {field.type === "pairs" || field.type === "lines" ? (
              // Repeatable lists manage all three languages together, so they
              // replace the usual three-column layout entirely.
              (() => {
                const names = {
                  en: `${field.name}En`,
                  si: `${field.name}Si`,
                  ta: `${field.name}Ta`,
                };
                const values = {
                  en: record?.[`${field.name}En`] ?? "",
                  si: record?.[`${field.name}Si`] ?? "",
                  ta: record?.[`${field.name}Ta`] ?? "",
                };
                return field.type === "pairs" ? (
                  <PairListField
                    names={names}
                    values={values}
                    leftLabel={field.leftLabel}
                    rightLabel={field.rightLabel}
                    itemLabel={field.itemLabel}
                    addLabel={field.addLabel}
                  />
                ) : (
                  <LineListField
                    names={names}
                    values={values}
                    itemLabel={field.itemLabel}
                    addLabel={field.addLabel}
                    translated={field.i18n !== false}
                  />
                );
              })()
            ) : field.i18n ? (
              <div
                className={
                  // Three rich editors side by side would be unusable, so those
                  // stack full-width instead of sitting in three columns.
                  field.type === "richtext" ? "space-y-5" : "grid gap-4 lg:grid-cols-3"
                }
              >
                {langs.map((lang) => (
                  <div key={lang.suffix} className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">{lang.label}</p>
                    <SingleField
                      field={field}
                      name={`${field.name}${lang.suffix}`}
                      defaultValue={record?.[`${field.name}${lang.suffix}`]}
                      required={field.required && lang.suffix === "En"}
                      invalid={invalid && lang.suffix === "En"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <SingleField
                field={field}
                name={field.name}
                defaultValue={record?.[field.name]}
                required={field.required}
                invalid={invalid}
              />
            )}
          </CardContent>
        </Card>
        );
      })}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {record ? "Save Changes" : `Create ${entity.titleSingular}`}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admin/content/${entity.slug}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
