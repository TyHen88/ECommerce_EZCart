// app/test-session/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <div className="space-y-2">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Session exists:</strong> {session ? "Yes" : "No"}
        </p>
        {session?.user && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>
              <strong>User ID:</strong> {session.user.id}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Role:</strong> {session.user.role}
            </p>
            <p>
              <strong>Has Access Token:</strong>{" "}
              {session.accessToken ? "Yes" : "No"}
            </p>
          </div>
        )}
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
