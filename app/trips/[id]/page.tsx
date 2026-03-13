import Link from "next/link";
import { notFound } from "next/navigation";
import { ItinerarySchema } from "@/lib/itinerary";
import { ItineraryView } from "@/components/ItineraryView";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TripRow = {
  id: string;
  title: string;
  prompt: string;
  itinerary: unknown;
  created_at: string;
};

export default async function TripDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Sign in required
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Please sign in to view your saved trips.
        </p>
        <Link
          href="/trips"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white"
        >
          Go to My Trips
        </Link>
      </div>
    );
  }

  const { data: trip, error } = await supabase
    .from("trips")
    .select("id,title,prompt,itinerary,created_at")
    .eq("id", params.id)
    .single<TripRow>();

  if (error || !trip) return notFound();

  const itineraryParsed = ItinerarySchema.safeParse(trip.itinerary);
  if (!itineraryParsed.success) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/trips" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Back to My Trips
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {trip.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {new Date(trip.created_at).toLocaleString()}
          </p>
          <p className="mt-3 text-sm text-zinc-700">
            Prompt: <span className="text-zinc-900">{trip.prompt}</span>
          </p>
        </div>
      </div>

      <ItineraryView itinerary={itineraryParsed.data} />
    </div>
  );
}

