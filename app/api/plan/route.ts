import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  PlanTripRequestSchema,
  PlanTripResponseSchema,
} from "@/lib/itinerary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = PlanTripRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { prompt, days } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  const client = new OpenAI({ apiKey });

  const targetDays = days ?? 5;

  const system = [
    "You are an expert travel planner.",
    "Return ONLY valid JSON. No markdown, no commentary.",
    "The JSON must match this TypeScript type:",
    '{ itinerary: { title: string; destination: string; days: { day: number; title: string; activities: string[] }[] } }',
    `The itinerary must have exactly ${targetDays} days.`,
    "Activities must be concrete, tourist-friendly, and realistic.",
    "Avoid unsafe or illegal suggestions.",
  ].join("\n");

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `User request: ${prompt}`,
      },
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

  if (validated.data.itinerary.days.length !== targetDays) {
    return NextResponse.json(
      { error: "Model returned wrong number of days" },
      { status: 502 },
    );
  }

  return NextResponse.json(validated.data);
}

