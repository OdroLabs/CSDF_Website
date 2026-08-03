import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/roles";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ToastProvider } from "@/components/admin/toast";
import { AdminUserMenu } from "@/components/admin/user-menu";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar role={admin.role} email={admin.email} />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b border-border bg-white/80 px-6 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
            <AdminUserMenu email={admin.email} role={ROLE_LABELS[admin.role]} />
          </header>
          <main className="p-6 md:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
