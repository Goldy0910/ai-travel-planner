import { AuthCard } from "@/components/AuthCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

type TripRow = {
  id: string;
  title: string;
  prompt: string;
  created_at: string;
};

export default async function TripsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Trips</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign in to save trips to Supabase and see them here.
          </p>
        </div>
        <AuthCard />
      </div>
    );
  }

  const { data: trips, error } = await supabase
    .from("trips")
    .select("id,title,prompt,created_at")
    .order("created_at", { ascending: false })
    .returns<TripRow[]>();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Trips</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Signed in as <span className="text-zinc-800">{user.email}</span>
          </p>
        </div>
        <form action="/api/trips" method="POST">
          {/* Sign out is handled client-side; keeping UI simple for MVP */}
        </form>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Could not load trips: {error.message}
        </div>
      ) : null}

      {!trips?.length ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-700">No saved trips yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((t) => (
            <Link
              key={t.id}
              href={`/trips/${t.id}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {t.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-zinc-600">
                    {t.prompt}
                  </p>
                </div>
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition group-hover:border-zinc-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span>{new Date(t.created_at).toLocaleDateString()}</span>
                <span className="text-zinc-600 group-hover:text-zinc-900">
                  Open
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

