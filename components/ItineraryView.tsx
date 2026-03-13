import type { Itinerary } from "@/lib/itinerary";

export function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {itinerary.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">{itinerary.destination}</p>
      </div>

      <div className="space-y-4">
        {itinerary.days.map((d) => (
          <section
            key={d.day}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">Day {d.day}</h2>
              <p className="text-sm text-zinc-600">{d.title}</p>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-800">
              {d.activities.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

