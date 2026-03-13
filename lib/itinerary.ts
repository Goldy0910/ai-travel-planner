import { z } from "zod";

export const ItineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(1),
  activities: z.array(z.string().min(1)).min(1),
});

export const ItinerarySchema = z.object({
  title: z.string().min(1),
  destination: z.string().min(1),
  days: z.array(ItineraryDaySchema).min(1),
});

export type Itinerary = z.infer<typeof ItinerarySchema>;

export const PlanTripRequestSchema = z.object({
  prompt: z.string().min(5).max(1000),
  days: z.number().int().min(1).max(21).optional(),
});

export const PlanTripResponseSchema = z.object({
  itinerary: ItinerarySchema,
});

