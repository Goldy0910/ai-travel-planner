import { NextResponse } from "next/server";
import { z } from "zod";
import { ItinerarySchema } from "@/lib/itinerary";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CreateTripSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  prompt: z.string().min(1).max(1000),
  itinerary: ItinerarySchema,
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { prompt, itinerary } = parsed.data;
  const title = (parsed.data.title?.trim() || itinerary.title).slice(0, 200);

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      title,
      prompt,
      itinerary,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

