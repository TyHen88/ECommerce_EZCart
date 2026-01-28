import crypto from "crypto";

export const runtime = "nodejs";

function buildHash(
  fields: Record<string, string>,
  publicKey: string,
  fieldOrder?: string
): string {
  if (!fieldOrder) return "";
  const order = fieldOrder
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const raw = order.map((key) => fields[key] ?? "").join("");
  return crypto.createHmac("sha512", publicKey).update(raw).digest("base64");
}

export async function POST(req: Request) {
  let body: Record<string, any> | null = null;
  try {
    body = (await req.json()) as Record<string, any>;
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const publicKey = process.env.PAYWAY_PUBLIC_KEY || "";
  const hashFields = process.env.PAYWAY_RETURN_HASH_FIELDS || "";

  let isValidHash = true;
  if (publicKey && hashFields && body?.hash) {
    const computed = buildHash(body, publicKey, hashFields);
    isValidHash = computed === body.hash;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("PayWay return callback:", {
      isValidHash,
      tran_id: body?.tran_id,
      status: body?.status,
    });
  }

  return Response.json({ ok: true, isValidHash });
}
