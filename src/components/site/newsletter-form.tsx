"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function NewsletterForm({ dict }: { dict: Dictionary }) {
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm font-medium text-accent">✓ {dict.home.subscribed}</p>;
  }

  return (
    <form
      action={async (fd) => {
        const res = await subscribeNewsletter(fd);
        if (res.ok) setDone(true);
      }}
      className="flex gap-2"
    >
      <Input
        name="email"
        type="email"
        required
        placeholder={dict.home.emailPlaceholder}
        className="border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/20"
      />
      <Button type="submit" className="shrink-0 bg-white text-secondary hover:bg-white/90">
        {dict.home.subscribe}
      </Button>
    </form>
  );
}
