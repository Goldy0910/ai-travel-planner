"use client";

import { useMemo, useRef, useState } from "react";
import { PlanTripResponseSchema, type Itinerary } from "@/lib/itinerary";
import { ItineraryView } from "@/components/ItineraryView";

export function TripPlannerClient() {
  const [prompt, setPrompt] = useState(
    "Plan a 4 day trip to Bali with beaches and cafes",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    | { state: "idle" }
    | { state: "saved"; id: string }
    | { state: "needs_auth" }
    | { state: "error"; message: string }
  >({ state: "idle" });
  const resultRef = useRef<HTMLDivElement | null>(null);

  const canGenerate = useMemo(() => {
    return prompt.trim().length >= 5 && !isLoading;
  }, [prompt, isLoading]);

  const canSave = useMemo(() => {
    return !!itinerary && !isLoading && !isSaving && saveStatus.state !== "saved";
  }, [itinerary, isLoading, isSaving, saveStatus.state]);

  async function generateTrip(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setItinerary(null);
    setSaveStatus({ state: "idle" });
    setIsLoading(true);

    try {
      const res = await fetch("/api/generateTrip", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Request failed (${res.status})`);
      }

      const json = await res.json();
      const parsed = PlanTripResponseSchema.safeParse(json);
      if (!parsed.success) throw new Error("Model response was invalid.");

      setItinerary(parsed.data.itinerary);
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveTrip() {
    if (!itinerary) return;
    setIsSaving(true);
    setSaveStatus({ state: "idle" });

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: itinerary.title,
          prompt,
          itinerary,
        }),
      });

      if (res.status === 401) {
        setSaveStatus({ state: "needs_auth" });
        return;
      }

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Save failed (${res.status})`);
      }

      const json = (await res.json()) as { id: string };
      setSaveStatus({ state: "saved", id: json.id });
    } catch (err) {
      setSaveStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Could not save trip.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              AI Trip Planner
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Describe your ideal trip. We’ll generate a clean day-by-day plan.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Powered by OpenAI
          </div>
        </div>

        <form onSubmit={generateTrip} className="mt-6 space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={7}
              className="w-full resize-y rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-zinc-900"
              placeholder='Try: "Plan a 4 day trip to Bali with beaches and cafes"'
            />
            <div className="pointer-events-none absolute right-3 top-3 hidden rounded-full border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-500 md:block">
              Prompt
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canGenerate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                "Generate Trip"
              )}
            </button>

            <button
              type="button"
              onClick={saveTrip}
              disabled={!canSave}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving…" : saveStatus.state === "saved" ? "Saved" : "Save trip"}
            </button>

            <p className="text-xs text-zinc-500">
              Tip: add budget, pace (relaxed vs packed), and interests.
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {error}
            </div>
          ) : null}

          {saveStatus.state === "needs_auth" ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Please sign in on <a className="underline" href="/trips">My Trips</a> to save.
            </div>
          ) : null}

          {saveStatus.state === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {saveStatus.message}
            </div>
          ) : null}
        </form>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-100" />
            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
          </div>
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="h-5 w-24 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-10/12 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-9/12 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div ref={resultRef} />
      {itinerary ? <ItineraryView itinerary={itinerary} /> : null}
    </div>
  );
}

