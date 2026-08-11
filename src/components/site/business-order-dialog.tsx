"use client";

import { useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { submitBusinessOrder } from "@/lib/actions";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BusinessOrderDialog({
  productId,
  productName,
  locale,
  dict,
}: {
  productId: number;
  productName: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState("pickup");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function placeOrder(formData: FormData) {
    setPending(true);
    setError("");
    const result = await submitBusinessOrder(formData);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setReference(result.data.reference);
    if (result.data.whatsappUrl) window.location.assign(result.data.whatsappUrl);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="mt-auto w-fit">
          <ShoppingBag className="h-4 w-4" /> {dict.common.orderNow}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-6 sm:p-8">
        <DialogTitle>{dict.business.orderTitle}</DialogTitle>
        <DialogDescription>
          {productName} · {dict.business.orderIntro}
        </DialogDescription>

        {reference ? (
          <div className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.04] p-5">
            <p className="font-semibold text-foreground">{dict.business.orderSaved}</p>
            <p className="mt-1 font-number text-sm text-primary">{reference}</p>
          </div>
        ) : (
          <form action={placeOrder} className="mt-5 space-y-5">
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="locale" value={locale} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`order-name-${productId}`}>{dict.business.name} *</Label>
                <Input id={`order-name-${productId}`} name="customerName" required autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`order-phone-${productId}`}>{dict.business.phone} *</Label>
                <Input id={`order-phone-${productId}`} name="phone" type="tel" required autoComplete="tel" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`order-email-${productId}`}>{dict.business.email}</Label>
                <Input id={`order-email-${productId}`} name="email" type="email" autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`order-quantity-${productId}`}>{dict.business.quantity} *</Label>
                <Input id={`order-quantity-${productId}`} name="quantity" type="number" min={1} max={99} defaultValue={1} required />
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">{dict.business.fulfillment} *</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["pickup", dict.business.pickup],
                  ["delivery", dict.business.delivery],
                ].map(([value, label]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-input px-4 py-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/[0.04]">
                    <input
                      type="radio"
                      name="fulfillment"
                      value={value}
                      checked={fulfillment === value}
                      onChange={() => setFulfillment(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            {fulfillment === "delivery" && (
              <div className="space-y-1.5">
                <Label htmlFor={`order-address-${productId}`}>{dict.business.address} *</Label>
                <Textarea id={`order-address-${productId}`} name="address" required rows={3} autoComplete="street-address" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor={`order-notes-${productId}`}>{dict.business.notes}</Label>
              <Textarea id={`order-notes-${productId}`} name="notes" rows={3} />
            </div>

            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              <MessageCircle className="h-4 w-4" />
              {pending ? dict.business.submitting : dict.business.continueWhatsApp}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
