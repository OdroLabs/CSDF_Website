"use client";

import { useState } from "react";
import { submitContact } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-lg border border-teal-500/40 bg-teal-50 p-6 text-teal-800">
        ✓ {dict.contact.sent}
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        const res = await submitContact(fd);
        if (res.ok) setDone(true);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-name">{dict.common.name} *</Label>
          <Input id="c-name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-email">{dict.common.email} *</Label>
          <Input id="c-email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-phone">
            {dict.common.phone} <span className="text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="c-phone" name="phone" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-subject">
            {dict.common.subject} <span className="text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="c-subject" name="subject" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-message">{dict.common.message} *</Label>
        <Textarea id="c-message" name="message" required rows={6} />
      </div>
      <Button type="submit">{dict.common.send}</Button>
    </form>
  );
}
