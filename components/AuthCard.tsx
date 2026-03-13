"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthCard() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/trips`
            : undefined,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Check your email for the sign-in link.");
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-semibold tracking-tight">Sign in</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Use a magic link to save trips and see your dashboard.
      </p>

      <form onSubmit={sendMagicLink} className="mt-4 flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-900"
        />
        <button
          disabled={status === "loading"}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Email me a sign-in link"}
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-zinc-700">{message}</p> : null}
    </div>
  );
}

