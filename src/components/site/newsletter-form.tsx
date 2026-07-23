"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function NewsletterForm({ dict }: { dict: Dictionary }) {
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm text-teal-100">✓ {dict.common.thankYou}</p>;
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
        className="bg-white/10 text-white placeholder:text-white/50 border-white/20"
      />
      <Button type="submit" variant="secondary">
        {dict.home.subscribe}
      </Button>
    </form>
  );
}
