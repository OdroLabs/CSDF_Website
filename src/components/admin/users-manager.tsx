"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import {
  createUser,
  deleteUser,
  resetUserPassword,
  setUserActive,
  updateUser,
} from "@/lib/actions";
import { ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS, type Role } from "@/lib/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, withMinDelay } from "@/lib/utils";
import { useToast } from "./toast";

export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

function formatWhen(value: string | null): string {
  if (!value) return "Never";
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RoleSelect({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? "editor"}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}

export function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUserRow[];
  currentUserId: number;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, update } = useToast();
  const router = useRouter();

  /** Wrap an action with a loading → success/error toast. */
  async function run(
    labels: { loading: string; success: string; failure: string },
    fn: () => Promise<{ ok: boolean; error?: string }>,
    onSuccess?: () => void
  ) {
    const id = toast({ title: labels.loading, variant: "loading" });
    try {
      const result = await withMinDelay(fn());
      if (result.ok) {
        update(id, { title: labels.success, variant: "success" });
        onSuccess?.();
        router.refresh();
      } else {
        update(id, { title: labels.failure, description: result.error, variant: "error" });
      }
    } catch {
      update(id, {
        title: labels.failure,
        description: "Could not reach the server. Check your connection and try again.",
        variant: "error",
      });
    }
  }

  const activeOwners = users.filter((u) => u.role === "owner" && u.active).length;

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------- Add */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
          <CardTitle className="text-base">Admin users</CardTitle>
          <Button
            type="button"
            size="sm"
            variant={adding ? "outline" : "default"}
            onClick={() => setAdding((v) => !v)}
          >
            {adding ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add user
              </>
            )}
          </Button>
        </CardHeader>

        {adding && (
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                setSaving(true);
                await run(
                  {
                    loading: "Creating user…",
                    success: "User created",
                    failure: "Not created",
                  },
                  () => createUser(fd),
                  () => setAdding(false)
                );
                setSaving(false);
              }}
              className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2"
            >
              <div className="space-y-1.5">
                <Label htmlFor="new-name">Name</Label>
                <Input id="new-name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-email">Email</Label>
                <Input id="new-email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                />
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-confirm">Confirm password</Label>
                <Input
                  id="new-confirm"
                  name="confirm"
                  type="password"
                  minLength={8}
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="new-role">Role</Label>
                <RoleSelect name="role" />
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  {ROLES.map((role) => (
                    <p key={role}>
                      <span className="font-semibold">{ROLE_LABELS[role]}:</span>{" "}
                      {ROLE_DESCRIPTIONS[role]}
                    </p>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create user
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* ----------------------------------------------------------- List */}
      <div className="space-y-3">
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          const isLastOwner = user.role === "owner" && user.active && activeOwners === 1;
          const locked = isSelf || isLastOwner;

          return (
            <Card key={user.id} className={cn(!user.active && "opacity-70")}>
              <CardContent className="pt-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{user.name}</p>
                      <Badge
                        variant={user.role === "owner" ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {user.role === "owner" && <ShieldCheck className="mr-1 h-3 w-3" />}
                        {ROLE_LABELS[user.role as Role] ?? user.role}
                      </Badge>
                      {!user.active && (
                        <Badge variant="outline" className="rounded-full text-destructive">
                          Suspended
                        </Badge>
                      )}
                      {isSelf && (
                        <span className="text-xs text-muted-foreground">(that&apos;s you)</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Last signed in {formatWhen(user.lastLoginAt)} · Added{" "}
                      {formatWhen(user.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(editingId === user.id ? null : user.id);
                        setResettingId(null);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setResettingId(resettingId === user.id ? null : user.id);
                        setEditingId(null);
                      }}
                    >
                      <KeyRound className="h-3.5 w-3.5" /> Password
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={locked || busyId === user.id}
                      title={
                        isSelf
                          ? "You cannot deactivate your own account"
                          : isLastOwner
                            ? "The only active owner cannot be deactivated"
                            : undefined
                      }
                      onClick={async () => {
                        setBusyId(user.id);
                        await run(
                          {
                            loading: user.active ? "Deactivating…" : "Reactivating…",
                            success: user.active ? "Account suspended" : "Account restored",
                            failure: "Could not change that account",
                          },
                          () => setUserActive(user.id, !user.active)
                        );
                        setBusyId(null);
                      }}
                    >
                      {busyId === user.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : user.active ? (
                        <UserX className="h-3.5 w-3.5" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5" />
                      )}
                      {user.active ? "Deactivate" : "Reactivate"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={locked}
                      title={
                        isSelf
                          ? "You cannot delete your own account"
                          : isLastOwner
                            ? "The only owner cannot be deleted"
                            : undefined
                      }
                      onClick={async () => {
                        if (
                          !confirm(
                            `Delete ${user.name}? This cannot be undone. Deactivating instead keeps their record.`
                          )
                        )
                          return;
                        await run(
                          {
                            loading: "Deleting…",
                            success: "User deleted",
                            failure: "Not deleted",
                          },
                          () => deleteUser(user.id)
                        );
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Edit details */}
                {editingId === user.id && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      setBusyId(user.id);
                      await run(
                        {
                          loading: "Saving…",
                          success: "User updated",
                          failure: "Not saved",
                        },
                        () => updateUser(user.id, fd),
                        () => setEditingId(null)
                      );
                      setBusyId(null);
                    }}
                    className="mt-4 grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-3"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor={`name-${user.id}`}>Name</Label>
                      <Input id={`name-${user.id}`} name="name" defaultValue={user.name} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`email-${user.id}`}>Email</Label>
                      <Input
                        id={`email-${user.id}`}
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`role-${user.id}`}>Role</Label>
                      <RoleSelect name="role" defaultValue={user.role} />
                    </div>
                    <div className="sm:col-span-3">
                      <Button type="submit" size="sm" disabled={busyId === user.id}>
                        {busyId === user.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Save changes
                      </Button>
                    </div>
                  </form>
                )}

                {/* Reset password */}
                {resettingId === user.id && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      setBusyId(user.id);
                      await run(
                        {
                          loading: "Updating password…",
                          success: "Password updated",
                          failure: "Not updated",
                        },
                        () => resetUserPassword(user.id, fd),
                        () => setResettingId(null)
                      );
                      setBusyId(null);
                    }}
                    className="mt-4 grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor={`pw-${user.id}`}>New password</Label>
                      <Input
                        id={`pw-${user.id}`}
                        name="password"
                        type="password"
                        minLength={8}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`pwc-${user.id}`}>Confirm password</Label>
                      <Input
                        id={`pwc-${user.id}`}
                        name="confirm"
                        type="password"
                        minLength={8}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" size="sm" disabled={busyId === user.id}>
                        {busyId === user.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Set password
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Tell {user.name} their new password over a channel they already trust — it
                        is not emailed to them.
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
