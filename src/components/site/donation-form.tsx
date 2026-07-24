"use client";

import { useState } from "react";
import { Heart, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";

const PRESETS = [1000, 2500, 5000, 10000, 25000];

export function DonationForm({ locale, dict }: { locale: string; dict: Dictionary }) {
  const d = dict.donate;
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [amount, setAmount] = useState<string>("2500");

  const purposes = [
    { value: "general", label: d.purposeGeneral },
    { value: "health", label: d.purposeHealth },
    { value: "education", label: d.purposeEducation },
    { value: "community", label: d.purposeCommunity },
  ];

  return (
    <form action="/api/donate" method="POST" className="space-y-7">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="frequency" value={frequency} />

      {/* Frequency toggle */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-muted p-1.5" role="group" aria-label={d.purpose}>
        {(
          [
            { key: "one_time", label: d.oneTime, Icon: Heart },
            { key: "monthly", label: d.monthly, Icon: RefreshCw },
          ] as const
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFrequency(key)}
            aria-pressed={frequency === key}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200",
              frequency === key
                ? "bg-white text-primary shadow-md shadow-navy-950/[0.08]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="space-y-2.5">
        <Label className="text-sm font-bold text-navy-900">{d.chooseAmount} *</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              aria-pressed={amount === String(p)}
              className={cn(
                "rounded-xl border-2 px-2 py-3 text-center text-sm font-bold transition-all duration-200 motion-safe:active:scale-95",
                amount === String(p)
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                  : "border-border bg-white text-navy-900 hover:border-primary/50 hover:text-primary"
              )}
            >
              {p.toLocaleString()}
              {frequency === "monthly" && (
                <span className="block text-[10px] font-medium opacity-70">{d.perMonth}</span>
              )}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="d-amount" className="text-xs text-muted-foreground">
            {d.customAmount} ({d.amount})
          </Label>
          <Input
            id="d-amount"
            name="amount"
            type="number"
            min="100"
            step="50"
            required
            placeholder="2500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 rounded-xl text-base font-semibold"
          />
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-1.5">
        <Label htmlFor="d-purpose" className="text-sm font-bold text-navy-900">
          {d.purpose}
        </Label>
        <select
          id="d-purpose"
          name="purpose"
          defaultValue="general"
          className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {purposes.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Donor details */}
      <div className="space-y-4">
        <p className="text-sm font-bold text-navy-900">{d.yourDetails}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="d-name">{dict.common.name} *</Label>
            <Input id="d-name" name="name" required className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-email">{dict.common.email} *</Label>
            <Input id="d-email" name="email" type="email" required className="h-11 rounded-xl" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="d-phone">
            {dict.common.phone}{" "}
            <span className="font-normal text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="d-phone" name="phone" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="d-message">
            {dict.common.message}{" "}
            <span className="font-normal text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Textarea id="d-message" name="message" rows={3} className="rounded-xl" />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-13 w-full rounded-full bg-destructive py-6 text-base font-bold shadow-lg shadow-destructive/25 hover:bg-destructive/90"
      >
        <Heart className="h-5 w-5 fill-current" />
        {d.donateNow}
        {amount && Number(amount) > 0 && (
          <span className="font-number">
            — Rs. {Number(amount).toLocaleString()}
            {frequency === "monthly" ? d.perMonth : ""}
          </span>
        )}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
          <Lock className="h-3 w-3" /> SSL
        </span>
        <ShieldCheck className="h-4 w-4 text-emerald-600" /> {d.securePayment}
      </p>
    </form>
  );
}
