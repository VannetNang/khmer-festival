-- Khmer Living Archive — entries table + Row Level Security
-- Paste this whole file into Supabase: Dashboard -> SQL Editor -> New query -> Run.
-- Safe to run more than once.

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------
create table if not exists archive_entries (
  -- baseline columns every entry gets
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner uuid not null references auth.users (id),

  -- archive content (Khmer text is first-class content, never stripped or "fixed")
  title_khmer text not null,
  title_english text not null,
  category text not null,
  description_khmer text not null,
  description_english text not null,
  season_or_month text not null,
  source text not null,
  image_path text not null,          -- every entry must have a photo path or URL

  -- optional: no default, so an untagged entry stays NULL instead of looking
  -- like someone deliberately chose an empty list
  tags text[]
);

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------
alter table archive_entries enable row level security;

-- Anyone, signed in or not, can read the archive.
drop policy if exists "Entries are viewable by everyone" on archive_entries;
create policy "Entries are viewable by everyone"
  on archive_entries
  for select
  to anon, authenticated
  using (true);

-- A signed-in contributor can add an entry, but only one owned by themselves.
drop policy if exists "Authenticated users can insert their own entries" on archive_entries;
create policy "Authenticated users can insert their own entries"
  on archive_entries
  for insert
  to authenticated
  with check (owner = auth.uid());

-- An owner can edit their own entry. USING limits which rows are visible to the
-- update; WITH CHECK stops an owner from reassigning the row to someone else.
drop policy if exists "Owners can update their own entries" on archive_entries;
create policy "Owners can update their own entries"
  on archive_entries
  for update
  to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

-- An owner can remove their own entry.
drop policy if exists "Owners can delete their own entries" on archive_entries;
create policy "Owners can delete their own entries"
  on archive_entries
  for delete
  to authenticated
  using (owner = auth.uid());