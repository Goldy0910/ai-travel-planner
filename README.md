## AI Travel Planner MVP

Tech:
- Next.js (App Router)
- Tailwind CSS
- OpenAI API
- Supabase (Auth + Postgres)

### Pages
- `/` Landing
- `/planner` AI Trip Planner
- `/trip` Trip Result (preview + save)
- `/trips` My Trips dashboard

### Folder structure (important bits)
```
app/
  api/
    plan/route.ts        # OpenAI itinerary generation
    trips/route.ts       # Save trip to Supabase (auth required)
  planner/page.tsx
  trip/page.tsx
  trips/page.tsx
components/
  AppShell.tsx
  AuthCard.tsx
  ItineraryView.tsx
  PromptForm.tsx
lib/
  itinerary.ts           # Zod schemas + shared types
  supabase/
    client.ts            # Browser Supabase client (auth)
    server.ts            # Server Supabase client (DB)
    middleware.ts        # Session refresh
supabase/
  schema.sql             # Create the trips table + RLS policies
middleware.ts            # Next middleware wiring
```

## Getting Started

### 1) Create a Supabase project
- **Auth**: enable Email (OTP / magic link)
- **SQL**: run `supabase/schema.sql` in the SQL Editor

### 2) Set environment variables
Create `.env.local`:
```
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
