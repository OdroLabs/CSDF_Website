"use client";

import { useState } from "react";
import { submitSuggestion } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function SuggestionForm({
  dict,
  /** Set in Site Settings → Other Pages. Falls back to a generic thank-you. */
  successMessage,
}: {
  dict: Dictionary;
  successMessage?: string;
}) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-teal-500/30 bg-teal-50 p-6 text-sm font-medium text-teal-800">
        ✓ {successMessage || dict.common.thankYou}
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        const res = await submitSuggestion(fd);
        if (res.ok) setDone(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="s-name">
            {dict.common.name} <span className="text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="s-name" name="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-email">
            {dict.common.email} <span className="text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="s-email" name="email" type="email" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-message">{dict.common.message} *</Label>
        <Textarea id="s-message" name="message" required rows={6} />
      </div>
      <Button type="submit" size="lg" className="px-8">
        {dict.common.submit}
      </Button>
    </form>
  );
}
