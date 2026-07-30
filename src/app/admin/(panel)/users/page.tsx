import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { UsersManager } from "@/components/admin/users-manager";

export default async function UsersPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  // Owners only — editors are bounced back to the dashboard.
  if (admin.role !== "owner") redirect("/admin/dashboard");

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold">Users</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Who can sign in to this admin panel, and what they are allowed to change. Only owners can
        see this page.
      </p>

      <UsersManager
        currentUserId={admin.id}
        users={users.map((u) => ({
          ...u,
          lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
