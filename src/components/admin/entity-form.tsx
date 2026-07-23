"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { saveEntity } from "@/lib/actions";
import type { EntityDef, FieldDef } from "@/lib/admin-config";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadField } from "./image-upload";

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
}: {
  field: FieldDef;
  name: string;
  defaultValue: any;
  required?: boolean;
}) {
  switch (field.type) {
    case "textarea":
      return <Textarea name={name} rows={5} defaultValue={toInputValue(field, defaultValue)} required={required} />;
    case "image":
      return <FileUploadField name={name} defaultValue={defaultValue} />;
    case "file":
      return (
        <FileUploadField name={name} defaultValue={defaultValue} accept="application/pdf" isImage={false} />
      );
    case "number":
      return (
        <Input name={name} type="number" step="any" defaultValue={toInputValue(field, defaultValue)} required={required} />
      );
    case "date":
      return <Input name={name} type="date" defaultValue={toInputValue(field, defaultValue)} required={required} />;
    case "datetime":
      return (
        <Input name={name} type="datetime-local" defaultValue={toInputValue(field, defaultValue)} required={required} />
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
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    default:
      return <Input name={name} defaultValue={toInputValue(field, defaultValue)} required={required} />;
  }
}

export function EntityForm({
  entity,
  record,
}: {
  entity: EntityDef;
  record: Record<string, any> | null;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <form
      action={async (fd) => {
        setSaving(true);
        try {
          await saveEntity(entity.slug, record?.id ?? null, fd);
        } finally {
          setSaving(false);
        }
      }}
      className="space-y-5"
    >
      {entity.fields.map((field) => (
        <Card key={field.name}>
          <CardContent className="pt-5">
            <Label className="mb-3 block font-semibold">
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            {field.help && <p className="-mt-2 mb-3 text-xs text-muted-foreground">{field.help}</p>}
            {field.i18n ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {langs.map((lang) => (
                  <div key={lang.suffix} className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">{lang.label}</p>
                    <SingleField
                      field={field}
                      name={`${field.name}${lang.suffix}`}
                      defaultValue={record?.[`${field.name}${lang.suffix}`]}
                      required={field.required && lang.suffix === "En"}
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
              />
            )}
          </CardContent>
        </Card>
      ))}
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
