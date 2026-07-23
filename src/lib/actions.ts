"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { prisma } from "./prisma";
import { authOptions } from "./auth";
import { getEntity, type FieldDef } from "./admin-config";
import { settingGroups } from "./settings";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

function delegate(model: string) {
  return (prisma as any)[model];
}

function parseFieldValue(field: FieldDef, raw: FormDataEntryValue | null) {
  const value = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "number": {
      if (value === "") return field.name === "order" ? 0 : null;
      const n = Number(value);
      return isNaN(n) ? null : n;
    }
    case "date":
    case "datetime":
      return value === "" ? null : new Date(value);
    case "boolean":
      return raw === "on" || raw === "true";
    default:
      return value === "" ? null : value;
  }
}

function buildData(fields: FieldDef[], formData: FormData) {
  const data: Record<string, any> = {};
  for (const field of fields) {
    if (field.i18n) {
      for (const suffix of ["En", "Si", "Ta"]) {
        const key = `${field.name}${suffix}`;
        const parsed = parseFieldValue(field, formData.get(key));
        // English base field is required by schema for required fields
        data[key] = field.required && suffix === "En" ? (parsed ?? "") : parsed;
      }
    } else {
      const parsed = parseFieldValue(field, formData.get(field.name));
      if (field.type === "boolean") data[field.name] = parsed;
      else if (field.required) data[field.name] = parsed ?? "";
      else data[field.name] = parsed;
    }
  }
  return data;
}

export async function saveEntity(slug: string, id: number | null, formData: FormData) {
  await requireAdmin();
  const entity = getEntity(slug);
  if (!entity || entity.readOnly) throw new Error("Unknown entity");
  const data = buildData(entity.fields, formData);
  if (id) {
    await delegate(entity.model).update({ where: { id }, data });
  } else {
    await delegate(entity.model).create({ data });
  }
  revalidatePath("/", "layout");
  redirect(`/admin/content/${slug}`);
}

export async function deleteEntity(slug: string, id: number) {
  await requireAdmin();
  const entity = getEntity(slug);
  if (!entity) throw new Error("Unknown entity");
  await delegate(entity.model).delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath(`/admin/content/${slug}`);
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  for (const group of settingGroups) {
    for (const item of group.items) {
      if (item.i18n) {
        const valueEn = (formData.get(`${item.key}__en`) as string) ?? "";
        const valueSi = (formData.get(`${item.key}__si`) as string) ?? "";
        const valueTa = (formData.get(`${item.key}__ta`) as string) ?? "";
        await prisma.setting.upsert({
          where: { key: item.key },
          update: { valueEn, valueSi, valueTa },
          create: { key: item.key, valueEn, valueSi, valueTa },
        });
      } else {
        const valueEn = (formData.get(`${item.key}__en`) as string) ?? "";
        await prisma.setting.upsert({
          where: { key: item.key },
          update: { valueEn },
          create: { key: item.key, valueEn },
        });
      }
    }
  }
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function changePassword(formData: FormData) {
  const session = await requireAdmin();
  const password = formData.get("password") as string;
  if (!password || password.length < 8) throw new Error("Password must be at least 8 characters");
  const email = session.user?.email;
  if (!email) throw new Error("No user");
  await prisma.user.update({
    where: { email },
    data: { password: await hash(password, 10) },
  });
  redirect("/admin?saved=1");
}

// ---------- Public form actions ----------

export async function submitContact(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  if (!name || !email || !message) return { ok: false };
  await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: ((formData.get("phone") as string) || "").trim() || null,
      subject: ((formData.get("subject") as string) || "").trim() || null,
      message,
    },
  });
  return { ok: true };
}

export async function submitSuggestion(formData: FormData) {
  const message = (formData.get("message") as string)?.trim();
  if (!message) return { ok: false };
  await prisma.suggestion.create({
    data: {
      name: ((formData.get("name") as string) || "").trim() || null,
      email: ((formData.get("email") as string) || "").trim() || null,
      message,
    },
  });
  return { ok: true };
}

export async function subscribeNewsletter(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  if (!email || !email.includes("@")) return { ok: false };
  try {
    await prisma.subscriber.create({ data: { email } });
  } catch {
    // duplicate — treat as success
  }
  return { ok: true };
}
