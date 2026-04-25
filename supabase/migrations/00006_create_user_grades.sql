create table public.user_grades (
  boulder_id uuid not null references public.boulders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  grade text not null,
  created_at timestamptz not null default now(),
  primary key (boulder_id, user_id)
);

alter table public.user_grades enable row level security;

create policy "User grades are publicly readable"
  on public.user_grades for select
  using (true);

create policy "Authenticated users can insert own grade"
  on public.user_grades for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own grade"
  on public.user_grades for update
  to authenticated
  using (auth.uid() = user_id);
