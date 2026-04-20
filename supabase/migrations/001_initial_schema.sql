-- ============================================================
--  City Light Media — Supabase Database Setup
--  Paste this entire script into:
--  Supabase Dashboard → SQL Editor → New Query → Run (F5)
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
--    One row per authenticated user, linked to auth.users
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  username    text,
  email       text,
  created_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 2. RELEASES
--    Music releases owned by a profile
-- ────────────────────────────────────────────────────────────
create table if not exists public.releases (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.profiles (id) on delete cascade,
  title        text        not null,
  cover_url    text,
  release_date date,
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 3. TRACKS
--    Individual audio tracks belonging to a release
-- ────────────────────────────────────────────────────────────
create table if not exists public.tracks (
  id          uuid        primary key default gen_random_uuid(),
  release_id  uuid        not null references public.releases (id) on delete cascade,
  title       text        not null,
  audio_url   text,
  duration    integer,    -- duration in seconds
  created_at  timestamptz not null default now()
);


-- ============================================================
-- 4. ROW LEVEL SECURITY — enable on all tables
-- ============================================================
alter table public.profiles enable row level security;
alter table public.releases  enable row level security;
alter table public.tracks    enable row level security;


-- ============================================================
-- 5. RLS POLICIES
-- ============================================================

-- ── profiles ──────────────────────────────────────────────
-- Users can read their own profile
create policy "profiles: select own"
  on public.profiles for select
  using ( auth.uid() = id );

-- Users can insert their own profile
create policy "profiles: insert own"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Users can update their own profile
create policy "profiles: update own"
  on public.profiles for update
  using ( auth.uid() = id );

-- ── releases ──────────────────────────────────────────────
-- Users can read their own releases
create policy "releases: select own"
  on public.releases for select
  using ( auth.uid() = user_id );

-- Users can insert releases for themselves
create policy "releases: insert own"
  on public.releases for insert
  with check ( auth.uid() = user_id );

-- Users can update their own releases
create policy "releases: update own"
  on public.releases for update
  using ( auth.uid() = user_id );

-- Users can delete their own releases
create policy "releases: delete own"
  on public.releases for delete
  using ( auth.uid() = user_id );

-- ── tracks ────────────────────────────────────────────────
-- Tracks are accessed through their parent release.
-- A user owns a track if they own the release it belongs to.
create policy "tracks: select own"
  on public.tracks for select
  using (
    exists (
      select 1 from public.releases r
      where r.id = tracks.release_id
        and r.user_id = auth.uid()
    )
  );

create policy "tracks: insert own"
  on public.tracks for insert
  with check (
    exists (
      select 1 from public.releases r
      where r.id = tracks.release_id
        and r.user_id = auth.uid()
    )
  );

create policy "tracks: update own"
  on public.tracks for update
  using (
    exists (
      select 1 from public.releases r
      where r.id = tracks.release_id
        and r.user_id = auth.uid()
    )
  );

create policy "tracks: delete own"
  on public.tracks for delete
  using (
    exists (
      select 1 from public.releases r
      where r.id = tracks.release_id
        and r.user_id = auth.uid()
    )
  );


-- ============================================================
-- 6. HELPER: auto-create a profile when a user signs up
--    (runs as a Postgres trigger on auth.users)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop if already exists, then re-create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- 7. TEST INSERT (uses a fake UUID — safe to run, safe to delete)
--    This bypasses RLS because it runs as the service role in
--    the SQL editor. It proves the table schema is correct.
-- ============================================================

-- Insert a test profile
insert into public.profiles (id, username, email)
values (
  '00000000-0000-0000-0000-000000000001',
  'test_artist',
  'test@citylightmedia.com'
)
on conflict (id) do nothing;

-- Insert a test release
insert into public.releases (id, user_id, title, cover_url, release_date)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Neon Horizon (Test)',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
  '2026-04-04'
)
on conflict (id) do nothing;

-- Insert a test track
insert into public.tracks (release_id, title, audio_url, duration)
values (
  '00000000-0000-0000-0000-000000000010',
  'Neon Horizon — Main Mix',
  'https://example.com/audio/neon-horizon.mp3',
  215
)
on conflict do nothing;

-- ── Verify the inserts ──────────────────────────────────────
select 'profiles' as "table", count(*) as "rows" from public.profiles
union all
select 'releases', count(*) from public.releases
union all
select 'tracks',   count(*) from public.tracks;
