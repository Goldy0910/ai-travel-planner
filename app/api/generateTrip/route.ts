import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PlanTripResponseSchema } from "@/lib/itinerary";

export const runtime = "nodejs";

const GenerateTripRequestSchema = z.object({
  prompt: z.string().min(5).max(1000),
});

/**
 * POST /api/generateTrip
 * Body: { prompt: string }
 * Response: { itinerary: { title, destination, days: [{ day, title, activities[] }] } }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = GenerateTripRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  const client = new OpenAI({ apiKey });

  const system = [
    "You are an expert travel planner.",
    "Return ONLY valid JSON. No markdown, no commentary.",
    "The JSON must match this TypeScript type:",
    '{ itinerary: { title: string; destination: string; days: { day: number; title: string; activities: string[] }[] } }',
    "Generate a day-by-day travel plan with clear, concrete activities.",
    "Activities must be realistic and tourist-friendly.",
    "Avoid unsafe or illegal suggestions.",
  ].join("\n");

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `User request: ${parsed.data.prompt}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content ?? "";
  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Model returned non-JSON output" },
      { status: 502 },
    );
  }

  const validated = PlanTripResponseSchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      { error: "Model returned invalid schema", details: validated.error.flatten() },
      { status: 502 },
    );
  }

  return NextResponse.json(validated.data);
}

