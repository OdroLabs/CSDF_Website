import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEntity } from "@/lib/admin-config";
import { requireAdmin } from "@/lib/session";
import { formatDate } from "@/lib/utils";

/** Wraps a value in quotes and escapes embedded quotes, per RFC 4180. */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET(_req: NextRequest, { params }: { params: { entity: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entity = getEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rows: Record<string, any>[] = await (prisma as any)[entity.model].findMany({
    orderBy: entity.orderBy,
  });

  const columns = entity.listFields;
  const header = columns.map((col) => csvCell(col.label)).join(",");
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const value = row[col.name];
        if (col.type === "date") return csvCell(value ? formatDate(value) : "");
        if (col.type === "boolean") return csvCell(value ? "Yes" : "No");
        return csvCell(value);
      })
      .join(",")
  );

  const csv = "﻿" + [header, ...lines].join("\r\n") + "\r\n";
  const filename = `${entity.slug}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
