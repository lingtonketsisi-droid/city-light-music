-- ============================================================
--  City Light Media — Storage Bucket Setup
--  Single bucket architecture for local uploads
-- ============================================================

-- ── 1. Create "audio-uploads" bucket ────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio-uploads',
  'audio-uploads',
  true,                             -- public: URLs stored in DB must be permanently accessible
  524288000,                        -- 500 MB limit
  array[
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
    'audio/flac', 'audio/x-flac', 'audio/aiff', 'audio/x-aiff',
    'audio/aac', 'audio/ogg', 'audio/webm',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
  ]
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================
-- 2. RLS POLICIES — audio-uploads
-- ============================================================

-- Allow authenticated users to upload their own files to their own folder
create policy "audio-uploads: upload own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'audio-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone can read files (public bucket)
create policy "audio-uploads: public read"
  on storage.objects for select
  to public
  using ( bucket_id = 'audio-uploads' );

-- Allow owners to delete their own files
create policy "audio-uploads: delete own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'audio-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow owners to update their own files
create policy "audio-uploads: update own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'audio-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── Verify ────────────────────────────────────────────────────────
select id, name, public, file_size_limit
from storage.buckets
where id = 'audio-uploads';

