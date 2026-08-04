"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { subscribeNewsletter } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function NewsletterForm({ dict }: { dict: Dictionary }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (done) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-medium text-accent">
        <Check className="h-4 w-4" /> {dict.home.subscribed}
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        const fd = new FormData(e.currentTarget);
        const res = await subscribeNewsletter(fd);
        setLoading(false);
        if (res.ok) setDone(true);
        else setError(true);
      }}
      className="flex gap-2"
    >
      <Input
        name="email"
        type="email"
        required
        disabled={loading}
        placeholder={dict.home.emailPlaceholder}
        className="border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/20"
      />
      <Button
        type="submit"
        disabled={loading}
        className="shrink-0 bg-white text-secondary hover:bg-white/90"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {dict.home.subscribe}
      </Button>
      {error && (
        <p className="absolute mt-11 text-xs text-destructive">{dict.home.subscribeError}</p>
      )}
    </form>
  );
}
