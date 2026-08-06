"use client";

import { useState } from "react";
import { submitContact } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function ContactForm({
  dict,
  /** Set in Site Settings → Contact Page. Falls back to a generic thank-you. */
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
        // The visible form splits the name into two fields for a nicer
        // layout, but the ContactMessage record (and the notification email)
        // only has a single `name` column — combine them here rather than
        // touching the schema.
        const firstName = ((fd.get("firstName") as string) || "").trim();
        const lastName = ((fd.get("lastName") as string) || "").trim();
        fd.set("name", [firstName, lastName].filter(Boolean).join(" "));

        const res = await submitContact(fd);
        if (res.ok) setDone(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-first-name">{dict.common.firstName} *</Label>
          <Input id="c-first-name" name="firstName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-last-name">{dict.common.lastName} *</Label>
          <Input id="c-last-name" name="lastName" required />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-email">{dict.common.email} *</Label>
          <Input id="c-email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-phone">
            {dict.common.phone} <span className="text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="c-phone" name="phone" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-subject">
          {dict.common.subject} <span className="text-muted-foreground">({dict.common.optional})</span>
        </Label>
        <Input id="c-subject" name="subject" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-message">{dict.common.message} *</Label>
        <Textarea id="c-message" name="message" required rows={6} />
      </div>
      <Button type="submit" size="lg" className="rounded-full px-8">
        {dict.common.send}
      </Button>
    </form>
  );
}
