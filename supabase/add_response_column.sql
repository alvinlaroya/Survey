-- Migration for an existing date_plans table. Run once in the Supabase SQL editor.

alter table public.date_plans
  add column if not exists response text not null default 'yes'
    check (response in ('yes', 'not_interested'));

-- "Not Interested" rows have no picked time.
alter table public.date_plans
  alter column picked_time drop not null;

alter table public.date_plans
  add constraint picked_time_required_for_yes
    check (response <> 'yes' or picked_time is not null);
