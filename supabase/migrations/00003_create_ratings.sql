create table public.ratings (
  boulder_id uuid not null references public.boulders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  stars smallint not null check (stars >= 1 and stars <= 5),
  created_at timestamptz not null default now(),
  primary key (boulder_id, user_id)
);

alter table public.ratings enable row level security;

create policy "Ratings are publicly readable"
  on public.ratings for select
  using (true);

create policy "Authenticated users can insert own rating"
  on public.ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own rating"
  on public.ratings for update
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.update_boulder_rating()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.boulders
  set
    average_rating = coalesce((
      select avg(stars)::numeric(3, 2)
      from public.ratings
      where boulder_id = coalesce(new.boulder_id, old.boulder_id)
    ), 0),
    rating_count = (
      select count(*)
      from public.ratings
      where boulder_id = coalesce(new.boulder_id, old.boulder_id)
    )
  where id = coalesce(new.boulder_id, old.boulder_id);
  return coalesce(new, old);
end;
$$;

create trigger on_rating_change
  after insert or update or delete on public.ratings
  for each row execute function public.update_boulder_rating();
