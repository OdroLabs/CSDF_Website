import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Plus, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getEntity, type EntityDef } from "@/lib/admin-config";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function EntityListPage({ params }: { params: { entity: string } }) {
  const entity = getEntity(params.entity);
  if (!entity) notFound();

  const rows: Record<string, any>[] = await (prisma as any)[entity.model].findMany({
    orderBy: entity.orderBy,
  });

  function renderCell(row: Record<string, any>, col: EntityDef["listFields"][number]) {
    const value = row[col.name];
    if (col.type === "image") {
      return value ? (
        <div className="relative h-10 w-14 overflow-hidden rounded border">
          <Image src={value} alt="" fill className="object-cover" />
        </div>
      ) : null;
    }
    if (col.type === "boolean") {
      return value ? (
        <CheckCircle2 className="h-4 w-4 text-teal-600" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      );
    }
    if (col.type === "date") return <span className="whitespace-nowrap">{formatDate(value)}</span>;
    if (col.type === "money") return value != null ? formatMoney(String(value)) : "—";
    if (value == null || value === "") return "—";
    return <span className="line-clamp-2 max-w-md">{String(value)}</span>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{entity.title}</h1>
          <p className="text-sm text-muted-foreground">{entity.description}</p>
        </div>
        {!entity.readOnly && (
          <Button asChild>
            <Link href={`/admin/content/${entity.slug}/new`}>
              <Plus className="h-4 w-4" /> Add {entity.titleSingular}
            </Link>
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                {entity.listFields.map((col) => (
                  <TableHead key={col.name}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {entity.listFields.map((col) => (
                    <TableCell key={col.name}>{renderCell(row, col)}</TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!entity.readOnly && (
                        <Button asChild variant="ghost" size="icon" aria-label="Edit">
                          <Link href={`/admin/content/${entity.slug}/${row.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <DeleteButton slug={entity.slug} id={row.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={entity.listFields.length + 1}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Nothing here yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
