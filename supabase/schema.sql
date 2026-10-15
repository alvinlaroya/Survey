-- Run this in the Supabase SQL editor.

create table if not exists public.date_plans (
  id uuid primary key default gen_random_uuid(),
  picked_time time not null,
  created_at timestamptz not null default now()
);

alter table public.date_plans enable row level security;

-- Anyone with the link can create a plan and read a plan (toy app, no auth).
create policy "anon can insert date plans"
  on public.date_plans for insert
  to anon
  with check (true);

create policy "anon can read date plans"
  on public.date_plans for select
  to anon
  using (true);
