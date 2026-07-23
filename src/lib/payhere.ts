import crypto from "crypto";

export function payhereCheckoutUrl() {
  return process.env.PAYHERE_MODE === "live"
    ? "https://www.payhere.lk/pay/checkout"
    : "https://sandbox.payhere.lk/pay/checkout";
}

const md5 = (v: string) => crypto.createHash("md5").update(v).digest("hex").toUpperCase();

/** Hash sent with the checkout request. */
export function generateCheckoutHash(orderId: string, amount: string, currency: string) {
  const merchantId = process.env.PAYHERE_MERCHANT_ID ?? "";
  const secret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
  return md5(merchantId + orderId + amount + currency + md5(secret));
}

/** Verify the md5sig received on the notify webhook. */
export function verifyNotifySignature(params: {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
}) {
  const secret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
  const local = md5(
    params.merchant_id +
      params.order_id +
      params.payhere_amount +
      params.payhere_currency +
      params.status_code +
      md5(secret)
  );
  return local === params.md5sig;
}

export function statusFromCode(code: string): string {
  switch (code) {
    case "2":
      return "success";
    case "0":
      return "pending";
    case "-1":
      return "cancelled";
    case "-2":
      return "failed";
    case "-3":
      return "chargeback";
    default:
      return "pending";
  }
}
