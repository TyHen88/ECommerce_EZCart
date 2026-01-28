import crypto from "crypto";

export const runtime = "nodejs";

type PurchasePayload = {
  req_time?: string;
  merchant_id?: string;
  tran_id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  type?: string;
  payment_option?: string;
  items?: Array<{ name: string; quantity: number; price: string | number }> | string;
  shipping?: number | string;
  amount?: number | string;
  currency?: string;
  return_url?: string;
  cancel_url?: string;
  continue_success_url?: string;
  return_deeplink?: string;
  custom_fields?: string;
  return_params?: string;
  payout?: string;
  lifetime?: number | string;
  additional_params?: string;
  google_pay_token?: string;
  skip_success_page?: number | string;
  view_type?: string;
  payment_gate?: number | string;
  hash?: string;
};

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

const DEFAULT_HASH_ORDER = [
  "req_time",
  "merchant_id",
  "tran_id",
  "amount",
  "items",
  "shipping",
  "firstname",
  "lastname",
  "email",
  "phone",
  "type",
  "payment_option",
  "return_url",
  "cancel_url",
  "continue_success_url",
  "return_deeplink",
  "currency",
  "custom_fields",
  "return_params",
  "payout",
  "lifetime",
  "additional_params",
  "google_pay_token",
  "skip_success_page",
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

function getFormValue(
  value: FormDataEntryValue | null
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.name;
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
  let body: PurchasePayload | null = null;
  if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
    const formData = await req.formData();
    body = {
      req_time: getFormValue(formData.get("req_time")),
      merchant_id: getFormValue(formData.get("merchant_id")),
      tran_id: getFormValue(formData.get("tran_id")),
      firstname: getFormValue(formData.get("firstname")),
      lastname: getFormValue(formData.get("lastname")),
      email: getFormValue(formData.get("email")),
      phone: getFormValue(formData.get("phone")),
      type: getFormValue(formData.get("type")),
      payment_option: getFormValue(formData.get("payment_option")),
      items: getFormValue(formData.get("items")) || undefined,
      shipping: getFormValue(formData.get("shipping")),
      amount: getFormValue(formData.get("amount")),
      currency: getFormValue(formData.get("currency")),
      return_url: getFormValue(formData.get("return_url")),
      cancel_url: getFormValue(formData.get("cancel_url")),
      continue_success_url: getFormValue(formData.get("continue_success_url")),
      return_deeplink: getFormValue(formData.get("return_deeplink")),
      custom_fields: getFormValue(formData.get("custom_fields")),
      return_params: getFormValue(formData.get("return_params")),
      payout: getFormValue(formData.get("payout")),
      lifetime: getFormValue(formData.get("lifetime")),
      additional_params: getFormValue(formData.get("additional_params")),
      google_pay_token: getFormValue(formData.get("google_pay_token")),
      skip_success_page: getFormValue(formData.get("skip_success_page")),
      view_type: getFormValue(formData.get("view_type")),
      payment_gate: getFormValue(formData.get("payment_gate")),
      hash: getFormValue(formData.get("hash")),
    };
  } else {
    try {
      body = (await req.json()) as PurchasePayload;
    } catch {
      return Response.json({ message: "Invalid JSON body" }, { status: 400 });
    }
  }

  const merchantId = body?.merchant_id || process.env.PAYWAY_MERCHANT_ID || "";
  const hmacKey =
    process.env.PAYWAY_HMAC_KEY || process.env.PAYWAY_PUBLIC_KEY || "";
  const apiUrl =
    process.env.PAYWAY_PURCHASE_URL ||
    "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";
  const baseUrl =
    process.env.PAYWAY_BASE_URL || "https://checkout-sandbox.payway.com.kh";

  if (!merchantId || !hmacKey) {
    return Response.json(
      { message: "PayWay is not configured" },
      { status: 500 }
    );
  }
  if (
    hmacKey.includes("BEGIN") ||
    hmacKey.startsWith("MI") ||
    hmacKey.length > 120
  ) {
    return Response.json(
      {
        message:
          "PAYWAY_PUBLIC_KEY should be the API public key (HMAC), not the RSA key. Set PAYWAY_HMAC_KEY or PAYWAY_PUBLIC_KEY to the 32-char key from PayWay.",
      },
      { status: 500 }
    );
  }

  const reqTime = body?.req_time || getReqTimeUtc();
  const tranId = body?.tran_id || generateTranId();
  const amount = toAmountString(body?.amount);
  const currency = body?.currency || "USD";
  const type = body?.type || "purchase";
  const paymentOption = body?.payment_option || "cards";
  const shipping = body?.shipping ?? 0;
  const itemsRaw = (body as any)?.items_list || body?.items || [];
  let itemsEncoded: string;
  if (typeof itemsRaw === "string") {
    itemsEncoded = ensureBase64(itemsRaw);
  } else {
    itemsEncoded = Buffer.from(JSON.stringify(itemsRaw)).toString("base64");
  }
  const returnUrlRaw = body?.return_url || process.env.PAYWAY_RETURN_URL || "";
  const cancelUrl = body?.cancel_url || process.env.PAYWAY_CANCEL_URL || "";
  const continueSuccessUrl =
    body?.continue_success_url || process.env.PAYWAY_CONTINUE_SUCCESS_URL || "";
  const returnDeeplinkRaw = body?.return_deeplink || "";
  const customFieldsRaw = body?.custom_fields || "";
  const returnParamsRaw = body?.return_params || "";
  const payoutRaw = body?.payout || "";
  const lifetime = body?.lifetime ?? "";
  const additionalParamsRaw = body?.additional_params || "";
  const googlePayToken = body?.google_pay_token || "";
  const skipSuccessPage = body?.skip_success_page ?? "";
  const viewType = body?.view_type || "";
  const paymentGate = body?.payment_gate ?? "";

  // PayWay requires these fields to be base64-encoded
  const returnUrl = ensureBase64(returnUrlRaw);
  const returnDeeplink = ensureBase64(returnDeeplinkRaw);
  const customFields = ensureBase64(customFieldsRaw);
  const returnParams = ensureBase64(returnParamsRaw);
  const payout = ensureBase64(payoutRaw);
  const additionalParams = ensureBase64(additionalParamsRaw);

  const hashFields = parseHashFields(
    process.env.PAYWAY_PURCHASE_HASH_FIELDS
  );
  const hashInput = {
    req_time: reqTime,
    merchant_id: merchantId,
    tran_id: tranId,
    amount,
    items: itemsEncoded,
    shipping: String(shipping ?? ""),
    firstname: body?.firstname || "",
    lastname: body?.lastname || "",
    email: body?.email || "",
    phone: body?.phone || "",
    type,
    payment_option: paymentOption,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    continue_success_url: continueSuccessUrl,
    return_deeplink: returnDeeplink,
    currency,
    custom_fields: customFields,
    return_params: returnParams,
    payout,
    lifetime: String(lifetime ?? ""),
    additional_params: additionalParams,
    google_pay_token: googlePayToken,
    skip_success_page: String(skipSuccessPage ?? ""),
  };
  const computed = buildHashFromOrder(hashInput, hmacKey, hashFields);
  const hash = body?.hash || computed.hash;
  const debugInfo =
    process.env.NODE_ENV === "development"
      ? {
          hash_fields: hashFields.join(","),
          hash_raw: computed.raw,
          hash: computed.hash,
        }
      : {};

  const form = new FormData();
  form.set("req_time", reqTime);
  form.set("merchant_id", merchantId);
  form.set("tran_id", tranId);
  form.set("firstname", body?.firstname || "");
  form.set("lastname", body?.lastname || "");
  form.set("email", body?.email || "");
  form.set("phone", body?.phone || "");
  form.set("type", type);
  form.set("payment_option", paymentOption);
  form.set("items", itemsEncoded);
  form.set("shipping", String(shipping));
  form.set("amount", amount);
  form.set("currency", currency);
  form.set("return_url", returnUrl);
  form.set("cancel_url", cancelUrl);
  form.set("continue_success_url", continueSuccessUrl);
  form.set("return_deeplink", returnDeeplink);
  form.set("custom_fields", customFields);
  form.set("return_params", returnParams);
  form.set("payout", payout);
  form.set("lifetime", String(lifetime ?? ""));
  form.set("additional_params", additionalParams);
  form.set("google_pay_token", googlePayToken);
  form.set("skip_success_page", String(skipSuccessPage ?? ""));
  form.set("view_type", viewType);
  form.set("payment_gate", String(paymentGate ?? ""));
  form.set("hash", hash);

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      body: form,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown fetch error";
    return Response.json(
      { message: "PayWay request failed", error: message },
      { status: 502 }
    );
  }

  let text = "";
  try {
    text = await response.text();
  } catch {
    text = "";
  }

  const paywayResponseContentType =
    response.headers.get("content-type") || "text/html; charset=utf-8";

  const textTrimmed = text.trim();
  const looksLikeJson = textTrimmed.startsWith("{") || textTrimmed.startsWith("[");
  let paywayJson: any = null;
  if (paywayResponseContentType.includes("application/json") || looksLikeJson) {
    try {
      paywayJson = JSON.parse(text);
    } catch {
      paywayJson = null;
    }
  }

  if (!response.ok) {
    return Response.json(
      {
        message: "PayWay error",
        paywayStatus: response.status,
        paywayBody: paywayJson ?? text,
        ...(process.env.NODE_ENV === "development"
          ? {
              hash_fields: hashFields.join(","),
              hash_raw: computed.raw,
              merchant_id: merchantId,
              tran_id: tranId,
              amount,
              currency,
              payment_option: paymentOption,
            }
          : {}),
      },
      { status: response.status }
    );
  }

  if (paywayResponseContentType.includes("text/html")) {
    const baseTag = `<base href="${baseUrl}">`;
    let injection = baseTag;
    const pathMatch = text.match(/"path"\s*:\s*"([^"]+)"/);
    if (pathMatch?.[1]) {
      const checkoutPath = pathMatch[1].replace(/\\u002F/g, "/");
      const historyScript = `<script>try{history.replaceState(null,"",${JSON.stringify(
        checkoutPath
      )});}catch(e){}</script>`;
      injection += historyScript;
    }
    if (!text.toLowerCase().includes("<base")) {
      text = text.replace(/<head([^>]*)>/i, `<head$1>${injection}`);
    }
  }

  const accept = req.headers.get("accept") || "";
  if (accept.includes("application/json")) {
    if (paywayJson) {
      return Response.json(
        {
          ...paywayJson,
          ...(process.env.NODE_ENV === "development" ? debugInfo : {}),
        },
        { status: response.status }
      );
    }
    const pathMatch = text.match(/"path"\s*:\s*"([^"]+)"/);
    const checkoutPath = pathMatch?.[1]?.replace(/\\u002F/g, "/") || "";
    const checkoutUrl = checkoutPath ? `${baseUrl}${checkoutPath}` : "";
    return Response.json(
      {
        checkoutUrl,
        paywayHtml: checkoutUrl ? undefined : text,
        ...(process.env.NODE_ENV === "development" ? debugInfo : {}),
      },
      { status: 200 }
    );
  }

  if (paywayJson) {
    return Response.json(paywayJson, { status: response.status });
  }

  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": paywayResponseContentType,
    },
  });
}
