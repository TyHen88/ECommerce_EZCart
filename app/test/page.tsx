// app/test-session/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      
    </div>
  );
}
