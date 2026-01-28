import crypto from "crypto";

export const runtime = "nodejs";

type CheckPayload = {
  req_time?: string;
  merchant_id?: string;
  tran_id?: string;
};

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

function buildHash(merchantId: string, tranId: string, publicKey: string) {
  const raw = `${merchantId}${tranId}`;
  return crypto.createHmac("sha512", publicKey).update(raw).digest("base64");
}

export async function POST(req: Request) {
  let body: CheckPayload | null = null;
  try {
    body = (await req.json()) as CheckPayload;
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const merchantId = body?.merchant_id || process.env.PAYWAY_MERCHANT_ID || "";
  const publicKey = process.env.PAYWAY_PUBLIC_KEY || "";
  const tranId = body?.tran_id || "";
  const reqTime = body?.req_time || getReqTimeUtc();
  const checkUrl = process.env.PAYWAY_CHECK_URL || "";

  if (!merchantId || !publicKey || !tranId || !checkUrl) {
    return Response.json(
      { message: "Missing PayWay configuration or tran_id" },
      { status: 400 }
    );
  }

  const hash = buildHash(merchantId, tranId, publicKey);

  const response = await fetch(checkUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      req_time: reqTime,
      merchant_id: merchantId,
      tran_id: tranId,
      hash,
    }),
  });

  const data = await response.json().catch(() => null);
  return Response.json(data ?? { message: "Invalid response" }, {
    status: response.status,
  });
}
