"use client";

import { useSearchParams } from "next/navigation";

export default function PaywayPage() {
  const searchParams = useSearchParams();
  const checkoutUrl = searchParams.get("checkoutUrl");
  const token = searchParams.get("token");

  const iframeSrc = checkoutUrl
    ? checkoutUrl
    : token
      ? `https://checkout-sandbox.payway.com.kh/checkout/${encodeURIComponent(
          token
        )}`
      : null;

  if (!iframeSrc) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-2">
          <h1 className="text-2xl font-semibold">PayWay</h1>
          <p className="text-muted-foreground">
            Missing checkout URL. Please start payment again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <iframe
        title="PayWay Checkout"
        src={iframeSrc}
        className="w-full h-screen border-0"
        allow="payment *"
      />
    </div>
  );
}
