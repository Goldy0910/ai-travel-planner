"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ItinerarySchema, type Itinerary } from "@/lib/itinerary";
import { ItineraryView } from "@/components/ItineraryView";
import { useRouter } from "next/navigation";

const DRAFT_KEY = "trip_draft_v1";

type Draft = {
  prompt: string;
  createdAt: string;
  itinerary: Itinerary;
};

export default function TripResultPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Draft;
      const valid = ItinerarySchema.safeParse(parsed.itinerary);
      if (!valid.success) return;
      setDraft({ ...parsed, itinerary: valid.data });
    } catch {
      // ignore
    }
  }, []);

  const canSave = useMemo(() => {
    return !!draft && !isSaving && !savedId;
  }, [draft, isSaving, savedId]);

  async function saveTrip() {
    if (!draft) return;
    setError(null);
    setIsSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: draft.prompt,
          itinerary: draft.itinerary,
        }),
      });

      if (res.status === 401) {
        router.push("/trips");
        return;
      }

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Save failed (${res.status})`);
      }

      const json = (await res.json()) as { id: string };
      setSavedId(json.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save trip.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!draft) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">No trip yet</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Generate an itinerary first, then you’ll see it here.
        </p>
        <Link
          href="/planner"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white"
        >
          Go to planner
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trip Result</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Prompt: <span className="text-zinc-800">{draft.prompt}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={saveTrip}
            disabled={!canSave}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60"
          >
            {savedId ? "Saved" : isSaving ? "Saving..." : "Save trip"}
          </button>
          <Link
            href="/planner"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900"
          >
            Plan another
          </Link>
        </div>
      </div>

      {savedId ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Saved to your dashboard.{" "}
          <Link href="/trips" className="underline">
            View My Trips
          </Link>
          .
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      ) : null}

      <ItineraryView itinerary={draft.itinerary} />
    </div>
  );
}

