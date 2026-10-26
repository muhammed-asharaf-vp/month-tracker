create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  dob date not null check (dob <= current_date),
  months boolean[] not null default ARRAY[false, false, false, false, false, false, false, false, false, false, false, false]::boolean[],
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint people_months_must_have_twelve_values check (array_length(months, 1) = 12)
);

alter table public.people enable row level security;
revoke all on table public.people from anon;
grant select, insert, update, delete on table public.people to authenticated;

drop policy if exists "Signed-in members can read shared people" on public.people;
create policy "Signed-in members can read shared people"
  on public.people for select to authenticated
  using (true);

drop policy if exists "Members can add people as themselves" on public.people;
create policy "Members can add people as themselves"
  on public.people for insert to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Signed-in members can update shared people" on public.people;
create policy "Signed-in members can update shared people"
  on public.people for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Signed-in members can delete shared people" on public.people;
create policy "Signed-in members can delete shared people"
  on public.people for delete to authenticated
  using (true);

do $publication$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    raise exception 'Supabase Realtime publication was not found.';
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'people'
  ) then
    execute 'alter publication supabase_realtime add table public.people';
  end if;
end;
$publication$;
create or replace function public.toggle_person_month(p_person_id uuid, p_month_index integer)
returns public.people
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  updated public.people;
begin
  if p_month_index is null or p_month_index < 0 or p_month_index > 11 then
    raise exception 'Month index must be between 0 and 11.' using errcode = '22023';
  end if;

  update public.people
  set months[p_month_index + 1] = not months[p_month_index + 1]
  where id = p_person_id
  returning * into updated;

  return updated;
end;
$function$;

revoke all on function public.toggle_person_month(uuid, integer) from public, anon;
grant execute on function public.toggle_person_month(uuid, integer) to authenticated;