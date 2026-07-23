import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { payhereCheckoutUrl, generateCheckoutHash } from "@/lib/payhere";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name = ((form.get("name") as string) || "").trim();
  const email = ((form.get("email") as string) || "").trim();
  const phone = ((form.get("phone") as string) || "").trim();
  const message = ((form.get("message") as string) || "").trim();
  const locale = ((form.get("locale") as string) || "en").trim();
  const amountRaw = parseFloat((form.get("amount") as string) || "0");

  if (!name || !email || !amountRaw || amountRaw <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  if (!merchantId || !process.env.PAYHERE_MERCHANT_SECRET) {
    return NextResponse.json(
      { error: "Online payments are not configured yet. Please use bank transfer." },
      { status: 503 }
    );
  }

  const amount = amountRaw.toFixed(2);
  const currency = "LKR";
  const orderId = `CSDF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  await prisma.donation.create({
    data: { orderId, name, email, phone: phone || null, amount, currency, message: message || null },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [firstName, ...rest] = name.split(" ");

  const fields: Record<string, string> = {
    merchant_id: merchantId,
    return_url: `${siteUrl}/${locale}/donate/success`,
    cancel_url: `${siteUrl}/${locale}/donate?cancelled=1`,
    notify_url: `${siteUrl}/api/payhere/notify`,
    order_id: orderId,
    items: "Donation to CSDF",
    currency,
    amount,
    first_name: firstName,
    last_name: rest.join(" ") || "-",
    email,
    phone: phone || "-",
    address: "-",
    city: "-",
    country: "Sri Lanka",
    hash: generateCheckoutHash(orderId, amount, currency),
  };

  const inputs = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${k}" value="${v.replace(/"/g, "&quot;")}" />`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html><head><title>Redirecting to PayHere…</title></head>
<body style="font-family:sans-serif;text-align:center;padding-top:80px">
<p>Redirecting to secure payment…</p>
<form id="ph" method="post" action="${payhereCheckoutUrl()}">${inputs}</form>
<script>document.getElementById("ph").submit();</script>
</body></html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
