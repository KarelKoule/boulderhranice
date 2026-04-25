create table public.boulders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade text not null,
  section text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  average_rating numeric(3, 2) not null default 0,
  rating_count integer not null default 0
);

alter table public.boulders enable row level security;

create policy "Boulders are publicly readable"
  on public.boulders for select
  using (true);

create policy "Authenticated users can create boulders"
  on public.boulders for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update boulders"
  on public.boulders for update
  to authenticated
  using (true);
