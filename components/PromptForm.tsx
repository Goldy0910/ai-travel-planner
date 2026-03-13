"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PlanTripResponseSchema } from "@/lib/itinerary";

const DRAFT_KEY = "trip_draft_v1";

export function PromptForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("Plan a 5 day trip to Bali");
  const [days, setDays] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return prompt.trim().length >= 5 && days >= 1 && days <= 21 && !isLoading;
  }, [prompt, days, isLoading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, days }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Request failed (${res.status})`);
      }

      const json = await res.json();
      const parsed = PlanTripResponseSchema.safeParse(json);
      if (!parsed.success) throw new Error("Model response was invalid.");

      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          prompt,
          createdAt: new Date().toISOString(),
          itinerary: parsed.data.itinerary,
        }),
      );

      router.push("/trip");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-900">
          Your trip request
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900"
          placeholder='e.g. "Plan a 5 day trip to Bali"'
        />
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-900">Days</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            min={1}
            max={21}
            className="w-28 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Generate itinerary"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : (
        <p className="mt-4 text-xs text-zinc-500">
          Tip: include budget, interests, and pace (relaxed vs packed).
        </p>
      )}
    </form>
  );
}

