create table public.ascents (
  boulder_id uuid not null references public.boulders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (boulder_id, user_id)
);

alter table public.ascents enable row level security;

create policy "Ascents are publicly readable"
  on public.ascents for select
  using (true);

create policy "Authenticated users can insert own ascents"
  on public.ascents for insert
  with check (auth.uid() = user_id);

create policy "Authenticated users can delete own ascents"
  on public.ascents for delete
  using (auth.uid() = user_id);
