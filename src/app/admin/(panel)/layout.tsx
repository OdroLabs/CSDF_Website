import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 bg-muted/40">
        <header className="flex h-14 items-center justify-between border-b bg-white px-6">
          <span className="text-sm text-muted-foreground">
            Signed in as <strong>{session.user?.email}</strong>
          </span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
