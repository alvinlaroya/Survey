-- Run this in the Supabase SQL editor (fresh install).
-- If you already created date_plans earlier, run add_response_column.sql instead.

create table if not exists public.date_plans (
  id uuid primary key default gen_random_uuid(),
  response text not null default 'yes' check (response in ('yes', 'not_interested')),
  picked_time time,
  created_at timestamptz not null default now(),
  constraint picked_time_required_for_yes
    check (response <> 'yes' or picked_time is not null)
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
