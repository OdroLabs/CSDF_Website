"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(searchParams.get("callbackUrl") ?? "/admin");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoFocus placeholder="you@csdf.org" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-secondary p-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold tracking-tight">CSDF Admin</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage your site</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-pop">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/40">
          <ShieldCheck className="h-3.5 w-3.5" /> Restricted access — authorized staff only
        </p>
      </div>
    </div>
  );
}
