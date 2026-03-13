-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  prompt text not null,
  itinerary jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.trips enable row level security;

drop policy if exists "trips_select_own" on public.trips;
create policy "trips_select_own"
on public.trips
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "trips_insert_own" on public.trips;
create policy "trips_insert_own"
on public.trips
for insert
to authenticated
with check (auth.uid() = user_id);

