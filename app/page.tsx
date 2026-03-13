import Link from "next/link";

export default function Home() {
  return (
    <div className="py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-200 via-sky-200 to-violet-200 blur-3xl opacity-70" />
          <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-fuchsia-200 blur-3xl opacity-60" />
        </div>

        <div className="p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI Travel Planner for busy people
          </div>

          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Your next trip, planned end‑to‑end in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            TripCraft turns a single prompt into a day-by-day itinerary. Pick
            your vibe, pace, and budget — then save trips to your dashboard.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/planner"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white"
            >
              Generate a trip
            </Link>
            <Link
              href="/trips"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900"
            >
              View My Trips
            </Link>
            <p className="text-xs text-zinc-500">
              Example: “Plan a 4 day trip to Bali with beaches and cafes”
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              { k: "Fast", v: "A plan in seconds" },
              { k: "Structured", v: "Day-by-day activities" },
              { k: "Saved", v: "Trips in your dashboard" },
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-2xl border border-zinc-200 bg-white/60 p-4 backdrop-blur"
              >
                <p className="text-sm font-semibold text-zinc-900">{x.k}</p>
                <p className="mt-1 text-sm text-zinc-600">{x.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              One prompt → a clear itinerary → saved in Supabase.
            </p>
          </div>
          <Link href="/planner" className="text-sm font-medium text-zinc-900">
            Try it now →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Describe your trip",
              body: "Destination, days, budget, interests, pace — anything you care about.",
            },
            {
              n: "02",
              title: "Generate day-by-day plan",
              body: "We return structured JSON and render it as a clean itinerary.",
            },
            {
              n: "03",
              title: "Save & revisit",
              body: "Sign in with a magic link and keep your trips in your dashboard.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-xs font-medium text-zinc-500">{s.n}</p>
              <h3 className="mt-2 text-base font-semibold text-zinc-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example trips */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Example trips</h2>
        <p className="mt-1 text-sm text-zinc-600">
          A few starter prompts to copy/paste.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Bali • 4 days",
              prompt: "Plan a 4 day trip to Bali with beaches and cafes",
              tags: ["Relaxed", "Food", "Beaches"],
            },
            {
              title: "Tokyo • 5 days",
              prompt: "Plan a 5 day trip to Tokyo for first-timers, food + neighborhoods, moderate pace",
              tags: ["City", "Food", "Walkable"],
            },
            {
              title: "Lisbon • 3 days",
              prompt: "Plan a 3 day trip to Lisbon with viewpoints, pastries, and a day trip nearby",
              tags: ["Culture", "Scenic", "Day trip"],
            },
          ].map((ex) => (
            <div
              key={ex.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-zinc-900">
                  {ex.title}
                </h3>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] text-zinc-600">
                  Prompt
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                “{ex.prompt}”
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ex.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href="/planner"
                  className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900"
                >
                  Generate this trip
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-900 p-8 text-white md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to plan your next trip?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Turn one prompt into a complete itinerary — then save it and come
              back anytime.
            </p>
          </div>
          <Link
            href="/planner"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900"
          >
            Start planning
          </Link>
        </div>
      </section>
    </div>
  );
}
