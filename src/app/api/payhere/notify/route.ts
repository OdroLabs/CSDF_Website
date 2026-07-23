import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNotifySignature, statusFromCode } from "@/lib/payhere";

// PayHere server-to-server notification. Must be publicly reachable in production.
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params = {
    merchant_id: (form.get("merchant_id") as string) ?? "",
    order_id: (form.get("order_id") as string) ?? "",
    payhere_amount: (form.get("payhere_amount") as string) ?? "",
    payhere_currency: (form.get("payhere_currency") as string) ?? "",
    status_code: (form.get("status_code") as string) ?? "",
    md5sig: (form.get("md5sig") as string) ?? "",
  };
  const paymentId = (form.get("payment_id") as string) ?? null;

  if (!verifyNotifySignature(params)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await prisma.donation.updateMany({
    where: { orderId: params.order_id },
    data: {
      status: statusFromCode(params.status_code),
      payherePaymentId: paymentId,
    },
  });

  return NextResponse.json({ ok: true });
}
