"use client";

import { useEffect, useState } from "react";

export default function PaywayHtmlView() {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("payway_html");
    if (stored) {
      setHtml(stored);
      sessionStorage.removeItem("payway_html");
    }
  }, []);

  if (!html) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-2">
          <h1 className="text-2xl font-semibold">PayWay</h1>
          <p className="text-muted-foreground">
            No checkout HTML found. Please start payment again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <iframe
        title="PayWay Checkout"
        srcDoc={html}
        className="w-full h-screen border-0"
        allow="payment *"
      />
    </div>
  );
}
