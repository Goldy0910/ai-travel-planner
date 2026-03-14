import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { PlanTripResponseSchema } from "@/lib/itinerary";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const BodySchema = z.object({
  prompt: z.string().min(5).max(1000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const system = [
      "You are an expert travel planner.",
      "Return ONLY valid JSON. No markdown, no commentary.",
      "The JSON must match this TypeScript type:",
      '{ itinerary: { title: string; destination: string; days: { day: number; title: string; activities: string[] }[] } }',
      "Generate a day-by-day travel plan with clear, concrete activities.",
      "Activities must be realistic and tourist-friendly.",
      "Avoid unsafe or illegal suggestions.",
    ].join("\n");

    const prompt = `${system}\n\nUser request: ${parsed.data.prompt}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return Response.json(
        { error: "Model response is invalid" },
        { status: 500 },
      );
    }

    let json: unknown;
    try {
      let raw = text.trim();

      // If the model wrapped JSON in extra text/markdown, try to slice out the JSON object.
      if (!raw.startsWith("{") || !raw.endsWith("}")) {
        const first = raw.indexOf("{");
        const last = raw.lastIndexOf("}");
        if (first !== -1 && last !== -1 && last > first) {
          raw = raw.slice(first, last + 1);
        }
      }

      json = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "Model did not return JSON" },
        { status: 502 },
      );
    }

    const validated = PlanTripResponseSchema.safeParse(json);
    if (!validated.success) {
      return Response.json(
        {
          error: "Model returned invalid schema",
          details: validated.error.flatten(),
        },
        { status: 502 },
      );
    }

    return Response.json(validated.data);
  } catch (error) {
    console.error("🚨 Error generating trip:", error);
    return Response.json(
      { error: "Trip generation failed" },
      { status: 500 },
    );
  }
}