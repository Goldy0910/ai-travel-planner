import type { Itinerary } from "@/lib/itinerary";

const DAYPARTS = ["Morning", "Afternoon", "Evening", "Night"] as const;

function groupByDaypart(activities: string[]) {
  const nonEmpty = activities.map((a) => a.trim()).filter(Boolean);
  const groups: Record<(typeof DAYPARTS)[number], string[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Night: [],
  };

  if (nonEmpty.length === 0) return groups;

  const buckets = Math.min(DAYPARTS.length, nonEmpty.length);
  for (let i = 0; i < nonEmpty.length; i++) {
    const idx = Math.floor((i * buckets) / nonEmpty.length);
    const key = DAYPARTS[idx] ?? "Night";
    groups[key].push(nonEmpty[i]);
  }

  return groups;
}

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
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {DAYPARTS.map((part) => {
                const grouped = groupByDaypart(d.activities);
                const items = grouped[part];
                if (!items.length) return null;

                return (
                  <div
                    key={part}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-900">
                        {part}
                      </p>
                      <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600">
                        {items.length} item{items.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-800">
                      {items.map((a, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

