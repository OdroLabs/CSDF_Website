"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const presets = [1000, 2500, 5000, 10000];

export function AmountField({ label }: { label: string }) {
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="space-y-1.5">
      <label htmlFor="d-amount" className="text-sm font-medium leading-none">
        {label} *
      </label>
      <div className="flex flex-wrap gap-2 pb-1">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(String(p))}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary",
              amount === String(p) && "border-primary bg-primary text-white hover:text-white"
            )}
          >
            Rs. {p.toLocaleString()}
          </button>
        ))}
      </div>
      <Input
        id="d-amount"
        name="amount"
        type="number"
        min="100"
        step="50"
        required
        placeholder="1000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
  );
}
