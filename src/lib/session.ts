import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { toRole, type Role } from "./roles";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

/** The signed-in admin, or null. Safe to call from any server component. */
export async function getAdmin(): Promise<AdminUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { id?: string; name?: string | null; email?: string | null; role?: string }
    | undefined;
  if (!user?.email) return null;
  return {
    id: Number(user.id),
    name: user.name ?? "",
    email: user.email,
    role: toRole(user.role),
  };
}

/** Throws unless someone is signed in. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

/**
 * Throws unless the signed-in user is an owner. Used by every action that
 * touches site settings or other user accounts.
 */
export async function requireOwner(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (admin.role !== "owner") throw new Error("Forbidden");
  return admin;
}
