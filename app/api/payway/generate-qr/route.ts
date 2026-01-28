import crypto from "crypto";

export const runtime = "nodejs";

type GenerateQrPayload = {
  req_time?: string;
  merchant_id?: string;
  tran_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  amount?: number | string;
  purchase_type?: string;
  payment_option?: string;
  items?: string;
  currency?: string;
  callback_url?: string;
  return_deeplink?: string;
  custom_fields?: string;
  return_params?: string;
  payout?: string;
  lifetime?: number | string;
  qr_image_template?: string;
  additional_params?: string;
  hash?: string;
};

const DEFAULT_HASH_ORDER = [
  "req_time",
  "merchant_id",
  "tran_id",
  "amount",
  "items",
  "first_name",
  "last_name",
  "email",
  "phone",
  "purchase_type",
  "payment_option",
  "callback_url",
  "return_deeplink",
  "currency",
  "custom_fields",
  "return_params",
  "payout",
  "lifetime",
  "qr_image_template",
];

function parseHashFields(fieldOrder?: string): string[] {
  if (!fieldOrder) return DEFAULT_HASH_ORDER;
  const order = fieldOrder
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return order.length ? order : DEFAULT_HASH_ORDER;
}

function buildHashFromOrder(
  fields: Record<string, string>,
  publicKey: string,
  order: string[]
): { hash: string; raw: string } {
  const raw = order.map((key) => fields[key] ?? "").join("");
  const hash = crypto.createHmac("sha512", publicKey).update(raw).digest("base64");
  return { hash, raw };
}

function toAmountString(value: number | string | undefined): string {
  if (typeof value === "number") return value.toFixed(2);
  return value ? String(value) : "0.00";
}

function getReqTimeUtc(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    now.getUTCFullYear().toString() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes()) +
    pad(now.getUTCSeconds())
  );
}

function generateTranId(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = now.getUTCFullYear();
  const m = pad(now.getUTCMonth() + 1);
  const d = pad(now.getUTCDate());
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `ORD-${y}${m}${d}-${random}`;
}

function toBase64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function normalizeBase64(value: string): string {
  const cleaned = value.replace(/\s+/g, "");
  const padLength = cleaned.length % 4;
  if (padLength === 0) return cleaned;
  return cleaned + "=".repeat(4 - padLength);
}

function isBase64(value: string): boolean {
  if (!value) return false;
  const cleaned = value.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) return false;
  try {
    const normalized = normalizeBase64(cleaned);
    const decoded = Buffer.from(normalized, "base64").toString("utf8");
    const reencoded = Buffer.from(decoded, "utf8").toString("base64");
    return normalizeBase64(reencoded) === normalized;
  } catch {
    return false;
  }
}

function ensureBase64(value: string | undefined): string {
  if (!value) return "";
  return isBase64(value) ? value : toBase64(value);
}

export async function POST(req: Request) {
  let body: GenerateQrPayload | null = null;
  try {
    body = (await req.json()) as GenerateQrPayload;
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const merchantId = body?.merchant_id || process.env.PAYWAY_MERCHANT_ID || "";
  const hmacKey =
    process.env.PAYWAY_HMAC_KEY || process.env.PAYWAY_PUBLIC_KEY || "";
  const apiUrl =
    process.env.PAYWAY_QR_URL ||
    "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr";

  if (!merchantId || !hmacKey) {
    return Response.json(
      { message: "PayWay is not configured" },
      { status: 500 }
    );
  }

  const reqTime = body?.req_time || getReqTimeUtc();
  const tranId = body?.tran_id || generateTranId();
  const amount = toAmountString(body?.amount);
  const purchaseType = body?.purchase_type || "purchase";
  const paymentOption = body?.payment_option || "abapay_khqr";
  const currency = body?.currency || "USD";
  const qrImageTemplate = body?.qr_image_template || "template3_color";

  const itemsRaw = body?.items || "";
  const items = itemsRaw ? (isBase64(itemsRaw) ? itemsRaw : toBase64(itemsRaw)) : "";
  const callbackUrl = ensureBase64(body?.callback_url);
  const returnDeeplink = ensureBase64(body?.return_deeplink);
  const customFields = ensureBase64(body?.custom_fields);
  const returnParams = ensureBase64(body?.return_params);
  const payout = ensureBase64(body?.payout);
  const additionalParams = ensureBase64(body?.additional_params);
  const lifetime = body?.lifetime ?? 43200;

  const hashFields = parseHashFields(process.env.PAYWAY_QR_HASH_FIELDS);
  const hashInput = {
    req_time: reqTime,
    merchant_id: merchantId,
    tran_id: tranId,
    amount,
    items,
    first_name: body?.first_name || "",
    last_name: body?.last_name || "",
    email: body?.email || "",
    phone: body?.phone || "",
    purchase_type: purchaseType,
    payment_option: paymentOption,
    callback_url: callbackUrl,
    return_deeplink: returnDeeplink,
    currency,
    custom_fields: customFields,
    return_params: returnParams,
    payout,
    lifetime: String(lifetime ?? ""),
    qr_image_template: qrImageTemplate,
  };

  const computed = buildHashFromOrder(hashInput, hmacKey, hashFields);
  const hash = body?.hash || computed.hash;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      req_time: reqTime,
      merchant_id: merchantId,
      tran_id: tranId,
      first_name: body?.first_name || "",
      last_name: body?.last_name || "",
      email: body?.email || "",
      phone: body?.phone || "",
      amount: amount,
      purchase_type: purchaseType,
      payment_option: paymentOption,
      items,
      currency,
      callback_url: callbackUrl,
      return_deeplink: returnDeeplink || null,
      custom_fields: customFields || null,
      return_params: returnParams || null,
      payout: payout || null,
      lifetime: lifetime,
      qr_image_template: qrImageTemplate,
      additional_params: additionalParams || null,
      hash,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return Response.json(
      {
        message: "PayWay error",
        paywayStatus: response.status,
        paywayBody: data,
        ...(process.env.NODE_ENV === "development"
          ? {
              hash_fields: hashFields.join(","),
              hash_raw: computed.raw,
              merchant_id: merchantId,
              tran_id: tranId,
              amount,
            }
          : {}),
      },
      { status: response.status }
    );
  }

  return Response.json(data ?? { message: "Invalid PayWay response" }, {
    status: response.status,
  });
}
