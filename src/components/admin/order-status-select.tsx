"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBusinessOrderStatus } from "@/lib/actions";
import { useToast } from "./toast";

const statuses = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderStatusSelect({ id, status }: { id: number; status: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { toast, update } = useToast();

  return (
    <select
      value={status}
      disabled={pending}
      aria-label="Order status"
      className="h-9 rounded-lg border border-input bg-white px-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
      onChange={async (event) => {
        const nextStatus = event.target.value;
        setPending(true);
        const toastId = toast({ title: "Updating order…", variant: "loading" });
        const result = await updateBusinessOrderStatus(id, nextStatus);
        if (result.ok) {
          update(toastId, { title: "Order updated", variant: "success" });
          router.refresh();
        } else {
          update(toastId, { title: "Not updated", description: result.error, variant: "error" });
        }
        setPending(false);
      }}
    >
      {statuses.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
